module.exports = function(mobile){
    let pattern = /^639[0-9]{9}$/
    return pattern.test(mobile)
}