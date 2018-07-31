const SERVER_PORT = "8088"

const OBJECT_TYPE_TO_QUERY_STRING = {
    "both": {
        "queue_query_string": "full_queue",
        "list_query_string": "full_list"
    },
    "washer": {
        "queue_query_string": "washer_queue",
        "list_query_string": "washer_list",
    },
    "dryer": {
        "queue_query_string": "dryer_queue",
        "list_query_string": "dryer_list"
    }
}

const URL_STRING = 'http://localhost:4200'

const USE_SSL = false

const SERVER_URL_STRING = `http://localhost:${SERVER_PORT}/`
const SERVER_URL_SSL_STRING = `https://localhost:${SERVER_PORT}/`

module.exports.SERVER_PORT = SERVER_PORT;
module.exports.OBJECT_TYPE_TO_QUERY_STRING = OBJECT_TYPE_TO_QUERY_STRING
module.exports.URL_STRING = URL_STRING
module.exports.USE_SSL = USE_SSL
module.exports.SERVER_URL_STRING = SERVER_URL_STRING
module.exports.SERVER_URL_SSL_STRING = SERVER_URL_SSL_STRING
