<template>
  <div
    class="scrolling-document"
    v-scroll.immediate="updateScrollBounds"
    >
    <ScrollingPage
      v-for="page  in pages"
      :key="page.pageNumber"
      v-bind="{page, clientHeight, scrollTop, focusedPage, enablePageJump}"
      v-slot="{isPageFocused, isElementFocused}"
      @page-jump="onPageJump"
      >
      <div
        class="scrolling-page"
        >
        <slot v-bind="{page, isPageFocused, isElementFocused}"></slot>

        <div class="question" v-if="page.pageNumber === pageCount" ref='questions' style="padding-left:20px">
          <v-card v-for='(question,index) in questions ' :key="index">
            <h1>Question{{index+1}}</h1>
            <h3>{{questions.text[lang]}}</h3>

            <v-switch label='Multiple choice?' :disabled='disabled'  :true-value='question.multiplechoice'>
            </v-switch>
            <div style="margin:auto; " v-if='!question.multiplechoice'>
              <div style="height:35px; ">
                <span class="question_span" style='background-color: unset;'> Answer text </span>
                <span class="question_radio"> Correct ?    </span>
              </div>
              <div v-for='(answer,i) in question.answers' v-bind:key='i' style="height:35px;">
                <span class="question_span"> {{answer.anstext[lang]}} </span>
                <span class="question_radio"><input type='radio' :value='i' name='s'    :id='"question"+index+"_"+i' style="width:30px;height:30px;cursor:pointer">    </span>
              </div>

            </div>
           <div style="margin:auto; " v-else >
              <div style="height:35px; ">
                <span class="question_span" style="background-color: unset;"> Answer text </span>
                <span class="question_radio"> Correct ?    </span>
              </div>
              <div v-for='(answer,i) in question.answers' v-bind:key='i' style="height:35px;">
                <span class="question_span"><input type="text" :value='answer.anstext[lang]' disabled  class="question_text"></span>
                <span class="question_radio"><v-checkbox    :id='"question"+index+"_"+i'  style="width:30px;height:30px;cursor:pointer"></v-checkbox  ></span>
              </div>
            </div>


            <div style="text-align:center" v-if ='question.answersrequired==0'>
              <div style="line-height:unset;display:inline-block" :id='"answer"+index'></div>
                <h3 style="text-align:center;line-height:unset"  > You answered this questions   </h3>

            </div>
            <div style="text-align:center;margin-top:20px" v-else>
              <div style="line-height:unset;display:inline-block" :id='"answer_"+index'> </div>
              <h3 style="text-align:center;line-height:unset ;display: inline-block"    >Required Correct answers?   {{question.answersrequired}}</h3>
              <v-btn  v-on:click='clicked_answer(index)' :id='"btn_answer"+index' class='btn_answer'>Check</v-btn>
            </div>
          </v-card>

        </div>
      </div>

    </ScrollingPage>

    <div v-visible="fetchPages" class="observer"></div>

  </div>
</template>

<script>
import scroll from '../../directives/scroll';
import visible from '../../directives/visible';

import ScrollingPage from './ScrollingPage';
import { functionAPI } from '~/plugins/functions';
export default {
  components: {
    ScrollingPage,
  },

  directives: {
    visible,
    scroll,
  },

  props: {
    pageCount:{
      required:true
    },
    pages: {
      required: true,
    },
    enablePageJump: {
      type: Boolean,
      default: false,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    isParentVisible: {
      default: true,
    },
    number:{
      type:Number,
      default:1
    }
  },

  data() {
    return {
      focusedPage: undefined,
      scrollTop: 0,
      clientHeight: 0,
      questions:null,

    };
  },

  computed: {
    pagesLength() {
      return this.pages.length;
    },
    courseid(){
        return this.$store.state.courseid
      }
  },
  mounted(){

  },
  async created(){
    if(!this.courseid)
    {
      alert("there is no courseid, please login again");
       this.push("/login")
    }

     let course = await functionAPI.get_course(this.courseid);

     this.questions = course.courseData.questions;

  },
  methods: {
    fetchPages(currentPage) {
      this.$emit('pages-fetch', currentPage);
    },

    onPageJump(scrollTop) {
      this.$emit('page-jump', scrollTop);
    },

    updateScrollBounds() {
      const {scrollTop, clientHeight} = this.$el;
      this.scrollTop = scrollTop;
      this.clientHeight = clientHeight;
    },
  },

  watch: {
    isParentVisible: 'updateScrollBounds',

    pagesLength(count, oldCount) {
      if (oldCount === 0) this.$emit('pages-reset');

      // Set focusedPage after new pages are mounted
      this.$nextTick(() => {
        this.focusedPage = this.currentPage;
      });
    },

    currentPage(currentPage) {
      if (currentPage > this.pages.length) {
        this.fetchPages(currentPage);
      } else {
        this.focusedPage = currentPage;
      }
    },
  },
}
</script>
