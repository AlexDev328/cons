/*

password sKFKdhD3v3UoqU5ZKcCEAL

 config: { 'iceServers': [
            { urls: 'stun:help.fianitlombard.ru:5349?transport=tcp'},
        ]
    },
 */
/*
const queNumberTimeout = 10000;


const host = 'http://192.168.1.4:8000/';
const wsLobbyUrl = 'ws://192.168.1.4:8000/ws/applications'
const wsCallUrl = 'ws://192.168.1.4:8000/ws/call/'
const call_host = {
    url: '//help.fianitlombard.ru',
    path: '/peer',
    port: '40683',
    debug: 3,
    config: {
        'iceServers': [
            {url: 'stun:stun01.sipphone.com'},
            {url: 'stun:stun.ekiga.net'},
            {url: 'stun:stunserver.org'},
            {url: 'stun:stun.softjoys.com'},
            {url: 'stun:stun.voiparound.com'},
            {url: 'stun:stun.voipbuster.com'},
            {url: 'stun:stun.voipstunt.com'},
            {url: 'stun:stun.voxgratia.org'},
            {url: 'stun:stun.xten.com'},

        ]
    },

}





/*
const queNumberTimeout = 10000;


const host = 'http://192.168.1.235:8000/';
const wsLobbyUrl = 'ws://192.168.1.235:8000/ws/applications'
const wsCallUrl = 'ws://192.168.1.235:8000/ws/call/'
const call_host = {
    url: '//help.fianitlombard.ru',
    path: '/peer',
    port: '40683',
    debug: 3,
    config: {
        'iceServers': [
            {url: 'stun:stun01.sipphone.com'},
            {url: 'stun:stun.ekiga.net'},
            {url: 'stun:stunserver.org'},
            {url: 'stun:stun.softjoys.com'},
            {url: 'stun:stun.voiparound.com'},
            {url: 'stun:stun.voipbuster.com'},
            {url: 'stun:stun.voipstunt.com'},
            {url: 'stun:stun.voxgratia.org'},
            {url: 'stun:stun.xten.com'},

        ]
    },

}
*/

/*
/**/
const host = 'https://help.fianitlombard.ru/'

const call_host = {
    url: '//help.fianitlombard.ru',
    path: '/peer',
    port: '',
    debug: 3,
    config: { 'iceServers': [
            { urls: 'turn:test@help.fianitlombard.ru:5349?transport=tcp',
                credential:'test',
            },
            { urls: 'stun:stun01.sipphone.com' },
            { urls: 'stun:stun.ekiga.net' },
            { urls: 'stun:stunserver.org' },
            { urls: 'stun:stun.softjoys.com' },
            { urls: 'stun:stun.voiparound.com' },
            { urls: 'stun:stun.voipbuster.com' },
            { urls: 'stun:stun.voipstunt.com' },
            { urls: 'stun:stun.voxgratia.org' },
            { urls: 'stun:stun.xten.com' },
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "turn:0.peerjs.com:3478", username: "peerjs", credential: "peerjsp" }
        ],
        sdpSemantics: "unified-plan"
    },
}


const queNumberTimeout = 10000;

const wsLobbyUrl = 'wss://help.fianitlombard.ru/ws/applications'
const wsCallUrl = 'wss://help.fianitlombard.ru/ws/call/'


/*

const host = 'https://aidev.fun/'

const call_host = {
    url: '//aidev.fun',
    path: '/peer',
    port: '',
    debug: 3,
    config: { 'iceServers': [
            { url: 'stun:stun01.sipphone.com' },
            { url: 'stun:stun.ekiga.net' },
            { url: 'stun:stunserver.org' },
            { url: 'stun:stun.softjoys.com' },
            { url: 'stun:stun.voiparound.com' },
            { url: 'stun:stun.voipbuster.com' },
            { url: 'stun:stun.voipstunt.com' },
            { url: 'stun:stun.voxgratia.org' },
            { url: 'stun:stun.xten.com' },

        ]
    },

}

const queNumberTimeout = 10000;

const wsLobbyUrl = 'wss://aidev.fun/ws/applications'
const wsCallUrl = 'wss://aidev.fun/ws/call/'

*/

export default {
    host,
    call_host,
    queNumberTimeout,
    wsLobbyUrl,
    wsCallUrl
}