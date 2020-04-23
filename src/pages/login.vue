<template>

  <div class="login_main" v-if='islogin'>
    <div class="login">
      <div class="login_header">
        <div class="logo_training">
            <nuxt-link to='/'>  <img src="../static/noun_door knob_2122694.png" />  </nuxt-link>
            <span>TrainingRoom</span>

        </div>
      </div>
      <div class="login_content">
        <div class="login_content_group">
          <div class="login_sign login_font">Sign In</div>
          <div class="login_divider1" v-if='finish==0'></div>
          <div class="login_email"  v-if='finish==0'>
            <span class="login_font login_email_text">Email</span>
            <input type="text" class="login_email_rect" v-model="email" />
          </div>
          <div class="login_email"  v-if='finish==0'>
            <span class="login_font login_email_text">Password</span>
            <input type="password" class="login_email_rect" v-model="password" />
          </div>
          <div class="login_email" v-if='finish==0'>
            <span class="login_font login_email_text login_forgot_before" style="height:10px"> </span>
            <nuxt-link class="login_forgot" to="/forgotPassword">Forgot password?</nuxt-link>
          </div>
          <div class="login_email" v-if='finish==0'>
            <div class="login_divider2"></div>
            <div class="login_font login_or">Or</div>
            <div class="login_divider3"></div>
          </div>
          <div class="login_email">
            <div class="login_font login_email_text mobile_float" >Mobile/Cell</div>
            <div class="login_email_rect1"  ><input
              class="login_code_rect"
              input="text"
              placeholder="country code"
              style="text-align:center"
              v-model="country_mobile"
            />
            <input class="login_mobile_rect" type="text" v-model="mobile_text" /></div>

          </div>
          <div style="display:table;color:grey; margin:auto" v-if='past_phonenumer'>4last digits of your phonenumber is {{past_phonenumer}} ?</div>
          <div class="login_email" v-if="show_verifycode">
            <input
              class="login_mobile_rect"
              type="text"
              v-model="verify_code"
              @keydown="veryfycode_keyevent"
            />

          </div>

          <div class="login_email text-center" >

             <input class="login_remember_rect" v-model="rememberMe" type="checkbox" />
            <span class="login_remember_text">Remember me</span>

          </div>
          <div class="login_sign_rect" @click="signIn">
            <div class="login_sign_text" >Sign In</div>
          </div>
          <div class="login_email text-center"  v-if='finish==0'>
            <div class="login_font ">Or</div>
          </div>
          <div class="login_google" @click="googleSignIn" v-if='finish==0'>
            <img src="../static/btn_google.png" alt />
            <span class="login_google_text">Sign in with Google</span>
          </div>
          <div class="login_microsoft" @click="microsoftSignIn" v-if='finish==0'>
            <img src="../static/btn_microsoft.png" alt />
            <span class="login_microsoft_text">Sign in with Microsoft</span>
          </div>
          <div id="recaptcha-container"></div>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import FirebaseUi from "~/components/FirebaseUI";
 import firebase from "firebase/app";
import axios from 'axios';
import { auth } from '~/plugins/firebase';

import { functionAPI } from '~/plugins/functions';
import jcookies from 'js-cookie'

export default {
  name: "Login",
  components: {
    FirebaseUi
  },
  data() {
    return {
      email: "",
      password: "",
      islogin:false,
      country_mobile: "",
      mobile_text: "",
      verify_code: "",
      show_verifycode: false,
      confirmResult: {},
      rememberMe: false,
      courseid:null,
      past_phonenumer:null,
      finish:0
    };
  },
 async mounted() {
console.log("WEWRWE");
 //await this.$store.dispatch('setcode',{code:'2222'});
 if(this.$router.history.current.query.finish)
  this.finish  = 1

   let cookie = jcookies.get('__session');

    if(cookie){

      let data  = JSON.parse(cookie);

      if(data.authenticated)
      {

        if(this.finish)
        {
           await this.$store.dispatch('login',{user:data.userid,auth:''});
           jcookies.set("__session", '');
           this.islogin = true;
          if(data.phone)
          {
            this.past_phonenumer = data.phone.substring(data.phone.length - 4, data.phone.length);


            return;
          }
          else{
            this.finish = 0;
            return;
          }

        }

        await this.$store.dispatch('login',{user:data.userid,auth:data.authenticated});
        await this.$store.dispatch('setemail',{email:data.email});
        await this.$store.dispatch('setphone',{phone:data.phone});
        await this.$store.dispatch('setname',{name:data.name});
        await this.$store.dispatch('setcourseid',{coursid:data.courseid});
        await this.$store.dispatch('setdataurl',{url:data.url});

        await this.$store.dispatch('setcode',{code:this.$router.history.current.query.accesscode});
        this.courseid = data.courseid;
        // jcookies.set("__session", data);
        await this.$router.push('/');
      }
      else
      {
        this.islogin = true;


        if(this.finish)
        {


          if(data.phone)
          {
            this.past_phonenumer = data.phone.substring(data.phone.length - 4, data.phone.length);

            return;
          }
          else{
            this.finish = 0;
            return;
          }
        }
         this.finish = 0;
      }

    }
    else
    {
      console.log("EWWE")
    //  await this.$store.dispatch('setdataurls',{urls:null});
      await this.$store.dispatch('setcourselist',{courselist:null});
      this.islogin = true;
      this.finish = 0;
    }
  },

  methods: {
    save_data(userid,token,email,name, accesscode){

      let data = {
        userid:userid,
        authenticated:token,
        email:email,
        name:name,

      }
      jcookies.set("__session",data);

      if((this.finish ===1)&&(this.courseid))
       {
         functionAPI.complete_course(courseid);
       }

    },
    googleSignIn() {
      const provider = new firebase.auth.GoogleAuthProvider();
      let self = this;

        auth
        .signInWithPopup(provider)
        .then(async result => {
          // this.$store.commit("auth/setLogin");

         this.$store.dispatch('login',{user:result.user.uid,auth:result.user.ma});
         this.$store.dispatch('setemail',{email:result.user.email});
         this.$store.dispatch('setname',{name:result.user.displayName});
         this.$store.dispatch('setphone',{phone:''});
         self.save_data(result.user.uid, result.user.ma,result.user.email,result.user.displayName,this.$router.history.current.query.accesscode);

      if(this.$router.history.current.query.accesscode)
              this.$router.push("/?accesscode="+this.$router.history.current.query.accesscode);
            else this.$router.push("/");
        })
        .catch(e => {
          console.log(e);
        });
    },
    microsoftSignIn() {
      const provider = new firebase.auth.OAuthProvider("microsoft.com");
      // provider.setCustomParameters({
      //   prompt: 'consent',
      //   login_hint: 'user@microsoft.com'
      // })
        let self = this;
        auth
        .signInWithPopup(provider)
        .then(async result => {
           this.$store.dispatch('login',{user:result.user.uid,auth:result.user.ma});
           this.$store.dispatch('setemail',{email:result.user.email});
         this.$store.dispatch('setname',{name:result.user.displayName});
         this.$store.dispatch('setphone',{phone:''});
         self.save_data(result.user.uid, result.user.ma,result.user.email,result.user.displayName,this.$router.history.current.query.accesscode);
        if(this.$router.history.current.query.accesscode)
              this.$router.push("/?accesscode="+this.$router.history.current.query.accesscode);
            else this.$router.push("/");
        })
        .catch(e => {
          console.log(e);
        });
    },
    signIn() {
      let self = this;
      if (this.email === "" || this.password === "") {
        if (this.country_mobile === "") {
          alert("Please input Email address or mobile number");
          return;
        }
      }

      if (this.email === "") {
        if (window.recaptchaVerifier == null) {
          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            "recaptcha-container",
            {
              size: "invisible"
            }
          );
        }

        const phoneNumber = this.country_mobile + this.mobile_text;
        const appVerifier = window.recaptchaVerifier;

          auth
          .signInWithPhoneNumber(phoneNumber, appVerifier)
          .then(confirmationResult => {
            // window.confirmationResult = confirmationResult;
            this.show_verifycode = true;
            this.$store.dispatch('setphone',{phone:phoneNumber});
            this.confirmResult = confirmationResult;
          })
          .catch(e => {
            alert("wrong code");
            window.recaptchaVerifier.reset();
          });
      } else {

          auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(async result => {


             this.$store.dispatch('login',{user:result.user.uid,auth:result.user.ma});
            this.$store.dispatch('setemail',{email:result.user.email});
            this.$store.dispatch('setphone',{phone:''});
            this.$store.dispatch('setname',{name:result.user.displayName});
            self.save_data(result.user.uid, result.user.ma,result.user.email,result.user.displayName,this.$router.history.current.query.accesscode);

            if(this.$router.history.current.query.accesscode)
              this.$router.push("/?accesscode="+this.$router.history.current.query.accesscode);
            else this.$router.push("/");
         })
          .catch(e => {
            alert("incorrect email or password");
          });
      }
    },
    veryfycode_keyevent(e) {
      if (e["keyCode"] === 13) {
        this.confirmResult
          .confirm(this.verify_code)
          .then(result => {

             this.$store.dispatch('login',{user:1});;
            this.$router.push("/");


          })
          .catch(e => {
            alert("wrong code");
          });
      }
    }
  }
};
</script>
<style>
.firebaseui-card-content {
  text-align: center;
}

.login_sign_text {
  position: absolute;
  left: 19.42%;
  right: 19.42%;
  top: 30.26%;
  bottom: 31.58%;

  /* H2 */

  font-family: Comfortaa;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 24px;
  /* or 200% */

  align-items: center;
  text-align: center;

  color: #f8feff;
}
.login_sign_rect:hover {
  background: #404040;
}
.login_sign_rect {
  width: 165px;
  position: relative;
  height: 53px;
  margin: auto;
  cursor: pointer;
  background: #000000;
  border-radius: 50px;
}
.login_remember_rect {

  width: 24px;
  height: 24px;

  background: #ffffff;
  border: 1px solid #000000;
  box-sizing: border-box;
}
.login_remember_text {

  width: 178px;
  height: 24px;

  font-size: 20px;
  font-weight: 700;
}
.login_mobile_rect {
  width: 78%;
  height: 40px;
  text-align: center;
  background: #ffffff;
  border-radius: 5px;
  border-style: none;
}
.login_code_rect {
  width:20%;
  height: 40px;
  background: #ffffff;
  border-style: none;
  margin-right:2%;
  border-radius: 5px;
}
.login_code {
  position: absolute;
  width: 66px;
  height: 24px;
  left: 311px;
  top: 3px;
  font-size: 9px !important;
}
.login_or {
  float:left;
  width: 6%;
  margin-left:1%;
  margin-right:1%;
  margin-top:-10px;
  text-align: center;
  height: 24px;
}
.login_divider3 {
  float:left;
  width: 46%;
  height: 2px;
  background: #000000;
}
.login_divider2 {
  float:left;
  width: 46%;
  height: 2px;
  left: 41px;
  background: #000000;
}
.login_forgot {

  height: 21px;
  font-family: Comfortaa;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  align-items: center;
  text-decoration-line: underline;
  color: #000000;
}
.login_email_text {
  margin-right:20px;
  height: 37px;
  width:25%;
  display: inline-table;
  text-align: right;
}
.login_email_rect {
  height: 40px;
  width:65%;
  text-align: center;
  background: #ffffff;
  border-radius: 5px;
  border-style: none;
}
.login_email_rect1 {
  height: 40px;
  float: left;
    display: table;
  width:65%;
  border-style: none;
  border-radius: 5px;
}
.login_email {
  width: 90%;
  height: 47px;

  margin:auto;
  margin-top: 10px;
}
.login_font {
  font-family: Comfortaa;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
}
.login_sign {
  margin: auto;

  width: 87px;
  height: 24px;

  color: #000000;
}

.login_divider1 {
  width:90%;
  height: 2px;

  margin: 0 auto;
  margin-top: 40px;
  background: #000000;
}
.login_content_group {

  margin: auto;
  padding-top: 20px;
  border-radius: 50px;
  background: #75c8f1;
}

.logo_training {

  width: 200px;
  height: 46px;
  left: 24px;
  top: 0px;
  z-index: 1;
  }
.logo_training div {

  left: -2.8%;
  right: -16.96%;
  top: 0%;
  bottom: 0%;
}
.logo_training span {


  font-family: Comfortaa;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 48px;
  /* or 200% */

  text-align: center;

  color: #000000;
}
#recaptcha-container{
    height:20px;
  }
.logo_training img {
  vertical-align: middle;
  margin-top:-10px;
}
.logo_training a {
  text-decoration: none;
}
.login_main {
  position: relative;
  min-height: 1000px;
  margin: auto;
  background: #ffffff;
}
.login {


  left: 0px;
  top: 0px;
}
.login_header {
  position: relative;
 margin:auto;
 width: 40%;

  background: #039be5;
}

.login_content {
  padding-top: 20px;

  width: 40%;
  margin:auto;

    margin-top:2%;

  /* Blue/skyblue */

  background: #cfecfa;
  border-radius: 20px;
}
.login_google {
  width: 300px;
  background: white;
  position: relative;
  margin: auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.login_google_text {
  font-size: 20px;
  font-weight: 600;
  margin-left: 10px;
}
.login_microsoft {
  width: 300px;
  background: white;
  position: relative;
  margin: auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  margin-top: 10px;

}
.login_microsoft_text {
  font-size: 20px;
  font-weight: 600;
  margin-left: 20px;
}
.text-center{
  text-align: center;
}
.mobile_float{
  float: left;
}
@media only screen and (max-width: 1211px) {

  .login_header{
    width: 80%;
  }
  .login_content{
    width: 80%;
  }
}
@media only screen and (max-width: 800px) {

  .login_email_rect{
    width: 50%;
  }
  .login_email_rect1{
    width: 49%;

  }
  .login_mobile_rect
  {
    width:78%;
  }

}
  @media only screen and (max-width: 640px) {
  .login_email
  {
    height:unset;
    text-align: center;
    display:flow-root;
  }
  .login_font{
    text-align: center;
  }
  .login_email_rect{
    width: 50%;
  }
  .login_email_rect1{
    width: 49%;
    height: unset;
    float: none;

    margin: auto;
  }
  .login_code_rect
  {
    width: 100%;

  }
  .login_mobile_rect{
    margin-top:5px;
    width: 100%;
  }
  .login_forgot_before{
    display: none;
  }
  .mobile_float{
    float:none;
  }

}
@media only screen and (max-width: 370px) {
 .logo_training span{
    font-size:16px;
  }
  .login_email_text
  {
    width: 40%;
  }
}
</style>
