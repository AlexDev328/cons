<template>
  <div>
    <div class="container">
      <button type="submit" @click="handleSubmitnewApps">загрузить запросы</button>
      <div v-for="app in list_of_apps"  :key="app.insigator" >
        <div class="item text-cons-title ">
          <div>
            <span>{{app.topic}}</span>
            <span class="text-cons"> Товаровед {{app.insigator.name}}</span>
          </div>
          <div class = "cons" @click="handleSelectItem(app)">
            <div class="button-text">Начать консультацию</div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <video id=myVideo muted="muted" width="400px" height="auto" ></video>
      <video id=remVideo width="400px" height="auto" ></video>
      <div id=callinfo>
        <button @click="getMyID" v-show="!uuid">Подключиться</button>
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

    export default {
        name: "conultation",
        data ()
        {
            return{
            token: "",
            list_of_apps: [],
            uuid: "",
            myid: '',
            is_called: false,
            }
        },
        props:{
            //myid : String,
            cons : Boolean,
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
                return axios.get('http://127.0.0.1:8000/auth/users/me/', {
                    headers: {
                        'Authorization': 'Bearer ' + this.getToken()/*eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk5NzM3MDA3LCJqdGkiOiIzMzI2OGFmNzg3NmY0ZjFlOWVjNDU4MDAzMGNmNTI3YSIsInVzZXJfaWQiOjF9.ZGpk8glqJdgwdTAKj9tpa4eQpaEhoSXVu5OAk8SVvmk`*/
                    }
                }).then(res => {
                    console.log("мой id")
                    console.log(res.data.id);
                    this.myid = res.data.id;
                    return res.data.id;
                })},

            getMyID(){
                this.getClientPeer()
                    .then((/*myId*/) => {
                        const url='http://127.0.0.1:8000/api/accounts/profile/' + this.myid;
                        axios.get(url,  {
                            headers: {
                                'Authorization': 'Bearer ' + this.getToken()/*eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk5NzM3MDA3LCJqdGkiOiIzMzI2OGFmNzg3NmY0ZjFlOWVjNDU4MDAzMGNmNTI3YSIsInVzZXJfaWQiOjF9.ZGpk8glqJdgwdTAKj9tpa4eQpaEhoSXVu5OAk8SVvmk`*/
                            }
                        }).then(response => {
                            console.log('мой uuid')
                            console.log(response.data.peerid);
                            this.uuid = response.data.peerid;
                            this.x = new Mycallshit(this.uuid);
                        })
                    })
            },
            answerCall() {
                this.x.callanswer();
            },
            handleSubmitnewApps() {
                axios.get('http://127.0.0.1:8000/api/accounts/chat', {
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
            handleSelectItem(id) {
                console.log(id.insigator)
                axios.get('http://127.0.0.1:8000/api/accounts/profile/' + id.insigator, {
                    headers: {
                        'Authorization': 'Bearer ' + this.getToken()
                    }
                }).then(response => {
                    console.log("вызываем")
                    console.log(response.data.peerid);
                    //this.callToNode(response.peerid)
                    this.x.callToNode(response.data.peerid);
                }).catch(function (error) {
                    console.error(error.response);
                });
            },

        },


    }
</script>

<style scoped>


</style>