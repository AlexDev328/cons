const host = 'http://192.168.1.235:8000/';
//const host = 'https://aidev.fun/'
const call_host = {
    url: '//aidev.fun',
    path: '/peer',
    port: '9000',

}
/*
const call_host = {
    url: '//127.0.0.1',
    path: '/peer',
    port: '9000',

}*/

const queNumberTimeout = 10000;

const wsLobbyUrl = 'ws://192.168.1.235:8000/applications'
const wsCallUrl = 'ws://192.168.1.235:8000/call/'

export default {
    host,
    call_host,
    queNumberTimeout,
    wsLobbyUrl,
    wsCallUrl
}