<template>
  <div>
    <div class="container" v-show="this.isCalled">
      <button type="submit" @click="handleLoadApplications">загрузить запросы</button>
      <div v-for="app in applications" :key="app.insigator" >
        <div class="item text-cons-title ">
          <div style="width: 400px;">
            <span>{{app.topic_name}}</span>
            <span class="text-cons"> Ломбард {{app.insigator_city}} {{app.insigator_filial}}</span>
          </div>
          <div class = "cons" @click="handleSelectApplication(app)">
            <div class="button-text">Начать консультацию</div>
          </div>
        </div>
      </div>
    </div>
    <div  v-show="!this.isCalled">
      <div class="button menu" ><div  @click='callcancel'>Завершить звонок</div></div>
      <div class="flex">
        <div class="button menu2" @click="callwithVideo"> Включить видео</div>
        <video v-show="this.myVideo" id='myVideo' muted="muted" width="200px" height="auto" ></video>
        <video id=remVideo width="700px" height="auto" ></video>
      </div>
      <canvas id="canvas" style="display: none"></canvas>
      <div class="pictureList" >
        <div class="picture_item" v-for="image in pictures" :key="image">
          <!--<div :style=setUrl></div>-->
          <img :src="image"  type="image/png">
        </div>
      </div>
      <div class="take_pic action-button button-text" @click="takePicture"> Сделать снимок</div>
      <div class="control-block">
        <textarea v-model="conclusion_text" class="text-conclusion" placeholder="Текст консультанта"></textarea>
        <div class="send_button action-button button-text" @click="uploadConclusion"> {{conclusion_ready}}</div>
      </div>
    </div>
  </div>

</template>

<script>
import WebRtcConnector from "@/libs/calls";
import api from "@/libs/backendApi";

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
    }
  },
  props:{
    cons : Boolean,
  },

  created() {
    this.initWebRtc();
  },

  methods:{
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
        this.handleSelectApplication(this.app, this.myVideo);
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
            console.log("Вызов " + response.data.peerid);
            this.webRtcConnector.callToNode(response.data.peerid, video);
            this.isCalled = false;
            api.deactivateApplication(this.application_id)
          }).catch(error => {
            console.error(error.response);
          });
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
        this.pictures.push(imgData);
      }
    },

    callcancel() {
      this.uploadConclusion()
      this.myVideo = true;
      document.location.reload();
      this.webRtcConnector.callcancel();

      //this.$router.push({path:"/consultation"})

    },

    uploadConclusion(){
      api.createConclusion(this.application_id, this.conclusion_text, this.pictures)
          .then(res => {
            console.log(res)
            this.conclusion_ready = "Редактировать заключение"
          }).catch(error => {
          console.error(error.response);
      });
    }

  },
    beforeDestroy() {
        this.webRtcConnector.destroy()
    }


}
</script>

<style scoped>

.action-button{
  background-color: #720F13;
  border: 1px solid #C4C4C4;
  box-sizing: border-box;
  box-shadow: 2px 2px 16px #C4C4C4;
  border-radius: 10px 0px;
  min-height: 62px;
   margin: 10px;
  line-height: 60px;
}
.pictureList{
  display: flex;
  height: 120px;
  margin: 5px;
  border: 1px solid #720F13;
  border-radius: 10px 0px;
}

.picture_item{
  width: 100px;
  margin: 5px;
}
.picture_item img{
  width: 100px;
  margin: 10px
}
video{
  align-items: center;
  justify-content: center
}

.take_pic{
position: relative;
width: 200px;
}

.send_button{
  width: 98vw;
}


.flex{
  display: flex;
  margin: 10px;
  align-items: center;
  justify-content: center;
}

</style>
