//const host = 'http://192.168.1.235:8000/';
//const host = 'https://aidev.fun/'

const host = 'https://help.fianitlombard.ru:40683/'

const call_host = {
    url: '//help.fianitlombard.ru',
    path: '/peer',
    port: '40683',
    debug: 0,

}
/*
const call_host = {
    url: '//127.0.0.1',
    path: '/peer',
    port: '9000',

}*/

const queNumberTimeout = 10000;

// const wsLobbyUrl = 'ws://192.168.1.235:8000/ws/applications'
// const wsCallUrl = 'ws://192.168.1.235:8000/ws/call/'
const wsLobbyUrl = 'wss://help.fianitlombard.ru:40683/ws/applications'
const wsCallUrl = 'wss://help.fianitlombard.ru:40683/ws/call/'

export default {
    host,
    call_host,
    queNumberTimeout,
    wsLobbyUrl,
    wsCallUrl
}