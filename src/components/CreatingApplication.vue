<template>
  <div >
    <div class="them-text">Выберите тематику</div>
    <div class="container" >
      <div v-for="topic in list_of_topics" :key="topic.id" class="item">{{topic.name}}</div>
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
                myid:''
            }
        },
        methods: {
            getToken() {
                return localStorage.token;
            },
            getAllTopics() {
                return axios.get('http://127.0.0.1:8000/api/accounts/topics', {
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

            created() {
                this.getAllTopics()
            }

        }
    }
</script>

<style scoped>


</style>