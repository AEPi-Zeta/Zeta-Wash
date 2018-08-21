var consts = require('./consts')
const express = require('express')
var config = require('config');
var cors = require('cors')
const app = express()
var fs = require('fs');
var path = require('path');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const bodyParser = require("body-parser");
const brothers = new FileSync('db.json')
const db = low(brothers)
var https = require('https');

const port = consts.SERVER_PORT;
const OBJECT_TYPE_TO_QUERY_STRING = consts.OBJECT_TYPE_TO_QUERY_STRING

const frontendURL = config.get("ZetaWash.Host.frontendURL");
const useEncryption = config.get("ZetaWash.Encryption.useEncryption");

// Set some defaults (required if your JSON file is empty)
db.defaults({ full_list: [], washer_list: [], dryer_list: [], full_queue: [], washer_queue: [], dryer_queue: [] })
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

    console.log(`Successfully removed ${listObj.name} from queue.`)

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

     console.log(`Successfully added ${listObj.name} to queue.`)

     res.end("yes");
})

app.post('/getList', (req, res) => {
    let onlyQueue = req.body.onlyQueue
    let listType = req.body.listType

    if (onlyQueue) queryString = 'queue_query_string'; else queryString = 'list_query_string'

    queryString = OBJECT_TYPE_TO_QUERY_STRING[listType.toLowerCase()][queryString]

    list = db.get(queryString).value();

    res.send({ 
        opCode: '200',
        list: list,
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
        queryString = 'list_query_string'
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
        .remove({ listObj })
        .write()
    db.get(queueType)
        .remove({ listObj })
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
                const queryString = 'queue_query_string';
                const queueType = OBJECT_TYPE_TO_QUERY_STRING[listObj.machine.toLowerCase()][queryString]

                return listObj.endTime < Math.floor(new Date() / 1000)
            })
            .write()
    }

    // DEBUG: console.log("Queues checked.")
    
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


function checkDBs() {

}