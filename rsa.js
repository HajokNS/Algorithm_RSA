function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function findRelativePrime(phi) {
    for (let e = 2; e < phi; e++) {
        if (gcd(e, phi) === 1) {
            return e;
        }
    }
    return null;
}

function gcd(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function modInverse(a, m) {
    let m0 = m;
    let x0 = 0;
    let x1 = 1;

    if (m === 1) return 0;

    while (a > 1) {
        const q = Math.floor(a / m);
        let t = m;

        m = a % m;
        a = t;
        t = x0;

        x0 = x1 - q * x0;
        x1 = t;
    }

    if (x1 < 0) {
        x1 += m0;
    }

    return x1;
}

function generateKeys() {
    let p, q, n, phi, e, d;

    do {
        p = generateRandomPrime();
        q = generateRandomPrime();
    } while (p === q);

    n = p * q;
    phi = (p - 1) * (q - 1);

    e = findRelativePrime(phi);

    d = modInverse(e, phi);

    console.log('p:', p);
    console.log('q:', q);
    console.log('Public Key:', { e, n });
    console.log('Private Key:', { d, n });

    return {
        publicKey: { e, n },
        privateKey: { d, n },
    };
}

function encrypt(message, publicKey) {
    const { e, n } = publicKey;
    const encryptedMessage = message.split('').map(char => BigInt(char.charCodeAt(0)) ** BigInt(e) % BigInt(n)).join(' ');
    return encryptedMessage;
}

function decrypt(encryptedMessage, privateKey) {
    const { d, n } = privateKey;
    const decryptedMessage = encryptedMessage
    .split(' ')
    .filter(Boolean)
    .map(char => String.fromCharCode(Number(BigInt(char) ** BigInt(d) % BigInt(n))))
    .join('');
    return decryptedMessage;
}

function generateRandomPrime() {
    let num;
    do {
        num = Math.floor(Math.random() * 100) + 50;
    } while (!isPrime(num));
    return num;
}

const keys = generateKeys();
const publicKey = keys.publicKey;
const privateKey = keys.privateKey;

const message = 'Algorithm';
console.log('Original Message:', message);

console.time('Encryption Time');
const encryptedMessage = encrypt(message, keys.publicKey);
console.timeEnd('Encryption Time');

console.time('Decryption Time');
const decryptedMessage = decrypt(encryptedMessage, keys.privateKey);
console.timeEnd('Decryption Time');

console.log('Encrypted Message:', encryptedMessage);
console.log('Decrypted Message:', decryptedMessage);