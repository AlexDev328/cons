<template>
  <div>
    <div class="container" v-show="this.is_called">
      <button type="submit" @click="handleSubmitnewApps">загрузить запросы</button>
      <div v-for="app in list_of_apps"  :key="app.insigator" >
        <div class="item text-cons-title ">
          <div>
            <span>{{app.topic_name}}</span>
            <span class="text-cons"> Товаровед {{app.insigator.name}}</span>
          </div>
          <div class = "cons" @click="handleSelectItem(app)">
            <div class="button-text">Начать консультацию</div>
          </div>
        </div>
      </div>
    </div>
    <div  v-show="!this.is_called">
      <video id=myVideo muted="muted" width="400px" height="auto" ></video>
      <video id=remVideo width="400px" height="auto" ></video>
      <canvas id="canvas" style="display: none"></canvas>
      <div id="pictureList" v-for="image in pictures" :key="image">
        <img :src="image">
      </div>
      <div class="button" @click="takePicture"> Сделать снимок</div>
      <textarea  placeholder="Текст консультанта"></textarea>
      <textarea  placeholder="Текст товароведа"></textarea>
      <div id=callinfo>
        <!--<button @click="getMyID" v-show="!uuid">Подключиться</button>-->
        <div id="is_called" style="display: none">
          Входящий звонок <button @click='answerCall' >Принять</button><button @click='callcancel' >Отклонить</button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
    import axios from "axios";
    import Mycallshit from "@/libs/calls";
    import setting from "@/settings/setting";

    export default {
        name: "conultation",
        data ()
        {
            return{
              token: "",
              list_of_apps: [],
              uuid: "",
              myid: '',
              is_called: true,
              application_id: '',
              pictures: [],
            }
        },
        props:{
            //myid : String,
            cons : Boolean,
        },
        created(){
            this.getMyID()
        },
        methods:{
            getToken() {
                return localStorage.token;
            },
            callcancel() {
                this.x.callcancel();
            },
            get_is_called(){
                if (this.x.get_incoming_call())
                    this.is_called = true;
            },
            getClientPeer(){
                return axios.get(setting.host + 'auth/users/me/', {
                    headers: {
                        'Authorization': 'Bearer ' + this.getToken()/*eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk5NzM3MDA3LCJqdGkiOiIzMzI2OGFmNzg3NmY0ZjFlOWVjNDU4MDAzMGNmNTI3YSIsInVzZXJfaWQiOjF9.ZGpk8glqJdgwdTAKj9tpa4eQpaEhoSXVu5OAk8SVvmk`*/
                    }
                }).then(res => {
                    console.log("мой id")
                    console.log(res.data.id);
                    this.myid = res.data.id;
                    return res.data.id;
                })},

          getClientPeer1() {

          },

            getMyID(){
                return this.getClientPeer()
                    .then((/*myId*/) => {
                        const url=setting.host + 'api/profile/' + this.myid;
                        axios.get(url,  {
                            headers: {
                                'Authorization': 'Bearer ' + this.getToken()/*eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk5NzM3MDA3LCJqdGkiOiIzMzI2OGFmNzg3NmY0ZjFlOWVjNDU4MDAzMGNmNTI3YSIsInVzZXJfaWQiOjF9.ZGpk8glqJdgwdTAKj9tpa4eQpaEhoSXVu5OAk8SVvmk`*/
                            }
                        }).then(response => {
                            console.log('мой uuid')
                            console.log(response.data.peerid);
                            this.uuid = response.data.peerid;
                            this.x = new Mycallshit(this.uuid, (call) => {
                              console.log("receiving call");
                              // Answer the call, providing our mediaStream
                              this.x.peercall = call;
                              console.log("отвечаем на звонок");
                              document.getElementById('is_called').style.display='flex';
                              this.x.callanswer();
                            });
                        })
                    })
            },
            answerCall() {
                this.x.callanswer();
            },
            handleSubmitnewApps() {
                axios.get(setting.host + 'api/application', {
                    headers: {
                        'Authorization': 'Bearer ' + this.getToken()/*eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk5NzM3MDA3LCJqdGkiOiIzMzI2OGFmNzg3NmY0ZjFlOWVjNDU4MDAzMGNmNTI3YSIsInVzZXJfaWQiOjF9.ZGpk8glqJdgwdTAKj9tpa4eQpaEhoSXVu5OAk8SVvmk`*/
                    }
                })
                    .then(response => {
                        console.log(response);
                        this.list_of_apps = response.data.applications;
                    })
                    .catch(function (error) {
                        console.error(error.response);
                    });
            },
            handleSelectItem(app) {
                console.log(app.insigator)
                this.application_id = app.id;
                axios.get(setting.host + 'api/profile/' + app.insigator, {
                    headers: {
                        'Authorization': 'Bearer ' + this.getToken()
                    }
                }).then(response => {
                    console.log("вызываем")
                    console.log(response.data.peerid);
                    //this.callToNode(response.peerid)
                    this.x.callToNode(response.data.peerid);
                    this.is_called = false;
                }).catch(function (error) {
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
              context.drawImage(remVideo, 0, 0, this.width, this.height);
              //var img = this.canvas.toBlob()
              const imgData = this.canvas.toDataURL('image/png');
              //this.addPicture(imgData);
              this.pictures.push(imgData);
            }
          },

          /*addPicture(imgData) {
            const img = document.createElement('img');
            img.src = imgData;
            document.getElementById('canvasList').appendChild(img);
          },*/

          uploadConclusion(text,lst_img){
            let data = new FormData();
            data.append('data', lst_img);
            data.append('text', text)

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


</style>