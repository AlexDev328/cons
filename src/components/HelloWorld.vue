<template>
  <div>
    <div class="loging-window" >
    <h4>Сервис консультаций</h4>
    <form class="login_form">
      <div>
        <label for="login" >Логин</label>
        <div>
          <input id="login" type="login" v-model="login" required>
        </div>
      </div>
      <div>
        <label for="password" >Пароль</label>
        <div>
          <input id="password" type="password" v-model="password" required>
        </div>
      </div>
    </form>
      <div>
        <button class="button login"  type="submit" @click="handleSubmit">


          Войти
        </button>
        <div><button class="button login"  @click="this.getMyID"></button></div>
        <div><button class="button login"  @click="this.getMyProfile"></button></div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
//import Consultation from "@/components/Consultation";

export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    data() {
        return {
            login: "",
            password: "",
            token: "",
            myid:''

        }
    },

    watch: {
        name(token) {
            localStorage.data.token = token;
        },
    },


    methods: {
        getToken() {
            return localStorage.token;
        },
        handleSubmit(e) {
            e.preventDefault()
            if (this.password.length > 0) {
                axios.post('http://127.0.0.1:8000/auth/jwt/create', {
                    username: this.login,
                    password: this.password
                })
                    .then(response => {
                        console.log(response);
                        localStorage.token = response.data.access
                        this.token = response.data.access
                        console.log(this.token)
                        this.getMyID()
                    })
                    .catch( (error) => {
                        console.error(error.response);
                    });
            }
        },
        getMyID() {
                return axios.get('http://127.0.0.1:8000/auth/users/me/', {
                    headers: {
                        'Authorization': 'Bearer ' + this.getToken()/*eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk5NzM3MDA3LCJqdGkiOiIzMzI2OGFmNzg3NmY0ZjFlOWVjNDU4MDAzMGNmNTI3YSIsInVzZXJfaWQiOjF9.ZGpk8glqJdgwdTAKj9tpa4eQpaEhoSXVu5OAk8SVvmk`*/
                    }
                }).then(res => {
                    console.log("мой id")
                    console.log(res.data.id);
                    this.myid = res.data.id;
                    if (!this.getMyProfile())
                    {
                        this.$router.push({path:'ask'})
                        console.log("проверка")
                    }

                })
        },
        getMyProfile() {
            console.log("падаем тут")
            console.log(this.myid);
            const url = 'http://127.0.0.1:8000/api/accounts/profile/' + this.myid;
            return axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + this.getToken()/*eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk5NzM3MDA3LCJqdGkiOiIzMzI2OGFmNzg3NmY0ZjFlOWVjNDU4MDAzMGNmNTI3YSIsInVzZXJfaWQiOjF9.ZGpk8glqJdgwdTAKj9tpa4eQpaEhoSXVu5OAk8SVvmk`*/
                }
            }).then(response => {
                if (response.data.consultant) {
                  console.log('консультант переадресация');
                  this.$router.push({path:'/consultation'})
                  return false }
                else{
                    this.$router.push({path:'/ask'})
                    console.log('не консультант')
                    return true
                }

            })
        }
        },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
