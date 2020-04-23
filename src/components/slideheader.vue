<template slot>

  <div class='fixed div_content'>
    <div style="margin-top:15px;margin-right:20px; float:left">
      <a @click="back">
          <img src="../static/noun_door knob_2122694.png" class="image_middle " />
      </a>

      {{title}}
    </div>
    <div style="float:right" >
       <speech
           :text='text'
           :lang='selectedlang'
           rate=1
        />
      <v-select
            label=""
                  v-bind:items="languages"
                  v-model="lang"
                  item-text="text"
                  item-value="shortCode"
                  max-height="auto"
                  autocomplete
                  v-on:change="changeLanguage()"
      >

            <template slot="selection" slot-scope="data">
              <template v-if="typeof data.item !== 'object'">
                <span v-text="data.item"> </span>
              </template>
              <template v-else>
                  <span v-html="data.item.shortCode"></span>
              </template>
            </template>
            <template slot="item" slot-scope="data">
              <template v-if="typeof data.item !== 'object'">
                <span v-text="data.item"> </span>
              </template>
              <template v-else>
                  <span v-html="data.item.text" style="font-size:12px;padding-left:20px"></span>
              </template>
            </template>

        </v-select>

    </div>


    </div>

</template>

<script>
import { functionAPI } from '~/plugins/functions';
 import speech from '~/components/speech.vue'

export default {
  props:['text','titles'],
  data(){
    return{
      title:"Course1",
      lang:{ shortCode: 'en', text: 'English (en) original'  },
      selectedlang:'original',
      course:null,
      languages: [ { header: 'Available:'},
     ]
  }
  },
 components: {

   speech:speech
  },
	computed: {
    courseid(){
        return this.$store.state.courseid
      },
    userid(){
        return this.$store.state.userid
      },
		},

  methods:{
   async back()
    {
       await this.$store.dispatch('setcode',{code:null});
       this.$router.push("/");
    },
   async changeLanguage(){
     let is_get = -1;
     for (var i in this.titles) {
       if((i == this.lang)||('en' == this.lang))
        is_get = 0;
     }
     if(is_get ==0)
     {
        this.selectedlang = this.lang;
        if(this.selectedlang =='en')
          this.selectedlang = 'original'

        this.title = this.titles[this.selectedlang];
        await this.$store.dispatch('setlanguage',{language:this.selectedlang});
     }
     else
     {

       alert("We are working on translating to "+ this.lang)
       for(let i = 0 ; i < this.languages.length; i ++)
       {
         if(this.languages[i].shortCode === this.lang)
          this.languages[i].text = this.languages[i].text + '  (in progress)';
       }
       this.lang = this.selectedlang;
       let course = await functionAPI.get_course(this.courseid);
       let templateid = course.templateid;
       functionAPI.request_lang(templateid, this.userid, this.lang);
     }
    }
  },
 async created() {

   let titles=  this.titles;
   this.title = titles[this.selectedlang];
   for (var i in titles) {
     let lang = i
     if(i =='original')
      lang = 'en'
     this.languages.push({shortCode:lang,text:'Language ('+i+')'});
   }
   this.languages.push({ divider: true })
   this.languages.push({ header: 'Get:'})
   let lang_codes = ['af','sq','am','ar','hy','az','eu','be','bn','bs','bg','ca','ceb','ny','zh-CN','zh-TW','co','hr','cs','da','nl','en','eo','et','tl','fi','fr','fy','gl','ka','de','el','gu','ht','ha','haw','iw','hi','hmn','hu','is','ig','id','ga','it','ja','jw','kn','kk','km','ko','ku','ky','lo','la','lv','lt','lb','mk','mg','ms','ml','mt','mi','mr','mn','my','ne','no','ps','fa','pl','pt','ma','ro','ru','sm','gd','sr','st','sn','sd','si','sk','sl','so','es','su','sw','sv','tg','ta','te','th','tr','uk','ur','uz','vi','cy','xh','yi','yo','zu'];
   let lang_names = ['Afrikaans','Albanian','Amharic','Arabic','Armenian','Azeerbaijani','Basque','Belarusian','Bengali','Bosnian','Bulgarian','Catalan','Cebuano','Chichewa','Chinese (Simplified)','Chinese (Traditional)','Corsican','Croatian','Czech','Danish','Dutch','English','Esperanto','Estonian','Filipino','Finnish','French','Frisian','Galician','Georgian','German','Greek','Gujarati','Haitian Creole','Hausa','Hawaiian','Hebrew','Hindi','Hmong','Hungarian','Icelandic','Igbo','Indonesian','Irish','Italian','Japanese','Javanese','Kannada','Kazakh','Khmer','Korean','Kurdish','Kyrgyz','Lao','Latin','Latvian','Lithuanian','Luxembourgish','Macedonian','Malagasy','Malay','Malayalam','Maltese','Maori','Marathi','Mongolian','Burmese','Nepali','Norwegian','Pashto','Persian','Polish','Portuguese','Punjabi','Romanian','Russian','Samoan','Scots Gaelic','Serbian','Sesotho','Shona','Sindhi','Sinhala','Slovak','Slovenian','Somali','Spanish','Sundanese','Swahili','Swedish','Tajik','Tamil','Telugu','Thai','Turkish','Ukrainian','Urdu','Uzbek','Vietnamese','Welsh','Xhosa','Yiddish','Yoruba','Zulu'];

   for(let i =0; i < lang_codes.length; i ++)
   {
    this.languages.push({ shortCode: lang_codes[i], text: lang_names[i]})
   }
   //this.languages.push({ shortCode: 'af', text: 'Afrikaans (af)'})
   //this.languages.push({ shortCode: 'sq', text: 'Albanian (shqiptar) (sq)'})
   this.languages.push({ shortCode: 'scroll', text: 'Scroll for rest of Google translate languages'})
   this.languages.push({ shortCode: 'language', text: 'languages'})



 }
};
</script>

<style>

.fixed{
  position: fixed;
  top:0px;
  z-index: 1;
  margin-top:0px;
  background-color:white;


  box-shadow: 0px 3px 2px #dedede;
}
.v-select{
  width:95px;
  margin-right:20px;
  display: inline-flex!important;
}
</style>

