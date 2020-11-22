
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
const host = 'https://help.fianitlombard.ru:40683/'

const call_host = {
    url: '//help.fianitlombard.ru',
    path: '/peer',
    port: '40683',
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

const wsLobbyUrl = 'wss://help.fianitlombard.ru:40683/ws/applications'
const wsCallUrl = 'wss://help.fianitlombard.ru:40683/ws/call/'


*/

export default {
    host,
    call_host,
    queNumberTimeout,
    wsLobbyUrl,
    wsCallUrl
}