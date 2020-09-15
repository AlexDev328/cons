<template>
  <div>
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
    <div>Вы в очереди</div>
    <div class="button menu" ><div @click="cancelcall() ">отменить запрос</div></div>
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
        name: "Queue",
        data(){
            return{
            }
        },
        methods:{
            getToken() {
                return localStorage.token;
            },
            cancelcall(){
                console.log("отмена звонка")
                axios.post('http://134.0.112.117/api/accounts/create',  {'close': true},{headers: {
                        'Authorization': 'Bearer ' + this.getToken()/*eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk5NzM3MDA3LCJqdGkiOiIzMzI2OGFmNzg3NmY0ZjFlOWVjNDU4MDAzMGNmNTI3YSIsInVzZXJfaWQiOjF9.ZGpk8glqJdgwdTAKj9tpa4eQpaEhoSXVu5OAk8SVvmk`*/
                    }
                }).then(response => {
                    console.log(response);
                    this.$router.push({path:'/ask'})

                })
                    .catch( (error) => {
                        console.error(error.response);
                    });
            },
            answerCall() {
                this.x.callanswer();
            },
            callcancel() {
                this.x.callcancel();
            },
            getMyID(){
                this.getClientPeer()
                    .then((/*myId*/) => {
                        const url='http://134.0.112.117/api/accounts/profile/' + this.myid;
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
            getClientPeer(){
                return axios.get('http://134.0.112.117/auth/users/me/', {
                    headers: {
                        'Authorization': 'Bearer ' + this.getToken()/*eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk5NzM3MDA3LCJqdGkiOiIzMzI2OGFmNzg3NmY0ZjFlOWVjNDU4MDAzMGNmNTI3YSIsInVzZXJfaWQiOjF9.ZGpk8glqJdgwdTAKj9tpa4eQpaEhoSXVu5OAk8SVvmk`*/
                    }
                }).then(res => {
                    console.log("мой id")
                    console.log(res.data.id);
                    this.myid = res.data.id;
                    return res.data.id;
                })},
        },
        created(){
            this.getMyID()

        }
    }
</script>

<style scoped>
  #floatingBarsG{
    position:relative;
    width:109px;
    height:135px;
    margin:auto;
    top: 150px;
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