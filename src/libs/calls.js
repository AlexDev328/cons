import Peer from './peerjs';

const configOptions = {
    host: '194.67.110.151',
    port: 9000,
    debug: '4',
    secure: false,
}

export default class {

    constructor(callerPeerId) {
        console.log("entered constructor");
        this.peer = new Peer([callerPeerId], configOptions);
        this.peer.on('open', (peerId) => {
            console.log(peerId);
        });
        this.peercall = null;
        this.peer.on('call', (call) => {
            console.log("receiving call");
            // Answer the call, providing our mediaStream
            this.peercall = call;
            document.getElementById('is_called').style.display = 'block';
        });
    }

    callcancel() {
        //this.peercall.disconnect();
        //this.peercall.peerConnection.close();
        console.log("завершение звонка")
        this.peercall.close()
        this.peer.reconnect()

    }

    get_incoming_call(){
        return this.peercall;
    }

    callanswer() {
        navigator.mediaDevices.getUserMedia({audio: true, video: true})
            .then((mediaStream) => {
                const video = document.getElementById('myVideo');
                this.peercall.answer(mediaStream); // отвечаем на звонок и передаем свой медиапоток собеседнику
                this.peercall.on ('close', this.callcancel); //можно обработать закрытие-обрыв звонка
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
                this.peercall.on ('close', this.callcancel); //можно обработать закрытие-обрыв звонка
                video.srcObject = mediaStream;
                video.onloadedmetadata = () => {
                    video.play();
                };
            }).catch(function (err) {
                console.log(err.name + ": " + err.message);
            });
    }
}

