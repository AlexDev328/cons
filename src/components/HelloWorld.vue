<template>
  <div>
    <div class="loging-window" >
      <h4>Сервис консультаций</h4>
      <form class="login_form">
        <div>
          <label for="login" >Логин</label>
          <div>
            <input id="login" type="text" v-model="login" required>
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
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/libs/backendApi";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      login: "",
      password: "",
      myid:''
    }
  },

  methods: {
    /**
     * Обработчик сабмита формы
     * @param e
     */
    handleSubmit(e) {
      e.preventDefault()
      if (this.login.length > 0 && this.password.length > 0) {
        api.authenticate(this.login, this.password)
            .then(response => {
              localStorage.token = response.data.access;
              console.log("Получен токен:" + localStorage.token);
              return this.getMyId();
            }).catch(error => {
              console.error(error.response);
            });
      }
    },

    getMyId() {
      return api.getSelfUser()
          .then(res => {
            console.log("ID пользователя: " + res.data.id);
            this.myid = res.data.id;
            return this.isConsultant();
          }).then(isConsultant => {
            let path = isConsultant ? "/consultation" : "/ask";
            console.log(`Текущий пользователь ${isConsultant ? "" : "не "}консультант`);
            this.$router.push({path:path});
          });
    },

    isConsultant() {
      return api.getUserProfile(this.myid)
          .then(response => !!response.data.consultant);
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
