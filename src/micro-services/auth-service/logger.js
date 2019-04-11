const winston = require("winston");
const { format } = require('winston');
const {combine, colorize, timestamp, label, printf, prettyPrint} = format;
const s3StreamLogger = require("s3-streamlogger").S3StreamLogger;
const {S3_BUCKET_SETTINGS} = require('./config/environment')
const s3Stream = new s3StreamLogger({
  bucket: S3_BUCKET_SETTINGS.name,
  access_key_id: S3_BUCKET_SETTINGS.access_key_id,
  secret_access_key: S3_BUCKET_SETTINGS.secret_key_id,
  name_format: "%Y-%m-%d-%H-%M.log",
  folder: S3_BUCKET_SETTINGS.folder
});

var transport = new winston.transports.Stream({
    stream: s3Stream
});

transport.on("error",function(err){
    console.log("S3 Logging bucket failed, please restart service")
})



/**
 * TODO
 * - PUT LOGIC HERE TO USE CONSOLE IN DEVELOPMENT, 
 *      BECAUSE TOO MANY LOGS IN S3 EVERYTIME THE 
 *      APP RESTARTS
 */

const logFormat = printf(({level, message, label, timestamp})=>{
    return `${timestamp} [${label}] [${level}] : ${message}`
})

const logger = winston.createLogger({
    format: combine(
        label({label:'Auth Service'}),
        timestamp(),
        logFormat
    ),
    transports:[
        transport,
        new winston.transports.Console({
            colorize:true,
            json:false
        })
    ]
})

logger.stream = {
    write: function(message, encoding){
        logger.info(message)
    }
}

module.exports = logger;