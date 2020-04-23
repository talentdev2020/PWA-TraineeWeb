<template>
  <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <label>Image
        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
      </label>
      <img :src="image">
    </div>
  </div>
</template>

<script>
import axios from 'axios'
  export default {
    /*
      Defines the data used by the component
    */
    data(){
      return {
        file: '',
        image:''
      }
    },
   computed: {
     authenticated(){
        return this.$store.state.authenticated
      },
   },
    methods: {
      /*
        Submits the file to the server
      */
      submitFile(){console.log("A");
        /*
                Initialize the form data
            */
            let formData = new FormData();

            /*
                Add the form data we need to submit
            */
            formData.append('file', this.file);

        /*
          Make the request to the POST /single-file URL
        */

             const options = {
            method:'POST',
            data:formData,

            headers:{'Access-Control-Allow-Origin' : '*',"Authorization" : this.authenticated},
            baseURL:'https://us-central1-tr-staging-8964c.cloudfunctions.net/api/user/updateProfileImage'
              }


            axios(options).then(function(response){

              console.log("success",response);
            })
            .catch(function(error){
              console.log("error2",error);
            });

      },

      /*
        Handles a change on the file upload
      */
      handleFileUpload(){
        this.file = this.$refs.file.files[0];
         if(!this.file.type.match("image.*")) {
          return;
        }
        let reader = new FileReader();
        let that = this;

        reader.onload = function (e) {
          this.image = e;
        }
        reader.readAsDataURL(this.file);

        this.submitFile();
      }
    }
  }
</script>
