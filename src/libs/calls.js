import Peer from './peerjs';
/*
const callOptions = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }
    ],
    sdpSemantics: 'unified-plan',
    url: 'turn:numb.viagenie.ca',
    credential: 'muazkh',
    username: 'webrtc@live.com'
}

/*
    {
    url: 'turn:192.158.29.39:3478?transport=udp',
    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    username: '28224511:1379330808'
    },
    {
    url: 'turn:192.158.29.39:3478?transport=tcp',
    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    username: '28224511:1379330808'
    },
        };*/

const configOptions = {
    host: '194.67.110.151',
    port: 9000,
    debug: '4',
    secure: false,
}

export default class {
    constructor(callerPeerId) {
        this.peer = new Peer([callerPeerId], configOptions);
        this.peer.on('open', (peerId) => {
            console.log(peerId);
        });
        this.peercall = null;
        this.peer.on('call', (call) => {
            console.log("receiving call");
            // Answer the call, providing our mediaStream
            this.peercall = call;
            document.getElementById('callinfo').innerHTML = "Входящий звонок <button onclick='callanswer()' >Принять</button><button onclick='callcancel()' >Отклонить</button>";
        });
    }

    callcancel() {
       // this.peer.disconnect();
    }

    callanswer() {
        navigator.mediaDevices.getUserMedia({audio: true, video: true})
            .then((mediaStream) => {
                const video = document.getElementById('myVideo');
                this.peercall.answer(mediaStream); // отвечаем на звонок и передаем свой медиапоток собеседнику
                //peercall.on ('close', onCallClose); //можно обработать закрытие-обрыв звонка
                video.srcObject = mediaStream; //помещаем собственный медиапоток в объект видео (чтоб видеть себя)
                //document.getElementById('callinfo').innerHTML="Звонок начат... <button onclick='callclose()' >Завершить звонок</button>"; //информируем, что звонок начат, и выводим кнопку Завершить
                video.onloadedmetadata = () => {//запускаем воспроизведение, когда объект загружен
                    video.play();
                };
                setTimeout(() => {
                    //входящий стрим помещаем в объект видео для отображения
                    document.getElementById('remVideo').srcObject = this.peercall.remoteStream;
                    document.getElementById('remVideo').onloadedmetadata = () => {
                        // и запускаем воспроизведение когда объект загружен
                        document.getElementById('remVideo').play();
                    };
                }, 1500);
            }).catch((err) => {
                console.log(err.name + ": " + err.message);
            });
    }

    callToNode(peerId) { //вызов
        navigator.mediaDevices.getUserMedia({audio: true, video: true})
            .then((mediaStream) => {
                const video = document.getElementById('myVideo');
                this.peercall = this.peer.call(peerId, mediaStream);
                this.peercall.on('stream', () => { //нам ответили, получим стрим
                    setTimeout(() => {
                        document.getElementById('remVideo').srcObject = this.peercall.remoteStream;
                        document.getElementById('remVideo').onloadedmetadata = () => {
                            document.getElementById('remVideo').play();
                        };
                    }, 1500);
                });
                //peercall.on('close', onCallClose);
                video.srcObject = mediaStream;
                video.onloadedmetadata = () => {
                    video.play();
                };
            }).catch(function (err) {
                console.log(err.name + ": " + err.message);
            });
    }
}

