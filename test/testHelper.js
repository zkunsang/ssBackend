const { assert, expect } = require('chai');

function isSameError(err, expectError) {
    assert.equal(err.errorType, expectError.errorType);
    assert.equal(err.name, expectError.name);
}

function throwNeedError() {
    throw {errorType: 'NEED ERROR'};
}

module.exports = {
    isSameError,
    throwNeedError,
    
}
