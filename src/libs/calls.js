var callOptions={  'iceServers':
        [{ 'urls': 'stun:stun.l.google.com:19302' }], 'sdpSemantics': 'unified-plan',
    url: 'turn:numb.viagenie.ca',
    credential: 'muazkh',
    username: 'webrtc@live.com'
};
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

var configOptions={
    host: '194.67.110.151',
    port: 9000,
    debug: '4',
    secure: false,
}
peer= new Peer(configOptions);
peer.on('open', function(peerID) {
    document.getElementById('myid').innerHTML=peerID;
});
var peercall;
peer.on('call', function(call) {
    // Answer the call, providing our mediaStream
    peercall=call;
    document.getElementById('callinfo').innerHTML="Входящий звонок <button onclick='callanswer()' >Принять</button><button onclick='callcancel()' >Отклонить</button>";
});

function callcancel() {
    peer.disconnect();

}
function callanswer() {
    navigator.mediaDevices.getUserMedia ({ audio: true, video: true }).then(function(mediaStream) {
        var video = document.getElementById('myVideo');
        peercall.answer(mediaStream); // отвечаем на звонок и передаем свой медиапоток собеседнику
        //peercall.on ('close', onCallClose); //можно обработать закрытие-обрыв звонка
        video.srcObject = mediaStream; //помещаем собственный медиапоток в объект видео (чтоб видеть себя)
        document.getElementById('callinfo').innerHTML="Звонок начат... <button onclick='callclose()' >Завершить звонок</button>"; //информируем, что звонок начат, и выводим кнопку Завершить
        video.onloadedmetadata = function(e) {//запускаем воспроизведение, когда объект загружен
            video.play();
        };
        setTimeout(function() {
            //входящий стрим помещаем в объект видео для отображения
            document.getElementById('remVideo').srcObject = peercall.remoteStream;
            document.getElementById('remVideo').onloadedmetadata= function(e) {
// и запускаем воспроизведение когда объект загружен
                document.getElementById('remVideo').play();
            };
        },1500);


    }).catch(function(err) { console.log(err.name + ": " + err.message); });
}
function callToNode(peerId) { //вызов
    navigator.mediaDevices.getUserMedia ({ audio: true, video: true }).then(function(mediaStream) {
        var video = document.getElementById('myVideo');
        peercall = peer.call(peerId,mediaStream);
        peercall.on('stream', function (stream) { //нам ответили, получим стрим
            setTimeout(function() {
                document.getElementById('remVideo').srcObject = peercall.remoteStream;
                document.getElementById('remVideo').onloadedmetadata= function(e) {
                    document.getElementById('remVideo').play();
                };
            },1500);
        });
        //  peercall.on('close', onCallClose);
        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
    }).catch(function(err) { console.log(err.name + ": " + err.message); });
}
