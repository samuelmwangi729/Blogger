let crypto = require("crypto");

const generateRandom = (xters) =>{
    return crypto.randomBytes(xters).toString('hex');
}

module.exports = generateRandom