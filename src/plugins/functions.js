import axios from 'axios'
import { store} from '~/plugins/firebase';
import moment from 'moment';
import consolaGlobalInstance from 'consola';
export const functionAPI = {
  async complete_course(courseid){
    let course_collection = store.collection('course').doc(courseid);
    // Remove the 'capital' field from the document

     course_collection.get().then(function(thisdoc){

       if(thisdoc.exists){

         let temp = thisdoc.data();
         temp.archived = true;
         course_collection.update(temp);
       }
     })
  },
  async get_course(courseid='all')
    {
      let result = await store.collection("course").get().then((querySnapshot) => {
          if(courseid !=='all')
            {

              let result= querySnapshot.docs.filter(query=>query.id===courseid).map(doc => doc.data());

              if(result.length ==0)
                return "";
              else
                return result[0];
            }
          else
            {

              let result= querySnapshot.docs.map(doc => { return {id:doc.id, data:doc.data()}});
              if(result.length ==0)
                return "";
              else
                return result;
            }
      });

      return result;
    },
    async get_teamcollection()
    {

       let result=  await store.collection("teams").get().then((querySnapshot) => {

            let result= querySnapshot.docs.map(doc => {
              return [doc.id,doc.data()];
            });
            if(result.length ==0)
              return "";
            else
              return result;


      });
      return result;
    },

    //get members from team id
    async get_team(teamid)
    {

       let result=  await store.collection("teams").get().then((querySnapshot) => {
         if(teamid)
         {
          let result= querySnapshot.docs.filter(query=>query.id===teamid).map(doc => doc.data());

          if(result.length ==0)
             return "";
          else
            return result[0];
         }
         else{
            let result= querySnapshot.docs.map(doc => {
              return [doc.id,doc.data().name];
            });
            if(result.length ==0)
              return "";
            else
              return result;
         }

      });
      return result;
    },

    //get template from template id
    async get_template(templateid){

      let result =  await store.collection("coursetemplates").get().then((querySnapshot) => {
        let result= querySnapshot.docs.filter(query=>query.id===templateid).map(doc => doc.data());

        if(result.length ==0)
          return "";
        else
          return result[0];
      });

      return result;

   },

  //get user information
  async get_userinfo(userid){

     let result =  await store.collection("userdetails").get().then((querySnapshot) => {

     let result= querySnapshot.docs.filter(query=>query.id===userid).map(doc => doc.data());

      if(result.length ==0)
         return "";
      else
        return result[0];
    });
    return result;
  },

  //update user information
  async update_userinfo(userid,userinfo){
    let user_collection = await store.collection("userdetails").doc(userid);

    let result = await user_collection.get().then(function(thisdoc){
        user_collection.set (userinfo);
        return true;
    })
    .catch(function(error) {
      return false;
    });
    return result;

  },

  //update team
  async update_team(teamid,team){

    let team_collection = store.collection('teams').doc(teamid);
   // Remove the 'capital' field from the document

    team_collection.get().then(function(thisdoc){
      if(thisdoc.exists){
        team_collection.update(team);
      }
    })
  },
  //set checkpoint
  async set_checkpoint(courseid,index){

    let course_collection = store.collection('course').doc(courseid);
   // Remove the 'capital' field   from the document

    course_collection.get().then(function(thisdoc){

      if(thisdoc.exists){

        let temp = thisdoc.data();

        temp.checkpoints[index].checkedtime =  moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
        course_collection.update(temp);
      }
    })
  },

  //set the questions with answer
  async set_questions(courseid,index,score,answers){

    let course_collection = store.collection('course').doc(courseid);
   // Remove the 'capital' field from the document

    course_collection.get().then(function(thisdoc){

      if(thisdoc.exists){

        let temp = thisdoc.data();
        temp.questions[index].score = score;
        temp.questions[index].answered = [];
        for(const i in answers)
        {
          temp.questions[index].answered.push(answers[i]);
        }

        if(!temp.questions[index].history)
          {
            temp.questions[index].history = [];
          }
       temp.questions[index].history.push({time:moment(new Date()).format("DD/MM/YYYY HH:mm:ss"), score:score,pass:true})
      //  temp.courseData.questions[index].answersrequired = 1;
        course_collection.update(temp);
      }
    })
  },
  async request_lang(templateid,uid, lang){

    let coursetemplate_collection = store.collection('coursetemplates').doc(templateid);

    await coursetemplate_collection.get().then(function(thisdoc){

      if(thisdoc.exists){

        let temp = thisdoc.data();
         if(!temp.langreq)
          temp.langreq = [];
         temp.langreq.push({reqdate:moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),reqby:uid, lang:lang})
           coursetemplate_collection.update(temp);
      }
    })
  },
  async set_signedcourse(courseid){

    let course_collection = store.collection('course').doc(courseid);
   // Remove the 'capital' field from the document

    await course_collection.get().then(function(thisdoc){

      if(thisdoc.exists){

        let temp = thisdoc.data();
       temp.signeddate = moment(new Date()).format("DD/MM/YYYY HH:mm:ss")
      course_collection.update(temp);
      }
    })
  },
  async add_answerhistory(courseid,index,score,answers){

    let course_collection = store.collection('course').doc(courseid);
   // Remove the 'capital' field from the document

    await course_collection.get().then(function(thisdoc){

      if(thisdoc.exists){

        let temp = thisdoc.data();
        if(!temp.questions[index].history)
          {
            temp.questions[index].history = [];
          }
        temp.questions[index].history.push({answers:answers,pass:false,time:moment(new Date()).format("DD/MM/YYYY HH:mm:ss"), score:score})
      //  temp.courseData.questions[index].answersrequired = 1;
        course_collection.update(temp);
      }
    })
  },

  //add the start or exit time about each section of slide or docs
  async add_slidehistory(courseid,index,isstart, slidepos=0){

    let course_collection = store.collection('course').doc(courseid);

    console.log('aaa',courseid)
    await course_collection.get().then(function(thisdoc){

      if(thisdoc.exists){
          console.log('asdaa');
        let temp = thisdoc.data();
        temp.slidehistory = "";
        temp.sessionhistory = [];
        temp.adminhistory = [];
        console.log("EE", temp.checkpoints);
        temp.checkpoints[0].checkedtime = 0;

        temp.questions[0].history = ""
        temp.questions[0].score = ""
     //   temp.questions[1].history = ""
        //temp.questions[1].score = ""
      // temp.slidepos = slidepos
        course_collection.update(temp);
        console.log("update")
        return;
        temp.slidepos = slidepos
        if(!temp.slidehistory)
        {
          temp.slidehistory = [];
          course_collection.update(temp);

        }

        let history = temp.slidehistory[index];
        let count  = 0;
        let x;
        for(x in history)
           count ++;

        if(isstart)
          {
            if(history)
            {
              let obj = {};
              obj['index'+count]= {starttime:moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),endtime:0}
              history = Object.assign(history,obj)

            }
            else
              history ={index0: {starttime:moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),endtime:0}}
          }
        else
        {

          if(history['index'+(count-1)].endtime === 0)
          history['index'+(count-1)].endtime = moment(new Date()).format("DD/MM/YYYY HH:mm:ss")


        }

        temp.slidehistory[index] = history;

        course_collection.update(temp);
      }
    })
  },

  async add_coursehistory(courseid,isstart,userinfo='', isadmin,adminid=''){

    let course_collection = store.collection('course').doc(courseid);
   // Remove the 'capital' field from the document

    await course_collection.get().then(function(thisdoc){

      if(thisdoc.exists){

        let temp = thisdoc.data();
        if(isadmin)
        {
          if(!temp.adminhistory)
            temp.adminhistory = [];
          temp.adminhistory.push({viewed:moment(new Date()).format("DD/MM/YYYY HH:mm:ss"), adminid:adminid})
        }
        else
        {
          if(!temp.sessionhistory)
          {
            temp.sessionhistory = [];
          }
          if(isstart)
            temp.sessionhistory.push({starttime:moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),userinfo:userinfo})
          else
            temp.sessionhistory[temp.sessionhistory.length -1 ].endtime = moment(new Date()).format("DD/MM/YYYY HH:mm:ss")
        }


        course_collection.update(temp);
      }
    })
  },
    //get current userprofile
    async get_userprofile(authorization){

      const options = {
     method:'GET',
     headers:
      {"Authorization" : authorization,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Request-With'},
     baseURL:'https://us-central1-tr-staging-8964c.cloudfunctions.net/api/user/getUserProfile'
       }

    let profile = await (axios(options).then(function(response){

       return response;
     })
     .catch(function(error){
     }));
     return profile;
   },


   //add course
   async add_course(course,authorization){

    const options = {
      method:'POST',
      data:course,
      headers:{"Authorization" : authorization,"Content-Type":'application/json'},
      baseURL:'https://us-central1-tr-staging-8964c.cloudfunctions.net/api/course/addcourse'
    }
    let courseid = 0;
    await axios(options).then(function(response){
      courseid = response.data.data.id;

        //courseid = response.courseid;


      })
      .catch(function(error){
        console.log("error",error);
      });

    return courseid;
 },
}
