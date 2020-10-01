import Peer from './peerjs';

const configOptions = {
    host: 'gradientmedia.ru',
    debug: '4',
    port:'443',
    secure: true,
    path:'/peer',
}

export default class {
    constructor(callerPeerId, onCallCb) {
        this.canvas = document.getElementById('canvas');

        console.log("entered constructor");
        this.peer = new Peer([callerPeerId], configOptions);
        this.peer.on('open', (peerId) => {
            console.log(peerId);
        }, (err) => {
            console.log(err);
            console.log("произошла ошибка при открытии сокета для webrtc");
        });
        this.peercall = null;
        this.mediaStream = null;
        this.peer.on('call', onCallCb);
        this.peer.on('close',()=>{
            console.log("завершение звонка")
            this.callcancel()
        })
    }

    callcancel() {
        //this.peercall.disconnect();
        //this.peercall.peerConnection.close();
        console.log("завершение звонка")
       // stream.stop();
        this.peercall.close()
        //this.peercall.peerConnection.close();


    }
/*
    toogleAudio(){
        this.peercall.

    }
*/
    get_incoming_call(){
        return this.peercall;
    }

    callanswer() {
        navigator.mediaDevices.getUserMedia({audio: true,
            video:  {
                width: { min: 1280 },
                height: { min: 720 }
            }})
            .then((mediaStream) => {
                console.log("Отправляем следующие треки:");
                console.log(mediaStream.getTracks());
                const video = document.getElementById('myVideo');
                this.peercall.answer(mediaStream); // отвечаем на звонок и передаем свой медиапоток собеседнику
                //this.peercall.on ('close', this.callcancel(mediaStream)); //можно обработать закрытие-обрыв звонка
                video.srcObject = mediaStream; //помещаем собственный медиапоток в объект видео (чтоб видеть себя)
                //document.getElementById('callinfo').innerHTML="Звонок начат... <button onclick='callclose()' >Завершить звонок</button>"; //информируем, что звонок начат, и выводим кнопку Завершить
                video.onloadedmetadata = () => {//запускаем воспроизведение, когда объект загружен
                    video.play();
                };
                setTimeout(() => {
                    console.log("Получаем следующие треки:");
                    console.log(this.peercall.remoteStream.getTracks());
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

    callToNode(peerId,with_video=false) { //вызов
        /* В Peer.js если звонящий не отправляет видеопоток, то по умолчанию не может принимать видеопоток.
        в метод call нужно передать объект с опциями, переопределяющими стандартное поведение WebRTC */
        const options = {
            'constraints': {
                'mandatory': {
                    'OfferToReceiveAudio': true,
                    'OfferToReceiveVideo': true
                },
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1,
            }
        }
        navigator.mediaDevices.getUserMedia({audio: true, video: with_video})
            .then((mediaStream) => {
                this.mediaStream = mediaStream;
                console.log("Отправляем следующие треки:");
                console.log(this.mediaStream.getTracks());
                const video = document.getElementById('myVideo');
                this.peercall = this.peer.call(peerId, this.mediaStream, options);

                this.peercall.on('stream', (s) => { //нам ответили, получим стрим
                        console.log("Получаем следующие треки:");
                        console.log(s.getTracks());
                        document.getElementById('remVideo').srcObject = this.peercall.remoteStream;
                        document.getElementById('remVideo').onloadedmetadata = () => {
                            document.getElementById('remVideo').play();
                        };
                });

                video.srcObject = this.mediaStream;
                video.onloadedmetadata = () => {
                    video.play();
                };
            }).catch(function (err) {
                console.log(err.name + ": " + err.message);
            });
    }
    
    addvideo(){
        console.log(this.mediaStream);
        navigator.mediaDevices.getUserMedia({audio: false, video: true})
            .then(mediaStream => {
                mediaStream.getVideoTracks()
                    .forEach(vt => this.mediaStream.addTrack(vt));
            }).catch(function (err) {
            console.log(err.name + ": " + err.message);
        });
    }

}

