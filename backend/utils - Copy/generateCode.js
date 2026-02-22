const crypto = require('crypto');

function generateCode() {
    const buffer = crypto.randomBytes(3);
    const code = buffer.readUInt16BE(0) % 10000; // restrict to 4 digits
    return code.toString().padStart(4, '0'); // pad with leading zeros if necessary
}

module.exports = generateCode;