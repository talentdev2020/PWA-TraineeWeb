<template slot>

  <div v-if="courseData" class='slide_header' >


    <slideheader  :titles='courseData.title' :text='text'/>
     <v-card style="padding:10px;  margin:0 20px;margin-top:20px; background-color:#eeeeee" v-if='courseData.signeddate'>
        <div class="checkpoint"   >

                <div style="padding-top:25%"  >
                    <h3>This course is signed at {{courseData.signeddate}}</h3>
                </div>

        </div>
      </v-card>
      <div  v-for='(slide, index) in courseData.slides[lang]' v-bind:key='index' v-scroll='handleScroll'   style="margin:0 20px;margin-bottom:40px" >
        <v-card style="padding:10px; margin:auto; margin-top:30px; background-color:#eeeeee"> <v-img  class="image_middle"  :src=slideurl?slideurl[index]:slide ref='images'/> </v-card>

        <v-card style="padding:10px;  margin-top:30px; background-color:#eeeeee" v-if='isInclude(0,index)'>
          <div class="checkpoint"  ref='checkpoints'>
              <div class="checktext">  Checkpoint {{getcheckpointindex(index)+1}}    </div>
              <div style="padding-top:10%" v-if='courseData.checkpoints[getcheckpointindex(index)].checkedtime'>
                  This is checked at {{courseData.checkpoints[getcheckpointindex(index)].checkedtime}}
              </div>
              <div style="margin-left:20px" v-else>
                <span v-if='time'>
                  Check point avaiable in {{time}}seconds
                </span>
                <span v-else>
                  Check point avaiable in {{courseData.checkpoints[getcheckpointindex(index)].duration}}seconds
                </span>
              </div>

              <v-btn class="btn_checkpoint"  v-on:click="click_checkpoint(getcheckpointindex(index))" v-if='!courseData.checkpoints[getcheckpointindex(index)].checkedtime'>
                {{courseData.checkpointlabel[lang]}}
              </v-btn>
          </div>
        </v-card>
        <v-card style="padding:10px;  margin-top:30px; background-color:#eeeeee" v-if='(isInclude(0,courseData.slides[lang].length)) &&(index===courseData.slides[lang].length-1) '>
          <div class="checkpoint"  ref='checkpoints' >
              <div class="checktext">  Checkpoint {{getcheckpointindex(courseData.slides[lang].length)+1}}   </div>

                <div style="padding-top:10%" v-if='courseData.checkpoints[getcheckpointindex(courseData.slides[lang].length)].checkedtime'>
                  This is checked at {{courseData.checkpoints[getcheckpointindex(courseData.slides[lang].length)].checkedtime}}
              </div>
              <div style="margin-left:20px" v-else>
                <span v-if='time'>
                    Check point avaiable in {{time}}seconds
                  </span>
                  <span v-else>
                    Check point avaiable in {{courseData.checkpoints[getcheckpointindex(courseData.slides[lang].length)].duration}}seconds
                  </span>
              </div>
              <v-btn class="btn_checkpoint"  v-on:click="click_checkpoint(getcheckpointindex(courseData.slides[lang].length))" v-if='!courseData.checkpoints[getcheckpointindex(courseData.slides[lang].length)].checkedtime'>
                {{courseData.checkpointlabel[lang]}}
              </v-btn>
          </div>
        </v-card>

        <v-card v-if='isInclude(1,index)' style="padding:10px; margin-top:30px; background-color:#eeeeee">
          <div class="question"  style="padding-left:20px">
            <h1>Question{{getquestionindex(index)+1}}</h1>
            <h3>{{courseData.questions[getquestionindex(index)].text[lang]}}</h3>
            <span style="font-size:14px;text-align:center;line-height:unset ;display: inline-block;margin:20px 0px"    >Required Correct answers?   {{courseData.questions[getquestionindex(index)].answersrequired}}</span>

            <div v-if='isadmin' style="margin-bottom:20px;margin-right:5px">
                  <div style="display:inline-block">
                    <span class="question_span_title " style="background-color: unset;"> Answer  </span>
                    <span class="question_radio_title"  > Correct ?    </span>
                  </div>
                  <div class='divider'></div>
                  <div v-for='(question,i) in courseData.questions[getquestionindex(index)].answers' v-bind:key='i' class='question_divider'>
                    <span class="question_span"><input type="text" :value='question.anstext[lang]'  disabled  class="question_text"></span>
                    <span class="question_radio"><v-checkbox  class='radio_style'></v-checkbox  ></span>
                  </div>

                  <div v-if='courseData.questions[getquestionindex(index)].history[courseData.questions[getquestionindex(index)].history.length-1]'>
                    <h3 style="text-align:center;line-height:unset"  > His score is {{courseData.questions[getquestionindex(index)].history[courseData.questions[getquestionindex(index)].history.length-1].score}}   </h3>
                    <br>
                    <h3 v-if='courseData.questions[getquestionindex(index)].score'>He passed this question</h3>
                    <h3 v-else>He didn't pass this question</h3>
                  </div>
                  <div v-else>
                    <h3>The tranee didn't answer this quesion yet.</h3>
                  </div>
            </div>

            <div style="padding:10px 0px;margin:10px 10px" v-else>
              <div style="margin:auto; " v-if='!courseData.questions[getquestionindex(index)].multiplechoice'>
                  <div style="display:inline-block;width:80% ">
                    <span class=" question_span_title" style='background-color: unset;'> Answer  </span>
                    <span class="question_radio_title"> Correct ?    </span>
                  </div>
                  <div class='divider' style=" "></div>
                  <div v-for='(question,i) in courseData.questions[getquestionindex(index)].answers' v-bind:key='i' class='question_divider'>
                    <span class="question_span"> {{question.anstext[lang]}} </span>
                    <span class="question_radio">
                      <input v-if='courseData.questions[getquestionindex(index)].score' disabled :checked='courseData.questions[getquestionindex(index)].answered[i]' type='radio' :value='i' name='s'    :id='"question"+getquestionindex(index)+"_"+i' class='radio_style'>
                      <input v-else type='radio' :value='i' name='s'    :id='"question"+getquestionindex(index)+"_"+i' class='radio_style'>
                    </span>
                  </div>

              </div>
              <div style="margin:auto; " v-else >
                  <div style="display:inline-block;width:80%   ">
                    <span class="question_span_title " style="background-color: unset;"> Answer  </span>
                    <span class="question_radio_title"> Correct ?    </span>
                  </div>
                  <div class='divider'></div>
                  <div v-for='(question,i) in courseData.questions[getquestionindex(index)].answers' v-bind:key='i' class='question_divider'>
                    <span class="question_span">
                      <input type="text" :value='question.anstext[lang]' disabled  class="question_text">
                    </span>
                    <span class="question_radio">
                      <v-checkbox v-if='courseData.questions[getquestionindex(index)].score' v-model="courseData.questions[getquestionindex(index)].answered[i]"  :id='"question"+getquestionindex(index)+"_"+i'  class='radio_style' disabled></v-checkbox>
                      <v-checkbox v-else  :id='"question"+getquestionindex(index)+"_"+i'  class='radio_style'></v-checkbox  >
                    </span>
                  </div>
              </div>

              <div style="text-align:center" v-if ='courseData.questions[getquestionindex(index)].score'>
                  <div style="line-height:unset;display:inline-block;width:80%" :id='"answer"+getquestionindex(index)'></div>
                    <h3 style="text-align:center;line-height:unset"  > You answered this questions   </h3><br>
                    <h3 style="text-align:center;line-height:unset"  >Your score is {{courseData.questions[getquestionindex(index)].score}} </h3>
                    <v-btn  disabled ref='questions' v-on:click='clicked_answer(getquestionindex(index))' :id='"btn_answer"+getquestionindex(index)' class='btn_answer'>Check</v-btn>
              </div>
              <div v-else style="text-align:center;margin-top:20px" >
                  <div style="line-height:unset;margin-top:10px;" :id='"answer_"+getquestionindex(index)'> </div>
                  <div style="color:red"  :id='"must_txt"+getquestionindex(index)' >You must get the answer correct before you can continue</div>
                  <v-btn   ref='questions' v-on:click='clicked_answer(getquestionindex(index))' :id='"btn_answer"+getquestionindex(index)' class='btn_answer'>Check</v-btn>
              </div>




            </div>
          </div>
        </v-card>

      </div>
      <!-- <v-dialog v-model="finished" persistent="true" max-width="390"   overlay-color='#FFFFFF'  content-class='text-center' >
         <div class="checkpoint"  >

            <v-card-title class="headline">You have finished the course. </v-card-title>

            <v-divider></v-divider>
            <v-card-actions>

              <v-btn class="btn_checkpoint " color="green darken-1"  @click.native="reauthenticate">Sign and Complete</v-btn>
            </v-card-actions>
          </div>
        </v-dialog> -->
      <v-card style="padding:10px; margin-top:30px; background-color:#eeeeee" v-if='finished||courseData.signeddate'>
          <div class="checkpoint"  >
            <v-card-title class="headline">You have completed all the requirements of this course,<br> you can now sign off </v-card-title>

            <v-divider></v-divider>
            <v-card-actions v-if='courseData.signeddate'>
               <v-card-title @click.native="reauthenticate">Signed off: {{courseData.signeddate}} </v-card-title>

            </v-card-actions>
            <v-card-actions v-else>
              <v-btn color="green darken-1"  @click.native="reauthenticate">Sign off and Complete</v-btn>
            </v-card-actions>

          </div>
      </v-card>
    <div style="height:150px">&nbsp;</div>
    </div>


</template>

<script>
import moment from 'moment';
import { functionAPI } from '~/plugins/functions';
import slideheader from '~/components/slideheader.vue'
import jcookies from 'js-cookie'
import axios from 'axios'
export default {
  props:['isadmin'],
  data(){
    return{
      time:'',
      interval:30,
      before_finish:false,
      finished:false,
      courseData:null,
      text:"This is slide",
      isRunning:false,
      currpos:0,  // current scroll pos
      disabled:true,
      isscroll:true,
      scores:{},
      questionpos:0,
      slidepos:0,   //current slide pos
      ischeck:-1,
      userinfo:{}     //screen is for checkpoint or question
    }
  },

	computed: {
     courseid(){
        return this.$store.state.courseid
      },
      slideurl(){
        return this.$store.state.dataurl
      },
     lang(){
       return this.$store.state.language
     },
     userid(){
       return this.$store.state.userid
     },

		},
  components: {
    slideheader:slideheader,

  },

  async created(){

    let course = await functionAPI.get_course(this.courseid);

    this.courseData = course;
    console.log("urls", this.slideurl);
    if(this.courseData.slidepos)
      this.slidepos = this.courseData.slidepos

    // if(this.courseData.textboxes.length > 0)
    //   this.text = this.courseData.textboxes[this.slidepos].text;
    this.text ='This is trainee course'
    this.ipLookUp();
    this.browserinfo();
  },
  async mounted() {

    this.initslidepos();
    window.scrollTo(0, 0);
    if(!this.isadmin)
    {
       functionAPI.add_slidehistory(this.courseid,0,true, this.slidepos);
       functionAPI.add_coursehistory(this.courseid,true,this.userinfo,this.isadmin);
    }
    else
        functionAPI.add_coursehistory(this.courseid,true,this.userinfo,this.isadmin, this.userid);


    let self = this;
    window.onbeforeunload = function(){
      if(!self.isadmin)
        functionAPI.add_slidehistory(self.courseid,self.slidepos,false);
      functionAPI.add_coursehistory(self.courseid,false, self.isadmin);
          return "Are you sure you want to close the window?";
      }

   },

  methods:{

    initslidepos(){
      let slides = this.$refs.images;

      if (!this.slidepos) {
        return false
      }
      const top = slides[this.slidepos].$el.getBoundingClientRect().top
      const height = slides[this.slidepos].$el.clientHeight
      window.scrollTo(0, top + height/2)

    },
    browserinfo(){

        var browser = '';
        var version = '';
        var idString = '';

        var ua = navigator.userAgent;
        var tem = [];
        var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i);

        //IE will be identified as 'Trident' and a different version number. The name must be corrected to 'Internet Explorer' and the correct version identified.
        //ie correction

        if(/trident/i.test(M[1]))
        {
            tem = /\brv[ :]+(\d+.?\d*)/g.exec(ua) || [];
            browser = 'Internet Explorer';
            version = tem[1];
        }

        //firefox
        else if(/firefox/i.test(M[1]))
        {
            tem = /\brv[ :]+(\d+.?\d*)/g.exec(ua) || [];
            browser = 'Firefox';
            version = tem[1];
        }

        //safari
        else if(/safari/i.test(M[1]))
        {
            tem = ua.match(/\bVersion\/(\d+.?\d*\s*\w+)/);
            browser = 'Safari';
            version = tem[1];
        }

        //If 'Chrome' is found, it may be another browser.
        else if(M[1] === 'Chrome')
        {
            //opera
            var temOpr = ua.match(/\b(OPR)\/(\d+.?\d*.?\d*.?\d*)/);
            //edge
            var temEdge = ua.match(/\b(Edge)\/(\d+.?\d*)/);
            //chrome
            var temChrome = ua.match(/\b(Chrome)\/(\d+.?\d*.?\d*.?\d*)/);

            //a genuine 'Chrome' reading will result from ONLY temChrome not being null.
            var genuineChrome = temOpr == null && temEdge == null && temChrome != null;

            if(temOpr != null)
            {
                browser = temOpr[1].replace('OPR', 'Opera');
                version = temOpr[2];
            }

            if(temEdge != null)
            {
                browser = temEdge[1];
                version = temEdge[2];
            }

            if(genuineChrome)
            {
                browser = temChrome[1];
                version = temChrome[2];
            }
        }
        //There will be some odd balls, so if you wish to support those browsers, add functionality to display those browsers as well.

        if(browser == '' || version == '')
        {
            idString = 'We couldn\'t find your browser, but you can still use the site';
        }
        else
        {
            idString = browser + ' version ' + version;
        }

        this.userinfo.browser = browser;

    },
    ipLookUp () {
      let self = this
        axios('https://pro.ip-api.com/json?key=lJyyD90SnSFqqmV')
        .then(
            function success(response) {
              console.log(response);
               //will do it
              //  self.userinfo.country = response.data.country
              //   self.userinfo.ip = response.data.query
              //   self.userinfo.zipcode = response.data.zipcode
            },

            function fail(data, status) {
                console.log('Request failed.  Returned status of',
                            status);
            }
        );
    } ,
    async reauthenticate(){
      //await this.$store.dispatch('login',{user:'',auth:''});
      let cookie = jcookies.get('__session');
      let data  = JSON.parse(cookie);
      data.authenticated = '';
      jcookies.set("__session", data);
      this.$router.push("/finish")
    },
    //when click the check button in question screen
    async clicked_answer(){
      if(this.ischeck ==1)
        {
          this.$toast.error('You should click the check point'  )
          setTimeout(this.$toast.clear,2000);
          return
        }
      if(this.isadmin)
        return;
       let questions = this.courseData.questions[this.questionpos];
       let num = 0;
      let answers =[];
      for(let i = 0;  i < questions.answers.length; i ++)
      {
        let temp = {};
        let pos = parseInt(this.questionpos);
        let answer = document.getElementById('question'+pos+'_'+i).checked;
        temp['answer'+(i+1)] = answer;
        answers = Object.assign(answers,temp);

        if(answer && questions.answers[i].correct)
           num++;
      }
       let success = 0;
       let score = 0;
       score = num / questions.answersrequired//questions.answers.length
      if(score>1)
        score = 1;
      if(questions.multiplechoice)
      {
        if(num >= questions.answersrequired)
        {
          //questions.answersrequired = 0;
        //   window.onscroll=function(){  };

          await functionAPI.set_questions(this.courseid, this.questionpos,score,answers);
           success = 1;
        }
        else
        await functionAPI.add_answerhistory(this.courseid, this.questionpos,score,answers);
      }
      else
      {
        if(num === 1)
        {

          success = 1;
          // window.onscroll=function(){  };
          await functionAPI.set_questions(this.courseid, this.questionpos,score,answers);
        }
        else{
           await functionAPI.add_answerhistory(this.courseid, this.questionpos,0,answers);
        }
      }



      //  if(document.getElementById('answer'+this.questionpos))
       //   document.getElementById('answer'+this.questionpos).innerHTML = 'Your score is ' + score.toPrecision(2) ;
       // if(document.getElementById('answer_'+this.questionpos))
        //  document.getElementById('answer_'+this.questionpos).innerHTML = 'Your score is ' + score.toPrecision(2);
      if(success === 1)
      {

        if(this.questionpos ==this.courseData.questions.length-1)
        {
          let checkpoints = this.courseData.checkpoints;
          if((checkpoints[checkpoints.length-1].checkedtime) )
             {

               this.before_finish = true;
              if(this.courseData.questions[this.questionpos].pos>=this.courseData.slides['original'].length)
              {
              this.finished = true;
              functionAPI.set_signedcourse(this.courseid);
              }
               //render the sign and complete button
             }
        }
         this.courseData.questions[this.questionpos].score = 1;
          if(!this.courseData.questions[this.questionpos].answered)
            this.courseData.questions[this.questionpos].answered = [];
        for(const i in answers)
        {
          this.courseData.questions[this.questionpos].answered.push(answers[i]);
        }
        this.$toast.success('Congratulations! You have passed this question'  )
        document.getElementById("must_txt"+this.questionpos).style="display:none";
        setTimeout(this.$toast.clear,2000);
        window.onscroll=function(){};

      }
      else
      {
        this.$toast.error("Your answer is not enough, please try again  ")
        setTimeout(this.$toast.clear,2000);
      }
      this.isscroll = true;
      this.ischeck = -1;

    },
   //get the index of question
    getquestionindex(pos){

      for(let i = 0 ; i < this.courseData.questions.length; i ++)
      {

        if((pos+1) == this.courseData.questions[i].pos)
        {

          return i;
        }
      }
    },

   getcheckpointindex(pos){

      for(let i = 0 ; i < this.courseData.checkpoints.length; i ++)
      {

        if((pos+1) == this.courseData.checkpoints[i].pos)
        {
          return i;
        }
      }
    },

    //when click check point button,
    click_checkpoint(index){
     if(( this.courseData.checkpoints[index].checkedtime ) ||(this.isadmin))
       return;
    //document.getElementsByTagName('html')[0].style='overflow:auto';
    this.isscroll = true;
    this.ischeck = -1;
    this.courseData.checkpoints[index].checkedtime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    this.$refs.checkpoints[index].children[1].innerHTML ="This is checked at "+ this.courseData.checkpoints[index].checkedtime;
    functionAPI.set_checkpoint(this.courseid, index);
    this.isRunning = false;
    if(this.questionpos ==this.courseData.questions.length-1)
        {
          let checkpoints = this.courseData.checkpoints;
          if(checkpoints[checkpoints.length-1].checkedtime)
             {
               //this.finished = true;
                this.before_finish = true;
               //render the sign and complete button
             }
        }
    },

    //check if the index of this slides is for checkpoints or questions
    // if isquestion=0, check if it is fro checkpoint
    isInclude(isquestion,index)
    {
      let result = '';
      if(isquestion == 0)
      {
         result = this.courseData.checkpoints.filter(function(element){
          if(element.pos === (index+1)) return true;
        })
      }
      else
      {
         result = this.courseData.questions.filter(function(element){
          if(element.pos === (index+1)) return true;
        })
      }

      if(result.length > 0)
        return true;
      else
        return false;
    },
    toggleTimer(time, index) {

        if (this.isRunning) {
            //debugger
        } else {

           this.time = time;
           this.$refs.checkpoints[index].children[2].classList.add('v-btn--disabled');
           this.isRunning = true;
         //  document.getElementsByTagName('html')[0].style='overflow:hidden';
          self = this;
          //window.onscroll=function(){window.scrollTo(0, self.currpos); };
          this.interval = setInterval(this.decrementTime, 1000, index);
        }

    },
    decrementTime(index) {

        if(this.time>1)
          this.time = parseInt(this.time) - 1;
        else
        {
          if(this.interval)
             clearInterval(this.interval);

          if(this.$refs.checkpoints[index].children[2].classList.contains('v-btn--disabled'))
          {

              this.$refs.checkpoints[index].children[2].classList.remove('v-btn--disabled');
              this.$refs.checkpoints[index].children[1].innerHTML = "Please click 'check point' button";
             // this.$refs.checkpoints[index].children[1].innerHTML = "";
          }
          // this.$refs.checkpoints[index].children[1].addEventListener("click",this.click_checkpoint(index),false);
        }

    },
    async handleScroll(evt,el )
    {
      if(this.isadmin)
        return;
      this.text = "I love you";
      self  = this;
      let checkpoints = this.$refs.checkpoints;
      let questions = this.$refs.questions;
      let slides = this.$refs.images;

      if (!checkpoints) {
        return false
      }
      const scroll = window.scrollY || window.pageYOffset
      const viewport = {
          top:scroll,
          bottom:scroll + window.innerHeight
        }

      for (var index in slides) {

        const boundsTop = slides[index].$el.getBoundingClientRect().top + scroll-200 ;

        const bounds = {
          top: boundsTop,
          bottom: boundsTop + slides[index].$el.clientHeight+200
        }

        if(((window.innerHeight + window.scrollY) >= document.body.offsetHeight-50) && this.before_finish) {
           this.finished = true;
           await functionAPI.set_signedcourse(this.courseid);
        }
        if((bounds.bottom <=viewport.bottom) &&(bounds.top>= viewport.top))
          {

            if(this.slidepos !== index)
            {

              await functionAPI.add_slidehistory(this.courseid,index,true);
            }
            this.slidepos = index;

          }
        else if(this.slidepos === index)
        {
          await functionAPI.add_slidehistory(this.courseid,index,false);
          this.slidepos = -1;
        }

      }

      //checkpoint scroll check
      for (var index in checkpoints) {
        if(this.courseData.checkpoints[index].checkedtime)
          continue
        const boundsTop = checkpoints[index].children[2].getBoundingClientRect().top + scroll;

        const bounds = {
          top: boundsTop,
          bottom: boundsTop + checkpoints[index].children[2].clientHeight+50
        }

        if((bounds.bottom <=viewport.bottom) &&(bounds.top>= viewport.top))
          {
            if(this.ischeck == 0)
               continue;

            if(!this.courseData.checkpoints[index].checkedtime)
              {

                if(self.isscroll){self.currpos = window.scrollY ;self.isscroll= false}

                if(window.scrollY < self.currpos) {  window.onscroll=function(){};}
                else
                window.onscroll=function()
                {
                  if(window.scrollY < self.currpos)
                  {
                    self.isscroll = true;
                    window.scrollTo(0, window.scrollY);
                  }
                  else
                  {
                   window.scrollTo(0, self.currpos);
                  }
                 };

                this.toggleTimer(this.courseData.checkpoints[index].duration, index);

                  this.ischeck = 1;
                  break;
              }
            else
              {
                this.$refs.checkpoints[index].children[2].innerHTML = "Checked";

                 window.onscroll=function(){ };
                //this.$refs.checkpoints[index].children[1].innerHTML = "You checked this checkpoint";
              }
          }
          else{

           window.onscroll=function(){};
          }
        }

        //questions scroll check
      for ( index in questions) {

        if(this.ischeck == 1)
              return;

        if(!questions[index])
        {
          window.onscroll=function(){};
          continue
        }

        const boundsTop = questions[index].$el.getBoundingClientRect().top + scroll;

        const bounds = {
          top: boundsTop,
          bottom: boundsTop + questions[index].$el.clientHeight+50
        }


        if((bounds.bottom <=viewport.bottom) &&(bounds.top>= viewport.top))
          {

            if(this.courseData.questions[index].score )
            {

                window.onscroll=function(){};

            }
            else
            {

                this.ischeck = 0;
              if(this.isscroll )
              {
                self.currpos = window.scrollY
                this.isscroll = false;
                this.$toast.info('You should answer these questions'  )
                setTimeout(this.$toast.clear,2000);
              }

              this.questionpos = index;

              if(window.scrollY < self.currpos)
              {
                window.onscroll=function(){};
              }
              else
              {
                window.onscroll=function()
                {

                  if(window.scrollY < self.currpos)
                  {
                   // self.currpos = 0;

                    window.scrollTo(0, window.scrollY);
                  }
                  else
                  {
                   window.scrollTo(0, self.currpos);
                  }
                 };
              }

            }


          }
        else
        {
         // if(!this.courseData.questions[index].score )
          // {
             //self.currpos = window.scrollY
            // window.onscroll=function(){};
          // }

        }

      }
    }
  },

};
</script>

<style>
.question{
  min-height: 400px;
  background-color:white;
   padding-bottom:20px;
    color:black;

   margin-top:30px;

}
.question_text{
  background: white;
  height: 30px;

  text-align: center;

}
.btn_answer{
  background-color: rgb(3,155,229)!important;
  color:white!important;
}
.btn_checkpoint {
  position: absolute!important;
  top:0;
  left:0;
  right:0;
  border-radius: 20px;
  background-color: rgb(3,155,229)!important;
  color:white!important;
  bottom:0;
  margin:auto;
}
.checkpoint{
  height:400px;
  background-color: rgb(42,57,144);
  padding-top:5vh;
  position: relative;
  color:white;
}
.checktext{
  color: white;
  font-size: 24px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;

}

.radio_style{
  width:30px;
  height:30px;
  margin:auto;
}
.v-card__title{
  display: block;
  text-align: center;
}
.v-card__actions
{
  display: block;
}
.question_span_title
{
    width: 75%;
  background-color: white;
  font-weight: bold;
  text-align: left;
  float: left;
}
.question_radio_title
{

  min-width: 80px;
  font-weight: bold;
}
.question_divider{
   width:80%;
  display: inline-block;
  margin: auto;
margin-top:15px;
}
.v-dialog{
  box-shadow: 3px 3px 6px #7485da;
}
.divider{
  border-bottom:1px solid lightgrey;width:80%;height:1px;width:80%;
  margin:auto;
   margin-bottom:15px;
}

@media screen and (max-width: 800px) {
  .checkpoint{
    height: 300px;
    text-align: center;
  }
  .question{
    min-height: 80vh;
  }
  .question_span_title{
  width:100%;
  }
  .question_span{
    width:100%;
  }
  .checktext{
    font-size:14px
  }

}
</style>

