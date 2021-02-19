<template>
  <div>
    <div class="container" >
      <div class="text-cons large magin"> Мне нужна помощь с оценкой : </div>
      <div v-for="topic in list_of_topics" :key="topic.id" class="item-el" >
        <div @click="raiseHand(topic.id)">{{topic.name}}  <span style="font-size: small;">(в очереди: {{topic.queue}})</span></div>
      </div>
    </div>
  </div>

</template>

<script>
import api from "@/libs/backendApi";

export default {
  name: "CreatingApplication",
  data() {
    return {
      list_of_topics: [],
    }
  },
  methods: {

    getAllTopics() {
      return api.getTopics()
          .then(res => {
            console.log(res.data)
            this.list_of_topics = res.data
          }).catch(error => {
            console.error(error.response);
          })
    },

    raiseHand(topicId){
      console.log("ID рубрики: " + topicId);
      api.createApplication(topicId)
          .then(response => {
            console.log(response);
            console.log(response.data.application.id)
            this.$router.push({
              path:'/wait',
              query: {
                applicationId: response.data.application.id
              }
            })
          })
          .catch(error => {
            console.error(error.response);
          });
    },
    getSelfUserId(){
      return api.getSelfUser()
          .then(res => {
            console.log("Идентификатор текущего пользователя: " + res.data.id);
            return res.data.id;
          })
    },
  },

  created() {

    console.log("created block")
    if (!localStorage.token) {
      this.$router.push('/')
    }
    else {
      this.getAllTopics();
      this.$parent.loadUserString();


    }
  },

}
</script>

<style scoped>


</style>