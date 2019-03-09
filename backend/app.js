var consts = require('./consts');
const express = require('express');
var config = require('config');
var cors = require('cors');
const app = express();
var fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const bodyParser = require("body-parser");
const db_file = new FileSync('db.json');
var https = require('https');


const OBJECT_TYPE_TO_QUERY_STRING = consts.OBJECT_TYPE_TO_QUERY_STRING

let frontendURL = config.get("ZetaWash.Host.frontendURL");
let backendURL = config.get("ZetaWash.Host.backendURL");
let port = backendURL.split(":")[2].substring(0,4);
let useEncryption = config.get("ZetaWash.Encryption.useEncryption");
let useCustomUsersList = config.get("ZetaWash.Users.customUsersList");
let machines = config.get("ZetaWash.Machines.List")

let dbsToCheck = ['full_list'];
let primaryList = 'full_list';

let dbConfig = {
    "full_list": [],
    "full_queue": [],
    "full_log": []
};

for (const machine in machines) { // creates db template and query string configuration
    if (machine) {
        const queueString = machine + '_queue';
        const listString = machine + '_list';
        const logString = machine + '_log';

        dbConfig['queue_query_string'] = queueString;
        dbConfig['list_query_string'] = listString;
        dbConfig['log_query_string'] = logString;

        OBJECT_TYPE_TO_QUERY_STRING[machine] = {};
        let machineConfig = OBJECT_TYPE_TO_QUERY_STRING[machine];
        machineConfig['queue_query_string'] = queueString
        machineConfig['list_query_string'] = listString;
        machineConfig['log_query_string'] = logString;

        dbsToCheck.push(listString);
    }
}

let alertService;

// mailing variables

let templates = {};
let transporter;
let mailOptions;
let users;
let emailUser;

var auth_json = JSON.parse(fs.readFileSync('./config/auth.json', 'utf8'));

if (useCustomUsersList) {
    var users_json = JSON.parse(fs.readFileSync('./config/users.json', 'utf8'));

    users = users_json['users'];
    alertService = config.get("ZetaWash.Users.alertService");
    
    if (alertService === 'email') {
        emailUser = auth_json['Email']['user'];
        const transportOptions = {
            service: config.get("ZetaWash.Users.Email.service"),
            auth: {
                user: emailUser,
                pass: auth_json['Email']['pass']
            }
        }

        for (let machine in machines) {
            if (machines[machine]['email'] && !(Object.keys(machines[machine]['email']).length === 0 && machines[machine]['email'].constructor === Object)) {
                templates[machine] = machines[machine]['email']
            } else {
                console.error('Machine \'' + machine + '\' in default.json is missing an email object! Skipping machine.');
            }
        }

        transporter = nodemailer.createTransport(transportOptions);
    }
}

// db stuff (deals with file 'db.json')

checkDB();
const db = low(db_file);

// Set some defaults (required if your JSON file is empty)
db.defaults(dbConfig)
  .write()

console.log(`Front-end URL: ${frontendURL}`)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", frontendURL);
    res.header('Access-Control-Allow-Methods', 'DELETE, GET, POST, PUT, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

app.options('*', (req, res) => {
    console.log("Pre-flight sent");
    res.send({
        opCode: '200'
    });

    res.end("yes");
})

app.post('/removeFromList', (req, res) => {
    let onlyQueue = req.body.onlyQueue
    let listObj = req.body.listObj

    removeListObjectDB(listObj, onlyQueue)

    res.send({ 
        opCode: '200'
    });

    // DEBUG: console.log(`Successfully removed ${listObj.name} from ${onlyQueue ? 'queue' : 'list'}.`)

    res.end("yes");
})

app.post('/finishReservation', (req, res) => {
    let listObj = req.body.listObj

    finishItemInList(listObj.uniqueID);

    res.send({ 
        opCode: '200'
    });

    res.end("yes");
})

app.post('/addToList', (req, res) => {
    let onlyQueue = req.body.onlyQueue
    let listObj = req.body.listObj

    const uuidv4 = require('uuid/v4');
    let uid = uuidv4();
    listObj['uniqueID'] = uid;

    addListObjectDB(listObj, onlyQueue);

    res.send({ 
        uniqueID: uid,
        opCode: '200',
        listObj: listObj
     });

     res.end("yes");
})

app.post('/getList', (req, res) => {
    let listType = req.body.listType

    let fullList = {}

    const queueQueryString = 'queue_query_string';
    const listQueryString = 'list_query_string';

    const convertedQueueQueryString = OBJECT_TYPE_TO_QUERY_STRING[listType.toLowerCase()][queueQueryString]
    const convertedListQueryString = OBJECT_TYPE_TO_QUERY_STRING[listType.toLowerCase()][listQueryString]

    fullList.list = db.get(convertedListQueryString).value();
    fullList.queue = db.get(convertedQueueQueryString).value();

    res.send({ 
        opCode: '200',
        fullList: fullList,
     });

     res.end("yes");
})

app.post('/getLog', (req, res) => {
    let logType = req.body.logType

    const convertedLogQueryString = OBJECT_TYPE_TO_QUERY_STRING[logType.toLowerCase()]['log_query_string']

    log = db.get(convertedLogQueryString).value();

    let new_log = [];
    for (let i = 0; i < log.length; i++) {
        new_log.push(log[i]['listObj'])
    }

    res.send({ 
        opCode: '200',
        log: new_log,
     });                                                   

     res.end("yes");
})

app.post('/getUsers', (req, res) => {
    var users_json = JSON.parse(fs.readFileSync('./config/users.json', 'utf8'));
    var users = users_json['users'];

    var users_names = [];

    for (var i = 0; i < users.length; i++) {
        users_names.push(users[i]['name'])
    }

    res.send({ 
        opCode: '200',
        users: users_names,
     });

     res.end("yes");
})

app.post('/checkPin', (req, res) => {
    var auth_json = JSON.parse(fs.readFileSync('./config/auth.json', 'utf8'));
    var auth_pin = auth_json['App']['pinCode'];

    const pin_valid = auth_pin === req.body.pin;

    res.send({
        authenticated: pin_valid
    })

    res.end("yes");
})

app.post('/getUsers', (req, res) => {
    var users_json = JSON.parse(fs.readFileSync('./config/users.json', 'utf8'));

    res.send({ 
        opCode: '200',
        users: users_json,
     });

     res.end("yes");
})

app.post('/setUsers', (req, res) => {
    var newUsers = req.body.users;
    fs.writeFileSync('config/users.json', JSON.stringify(newUsers, null, 4), 'utf8', function (error) {
        if (error) {
            console.log("Error on writing to users file!");
        }
    });

    res.send({
        opCode: '200'
    });
    console.log("users set!");
    res.end("yes");
});

app.post('/getAuth', (req, res) => {
    var auth_json = JSON.parse(fs.readFileSync('./config/auth.json', 'utf8'));

    res.send({ 
        opCode: '200',
        auth: auth_json,
     });

     res.end("yes");
})

app.post('/setAuth', (req, res) => {
    var newAuth = req.body.auth;
    fs.writeFileSync('config/auth.json', JSON.stringify(newAuth, null, 4), 'utf8', function (error) {
        if (error) {
            console.log("Error on writing to auth file!");
        }
    });

    res.send({
        opCode: '200'
    });
    console.log("auth set!");
    res.end("yes");
});

app.post('/setConfig', (req, res) => {
    var newConfig = {};
    config = require('config');
    var config = req.body.config;
    var shouldReload = req.body.shouldReload;
    newConfig.ZetaWash = config;
    fs.writeFileSync('config/default.json', JSON.stringify(newConfig, null, 4), 'utf8', function (error) {
        if (error) {
            console.log("Error on writing config!");
        }
    });
    res.send({ 
        opCode: '200'
     });
     console.log('config set!');
     if (shouldReload) {
         console.log('reloading');
        reloadConfig();
     } 
     res.end("yes");
})

app.post('/sendEmailAlert', (req, res) => {
    var user = req.body.user;
    var alertEmailObject = req.body.alertObject['email'];

    // sends email if user found
    if (useCustomUsersList && alertService == 'email') {
        const userObj = users.find(function(element) {
            return element.name === user;
          });

        if (userObj) {
            email = userObj['email'];
            
            var mailOptions = {
                from: emailUser,
                to: email,
                subject: emailParser(alertEmailObject['subject'], user, 0),
                text: emailParser(alertEmailObject['text'], user, 0)
            };
            
            // DEBUG: console.log("sending mail to " + listObj['name']);
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    }
    res.send({
        opCode: '200'
    });
    res.end("yes");
})

function addListObjectDB(listObj, onlyQueue) {
    listObjUID = listObj.uniqueID

    let queueType, queryString, fullString

    if (onlyQueue) {
        queryString = 'queue_query_string';
        fullString = 'full_queue';
    }  else {
        queryString = 'list_query_string';
        fullString = 'full_list';
    }

    queueType = OBJECT_TYPE_TO_QUERY_STRING[listObj.machine][queryString]
    
    db.get(fullString)  // adds object to the full list of queued objects
        .push({ listObj })
        .write()
    db.get(queueType)
        .push({ listObj })
        .write()
    
    checkDB();
}

function removeListObjectDB(listObj, onlyQueue) {

    listObjUID = listObj.uniqueID

    let queueType, queryString, fullString

    if (onlyQueue) {
        queryString = 'queue_query_string';
        fullString = 'full_queue';
    }  else {
        queryString = 'list_query_string'
        fullString = 'full_list';
    }

    queueType = OBJECT_TYPE_TO_QUERY_STRING[listObj.machine][queryString]

    db.get(fullString)
        .remove(function (parent) {
            listObjSelected = parent.listObj;
            return listObj.uniqueID == listObjSelected.uniqueID;
        })
        .write()
    db.get(queueType)
        .remove(function (parent) {
            listObjSelected = parent.listObj;
            return listObj.uniqueID == listObjSelected.uniqueID;
        })
        .write()

    checkDB();
}

// function to check if a json is valid https://codeblogmoney.com/validate-json-string-using-javascript/
function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// checks db.json, and backs it up to _db.json
function checkDB() {
    if (fs.existsSync('./db.json')) {
        temp_db_file = fs.readFileSync('./db.json', 'utf8');
        if (IsValidJSONString(temp_db_file)) {

            // writes backup
            fs.writeFileSync('./_db.json', temp_db_file, { flag: 'w' });
        } else { // if file is corrupted, likely from a crash
            console.log('Corrupt DB file found! Reverting from backup.')

            // reverts db from backup '_db.json'
            if (fs.existsSync('./_db.json')) { // if the backup exists
                backup_db_file = fs.readFileSync('./_db.json', 'utf8');
                if (IsValidJSONString(backup_db_file)) {
                    fs.writeFileSync('./db.json', backup_db_file, { flag: 'w' });
                }
            } else { // backup does not exist =( must rename db file so a new one gets generated
                console.log('No backup db file found. Renaming to \'corrupted_db.json\', and a new one will be generated.');
                fs.rename('./db.json', './corrupted_db.json', function(err) {
                    if ( err ) console.log('ERROR: ' + err);
                });
            }
        }
    } else { // if the file cannot be found
        console.log('No db file found. Generating new one.');
    }
}

// check the queue for finished items every 500 milliseconds
let checkListID = setInterval(() => checkList(), 500);

function checkList() {
    for (let i = 0; i < dbsToCheck.length; i++) {
        let dbToCheck = dbsToCheck[i]
        db.get(dbToCheck)
            .remove(function (parent) {
                listObj = parent.listObj;

                const shouldRemove = listObj.endTime < Math.floor(new Date() / 1000);

                // does actions when the listObj is to be removed from the full list ONLY
                if (shouldRemove && dbsToCheck[i] === primaryList) {
                    onRemoveFromList(listObj)
                }

                return shouldRemove;
            })
            .write()
    }

    // DEBUG: console.log("Queues checked.")
    
}

function finishItemInList(uniqueID) {
    for (let i = 0; i < dbsToCheck.length; i++) {
        let dbToCheck = dbsToCheck[i]
        db.get(dbToCheck)
            .remove(function (parent) {
                listObj = parent.listObj;

                const shouldRemove = listObj.uniqueID == uniqueID;

                // does actions when the listObj is to be removed from the full list ONLY
                if (shouldRemove && dbsToCheck[i] === primaryList) {
                    onRemoveFromList(listObj, true)
                }

                return shouldRemove;
            }).write();
    }
}

function onRemoveFromList(listObj, useCurrentTime) {

    // adds item to the log 
    const fullString = 'full_log';
    const queryString = 'log_query_string';
    const queueType = OBJECT_TYPE_TO_QUERY_STRING[listObj.machine][queryString]

    db.get(fullString)  // adds object to the full log of objects
        .push({ listObj })
        .write()
    db.get(queueType)   // adds object to the machine-specific log of objects
        .push({ listObj })
        .write()

    // sends email if necessary
    if (useCustomUsersList && alertService == 'email') {
        const user = users.find(function(element) {
            return element.name === listObj['name'];
          });

        if (user) {
            email = user['email'];
    
            const machine = listObj['machine'];

            let endTime;
            if (useCurrentTime) { // defines endtime based on optional parameter
                endTime = Date.now()/1000;
            } else {
                endTime = parseInt(listObj['endTime']);
            }
            
            var mailOptions = {
                from: emailUser,
                to: email,
                subject: emailParser(templates[machine]['subject'], listObj['name'], endTime),
                text: emailParser(templates[machine]['text'], listObj['name'], endTime)
            };
            
            // DEBUG: console.log("sending mail to " + listObj['name']);
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    // DEBUG: console.log('Email sent: ' + info.response);
                }
            });
        }
    }
}

function getNextObjectUIDFromQueue(queueType) {
    let queue = db.get(queryString).value();
    let nextQueueObj
    queue.forEach(element => {
        if (!nextQueueObj) nextQueueObj = element   // Sets default element to the first one

        if (element.startTime < nextQueueObj.startTime) nextQueueObj = element  // If the start time for this element is less than the lowest, set it as the lowest
    });

    return nextQueueObj['uniqueID'];
}

if (useEncryption) {

    var certFilePath = path.resolve(config.get("ZetaWash.Encryption.certFilePath"));
    var keyFilePath = path.resolve(config.get("ZetaWash.Encryption.keyFilePath"));

    let options = {
        cert: fs.readFileSync(certFilePath),
        key: fs.readFileSync(keyFilePath)
    };

    https.createServer(options, app).listen(port);
    console.log(`Zeta Wash server with SSL successfully started, listening on port ${port}`)
} else {
    app.listen(port, () => console.log(`Zeta Wash server successfully started, listening on port ${port}`))
}

function emailParser(inputString, name, endTime) {
    inputString = inputString.replace("${date}", timeConverter(endTime));
    inputString = inputString.replace("${name}", name);
    return inputString;
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    if (sec < 10) sec = "0" + sec;
    if (hour < 10) hour = "0" + hour;
    if (min < 10) min = "0" + min;
    var time = hour + ':' + min + ':' + sec + ' ' + date + ' ' + month + ' ' + year ;
    return time;
}

function reloadConfig() {
    const OBJECT_TYPE_TO_QUERY_STRING = consts.OBJECT_TYPE_TO_QUERY_STRING

    frontendURL = config.get("ZetaWash.Host.frontendURL");
    backendURL = config.get("ZetaWash.Host.backendURL");
    port = backendURL.split(":")[2].substring(0,4);
    useEncryption = config.get("ZetaWash.Encryption.useEncryption");
    useCustomUsersList = config.get("ZetaWash.Users.customUsersList");
    machines = config.get("ZetaWash.Machines.List")
    // console.log(config.get("ZetaWash.Machines.List"));
    dbsToCheck = [];
    for (const machine in machines) { // creates db template and query string configuration
        if (machine) {
            const queueString = machine + '_queue';
            const listString = machine + '_list';
            const logString = machine + '_log';

            dbConfig['queue_query_string'] = queueString;
            dbConfig['list_query_string'] = listString;
            dbConfig['log_query_string'] = logString;

            OBJECT_TYPE_TO_QUERY_STRING[machine] = {};
            let machineConfig = OBJECT_TYPE_TO_QUERY_STRING[machine];
            machineConfig['queue_query_string'] = queueString
            machineConfig['list_query_string'] = listString;
            machineConfig['log_query_string'] = logString;

            dbsToCheck.push(listString);
        }
    }

    // mailing variables

    if (useCustomUsersList) {
        var users_json = JSON.parse(fs.readFileSync('./config/users.json', 'utf8'));
        var auth_json = JSON.parse(fs.readFileSync('./config/auth.json', 'utf8'));

        users = users_json['users'];
        alertService = config.get("ZetaWash.Users.alertService");
        
        if (alertService === 'email') {
            emailUser = auth_json['Email']['user'];
            const transportOptions = {
                service: config.get("ZetaWash.Users.Email.service"),
                auth: {
                    user: emailUser,
                    pass: auth_json['Email']['pass']
                }
            }

            for (let machine in machines) {
                if (machines[machine]['email'] && !(Object.keys(machines[machine]['email']).length === 0 && machines[machine]['email'].constructor === Object)) {
                    templates[machine] = machines[machine]['email']
                } else {
                    console.error('Machine \'' + machine + '\' in default.json is missing an email object! Skipping machine.');
                }
            }

            transporter = nodemailer.createTransport(transportOptions);
        }
    }
}
