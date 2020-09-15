<template>
  <div id="app">
   <!-- <link type="text/css" src="assets/css/reset.css">-->
    <link type="text/css" src="assets/css/main.css">
    <div class="header">
      <div class="button menu" ><div ref="menu_button" @click="closeApp() ">{{button_text}}</div></div>
      <span class="logo"><img   src="./assets/img/logo.svg"/></span>

    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data() {
      return {
          token: "",
          button_text:'Выйти'
      }
  },
    methods:{
      closeApp(){
          localStorage.token = "";
          this.$router.push({name:'home'})
      }
    }


}
</script>

<style>
  @import "assets/css/main.css";
</style>
