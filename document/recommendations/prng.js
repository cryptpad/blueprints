const Crypto = require("crypto");

var isInteger = x => Boolean(typeof(x) === 'number' && !isNaN(x) && x % 1 === 0);

var forEach = function (u8, f) {
    var i = 0;
    var l = u8.length;
    for (;i < l;i++) {
        f(u8[i], i, u8);
    }
};

var concat = function (u8_list) {
    var length = 0;

    // take the total length of all the uint8Arrays
    forEach(u8_list, function (u8) {
        length += u8.length;
    });

    var total = new Uint8Array(length);

    var offset = 0;
    forEach(u8_list, function (u8) {
        total.set(u8, offset);
        offset += u8.length;
    });
    return total;
};

var createNonce = function () {
    return new Uint8Array(new Array(24).fill(0));
};

var increment = function (N) {
    var l = N.length;
    while (l-- > 1) {
    /*  our linter suspects this is unsafe because we lack types
        but as long as this is only used on nonces, it should be safe  */
        if (N[l] !== 255) { return void N[l]++; } // jshint ignore:line
        if (l === 0) { throw new Error('E_NONCE_TOO_LARGE'); }
        N[l] = 0;
    }
};

var Hash = input => {
    if (!(input instanceof Uint8Array)) {
        throw new Error("Expected Uint8Array");
    }

    var hash = Crypto.createHash('sha512');
    hash.update(input);
    return new Uint8Array(hash.digest(Uint8Array));
};

var PRNG = function (seed) {
    if (!(seed instanceof Uint8Array)) {
        throw new Error("Expected Uint8Array as seed");
    }
    var counter = createNonce(24);

    var offset = 0;
    var buffer;
    // populates a buffer of available bytes by hashing the input seed and a counter.
    // refilling automatically resets the byte offset back to zero.
    var refill = function () {
        buffer = Hash(concat([seed, counter]));
        increment(counter);
        offset = 0;
    };

    refill();

    // attempts to return as many bytes as you have requested
    // if fewer are available, it will return as much as it can.
    // automatically refills the buffer as necessary, and updates
    // the counter as bytes are taken
    var take = n => {
        // check whether the previous call exhausted the available bytes
        // and fill the buffer if necessary.
        if (offset === 64) {
            refill();
        }
        // bytes are always taken from the offset to ensure
        // that entropy is never reused.
        let result = buffer.subarray(offset, offset + n);
        // thus, we increment the offset by the length of the bytes
        // that we just took
        offset += result.length;
        return result;
    };

    // takes an empty Uin8Array: keeps requesting bytes
    // with which to fill the array until it has enough.
    var fill = function (R) {
        var i = 0;
        var needed = R.length;
        while (i < needed) {
            let taken = take(needed - i);
            let count = taken.length;
            R.set(taken, i);
            i += count;
        }
        return R;
    };

    return function (n) {
        if (!isInteger(n) || n < 1) {
            throw new Error("INVALID BYTE COUNT");
        }

        return fill(new Uint8Array(n));
    };
};

var take = PRNG(new Uint8Array([0, 1, 2, 3, 4]));
setInterval(function () {
    var taken = take(75);
    console.log(taken);
}, 1000);


module.exports = PRNG;

