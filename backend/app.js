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
const db = low(db_file);
var https = require('https');

const port = consts.SERVER_PORT;
const OBJECT_TYPE_TO_QUERY_STRING = consts.OBJECT_TYPE_TO_QUERY_STRING

const frontendURL = config.get("ZetaWash.Host.frontendURL");
const useEncryption = config.get("ZetaWash.Encryption.useEncryption");
const useCustomUsersList = config.get("ZetaWash.Users.customUsersList");
let alertService;

// mailing variables

let templates;
let dryerEmail;
let washerEmail;
let transporter;
let mailOptions;
let users;
let emailUser;

if (useCustomUsersList) {
    var users_json = JSON.parse(fs.readFileSync('./config/users.json', 'utf8'));
    users = users_json['users'];
    alertService = config.get("ZetaWash.Users.alertService");
    emailUser = config.get("ZetaWash.Users.Email.auth.user");
    if (alertService === 'email') {
        const transportOptions = {
            service: config.get("ZetaWash.Users.Email.service"),
            auth: {
                user: emailUser,
                pass: config.get("ZetaWash.Users.Email.auth.pass")
            }
        }

        washerEmail = config.get("ZetaWash.Users.Email.dryerEmail");
        dryerEmail = config.get("ZetaWash.Users.Email.washerEmail");

        templates = {
            'washer': washerEmail,
            'dryer': dryerEmail
        }

        transporter = nodemailer.createTransport(transportOptions);
    }
}

// Set some defaults (required if your JSON file is empty)
db.defaults({ full_list: [], washer_list: [], dryer_list: [], full_queue: [], washer_queue: [], dryer_queue: [], washer_log: [], dryer_log: [], full_log: []})
  .write()

console.log(`origin: ${frontendURL}`)

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

    console.log(`Successfully removed ${listObj.name} from ${onlyQueue ? 'queue' : 'list'}.`)

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

     console.log(`Successfully added ${listObj.name} to ${onlyQueue ? 'queue' : 'list'}.`)

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

    queueType = OBJECT_TYPE_TO_QUERY_STRING[listObj.machine.toLowerCase()][queryString]
    
    db.get(fullString)  // adds object to the full list of queued objects
        .push({ listObj })
        .write()
    db.get(queueType)
        .push({ listObj })
        .write()
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

    queueType = OBJECT_TYPE_TO_QUERY_STRING[listObj.machine.toLowerCase()][queryString]

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
}

// check the queue for finished items every 500 milliseconds
let checkListID = setInterval(() => checkList(), 500);

function checkList() {

    let dbsToCheck = ['washer_list', 'dryer_list', 'full_list']

    for (let i = 0; i < dbsToCheck.length; i++) {
        let dbToCheck = dbsToCheck[i]
        db.get(dbToCheck)
            .remove(function (parent) {
                listObj = parent.listObj;

                const shouldRemove = listObj.endTime < Math.floor(new Date() / 1000);

                // does actions when the listObj is to be removed from the list
                if (shouldRemove) {
                    onRemoveFromList(listObj)
                }

                return shouldRemove;
            })
            .write()
    }

    // DEBUG: console.log("Queues checked.")
    
}

function onRemoveFromList(listObj) {

    // adds item to the log 
    const fullString = 'full_log';
    const queryString = 'log_query_string';
    const queueType = OBJECT_TYPE_TO_QUERY_STRING[listObj.machine.toLowerCase()][queryString]

    db.get(fullString)  // adds object to the full log of objects
        .push({ listObj })
        .write()
    db.get(queueType)   // adds object to the machine-specific log of objects
        .push({ listObj })
        .write()

    // sends email if necessary
    if (useCustomUsersList && alertService == 'email') {
        console.log("sending email");
        const email = users.find(function(element) {
            return element.name === listObj['name'];
          })['email'];
        const machine = listObj['machine'];

        console.log(listObj['endTime']);
        
        var mailOptions = {
            from: emailUser,
            to: email,
            subject: emailParser(templates[machine]['subject'], listObj['name'], parseInt(listObj['endTime'])),
            text: emailParser(templates[machine]['text'],listObj['name'], parseInt(listObj['endTime']))
          };
        
        console.log("sending mail to " + listObj['name']);
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
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
    console.log(`ZetaWash server listening on port ${port}\nSSL: Enabled`)
} else {
    app.listen(port, () => console.log(`ZetaWash server listening on port ${port}\nSSL: Disabled`))
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

function checkDBs() {

}