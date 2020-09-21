<template>
  <div >
    <div class="them-text">Выберите тематику</div>
    <div class="container" >
      <div v-for="topic in list_of_topics" :key="topic.id" class="item-cat" ><div @click="raiseHand(topic.id)">{{topic.name}}</div></div>
    </div>
  </div>
  
</template>

<script>
    import axios from "axios";

    export default {
        name: "CreatingApplication",
        data() {
            return {
                list_of_topics: [],
            }
        },
        methods: {
            getToken() {
                return localStorage.token;
            },
            getAllTopics() {
                return axios.get('http://127.0.0.1:8000/api/topics', {
                    headers: {
                        'Authorization': 'Bearer ' + this.getToken()/*eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk5NzM3MDA3LCJqdGkiOiIzMzI2OGFmNzg3NmY0ZjFlOWVjNDU4MDAzMGNmNTI3YSIsInVzZXJfaWQiOjF9.ZGpk8glqJdgwdTAKj9tpa4eQpaEhoSXVu5OAk8SVvmk`*/
                    }
                }).then(res => {
                    console.log(res.data)
                    this.list_of_topics = res.data
                }).catch(function (error) {
                    console.error(error.response);
                })
            },
            raiseHand(id){
                console.log(id)
                axios.post('http://127.0.0.1:8000/api/application',  {'topic_id': id},{headers: {
                    'Authorization': 'Bearer ' + this.getToken()/*eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk5NzM3MDA3LCJqdGkiOiIzMzI2OGFmNzg3NmY0ZjFlOWVjNDU4MDAzMGNmNTI3YSIsInVzZXJfaWQiOjF9.ZGpk8glqJdgwdTAKj9tpa4eQpaEhoSXVu5OAk8SVvmk`*/
                }
                }).then(response => {
                        console.log(response);
                        this.$router.push({
                          path:'/wait',
                          query: {
                            applicationId: response.data.application.id
                          }
                        })

                    })
                    .catch( (error) => {
                        console.error(error.response);
                    });
            }
        },
        created() {
            this.getAllTopics()
            console.log("created block")
        },

    }
</script>

<style scoped>


</style>