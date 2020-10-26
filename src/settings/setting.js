//const host = 'http://192.168.1.235:8000/';
//const host = 'https://aidev.fun/'
const host = 'http://127.0.0.1:8000/'
const call_host = {
    url: '//aidev.fun',
    path: '/peer',
    port: '9000',
    debug: 0,

}
/*
const call_host = {
    url: '//127.0.0.1',
    path: '/peer',
    port: '9000',

}*/

const queNumberTimeout = 10000;

const wsLobbyUrl = 'wss://127.0.0.1:8000/ws/applications'
const wsCallUrl = 'wss://127.0.0.1:8000/ws/call/'

export default {
    host,
    call_host,
    queNumberTimeout,
    wsLobbyUrl,
    wsCallUrl
}