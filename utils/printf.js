var util = require('util');
var printf = function() { 
    return process.stdout.write(util.format.apply(null, arguments)); 
}

if(typeof module != 'undefined') {
    module.exports.printf = printf;
} else {
    alert('printf.js cannot be used on the client side');
}