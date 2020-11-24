<template>
  <div id="app">
   <!-- <link type="text/css" src="assets/css/reset.css">-->
    <link type="text/css" src="assets/css/main.css">
    <div class="header">
      <div class="button menu" v-show="token" ><div ref="menu_button" @click="closeApp() ">Выход</div></div>
      <span class="logo"><img   src="./assets/img/logo.svg"/></span>
      <div class="userProfile"><div>{{this.role}}</div> <div>{{this.userstring}}</div></div>
    </div>
    <router-view/>
  </div>
</template>

<script>

import api from "@/libs/backendApi";

export default {
  name: 'App',
  components: {
  },
  data() {
      return {
          token: "",
          WebRtcConnection: null,
          userstring:'',
          role:''

      }
  },
    methods:{
      closeApp(){
        sessionStorage.clear()
        localStorage.clear()
        this.token=''
        this.$router.push({name:'home', params:{force_logout:true}})
      },
      setUserString(userstring,role){
        this.userstring = userstring;
        if (role)
          this.role="Консультант";
        else
          this.role = "Товаровед";
      },
      loadUserString() {
        api.getSelfUser()
            .then(res => {
              console.debug("Идентификатор текущего пользователя: " + res.data.id);
              return res.data.id;
            })
            .then(userId => api.getUserProfile(userId))
            .then(userProfile => {
              console.log(userProfile)
              this.setUserString(userProfile.data.city+' '+userProfile.data.filial, userProfile.data.consultant)
            })
      }
    },

    created() {
      if(localStorage.token) this.token = localStorage.token;
      console.log(window.location)
    },
  updated() {
    if(localStorage.token) this.token = localStorage.token;
  },
}
</script>

<style>
  @import "assets/css/main.css";
</style>
