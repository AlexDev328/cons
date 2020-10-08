<template>
  <div>
    <div class="text-cons large magin"> Мне нужна помощь с оценкой : </div>
    <div class="container" >

      <div v-for="topic in list_of_topics" :key="topic.id" class="item-el" >
        <div @click="raiseHand(topic.id)">{{topic.name}}  <span style="font-size: small;">(в очереди: {{topic.queue}})</span></div>
      </div>
    </div>
  </div>

</template>

<script>
import api from "@/libs/backendApi";
import WebRtcConnector from "@/libs/calls";

export default {
  name: "CreatingApplication",
  data() {
    return {
      list_of_topics: [],
      webRtcConnection:null
    }
  },
  methods: {

    initWebRtcConnector(){
        return this.getSelfUserId()
            .then(selfUserId => api.getUserProfile(selfUserId))
            .then(response => {
                console.log('Мой PeerID: ' + response.data.peerid);
                this.uuid = response.data.peerid;
                this.webRtcConnection = new WebRtcConnector(this.uuid, this.onCall);
            }).catch((error)=>{
                console.log(error)
                console.log("Произошла ошибка")
                this.webRtcConnection.destroy();
                this.webRtcConnection = new WebRtcConnector(this.uuid, this.onCall);

                //document.location.reload()
            });
    },



      answerCall() {
          this.webRtcConnection.callanswer();
          this.is_call=true;
          clearInterval(this.timer)
          this.getConclusion(this.applicationId)
          this.startTimer()
      },


      onCall(call) {
          console.log("Входящий звонок");
          // Answer the call, providing our mediaStream
          this.webRtcConnection.peercall = call;
          console.log("Отвечаем на звонок");
          //document.getElementById('is_called').style.display = 'flex';
          this.answerCall();
      },

    getSelfUserId(){
        return api.getSelfUser()
            .then(res => {
                console.log("Идентификатор текущего пользователя: " + res.data.id);
                this.myid = res.data.id;
                return res.data.id;
            })
    },


    getAllTopics() {
      return api.getTopics()
          .then(res => {
            console.log(res.data)
            this.list_of_topics = res.data
          }).catch(error => {
            console.error(error.response);
          })
    },


    raiseHand(topicId){
      console.log("ID рубрики: " + topicId);
      api.createApplication(topicId)
          .then((response) => {
            console.log(response);
            console.log(response.data.application.id)
            this.$router.push({
              path:'/wait',
              query: {
                applicationId: response.data.application.id,
                webRtcConnector: this.webRtcConnection
              }
            })
          })
          .catch(error => {
            console.error(error.response);
          });
    }
  },

  created() {
    this.getAllTopics();
    console.log("created block");
    this.initWebRtcConnector();
  },
    destroy(){
        this.webRtcConnection.destroy();
    }

}
</script>

<style scoped>


</style>