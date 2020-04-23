<template>
  <div id="container">
    <input id="email-text-field" type="text" v-model="email" />
    <div>
      <button id="send-button" @click="sendForgotPassword">send</button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  data() {
    return {
      email: ""
    };
  },
  methods: {
    sendForgotPassword() {
      firebase
        .auth()
        .sendPasswordResetEmail(this.email)
        .then(() => {
          this.$router.push("/");
        })
        .catch(e => {
          alert("wrong email");
        });
    }
  }
};
</script>

<style scoped>
#container {
  text-align: center;
}
#email-text-field {
  margin-top: 100px;
}
#send-button {
  margin-top: 10px;
}
</style>