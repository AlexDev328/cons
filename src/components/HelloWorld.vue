<template>
  <div>
    <div class="loging-window" v-show="!token">
    <h4>Login</h4>
    <form>
      <div>
        <label for="login" >Login</label>
        <div>
          <input id="login" type="login" v-model="login" required>
        </div>
      </div>
      <div>
        <label for="password" >Password</label>
        <div>
          <input id="password" type="password" v-model="password" required>
        </div>
      </div>
      <div>
        <button type="submit" @click="handleSubmit">
          Login
        </button>
      </div>
    </form>
    </div>
    <button type="submit" @click="handleSubmitnewApps">загрузить запросы</button>
    <div v-for="app in list_of_apps"  :key="app.insigator" >
        <div @click="handleSelectItem(app)">{{app.topic}}</div>
    </div>


  <div>
    <video id=myVideo muted="muted" width="400px" height="auto" ></video>
    <video id=remVideo width="400px" height="auto" ></video>
    <div id=callinfo ></div>
  </div>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return {
      login : "",
      password : "",
      token: "",
      list_of_apps : []
    }
  },

  watch: {
    name(token) {
      localStorage.data.token = token;
    }
  },

  methods : {
    getToken()
    {
        return localStorage.token;
    },

    handleSelectItem(id)
    {
        console.log(id.insigator)
      axios.get('http://134.0.112.117/api/accounts/profile/'+id.insigator,  {headers: {
              'Authorization': 'Bearer '+this.getToken()
          }}).then(response => {
          console.log(response);
      })
    },
    handleSubmit(e){
      e.preventDefault()
      if (this.password.length > 0) {
        axios.post('http://134.0.112.117/auth/jwt/create', {
          username: this.login,
          password: this.password
        })
                .then(response => {
                  console.log(response);
                  localStorage.token = response.data.access
                  this.token=response.data.access
                  console.log(this.token)
                })
                .catch(function (error) {
                  console.error(error.response);
                });
      }
    },
    handleSubmitnewApps()
    {
        axios.get('http://134.0.112.117/api/accounts/chat',  {headers: {
                'Authorization': 'Bearer '+this.getToken()/*eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk5NzM3MDA3LCJqdGkiOiIzMzI2OGFmNzg3NmY0ZjFlOWVjNDU4MDAzMGNmNTI3YSIsInVzZXJfaWQiOjF9.ZGpk8glqJdgwdTAKj9tpa4eQpaEhoSXVu5OAk8SVvmk`*/
            }})
            .then(response => {
                console.log(response);
                this.list_of_apps = response.data.applications;
            })
            .catch(function (error) {
                console.error(error.response);
            });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
