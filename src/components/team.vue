<template>

  <v-card class="team_body"  >
    <v-card-title class=' blue--text subheading font-weight-bold'> My teams    </v-card-title>
    <div  class="div_content_back">
      <div v-for="team in teamnames" :key='team.id'  :class='!download?"team_list cursor_hand":"team_list"'  @click="view_course(team.id,team.name)">
         {{team.name}}

      </div>
    </div>
    <v-card-title>
      <div style="margin-bottom:40px">
      <span id='course_owner' style="margin-right:5px">My</span> courses
      </div>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items-per-page="50"
      :items="courses"
      :search="search"
      disable-sort=true


    >
      <template v-slot:item.duedate="{ item }">
          <v-chip :color="getColor(item.duedate)" >{{ getdate(item.duedate) }}</v-chip>
        </template>
      <template v-slot:item.daystodue="{ item }">
          <v-chip :color="getdueColor(item.daystodue)" >{{ item.daystodue }}</v-chip>
        </template>
      <template v-slot:item.download="{ item }">
          <i _ngcontent-urls-c19 class='material-icons icon-image-preview cursor_hand' v-if='item.download=="100%"' @click="gotoCourse(item.id)">play_arrow</i>
          <v-chip v-else>{{ item.download }}</v-chip>
        </template>

    </v-data-table>

  </v-card>

</template>

<script>

import { functionAPI } from '~/plugins/functions';
import jcookies from 'js-cookie';
import { storage } from '~/plugins/firebase';
import moment from 'moment';
export default {
  data(){

  return {
        urls:[],
        currentcourseid:"",
        search: '',
        download:0,
        loading:false,
        text:'0%',
        teamcollection:[],
        headers: [
          { text: '', value: 'download' },
          {
            text: 'Assigned dates',
            align: 'left',
            value: 'assigneddate',
            dataType: "Date"
          },
          { text: 'Course Title', value: 'title' },
          { text: 'Course Description', value: 'description' },
          { text: 'Due Date', value: 'duedate',dataType: "Date" },
          { text: 'Signed Date', value: 'signeddate' },
          { text: 'Teamname', value: 'teamname' },
          { text: 'Access Code', value: 'accesscode' },
          { text: 'Days to Due', value: 'daystodue' },
        ],
        courses:[],
        course_collection:[],
        teamnames:[]
    }
  },
  computed: {
      dataurl(){
        return this.$store.state.dataurl
      },
      courselist(){
        return this.$store.state.courselist
      },
      teamlist(){
        return this.$store.state.teamlist
      },
      dataurls(){
        return this.$store.state.dataurls
      },
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
    async gotoCourse(value) {
      this.download = 2;
      let url = this.urls.filter(item=>item.courseid===value);
      console.log('asd',url)
      console.log('asd1',this.urls);
      console.log('asd22',value)
      await this.$store.dispatch('setdataurl',{url:url[0].url});
      let cookie = jcookies.get('__session');
      let data  = JSON.parse(cookie);
      data.url = url;
      jcookies.set("__session", data);
      await this.$store.dispatch('setcourseid',{courseid:value});
      this.$router.push("/course");

    },
    getdate(time)
    {

      return moment(time* 1000).format("DD/MM/YYYY HH:mm:ss")
    },
    getColor (duedate) {

    let curr_time = new Date().getTime();

        if (duedate*1000 < curr_time ){
          return 'red'
        }

      },
    getdueColor (day) {
        if (day >  0)
          return 'green';
        else
          return 'red';
      },

    async view_course(teamid,teamname){

      if(this.download ==1)
        return;
      this.download = 1;
      this.loading = false;
      this.text = '0%'
      document.getElementById('course_owner').innerHTML = teamname+"'s"

      let courses = this.course_collection.filter(course=>course.data.teamid === teamid)
      //this.courses = courses.filter(course=>course.archieved===true);

      const temp_courses= [];
      courses.sort( ( a, b) => {
           return b.data.duedate.seconds - a.data.duedate.seconds;
      });

      for (const courseid in courses) {
        let row = courses[courseid].data;
        if(row)
        {
          let myDate = moment(new Date(row.assigneddate.seconds * 1000)).format("DD/MM/YYYY HH:mm:ss");
          let duedate =row.duedate.seconds


          let duetodays =(new Date(row.duedate.seconds * 1000)-new Date())/(60*60*24*1000);//(row.duedate.seconds-new Date().getTime())/(60 * 60 * 24);

          let teamname = this.get_teamname(row.teamid);
        let signeddate = row.signeddate;
        if(!signeddate)
            signeddate='';
          let data={
            download:'0%',
            id:courses[courseid].id,
            assigneddate:myDate+' ',
            title:row.title.original,
            description:row.description.original,
            duedate:duedate,
            signeddate:signeddate+'',
            teamname:teamname,
            accesscode:row.accesscode,
            daystodue:Math.round(duetodays),
          };
          temp_courses.push(data);
        }
      }
      this.courses = temp_courses;

      //download images for unsigned course
      let i = 0;
      let urls = [];
      this.urls=[];

      for (const courseid in courses)
        {

          i++;
          if(courses[courseid].data.slides){
          let slides = courses[courseid].data.slides.original;
          let arr = [];

          for(const index in slides)
            {
              if(this.download ==2)
                break;
              if(window.performance.memory.usedJSHeapSize< window.performance.memory.jsHeapSizeLimit*0.9)
              {

                this.courses[i-1].download = Math.round((parseInt(index)+1)*100/slides.length) +'%';
                arr.push(await this.getdownloadURL(slides[index]));
              }

            }

          let tmp_data = {courseid:courses[courseid].id, url:arr}
          this.urls.push(tmp_data);

          }
        }
        this.download = 0;
        //await this.$store.dispatch('setdataurls',{urls:this.urls});
        this.loading = true;
    },
     sortByObjectProperty(prop, getter) {
      return (a, b) => {
        a = getter(a), b = getter(b)
        if (a[prop] < b[prop])
          return -1;
        if (a[prop] > b[prop])
          return 1;
        return 0;
      }
    },
    get_teamname(teamid){

      for(const id in this.teamcollection)
        {
          if(teamid == this.teamcollection[id][0]){

            return this.teamcollection[id][1];
          }
        }

    },
    async init()
    {
      console.log('init dataurls', this.dataurls)
      this.courses = this.courselist;
      this.teamnames = this.teamlist;
      let course_len = 0;
      let newcourses = this.courselist;
      let temp_courses=[];
      for (const courseid in newcourses) {

        let row = newcourses[courseid].data;
        if(row)
        {
          let myDate = moment(new Date(row.assigneddate.seconds * 1000)).format("DD/MM/YYYY HH:mm:ss");
          let duedate = row.duedate.seconds //moment(new Date(row.duedate.seconds * 1000)).format("DD/MM/YYYY HH:mm:ss");


          let duetodays =(new Date(row.duedate.seconds * 1000)-new Date())/(60*60*24*1000);//(row.duedate.seconds-new Date().getTime())/(60 * 60 * 24);

          let teamname = this.get_teamname(row.teamid);
          let signeddate = row.signeddate;
          if(!signeddate)
            signeddate='';
          let progress = '0%';
          let url;


          if(this.dataurls)
           url= this.dataurls.filter(item=>item.courseid===newcourses[courseid].id);

          if(url!=null&&url.length !=0)
            progress = '100%'

          var data={
            download:progress,
            id:newcourses[courseid].id,
            assigneddate:myDate+' ',
            title:row.title.original,
            description:row.description.original,
            duedate:duedate,
            signeddate:signeddate+'',
            teamname:teamname,
            accesscode:row.accesscode,
            daystodue:Math.round(duetodays),
          };
          temp_courses.push(data);
        }
      }

    this.courses = temp_courses;
    let userdetails = await functionAPI.get_userinfo(this.userid);
    let courses = userdetails.courses
    let url_length = 0;
    if(this.dataurls)
      url_length = this.dataurls.length

    {
        if(this.download==2)
        return;

      let i = -1;
    console.log('dataurl',this.dataurls)
    console.log("couses",courses)

    for (const i in this.courses)
        {
          console.log('www',this.courses[i]);
          let url = null;
          if(url_length!=0)
          {
            //this.urls = this.dataurls;
            url = this.dataurls.filter(item=>item.courseid===this.courses[i].id);
            if(url.length ==0)
            url = null;
          }

          let course;
          for(const courseid in courses)
            if(courseid==this.courses[i].id)
            {
              course = courses[courseid]
              break;
            }

          console.log('course;',course);
          if(url == null && course.slides)
          {

           let slides = course.slides.original;
           const arr = [];

            for(const index in slides)
            {
              arr.push(await this.getdownloadURL(slides[index]));
               this.courses[i].download = Math.round((parseInt(index)+1)*100/slides.length) +'%';

            }
            await this.$store.dispatch('setdataurls',{urls:{courseid:this.courses[i].id, url:arr}});
            this.urls.push({courseid:this.courses[i].id, url:arr});

          }
          else if(url != null)
            {
              await this.$store.dispatch('setdataurls',{urls:{courseid:url[0].courseid,url:url[0].url}});
              this.urls.push({courseid:url[0].courseid,url:url[0].url});
            }
        }
        console.log("done", this.urls)
      //await this.$store.dispatch('setdataurls',{urls:this.urls});
      }


    },
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
  },
 async created () {

    this.course_collection = await functionAPI.get_course('all');
    console.log('list',this.courselist)
    if(this.courselist && this.courselist.length!=0)
      {
        this.init()
        return;
      }


   let userdetails = await functionAPI.get_userinfo(this.userid);
   let course_len = 0;
   if(userdetails)
    {
      console.log(userdetails)
      this.teamcollection = await functionAPI.get_team();
      let teamlist = userdetails.teamslist
      let courses = userdetails.courses;

      var  temp_courses=[];
      let newcourses = [];
      if(courses)
      for (const courseid in courses) {
        course_len++;

        newcourses.push({id:courseid, data:courses[courseid]});
      }

       newcourses.sort( ( a, b) => {
            return b.data.duedate.seconds - a.data.duedate.seconds;
       });

      for (const courseid in newcourses) {

        let row = newcourses[courseid].data;
        if(row)
        {
          let myDate = moment(new Date(row.assigneddate.seconds * 1000)).format("DD/MM/YYYY HH:mm:ss");
          let duedate = row.duedate.seconds //moment(new Date(row.duedate.seconds * 1000)).format("DD/MM/YYYY HH:mm:ss");


          let duetodays =(new Date(row.duedate.seconds * 1000)-new Date())/(60*60*24*1000);//(row.duedate.seconds-new Date().getTime())/(60 * 60 * 24);

          let teamname = this.get_teamname(row.teamid);
          let signeddate = row.signeddate;
          if(!signeddate)
            signeddate='';
          let progress = '0%';
          let url;


          if(this.dataurls)
           url= this.dataurls.filter(item=>item.courseid===newcourses[courseid].id);

          if(url!=null&&url.length !=0)
            progress = '100%'

          var data={
            download:progress,
            id:newcourses[courseid].id,
            assigneddate:myDate+' ',
            title:row.title.original,
            description:row.description.original,
            duedate:duedate,
            signeddate:signeddate+'',
            teamname:teamname,
            accesscode:row.accesscode,
            daystodue:Math.round(duetodays),
          };
          temp_courses.push(data);
        }
      }

      this.courses =temp_courses;

    await this.$store.dispatch('setcourselist',{ courselist : newcourses });



      let tmp_teamnames=[];
      for(const id in teamlist)
      {

        let teamname = this.get_teamname(teamlist[id]);
        tmp_teamnames.push({name:teamname, id:teamlist[id]});
      }

      this.teamnames = tmp_teamnames
      await this.$store.dispatch('setteamlist',{teamlist:tmp_teamnames});


      //get the urls from cloud storage
      let temp_urls=[];
      this.download = 1;

      let url_length = -1;
       if(this.dataurls)
         url_length = this.dataurls.length
      // console.log(this.dataurls)
      //if(url_length !=course_len)
      {
        if(this.download==2)
        return;

        let i = 0;

        for (const index in newcourses)
        {

          i++;
          let url = null;
          if(url_length!=0)
          {
            //this.urls = this.dataurls;

            url = this.dataurls.filter(item=>item.courseid===newcourses[index].id);
            if(url.length ==0)
            url = null;
          }


          if(url == null && newcourses[index].data.slides)
          {

           let slides = newcourses[index].data.slides.original;
           const arr = [];

            for(const index in slides)
            {
              arr.push(await this.getdownloadURL(slides[index]));
               this.courses[i-1].download = Math.round((parseInt(index)+1)*100/slides.length) +'%';

            }

          this.urls.push({courseid:newcourses[index].id, url:arr});
          await this.$store.dispatch('setdataurls',{urls:{courseid:newcourses[index].id, url:arr}});
          }
          else if(url != null)
          {
          this.urls.push({courseid:newcourses[index].id, url:url});
          await this.$store.dispatch('setdataurls',{urls:{courseid:newcourses[index].id, url:url}});
          }
        }
        //await this.$store.dispatch('setdataurls',{urls:this.urls});
        console.log('aaa',this.urls)
       // this.urls =temp_urls;
      }

      this.loading = true;
    }
   else
      {
        await this.$store.dispatch('login',{user:null,auth:null});
        this.$router.push("/login");
      }
      this.download = 0;

  }
}
</script>

<style>
.course{
  border:1px solid lightgray;
  padding:10px 10px;
  margin:10px 10px;
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

  margin: 10px 0px;
  padding:10px 10px;
  max-height:40vh;

  overflow: auto;
  border: 1px solid lightgray;
}
.cursor_hand
{
  cursor:pointer;
}
.team_list{
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
@media only screen and (max-width: 801px) {
  .div_content_back{
    height:80vh;
    max-height: 80vh;
  }

}
</style>

