const winston = require("winston");
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

const logger = winston.createLogger({
    transports:[
        transport,
        new winston.transports.Console()
    ]
})

module.exports = logger;