<template>
  <div>
    <div class="container" v-show="this.isCalled">
      <button type="submit" @click="handleLoadApplications">загрузить запросы</button>
      <div v-for="app in applications" :key="app.insigator" >
        <div class="item text-cons-title ">
          <div>
            <span>{{app.topic_name}}</span>
            <span class="text-cons"> Товаровед {{app.insigator.name}}</span>
          </div>
          <div class = "cons" @click="handleSelectApplication(app)">
            <div class="button-text">Начать консультацию</div>
          </div>
        </div>
      </div>
    </div>
    <div  v-show="!this.isCalled">
      <button @click='callcancel' >Завершить звонок</button>
      <video v-show="this.myVideo" id=myVideo muted="muted" width="600px" height="auto" ></video>
      <video id=remVideo width="400px" height="auto" ></video>
      <canvas id="canvas" style="display: none"></canvas>
      <div id="pictureList" >
        <div class="picture_item" v-for="image in pictures" :key="image">
          <div :style=setUrl></div>
          <img :src="image" >
        </div>
      </div>
      <div class="button" @click="takePicture"> Сделать снимок</div>
      <textarea class="text-conclusion" placeholder="Текст консультанта"></textarea>

    </div>
  </div>

</template>

<script>
import axios from "axios";
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

    handleSelectApplication(app) {
      console.log(app.insigator)
      this.application_id = app.id;
      api.getUserProfile(app.insigator)
          .then(response => {
            console.log("Вызов " + response.data.peerid);
            this.webRtcConnector.callToNode(response.data.peerid, false);
            this.isCalled = false;
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

        //const imgData = canvas.toBlob()
        const imgData = canvas.toDataURL('image/png');
        console.log(imgData);
        //this.addPicture(imgData);
        this.pictures.push(imgData);
      }
    },

    callcancel() {
      this.webRtcConnector.callcancel();
      this.$router.push({path:"/consultation"})
    },

    uploadConclusion(text, lst_img){
      let data = new FormData();
      data.append('data', lst_img);
      data.append('text', text)
      //todo: перенести запрос в backendApi.js
      axios
          .post(`http://127.0.0.1:8000/api/conclusion/`, data, {
            headers: {
              'Authorization': 'Bearer ' + this.getToken(),
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(res => {
            console.log(res)
          });
    }

  },


}
</script>

<style scoped>
.pictureList{
  display: flex;
  width: 200px;
}

.picture_item{
  width: 100px;
  margin: 5px;
}
.picture_item img{
  width: 100px;
}
video{
  align-items: center;
  justify-content: center
}
.text-conclusion{

  position: relative;
  width: 650px;
  height: 300px;
  resize: vertical;
  left: 120px;
}

</style>