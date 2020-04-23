<template slot>

   <v-app class='div_content course-header' >
    <Slide  v-if='type=="slides"' :isadmin='isadmin' />
    <Slide  v-if='type=="docs"'  />
    <Video v-if='type=="videos"' />
    <Slide  v-if='type=="words"' />
    <PDF  v-if='type=="pdfs"'/>
   </v-app>
</template>

<script>
import { functionAPI } from '~/plugins/functions';
 import speech from '~/components/speech.vue'
import slide from '~/components/slide.vue'
import pdf from '~/components/pdf.vue'
import video from '~/components/video.vue'


export default {
  data(){
    return{
         type:'slides',
         isadmin:false

    }
  },
 components: {
   Slide:slide,PDF:pdf, Video:video

  },
	computed: {
     courseid(){
        return this.$store.state.courseid
      },
		},

  methods:{

    changeLanguage(){
      this.selectedlang = this.lang;
      if(this.lang ==='en')
        this.selectedlang = 'original'
    }
  },

 async mounted() {
    if(this.$router.history.current.query.admin=='true')
      this.isadmin = true;

    let course = await functionAPI.get_course(this.courseid);
     let courseData = course.courseData;
    this.type = course.type;

  }
};
</script>

<style>
.question .question_span{
  margin-top:0px;
}
.fixed{

  top:0px;

  z-index: 1;

  background-color:#fafafa;


}

</style>

