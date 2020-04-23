<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header
          class="modal-header"
          id="modalTitle"
        >
          <slot name="header">
             Edit profile

            <button
              type="button"
              class="btn-close"
              @click="close"
              aria-label="Close modal"
            >
              x
            </button>
          </slot>
        </header>
        <section
          class="modal-body"
          id="modalDescription"
        >
        <div class=' '>
           <fileupload/>
          </div>
          <div class='profile_body'>
            <span>Email</span>
            <input type='text' v-model="userinfo.email">
          </div>
          <div class='profile_body'>
            <span>Family Name</span>
            <input type='text' v-model="userinfo.FamilyName">
          </div>
          <div class='profile_body'>
            <span>Given Name</span>
            <input type='text' v-model="userinfo.GivenName">
          </div>
         <div class='profile_body'>
            <span>Address</span>
            <input type='text' v-model="userinfo.Address">
          </div>
          <div class='profile_body'>
            <span>Birthday</span>
            <input type='text' v-model="userinfo.DOB">
          </div>
          <div class='profile_body'>
            <span>Mobile</span>
            <input type='text' v-model="userinfo.Mobile">
          </div>
          <div class='profile_body'>
            <span>Organization</span>
            <input type='text' v-model="userinfo.Organization">
          </div>

        </section>
        <footer class="modal-footer">
          <slot name="footer">

              <button
              type="button"
              class="btn-green"
              @click="save"
            >
              Save!
            </button>
            <button
              type="button"
              class="btn-green"
              @click="close"
              aria-label="Close modal"
            >
              Cancel!
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>
<script>
import { functionAPI } from '~/plugins/functions';
import fileupload from "~/components/fileupload.vue";
  export default {
    name: 'modal',
   components: {
    fileupload
  },
  computed: {
    userid(){
        return this.$store.state.userid
      },
     authenticated(){
        return this.$store.state.authenticated
      },
     email(){
        return this.$store.state.email
      },
     name(){
        return this.$store.state.name
      },
		},
   data () {

      return {
        userinfo: {
          "email":"",
          "FamilyName":"",
          "GivenName":"",
          "Address":"",
          "DOB":"",
          "Mobile":"",
          "Organization":"",
        },
      };
    },
   async mounted(){


      let userinfo = await functionAPI.get_userinfo(this.userid);

      if(userinfo)
         this.userinfo = userinfo;
      else{
        this.userinfo.email = this.email;
        this.userinfo.FamilyName = this.name.split(" ")[1];
        this.userinfo.GivenName = this.name.split(" ")[0];
      }
    },
    methods: {
      async save(){

        let result = await functionAPI.update_userinfo(this.userid,this.userinfo);
        if(result == true)
          alert("Successfully registered");
        else
          alert("Error occured while saving to database");
        this.close();
      },
      close() {
        this.$emit('close');
      }
    }
  };
</script>
<style>
.profile_body{
  height: 44px;
  text-align:center;
  margin-top:10px;
}
.profile_body input{
  border-style: outset;
  height: 30px;
}
.profile_body span{
  width:100px;
  display: inline-flex;
}
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    width:400px;
    flex-direction: column;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    margin:0px 5px;

    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }
  .btn-green:hover{
    cursor: pointer;
  }
</style>
