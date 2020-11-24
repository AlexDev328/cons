<template>
  <div>
    <div v-if="!this.is_call">
      <div id="floatingBarsG">
        <div class="blockG" id="rotateG_01"></div>
        <div class="blockG" id="rotateG_02"></div>
        <div class="blockG" id="rotateG_03"></div>
        <div class="blockG" id="rotateG_04"></div>
        <div class="blockG" id="rotateG_05"></div>
        <div class="blockG" id="rotateG_06"></div>
        <div class="blockG" id="rotateG_07"></div>
        <div class="blockG" id="rotateG_08"></div>
      </div>
      <div class="q_position">Ожидайте, Вы <b>{{this.number+1}}</b> в очереди</div>
      <div class="button-yellow  menu" ><div @click="cancelCall() ">отменить запрос</div></div>
    </div>
    <div class="call_container" id="is_called" v-if="this.is_call">
      <div class="button-yellow menu " ><div  @click='callcancel'>Завершить звонок</div></div>
      <div v-show="connection"  class="video-source-text">Соединение установлено {{this.currentTimeMins}}:{{currentTimeSec}}</div>
      <div v-show="!connection"  class="video-source-text">Соединение завершено</div>
      <div class="conclusion">
        <div>
          <div id="video-room" class="video-room">
            <div>
            <video id=myVideo muted="muted"  ></video>
              <div class="video-source-text">Ваше видео</div>
            </div>
            <div id="rem">
              <video id=remVideo></video>
              <div class="video-source-text">Видео консультанта</div>
            </div>
          </div>
        </div>
        <div class="info-box">
          <div> <div class="proBlockText">Фотографии</div>
            <div class="pictureList" >
              <div class="picture_item" v-for="image in pictures" :key="image">
                <img :src="image"  type="image/png">
              </div>
            </div>
          </div>
          <div>
            <div><div class="proBlockText">Заключение консультанта</div>
              <div class="text-conclusion"> {{this.conclusion}}</div>
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
import setting from "@/settings/setting_back";
export default {
  name: "Queue",
  data(){
    return{
      is_call:false,
      uuid: null,
      number: "",
      //applicationId: this.$props.applicationId,
      conclusion:'',
      timer: null,
      remVideoExist:false,
      pictures: [],
      currentTimeSec:"00",
      currentTimeMins:0,
      connection:true,
      webRtcConnector: null,
    }

  },
  props:{
      applicationId : null,
  },
  updated(){

  },

  methods:{
    wsuploadConclusion(){
        this.wsconnection = new WebSocket(setting.wsCallUrl+this.applicationId+'/')
        this.wsconnection.onopen = function () {
            console.log("Соединение с сокетом для звонка успешно")
        }
        this.wsconnection.onmessage = function (msg) {
            console.log(msg.data);
            let jsondata=JSON.parse(msg.data);
            console.log(jsondata.conclusion);
            this.conclusion = jsondata.conclusion.cons_text;
            this.pictures = jsondata.conclusion.pictures;
            if (jsondata.conclusion.final === true){
                clearInterval(this.timer);
                this.connection = false;
                clearInterval(this.timer)
                this.webRtcConnector.stopMediaStream();
            }

        }.bind(this)
        this.wsconnection.onclose = function () {
            console.log("отключение от сокета")

        }
    },

    startTimer(){
        clearInterval(this.timer);
        this.timer = setInterval(()=>
        {
            this.currentTimeSec++;
            if (this.currentTimeSec == 60){
                this.currentTimeMins++;
                this.currentTimeSec=0
            }
            if (this.currentTimeSec<10){
                this.currentTimeSec='0'+this.currentTimeSec;
            }
        }, 1000)
    },
    getConclusion(id) {
      setInterval( ()=> {
        console.log("попытка получения заключения")
        api.getCurrentConclusion(id)
        .then(response => {
          console.log(response.data.text)
          console.log(response.data.final_ver)
          this.conclusion = response.data.text;
          this.pictures = response.data.images;
          if (response.data.final_ver){
              this.connection = false;
              clearInterval(this.timer)
              this.webRtcConnector.stopMediaStream();
          }
        }).catch(()=> {
          console.log("не удалось получить заключние")
        })
      }, setting.queNumberTimeout);
    },

    cancelCall(){
      console.log("отмена звонка")
      api.deactivateApplication(this.$props.applicationId)
          .then(response => {
            console.log(response);
            //
          })
          .catch( (error) => {
            console.error(error.response);
          });
      //todo: Разобраться почему ругается если поместить в промис
      this.$router.push({path:'/ask'})
    },

    callcancel() {
        var msg = {
            disconnect: true
        };
      this.wsconnection.send(JSON.stringify(msg))
      this.$router.push({path:"/ask"})
      this.webRtcConnector.callcancel();
      document.location.reload();
    },
    
    getCurrentApplicationPosition(id) {
        this.timer = setInterval(()=>{
            api.getApplicationPosition(id)
                .then(response => {
                    console.log(response);
                    console.log(response.data.position)
                    this.number = response.data.position; //todo: опечатка?
                })
                .catch(error => {
                    console.error(error.response);
                });
        }, setting.queNumberTimeout);
    },
    answerCall() {
      this.webRtcConnector.callanswer();
      this.is_call=true;
      clearInterval(this.timer)
      //this.getConclusion(this.$props.applicationId)
      this.startTimer()
    },
    

    
    initWebRtcConnector(){
      return this.getSelfUserId()
          .then(selfUserId => api.getUserProfile(selfUserId))
          .then(response => {
            console.log('Мой PeerID: ' + response.data.peerid);
            this.uuid = response.data.peerid;
            this.webRtcConnector = new WebRtcConnector(this.uuid, this.onCall);
            console.log(this.webRtcConnector)
          }).catch(()=>{
              document.location.reload()
          });
    },

    onCall(call) {
      console.log("Входящий звонок");
      // Answer the call, providing our mediaStream
      this.webRtcConnector.peercall = call;
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
    forceRefreshHandler(){
      this.callcancel();
      this.$router.push({path:"/ask"})
    }
  },

  created() {
    console.error(this.applicationId)
    if (!this.applicationId)
    {
      console.error(this.applicationId)
      this.$router.push({path:"/ask"})
    }
    this.initWebRtcConnector()
      .then(() => {
        console.log(this.webRtcConnector);
      });
    this.getCurrentApplicationPosition(this.$props.applicationId);
    this.wsuploadConclusion();
  },

  /*beforeMount() {
    window.addEventListener("unload", this.forceRefreshHandler);
  },*/

  beforeDestroy(){
    this.forceRefreshHandler();
    this.cancelCall();
    this.webRtcConnector.destroy();
    console.log("выход")
  }
}
</script>

<style scoped>



#floatingBarsG{
  position:relative;
  width:109px;
  height:135px;
  margin:auto;
  top: 235px;
}

.blockG{
  position:absolute;
  background-color:rgb(255,255,255);
  width:18px;
  height:42px;
  border-radius:14px 14px 0 0;
  -o-border-radius:14px 14px 0 0;
  -ms-border-radius:14px 14px 0 0;
  -webkit-border-radius:14px 14px 0 0;
  -moz-border-radius:14px 14px 0 0;
  transform:scale(0.4);
  -o-transform:scale(0.4);
  -ms-transform:scale(0.4);
  -webkit-transform:scale(0.4);
  -moz-transform:scale(0.4);
  animation-name:fadeG;
  -o-animation-name:fadeG;
  -ms-animation-name:fadeG;
  -webkit-animation-name:fadeG;
  -moz-animation-name:fadeG;
  animation-duration:1.2s;
  -o-animation-duration:1.2s;
  -ms-animation-duration:1.2s;
  -webkit-animation-duration:1.2s;
  -moz-animation-duration:1.2s;
  animation-iteration-count:infinite;
  -o-animation-iteration-count:infinite;
  -ms-animation-iteration-count:infinite;
  -webkit-animation-iteration-count:infinite;
  -moz-animation-iteration-count:infinite;
  animation-direction:normal;
  -o-animation-direction:normal;
  -ms-animation-direction:normal;
  -webkit-animation-direction:normal;
  -moz-animation-direction:normal;
}

#rotateG_01{
  left:0;
  top:49px;
  animation-delay:0.45s;
  -o-animation-delay:0.45s;
  -ms-animation-delay:0.45s;
  -webkit-animation-delay:0.45s;
  -moz-animation-delay:0.45s;
  transform:rotate(-90deg);
  -o-transform:rotate(-90deg);
  -ms-transform:rotate(-90deg);
  -webkit-transform:rotate(-90deg);
  -moz-transform:rotate(-90deg);
}

#rotateG_02{
  left:14px;
  top:18px;
  animation-delay:0.6s;
  -o-animation-delay:0.6s;
  -ms-animation-delay:0.6s;
  -webkit-animation-delay:0.6s;
  -moz-animation-delay:0.6s;
  transform:rotate(-45deg);
  -o-transform:rotate(-45deg);
  -ms-transform:rotate(-45deg);
  -webkit-transform:rotate(-45deg);
  -moz-transform:rotate(-45deg);
}

#rotateG_03{
  left:46px;
  top:5px;
  animation-delay:0.75s;
  -o-animation-delay:0.75s;
  -ms-animation-delay:0.75s;
  -webkit-animation-delay:0.75s;
  -moz-animation-delay:0.75s;
  transform:rotate(0deg);
  -o-transform:rotate(0deg);
  -ms-transform:rotate(0deg);
  -webkit-transform:rotate(0deg);
  -moz-transform:rotate(0deg);
}

#rotateG_04{
  right:14px;
  top:18px;
  animation-delay:0.9s;
  -o-animation-delay:0.9s;
  -ms-animation-delay:0.9s;
  -webkit-animation-delay:0.9s;
  -moz-animation-delay:0.9s;
  transform:rotate(45deg);
  -o-transform:rotate(45deg);
  -ms-transform:rotate(45deg);
  -webkit-transform:rotate(45deg);
  -moz-transform:rotate(45deg);
}

#rotateG_05{
  right:0;
  top:49px;
  animation-delay:1.05s;
  -o-animation-delay:1.05s;
  -ms-animation-delay:1.05s;
  -webkit-animation-delay:1.05s;
  -moz-animation-delay:1.05s;
  transform:rotate(90deg);
  -o-transform:rotate(90deg);
  -ms-transform:rotate(90deg);
  -webkit-transform:rotate(90deg);
  -moz-transform:rotate(90deg);
}

#rotateG_06{
  right:14px;
  bottom:12px;
  animation-delay:1.2s;
  -o-animation-delay:1.2s;
  -ms-animation-delay:1.2s;
  -webkit-animation-delay:1.2s;
  -moz-animation-delay:1.2s;
  transform:rotate(135deg);
  -o-transform:rotate(135deg);
  -ms-transform:rotate(135deg);
  -webkit-transform:rotate(135deg);
  -moz-transform:rotate(135deg);
}

#rotateG_07{
  bottom:0;
  left:46px;
  animation-delay:1.35s;
  -o-animation-delay:1.35s;
  -ms-animation-delay:1.35s;
  -webkit-animation-delay:1.35s;
  -moz-animation-delay:1.35s;
  transform:rotate(180deg);
  -o-transform:rotate(180deg);
  -ms-transform:rotate(180deg);
  -webkit-transform:rotate(180deg);
  -moz-transform:rotate(180deg);
}

#rotateG_08{
  left:14px;
  bottom:12px;
  animation-delay:1.5s;
  -o-animation-delay:1.5s;
  -ms-animation-delay:1.5s;
  -webkit-animation-delay:1.5s;
  -moz-animation-delay:1.5s;
  transform:rotate(-135deg);
  -o-transform:rotate(-135deg);
  -ms-transform:rotate(-135deg);
  -webkit-transform:rotate(-135deg);
  -moz-transform:rotate(-135deg);
}




@keyframes fadeG{
  0%{
    background-color:rgb(114 15 19);
  }

  100%{
    background-color:rgb(255,255,255);
  }
}

@-o-keyframes fadeG{
  0%{
    background-color:rgb(114 15 19);
  }

  100%{
    background-color:rgb(255,255,255);
  }
}

@-ms-keyframes fadeG{
  0%{
    background-color:rgb(114 15 19);
  }

  100%{
    background-color:rgb(255,255,255);
  }
}

@-webkit-keyframes fadeG{
  0%{
    background-color:rgb(114 15 19);
  }

  100%{
    background-color:rgb(255,255,255);
  }
}

@-moz-keyframes fadeG{
  0%{
    background-color:rgb(114 15 19);
  }

  100%{
    background-color:rgb(255,255,255);
  }
}
</style>