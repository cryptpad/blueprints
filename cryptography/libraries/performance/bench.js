(async () => {
    const Nacl = window.nacl

    await window.sodium.ready
    const Sodium = window.sodium

    // =======================================================================
    // Ciphersuites
    // =======================================================================

    // The abstract definition of a ciphersuite that can be tested.
    class Ciphersuite {
        /*
         * The constructor should not be called directly.
         * @private
         */
        constructor () {
            this.name = 'Initialize name: this.constructor'
            if (this.constructor === Ciphersuite) {
                throw new Error("Abstract classes can't be instantiated.")
            }
        }

        // Instead, call await Ciphersuite.init()
        static init () {
            return new Ciphersuite()
        }
    }

    // -----------------------------------------------------------------------
    // NACL
    // -----------------------------------------------------------------------
    class NaClCipher extends Ciphersuite {
        constructor () {
            super()
            this.key = Nacl.randomBytes(Nacl.secretbox.keyLength)
            this.name = 'NaCl'
            const signingKeyPair = Nacl.sign.keyPair()
            this.signingKey = signingKeyPair.secretKey
            this.verifyKey = signingKeyPair.publicKey
        }

        static async init () {
            return new NaClCipher()
        }

        // Return ciphertext and nonce
        symEnc (plaintext) {
            const nonce = Nacl.randomBytes(Nacl.secretbox.nonceLength)
            const ciphertext = Nacl.secretbox(plaintext, nonce, this.key)

            return { ciphertext, nonce }
        }

        // Return plaintext
        symDec (ciphertext, nonce) {
            return Nacl.secretbox.open(ciphertext, nonce, this.key)
        }

        sign (message) {
            return Nacl.sign(message, this.signingKey)
        }

        verify (signedMessage) {
            return Nacl.sign.open(signedMessage, this.verifyKey)
        }

        hash (message) {
            return Nacl.hash(message)
        }
    }

    // -----------------------------------------------------------------------
    // LibSodium
    // -----------------------------------------------------------------------
    class SodiumCipher extends Ciphersuite {
        constructor () {
            super()
            this.key = Sodium.crypto_secretbox_keygen()
            this.name = 'Libsodium'

            const signingKeyPair = Sodium.crypto_sign_keypair()
            this.signingKey = signingKeyPair.privateKey
            this.verifyKey = signingKeyPair.publicKey
        }

        static async init () {
            return new SodiumCipher()
        }

        // Return ciphertext and nonce
        async symEnc (plaintext) {
            const nonce = Sodium.randombytes_buf(Sodium.crypto_secretbox_NONCEBYTES)
            const ciphertext = await Sodium.crypto_secretbox_easy(plaintext, nonce, this.key)

            return { ciphertext, nonce }
        }

        // Return plaintext
        async symDec (ciphertext, nonce) {
            const plaintext = await Sodium.crypto_secretbox_open_easy(ciphertext, nonce, this.key)
            return plaintext
        }

        async sign (message) {
            return await Sodium.crypto_sign(message, this.signingKey)
        }

        async verify (message) {
            return await Sodium.crypto_sign_open(message, this.verifyKey)
        }

        async hash (message) {
            return await Sodium.crypto_generichash(64, message)
        }
    }
    // -----------------------------------------------------------------------
    // AES-GCM
    // -----------------------------------------------------------------------
    class AESGCMCipher extends Ciphersuite {
        constructor (key, name, length, nonceLength) {
            super()
            this.key = key
            this.name = name
            this.length = length
            this.nonceLength = nonceLength
        }

        static async init () {
            const name = 'AES-GCM'
            const length = 256
            const nonceLength = 12
            const key = await AESGCMCipher.genKey(length, name)

            return new AESGCMCipher(key, name, length, nonceLength)
        }

        static async genKey (length, name) {
            const key = await window.crypto.subtle.generateKey(
                {
                    name,
                    length
                },
                true,
                ['encrypt', 'decrypt']
            )

            return key
        }

        // Return ciphertext and nonce
        async symEnc (plaintext) {
            const nonce = window.crypto.getRandomValues(new Uint8Array(this.nonceLength))
            const ciphertext = new Uint8Array(
                await window.crypto.subtle.encrypt(
                    {
                        name: this.name,
                        iv: nonce
                    },
                    this.key,
                    plaintext
                )
            )

            return { ciphertext, nonce }
        }

        // Return plaintext
        async symDec (ciphertext, nonce) {
            const plaintext = new Uint8Array(
                await window.crypto.subtle.decrypt(
                    { name: this.name, iv: nonce },
                    this.key,
                    ciphertext
                )
            )
            return plaintext
        }
    }

    // -----------------------------------------------------------------------
    // AES-CBC
    // -----------------------------------------------------------------------
    class AESCBCCipher extends AESGCMCipher {
        static async init () {
            const name = 'AES-CBC'
            const length = 256
            const nonceLength = 16
            const key = await AESGCMCipher.genKey(length, name)

            return new AESCBCCipher(key, name, length, nonceLength)
        }
    }

    // -----------------------------------------------------------------------
    // RSASSA-PKCS1-v1_5
    // -----------------------------------------------------------------------
    class RSASSACipher extends Ciphersuite {
        constructor (signingKeyPair, name) {
            super()
            this.name = name
            this.signingKey = signingKeyPair.privateKey
            this.verifyKey = signingKeyPair.publicKey
            this.signOption = this.name
        }

        static async init () {
            const name = 'RSASSA-PKCS1-v1_5'
            const signingKeyPair = await RSASSACipher.genSignKeys(name)

            return new RSASSACipher(signingKeyPair, name)
        }

        static async genSignKeys (name) {
            const modulusLength = 4096
            return await window.crypto.subtle.generateKey(
                {
                    name,
                    modulusLength,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: 'SHA-256'
                },
                true,
                ['sign', 'verify']
            )
        }

        async sign (message) {
            const signature = await window.crypto.subtle.sign(
                this.signOption,
                this.signingKey,
                message
            )

            return { message, signature }
        }

        async verify (signedMessage) {
            const signature = signedMessage.signature
            const message = signedMessage.message
            return await window.crypto.subtle.verify(
                this.signOption,
                this.verifyKey,
                signature,
                message
            )
        }
    }

    // -----------------------------------------------------------------------
    // RSA-PSS
    // -----------------------------------------------------------------------
    class RSAPSSCipher extends RSASSACipher {
        constructor (signingKeyPair, name) {
            super(signingKeyPair, name)
            this.signOption = { name: this.name, saltLength: 32 }
        }

        static async init () {
            const name = 'RSA-PSS'
            const signingKeyPair = await RSASSACipher.genSignKeys(name)

            return new RSAPSSCipher(signingKeyPair, name)
        }
    }

    // -----------------------------------------------------------------------
    // ECDSA
    // -----------------------------------------------------------------------
    class ECDSACipher extends Ciphersuite {
        constructor (signingKeyPair, name) {
            super()
            this.name = name
            this.signingKey = signingKeyPair.privateKey
            this.verifyKey = signingKeyPair.publicKey
            this.signOption = { name: this.name, hash: { name: 'SHA-384' } }
        }

        static async init () {
            const name = 'ECDSA'
            const signingKeyPair = await ECDSACipher.genSignKeys(name)

            return new ECDSACipher(signingKeyPair, name)
        }

        static async genSignKeys (name) {
            return await window.crypto.subtle.generateKey(
                {
                    name,
                    namedCurve: 'P-384'
                },
                true,
                ['sign', 'verify']
            )
        }

        async sign (message) {
            const signature = await window.crypto.subtle.sign(
                this.signOption,
                this.signingKey,
                message
            )

            return { message, signature }
        }

        async verify (signedMessage) {
            const signature = signedMessage.signature
            const message = signedMessage.message
            return await window.crypto.subtle.verify(
                this.signOption,
                this.verifyKey,
                signature,
                message
            )
        }
    }

    // -----------------------------------------------------------------------
    // WebCryptoSHA512
    // -----------------------------------------------------------------------
    class SHA512Cipher extends Ciphersuite {
        constructor () {
            super()
            this.name = 'SHA-512'
        }

        static init () {
            return new SHA512Cipher()
        }

        async hash (message) {
            return await crypto.subtle.digest(this.name, message)
        }
    }

    // =======================================================================
    // Helpers
    // =======================================================================

    async function checkCorrectness (suite, message) {
        // Define assert
        function assert (condition, message) {
            if (!condition) {
                throw new Error(message || 'Assertion failed')
            }
        }

        if (typeof suite.symEnc === 'function') {
            const result = await suite.symEnc(message)
            const decResult = await suite.symDec(result.ciphertext, result.nonce)
            assert(message.length === decResult.length &&
                message.every(
                    function (value, index) { return value === decResult[index] }
                ))
        }
        if (typeof suite.sign === 'function') {
            const signedMessage = await suite.sign(message)
            const verifiedMessage = await suite.verify(signedMessage)
            assert(verifiedMessage != null)
        }
        if (typeof suite.hash === 'function') {
            const hashedMessage = await suite.hash(message)
            assert(hashedMessage != null)
        }
    }

    async function measureSuite (Suite, n, message) {
        performance.clearMarks()
        performance.clearMeasures()

        const suite = await Suite.init()

        checkCorrectness(suite, message)

        const timeResults = {}

        let result

        if (typeof suite.symEnc === 'function') {
            performance.mark('start')
            for (let i = 0; i < n; i++) {
                result = await suite.symEnc(message)
                message = result.ciphertext.slice(0, message.length)
            }
            performance.mark('mid')
            for (let i = 0; i < n; i++) {
                await suite.symDec(result.ciphertext, result.nonce)
            }
            performance.mark('end')
            performance.measure('encryption', 'start', 'mid')
            performance.measure('decryption', 'mid', 'end')

            timeResults.tSymEnc = performance.getEntriesByName('encryption')[0].duration / n
            timeResults.tSymDec = performance.getEntriesByName('decryption')[0].duration / n
        }

        if (typeof suite.sign === 'function') {
            performance.mark('startSign')
            let signedMessage
            for (let i = 0; i < n; i++) {
                signedMessage = await suite.sign(message)
            }
            performance.mark('midSign')
            for (let i = 0; i < n; i++) {
                await suite.verify(signedMessage)
            }
            performance.mark('endSign')
            performance.measure('sign', 'startSign', 'midSign')
            performance.measure('verify', 'midSign', 'endSign')

            timeResults.tSign = performance.getEntriesByName('sign')[0].duration / n
            timeResults.tVerify = performance.getEntriesByName('verify')[0].duration / n
        }

        if (typeof suite.hash === 'function') {
            performance.mark('startHash')
            for (let i = 0; i < n; i++) {
                await suite.hash(message)
            }
            performance.mark('endHash')
            performance.measure('hash', 'startHash', 'endHash')

            timeResults.tHash = performance.getEntriesByName('hash')[0].duration / n
        }

        return timeResults
    }

    async function measurePerformance () {
        const results = {}
        const n = 1000
        const minMessageSize = 2 ** 10 // 1KB
        const maxMessageSize = (2 ** 11) * minMessageSize

        for (let msgSize = minMessageSize; msgSize < maxMessageSize; msgSize *= 2) {
            performance.clearMarks()
            performance.clearMeasures()
            const message = Nacl.randomBytes(msgSize)
            const ciphers = [
                NaClCipher,
                AESGCMCipher,
                AESCBCCipher,
                SodiumCipher,
                RSASSACipher,
                RSAPSSCipher,
                ECDSACipher,
                SHA512Cipher
            ]

            results[msgSize] = {}

            for (const cipher of ciphers) {
                const cipherName = cipher.name
                const result = await measureSuite(cipher, n, message)
                Object.keys(result).forEach(function (key, _) {
                    if (results[msgSize][key] == null) {
                        results[msgSize][key] = {}
                    }
                    results[msgSize][key][cipherName] = result[key]
                })
            }
        }

        return results
    }

    // Print in Console
    measurePerformance().then(result => {
        console.info(JSON.stringify(result))
        // ========================================================================
        // Clean up
        // ========================================================================
        console.log('Benchmark suite complete.')
    })
})()
