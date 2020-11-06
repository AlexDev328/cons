<template>
  <div id="app">
   <!-- <link type="text/css" src="assets/css/reset.css">-->
    <link type="text/css" src="assets/css/main.css">
    <div class="header">
      <div class="button menu" ><div ref="menu_button" @click="closeApp() ">Выход</div></div>
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
          WebRtcConnection: null,

      }
  },
    methods:{
      closeApp(){
          sessionStorage.clear()
          localStorage.clear()
          this.$router.push({name:'home', params:{force_logout:true}})
      },
    },
    created() {
      console.log(window.location)
    },
    beforeMount() {
      console.log("2")
      console.log(window.location.hash)
    }


}
</script>

<style>
  @import "assets/css/main.css";
</style>
