const otplib = require('otplib');

const secret = otplib.authenticator.generateSecret()
let token = otplib.totp.generate(secret, {step:1, window:30});
let output = ""
while(1){
    var verify = otplib.totp.verify({token: token, secret:secret})
    let temp = `${otplib.totp.timeRemaining()}, ${verify}`
    if (temp != output){
        output = temp
        console.log(temp);
    }

    if(!verify){
        break;
    }
    
}
