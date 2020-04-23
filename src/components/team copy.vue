<template>

  <v-card class="team_body"  >


     <v-card-title class='team_title blue--text subheading font-weight-bold'> This is a team </v-card-title>
    <div class="team_content">
      <v-treeview
      activatable
      color="warning"
      :items="items"
    ></v-treeview>
      <!-- <ul id="" class="div_content_back">
        <div v-for="teamid in teamids" :key='teamid' @click="view_course(teamid)" class='team_list'>
            {{teamid}}
             <div v-for="team in teams[teamid]" :key="team.id" style="padding-left:30px" >
              {{team }}
            </div>

        </div>
      </ul> -->
    </div>
      <span class='team_title'> Courses to be done </span>
    <div class="team_content"  v-if="uncourses.length!==0">

      <ul id="" class="div_content_back">
        <li v-for="courseid in uncourses" :key='courseid' @click="course_detail(courseid)" style="cursor:pointer">
            {{courseid}}
        </li>
      </ul>

    </div>
    <div v-else class='course'>No courses</div>
     <span class='team_title'> Courses Done</span>
    <div class="team_content" v-if="courses.length!==0">

      <ul id="" class="div_content_back"  >
        <li v-for="courseid in courses" :key='courseid' @click="course_detail(courseid)" style="cursor:pointer">
            {{courseid}}

        </li>
      </ul>

    </div>
    <div v-else class='course'> No courses</div>
  </v-card>
</template>

<script>

import { functionAPI } from '~/plugins/functions';
import jcookies from 'js-cookie'
export default {
  data(){

  return {
        teams:  "",
        teamids: "",
        courses:"",
        currentcourseid:"",
        uncourses:"",
        items: [   ],
    }
  },
  computed: {

      authenticated(){
        return this.$store.state.authenticated
      },
      userid(){
        return this.$store.state.userid
      },

		},
  filters: {
    pretty: function(value) {
      return JSON.stringify(JSON.parse(value), null, 2);
    }
  },
  methods:{
    async course_details(courseid){
      this.currentcourseid = courseid;
      await this.$store.dispatch('setcourseid',{courseid:courseid});
      this.$router.push('/course');
    },
    async view_course(teamid){

       let courses = await functionAPI.get_course();

       courses = courses.filter(course=>course.teamid === teamid)

       this.courses = courses.filter(course=>course.archieved===true);
       this.uncourses = courses.filter(course=>course.archieved===false);
    }
  },
 async mounted () {

    let userdetails = await functionAPI.get_userinfo(this.userid);


  //  await this.$store.dispatch('login',{user:null,auth:null});
  //  jcookies.remove("__session");
  //  this.$router.push("/login");

   if(userdetails)
    {
        this.teams = userdetails.teamsnest;
        this.teamids = userdetails.teamslist;
    }
   else
      {
        await this.$store.dispatch('login',{user:null,auth:null});
        this.$router.push("/login");
      }

    this.teamids.forEach((value, index) => {
      this.items.push({id:index,name:value,children:[{id:1, name:''}]});
    });

  }
}
</script>

<style>
.course{
  border:1px solid lightgray;
  padding:10px 10px;
  margin:10px 10px;
}
.team_title{
  font-size: 20px;

}
.course{
  padding-left:20px;
  margin-top:10px;
  margin-bottom:30px;
  color: grey;
}
.team_content{
  overflow: scroll;

  height:100%;
  height:300px;
  margin:20px 0px;
}
.div_content_back {
  background: #f1f1f1;
  margin: 10px 0px;
  padding:10px 10px;

  border: 1p solid lightgray;
}
.team_list{
  cursor: pointer;
  font-size:18px;
  margin-top:10px;
  color:darkslategrey;
}
.team_list:hover{
  background-color:#eaeaea;
}
.team_body
{
  padding-bottom:20px;
  padding:5px 10px;
}
</style>

