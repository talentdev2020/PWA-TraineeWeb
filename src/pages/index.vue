<template>
  <section class="container" >
    <v-card class='div_content index-page'  >
      <div class="header_bottom" >
        <div class="header_body">
        <nuxt-link to="/">
          <img src="../static/noun_door knob_2122694.png" class="image_middle " />
           <span class="train">Training Room</span>
        </nuxt-link>
         <span class="rel" @click="showModal" >
          <img src="../static/Ellipse2.png" class="header_2" />
          <img src="../static/Ellipse.png" class="header_1" />
        </span>
        </div>
        <div class="col   text-right">
          <nuxt-link to='/logout'><strong >{{name}}</strong></nuxt-link>
        </div>
      </div>
     <team  />
      <Editprofile
        v-show="isModalVisible"
        @close="closeModal"
      />

    </v-card>
    <!-- <v-progress-circular  color='#346587' indeterminate=true size=150 width=3 v-else style='display:flex;margin:auto;margin-top:15%' rodate=422>
           {{text}}
    </v-progress-circular> -->
 </section>
</template>

<script>
import Team from "~/components/team.vue";
import Editprofile from "~/components/editprofile.vue";
import { auth } from '~/plugins/firebase';
import { storage } from '~/plugins/firebase';
import { store} from '~/plugins/firebase';
import { functionAPI } from '~/plugins/functions';



export default {
	computed: {
      authenticated(){
        return this.$store.state.authenticated;
      },
      accesscode(){
        return this.$store.state.accesscode
      },
      userid(){
        return this.$store.state.userid
      },
      name(){
        return this.$store.state.name
      },
		},
  components: {
    Team,Editprofile
  },
  data () {
      return {

        isModalVisible: false,
        teamcollection:[],
        text:'Wait moment ...'
      };
    },
  methods:{
    async getdownloadURL(url){
      url = url.replace('https://storage.cloud.google.com/tr-staging-8964c.appspot.com/', '');
       var starsRef = storage.ref(url);
      // Get the download URL
      let ref_url;
      await starsRef.getDownloadURL().then(function(url) {

        ref_url = url;
      }).catch(function(error) {
          return 'no image';

        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break;

          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
        }
      });
      return ref_url;
    },
    get_team(teamid){
       for(const id in this.teamcollection)
        {
          if(teamid == this.teamcollection[id][0]){
            return this.teamcollection[id];
          }
        }
    },
    showModal() {
        this.isModalVisible = true;
      },
    closeModal() {
        this.isModalVisible = false;
      },
    //check the access code
    async check_accesscode(accesscode){

      //new project

       return  store.collection("accesscodes").get().then(async (querySnapshot) => {
       let result= querySnapshot.docs.filter(query=>query.id===accesscode).map(doc => doc.data());

        if(result.length ==0)
        {
          this.$store.dispatch('setcode',{code:''});
          alert("This accesscode is invalid")
           return false;

        }
        else
        {
          let access = result[0];
          if(access.type=='course')
          {
              await this.$store.dispatch('setcourseid',{courseid:access.courseid});

              //download images
              let course = await functionAPI.get_course(access.courseid);
              if (!course)
                return;

              let slides = course.slides.original
              let arr = [];

                for(const index in slides)
                {
                  arr.push(await this.getdownloadURL(slides[index]));

                }
               await this.$store.dispatch('setdataurl',{url:arr});

              this.$router.push('/course');
             return true;
          }
        }
    });





       var self = this;
      //get accesscode from database

      return await store.collection("accesscodes").get().then(async (querySnapshot) => {
        let access = "";

         let result= querySnapshot.docs.filter(query=>query.id===accesscode).map(doc => doc.data());
              if(result.length ==0)
              {
                alert("This accesscode "+ accesscode + " is not available");
                this.$router.push("/error");
                return;
              }

              else
                access = result[0];

          switch(access.type)
          {
            case "template":
              let template =await functionAPI.get_template(access.templateid);
              let teams = template.teams;


              for(let i = 0; i < teams.length; i ++)
              {
                let teamid  = teams[i];
                   let team = this.get_team(teamid);
                  let members = team.members;

                  //check if this user is member of team
                  let member= members[self.userid];
                  if(member !== null)
                  {
                      template['UID']   = self.userid;
                      template['teamid']= [teamid];
                      template['AdminId'] =  team.admins;
                      template['templateid'] = access.templateid;
                      let courseid = '';
                     if((self.authenticated !==1) &&(self.authenticated !== null))
                     {
                        courseid = await functionAPI.add_course(template, self.authenticated);
                        if(!courseid)
                          courseid='f7380537-8eda-4fde-a953-4fec610ab4f5'
                           self.text = 'Course rendering'
                        await self.$store.dispatch('setcourseid',{courseid:courseid});
                        alert("Successfully create course");

                        this.$router.push("/course");
                     }
                      return;
                  }
                };

            //check if the accesscode is configured with geust
                if(!access.guestteamid)
                  break;

                //console.log("this is configured as guest");
                let guestteamid = access.guestteamid;
                let guestteam = this.get_team(guestteamid);
                let userid = self.userid;

                if(!guestteam.members[userid])
                {
                    guestteam.members[userid] = {
                    "derived":"", "role":"guest"
                  };

                  guestteam.membersalllist.push(self.userid);
                  guestteam.membersdirectlist.push(self.userid);
                   await functionAPI.update_team(guestteamid, guestteam);
                  if((self.authenticated !==1) &&(self.authenticated !== null))
                     {
                        courseid = await functionAPI.add_course(template, self.authenticated);
                        await self.$store.dispatch('setcourseid',{courseid:courseid});
                         self.text = 'Course rendering'
                        alert("Successfully create course");

                      this.$router.push("/course");
                     }
                }

              break;
              case "oem":
                profile = await functionAPI.get_userprofile();

                let courselist = profile.courselist;
                //check if this user is new
                if(courselist.length == 0)
                {

                  var oemserial = prompt("Please enter the OEM serial number", "Harry Potter");
                  if (oemserial != null) {
                    if(oemserial === access.oemserialnumber)
                    {
                      let template =await functionAPI.get_template(access.templateid);
                      //console.log("add course with tempalte");
                      template['UID']   = self.userid;
                      let coursid= await functionAPI.add_course(template, self.authenticated);
                      //alert("go to course render");
                      await self.$store.dispatch('setcourseid',{courseid:courseid});
                       self.text = 'Course rendering'
                      alert("Successfully create course");

                      this.$router.push("/course");
                    }
                    else
                     alert("incorrect Serial NUmber supplied");
                  }
                }
                break;
              case 'course':



                let teamids = course.teamid;

                let is_member = 0;
                for(let i = 0; i < teamids.length; i ++)
                {

                  let teamid = teamids[i];

                  let team = this.get_team(teamid);
                  let members = team.members;
                  let member= members[self.userid];
                  if(!memeber)
                    is_member = 1;
                }
                await this.$store.dispatch('setcourseid',{courseid:access.courseid});
                if(is_member ==1 )
                  this.$router.push('/course');
                // check if logged user = admin
                let adminid = course.AdminId.filter(id=>id===self.userid);
                self.text = 'Course rendering'

                if(adminid)
                   this.$router.push('/course?admin=true');  //with admin
                break;
              default:
                alert("There is no accesscode with " + accesscode);
          }

        });
    },
  },
  async mounted() {

   this.teamcollection =  functionAPI.get_teamcollection();

   if(this.$router.history.current.query.accesscode)
      await this.$store.dispatch('setcode',{code:this.$router.history.current.query.accesscode});

  // await this.$store.dispatch('setcourseid',{courseid:'c45289dc-32a2-4cb4-ac53-81c36f3e2b6a'});
   //this.$router.push("/course");

   if(this.accesscode)
     if(this.check_accesscode(this.accesscode))
     {

      //this.$router.push("/error");
     }


  }
};
</script>

<style>
.div-center {
  margin: auto;
}



.header_bottom {
  display: flex;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 20px;
  padding-top:5px;
}
.text-right{
  text-align: right;
  width:35%;
}
body {
  font-family: "Montserrat";
  margin: 0;
}

.page-enter-active {
  animation: bounce-in 0.8s;
}
.page-leave-active {
  animation: bounce-out 0.5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.9);
    opacity: 0;
  }
}


.rel {
  position: relative;
}
.rel:hover{
  cursor: pointer;
}
.train {
  margin-right: 10px;
}
.header_1 {
  position: absolute;
  width: 8px;
  height: 8px;
  left: 8px;
  top: 0px;
}
.container {


  margin: auto;
  background: #ffffff;
}
.header_2 {
  position: absolute;
  width: 18px;
  height: 10px;
  left: 3px;
  top: 8px;

  background: #000000;

  box-sizing: border-box;
  border-radius: 2.11111px;
}
.header_body{
  width:60%;
}

@media only screen and (max-width: 1411px) {
  .div_content{
    width:60%;
  }

}
@media only screen and (max-width: 1111px) {
  .div_content{
    width:70%;
  }

}
@media only screen and (max-width: 881px) {
  .div_content{
    width:80%;
  }
  .div_content_back
  {
    height:70vh;
  }
  .fixed{
    width:80%;
  }
  .header_bottom{
    width:80%;
  }
}
</style>

