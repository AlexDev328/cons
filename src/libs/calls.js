import Peer from './peerjs';

const configOptions = {
    host: '134.0.112.117',
    port: 9000,
    debug: '4',
    secure: false,
}

export default class {

    constructor(callerPeerId) {
        this.canvas = document.getElementById('canvas');
        this.photo = document.getElementById('photo');

        console.log("entered constructor");
        this.peer = new Peer([callerPeerId], configOptions);
        this.peer.on('open', (peerId) => {
            console.log(peerId);
        }, (err) => {
            console.log(err);
            console.log("произошла ошибка при открытии сокета для webrtc");
        });
        this.peercall = null;
        this.peer.on('call', (call) => {
            console.log("receiving call");
            // Answer the call, providing our mediaStream
            this.peercall = call;
            console.log("отвечаем на звонок");
            document.getElementById('is_called').style.display='flex';
            this.callanswer();
        });
        this.peer.on('close',()=>{
            console.log("завершение звонка")
            this.callcancel()
        })
    }

    /*clearphoto() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }*/
    takepicture() {
        this.width = document.getElementById('remVideo').videoWidth;
        this.height = document.getElementById('remVideo').videoHeight;
        var context = this.canvas.getContext('2d');
        if (this.width && this.height) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            context.drawImage(document.getElementById('remVideo'), 0, 0, this.width, this.height);

            //var data = this.canvas.toDataURL('image/png');
            //this.photo.setAttribute('src', data);
        }
    }

    callcancel() {
        //this.peercall.disconnect();
        //this.peercall.peerConnection.close();
        console.log("завершение звонка")
       // stream.stop();
        this.peercall.peerConnection.close();


    }

    get_incoming_call(){
        return this.peercall;
    }

    callanswer(with_video=true) {
        navigator.mediaDevices.getUserMedia({audio: true, video: with_video})
            .then((mediaStream) => {
                const video = document.getElementById('myVideo');
                this.peercall.answer(mediaStream); // отвечаем на звонок и передаем свой медиапоток собеседнику
                //this.peercall.on ('close', this.callcancel(mediaStream)); //можно обработать закрытие-обрыв звонка
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

    callToNode(peerId,with_video=true) { //вызов
        navigator.mediaDevices.getUserMedia({audio: true, video: with_video})
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

                video.srcObject = mediaStream;
                video.onloadedmetadata = () => {
                    video.play();
                };
            }).catch(function (err) {
                console.log(err.name + ": " + err.message);
            });
    }
}

