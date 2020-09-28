import Peer from './peerjs'

const configOptions = {
    host: '134.0.112.117',
    port: 9000,
    debug: '0',
    secure: false,
}

class PeerCaller{

    constructor(uuid) {
        this.call = null;
        this.peer = new Peer([uuid], configOptions);
        this.peer.on('open',(uuid) =>{
        console.log(uuid);
        },(error)=>{
            console.log(error);
            console.log("произошла ошибка при открытии сокета для webrtc");
        });
        this.peer.on('call', (call) => {
            console.log("входящий звонок");
            // Answer the call, providing our mediaStream
            this.call = call;
            console.log("отвечаем на звонок");
            //document.getElementById('is_called').style.display='flex';
            this.callanswer();
        });

    }



}