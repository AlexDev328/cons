<template>
  <div>
    <div class="container" v-show="this.isCalled">
      <div v-if="!this.applications.length > 0"> <div class="text-cons large magin">Здесь будут отображаться заявки.На данный момент заявок нет. </div></div>
      <div v-if="this.applications.length > 0" class="text-cons large magin"> Выберите консультацию </div>
      <div v-for="app in applications" :key="app.insigator" >
        <div class="item  ">
          <div>
            <span class="text-cons-title">{{app.topic_name}}</span>
            <span class="text-cons"> Ломбард {{app.insigator_city}} {{app.insigator_filial}}</span>
          </div>
          <div class = "cons" @click="handleSelectApplication(app)">
            <div class="button-text">Начать консультацию</div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!this.isCalled">
      <div class="call_container">
        <div v-show="connection"  class="video-source-text">Соедниение установлено {{this.currentTimeMins}}:{{currentTimeSec}}</div>
        <div v-show="!connection"  class="video-source-text">Соедниение завершено</div>
        <div class="button menu2" @click="callwithVideo"> {{video_button_text}} видео</div>
        <div class="button-yellow menu " ><div  @click='callcancel'>Завершить звонок</div></div>
        <div class="conclusion">
          <div class="video-room">
            <div >
              <video id=remVideo width="700px" height="auto" ></video>
              <div v-if="!this.isCalled" class="video-source-text">Ломбард {{app.insigator_city}} {{app.insigator_filial}} </div>
            </div>

            <div v-show="myVideo">
              <video v-show="this.myVideo" id='myVideo' muted="muted"  ></video>
              <div class="video-source-text">Ваше видео</div>
            </div>
          </div>
          <div class="info-box">
            <canvas id="canvas" style="display: none"></canvas>
            <div class="proBlockText">Фотографии</div>
            <div class="pictureList" >
              <div class="picture_item" v-for="image in pictures" :key="image">
                <!--<div :style=setUrl></div>-->
                <img :src="image"  type="image/png">
              </div>
            </div>
            <div class="take_pic action-button button-text" @click="takePicture"> Сделать снимок</div>
            <div>
              <div class="proBlockText">Заключение</div>
              <textarea v-model="conclusion_text" class="text-conclusion" placeholder="Текст заключения"></textarea>
              <div class="send_button action-button button-text" @click="uploadConclusion"> {{conclusion_ready}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import WebRtcConnector from "@/libs/calls";
import api from "@/libs/backendApi";
import setting from "@/settings/setting";

export default {
  name: "Consultation",
  data() {
    return{
      token: "",
      applications: [],
      uuid: "",
      myid: '',
      isCalled: true,
      application_id: '',
      pictures: [],
      conclusion_text:'',
      app: null,
      myVideo: false,
      conclusion_ready: "Отправить заключение",
      video_button_text:"Включить",
      currentTimeSec:"00",
      currentTimeMins:0,
      timer:null,
      wsconnection: null,
      connection: null,
    }
  },
  props:{
    cons : Boolean,
  },

  created() {
    this.initWebRtc();
    //this.uploadApplicationsInPeriod();
    this.connectToLobbyWs()
  },

  methods:{
        connectToLobbyWs(){
            this.wsconnection = new WebSocket(setting.wsLobbyUrl)
            this.wsconnection.onopen = function () {
                    console.log("Соединение с лобби успешно")
            }
            this.wsconnection.onmessage = function (msg) {
                console.log(msg.data)
                let jsondata=JSON.parse(msg.data)
                console.log(jsondata)
                console.log(jsondata.applications)
                this.applications =jsondata.applications
            }.bind(this)
        },
      wsSendConclusion(final=false){
          var msg = {
              cons_text: this.conclusion_text,
              id:   this.app.id,
              pictures: this.pictures,
              final: final
          };
          this.wsconnection.send(JSON.stringify(msg))
      },

      startTimer(){
          this.timer = setInterval(()=>
          {
              this.currentTimeSec++;
              if (this.currentTimeSec === 60){
                  this.currentTimeMins++;
                  this.currentTimeSec=0
              }
              if (this.currentTimeSec<10){
                  this.currentTimeSec='0'+this.currentTimeSec;
              }
          }, 1000)
      },

      uploadApplicationsInPeriod(){
          this.handleLoadApplications()
          clearInterval(this.timer)
          this.timer = setInterval(()=>{
              this.handleLoadApplications()
          }, 10000)
      },


    cancelCall() {
      this.webRtcConnector.callcancel();
    },

    updateIsCalled(){
      if (this.webRtcConnector.get_incoming_call())
        this.isCalled = true;
    },
    
    getSelfUserId(){
      return api.getSelfUser()
          .then(res => {
            console.log("Идентификатор текущего пользователя: " + res.data.id);
            return res.data.id;
          })
    },

    initWebRtc(){
      return this.getSelfUserId()
          .then(selfUserId => {
            this.myid = selfUserId;
            api.getUserProfile(selfUserId)
                .then(response => {
                  console.log('Мой PeerID: ' + response.data.peerid);
                  this.uuid = response.data.peerid;
                  this.webRtcConnector = new WebRtcConnector(this.uuid, this.onCall);
                }).catch(()=>{
                document.location.reload()
            })
            })
    },
    
    onCall(call) {
      console.log("Входящий звонок");
      // Answer the call, providing our mediaStream
      this.webRtcConnector.peercall = call;
      console.log("Отвечаем на звонок");
      document.getElementById('is_called').style.display='flex';
      this.webRtcConnector.callanswer();
    },

    /**
     * Обработчик кнопки загрузить запросы
     * */
    handleLoadApplications() {
      api.getApplications()
          .then(response => {
            console.log(response);
            this.applications = response.data.applications;
          })
          .catch(error => {
            console.error(error.response);
          });
    },

    callwithVideo(){
        this.myVideo = !this.myVideo;
        this.video_button_text = 'Выключить';
        //this.handleSelectApplication(this.app, );
        this.webRtcConnector.callToNode(this.app.peerid, this.myVideo);
      /*api.getUserProfile(this.app.insigator)
          .then(response => {
            console.log("Вызов " + response.data.peerid);
            this.webRtcConnector.callToNode(response.data.peerid, true);
            this.isCalled = false;
            this.myVideo = true;
          }).catch(error => {
        console.error(error.response);
      });*/


    },

    handleSelectApplication(app, video=false) {
      console.log(app.insigator)
      this.app = app;
      this.application_id = app.id;
      api.getUserProfile(app.insigator)
          .then(response => {
            console.log("Проверка на актуальность заявки")
            api.deactivateApplication(this.application_id).then(res=>
            {
                console.log(res)
                if (res.status !== 200){
                    return null;
                }
                console.log("Вызов " + response.data.peerid);
                //todo: Проверка попытки подключения двух консультантов.
                this.webRtcConnector.callToNode(response.data.peerid, video);
                this.wsconnection.close()
                this.wsuploadConclusion()
                this.isCalled = false;
                this.connection = true;
                setTimeout(this.startTimer, 500);

            }).catch(error => {
                console.error(error.response);
            }).catch(error => {
            console.error(error.response);
          })});

    },

    takePicture() {
      const canvas = document.getElementById('canvas');
      const remVideo = document.getElementById('remVideo');
      const width = remVideo.videoWidth;
      const height = remVideo.videoHeight;
      const context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(remVideo, 0, 0, width, height);
        const imgData = canvas.toDataURL('image/png');
        console.log(imgData)
        this.pictures.push(imgData);
      }
    },

    callcancel() {
      this.uploadFinalConclusion()
      this.myVideo = true;
      document.location.reload();
      this.webRtcConnector.callcancel();

      //this.$router.push({path:"/consultation"})

    },

    uploadConclusion(){
      this.wsSendConclusion()
      api.createConclusion(this.application_id, this.conclusion_text, this.pictures, 'False')
          .then(res => {
            console.log(res)
            this.conclusion_ready = "Редактировать заключение"
          }).catch(error => {
          console.error(error.response);
      });
    },
    wsuploadConclusion(){
      this.wsconnection = new WebSocket(setting.wsCallUrl+this.app.id+'/')
      this.wsconnection.onopen = function () {
        console.log("Соединение с сокетом для звонка успешно")
      }
      this.wsconnection.onmessage = function (msg) {
        console.log(msg.data)
        let jsondata=JSON.parse(msg.data)
        console.log(jsondata.disconnect)
          if (jsondata.conclusion.disconnect == true)
              this.connection = false;
      }.bind(this)

        // api.createConclusion(this.application_id, this.conclusion_text, this.pictures, 'False')
        //   .then(res => {
        //     console.log(res)
        //     this.conclusion_ready = "Редактировать заключение"
        //   }).catch(error => {
        //   console.error(error.response);
        // });
    },

    uploadFinalConclusion(){
        this.wsSendConclusion(true)
        console.log("загруженно без возможности изменения")
        api.createConclusion(this.application_id, this.conclusion_text, this.pictures, 'True')
            .then(res => {
                console.log(res)
                this.conclusion_ready = "Редактировать заключение"
            }).catch(error => {
            console.error(error.response);
        });
    }

  },
    beforeDestroy() {
        this.webRtcConnector.destroy();
        clearInterval(this.timer);
    }


}
</script>

<style scoped>

</style>
