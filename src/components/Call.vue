<template>
  <div>
    <video id=myVideo muted="muted" width="400px" height="auto" ></video>
    <video id=remVideo width="400px" height="auto" ></video>
    <div id=callinfo>
      <div id="is_called" style="display: none">
        Входящий звонок <button @click='answerCall' >Принять</button><button @click='callcancel' >Отклонить</button>
      </div>
    </div>
  </div>
</template>

<script>
    import axios from "axios";
    import Mycallshit from "@/libs/calls";

    export default {
        name: "call",
        methods:{
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
        },
        created(){
            this.getMyID()

        }
    }
</script>

<style scoped>

</style>