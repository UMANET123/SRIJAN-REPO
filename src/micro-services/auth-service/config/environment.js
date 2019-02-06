exports.PORT_NUMBER = process.env.PORT_NUMBER || 3000;
exports.NODE_ENV = process.env.NODE_ENV || 'dev';
exports.OTP_TIMER = process.env.OTP_TIMER || 5;
exports.OTP_STEP = parseInt(process.env.OTP_STEP) || 60;
exports.EMAIL_USERNAME = process.env.EMAIL_USERNAME;
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
exports.EMAIL_HOST = process.env.EMAIL_HOST;
exports.EMAIL_PORT = process.env.EMAIL_PORT;