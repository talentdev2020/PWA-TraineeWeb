<template>
  <v-row class="justify-center">
    <v-card ref="card" width="1200px">
      <v-card-title
        :class="themeColor + ' headline'"
        class="sticky_title d-flex"
      >
        <v-spacer></v-spacer>
        <v-btn @click="loadmore()" :disabled="!isLoadable">Load More</v-btn>
      </v-card-title>
      <v-card-text class="pt-10">
        <v-form fluid>
          <v-container>
            <v-row justify="center">
              <v-col cols="12">
                <v-select
                  v-model="selectedLanguage"
                  :items="languages"
                  menu-props="auto"
                  label="Select"
                  hide-details
                  prepend-icon="hearing"
                  single-line
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-if="questions.length" justify="center">
              <v-col cols="12" md="9">
                <iframe :src="dataURL" width="100%" height="600px" />
                <v-card
                  ref="questions"
                  v-for="i in previewCount"
                  :key="i"
                  class="mb-5 pa-5 align-center d-flex lime lighten-2"
                  elevation="12 - 1"
                  min-height="400px"
                >
                  <v-card-text
                    v-if="questions[i - 1].type === 'question'"
                    class="text-center display-1"
                  >
                    <p class="text-uppercase font-weight-bold  text--info">
                      <v-icon>question_answer</v-icon> Question
                      {{ questions[i - 1].pos }}
                    </p>
                    <p class="headline font-italic font-weight-light">
                      Question:
                      {{ questions[i - 1].text.original }}
                    </p>
                    <p class="title">
                      Answers Required:
                      {{ questions[i - 1].answersrequired }}
                    </p>
                    <v-radio-group
                      v-if="!questions[i - 1].multiplechoice"
                      v-model="questions[i - 1].answerReply"
                      column
                    >
                      <v-row
                        v-for="(item, index) in questions[i - 1].answers"
                        :key="index"
                        class="py-1"
                      >
                        <v-radio
                          :label="item.anstext.original"
                          :value="index"
                          :disabled="questions[i - 1].score === 1"
                        ></v-radio>
                      </v-row>
                    </v-radio-group>
                    <v-container v-else column>
                      <div
                        v-for="(item, index) in questions[i - 1].answers"
                        :key="index"
                      >
                        <v-checkbox
                          v-model="questions[i - 1].answerReply"
                          :label="item.anstext.original"
                          :value="index"
                          :disabled="questions[i - 1].score === 1"
                          hide-details
                        ></v-checkbox>
                      </div>
                    </v-container>
                    <v-btn
                      v-if="questions[i - 1].score !== 1"
                      @click="clickAnswer(i - 1)"
                      >Check</v-btn
                    >
                    <p v-else class="title">
                      You answered the question correctly
                    </p>
                  </v-card-text>
                  <v-card-text v-else class="text-center display-1">
                    <p v-if="questions[i - 1].isSigned">
                      You are signed this course at
                      {{ questions[i - 1].signeddate }}
                    </p>
                    <div v-else>
                      You can now signoff
                      <v-btn @click="signOffCourse(i - 1)">Sign off</v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-row>
</template>
<style>
.v-card__title.sticky_title {
  position: sticky;
  top: 4rem;
  z-index: 10;
}
</style>
<script>
import JsPDF from 'jspdf'
import domtoimage from 'dom-to-image'
import { Storage, CloudStore } from '@/services/fireinit.js'
export default {
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css?family=Comfortaa:400,700&display=swap',
          crossorigin: 'anonymous'
        }
      ]
    }
  },
  data() {
    return {
      courseData: {},
      // Global Properties
      isTrigger: false,
      themeColor: 'purple white--text',
      languages: ['original'],
      selectedLanguage: 'original',
      slides: [],
      dataURL: '',
      questions: [],
      loadPoints: [],
      isLoadable: true,
      previewCount: 5,
      busy: false,
      language: 'original',
      currentCourseRef: {}
    }
  },
  computed: {
    // Computed properties from Vuex
    user() {
      return this.$store.getters.activeUser
    },
    token() {
      return this.$store.getters.getToken
    },
    userdetails() {
      return this.$store.getters.getUserDetails
    },
    teams() {
      return this.$store.getters.getTeams
    },
    admins() {
      return this.userdetails.teamsadminlist
    },
    trainees() {
      return this.userdetails.teamslist
    },
    templatesList() {
      return this.$store.getters.getCourseTemplates
    },
    coursesList() {
      return this.$store.getters.getCourses
    },
    courseid() {
      return this.$store.state.courseid
    }
  },
  async created() {
    setInterval(() => {
      this.isTrigger = !this.isTrigger
    }, 200)
    const data = (
      await CloudStore.collection('userdetails')
        .doc(this.user.uid)
        .get()
    ).data()
    this.$store.commit('setUserDetails', data)
    this.courseData = JSON.parse(
      JSON.stringify(this.userdetails.courses[this.courseid])
    )
    this.currentCourseRef = CloudStore.collection('course').doc(this.courseid)
    this.initCourse()
  },
  methods: {
    visibilityChanged(isVisible, entry, index) {
      if (isVisible && this.slides[index].checkedtime === undefined) {
        console.log(index, isVisible)
        const interval = setInterval(() => {
          this.slides[index].duration--
          if (this.slides[index].duration < 1) {
            clearInterval(interval)
            this.slides[index].isCheckable = true
          }
        }, 1000)
      }
    },
    clickAnswer(index) {
      const question = this.questions[index]
      let score = 0
      const answeredArray = new Array(question.answers.length)
      answeredArray.fill(false, 0)
      // Check question type is radio or checkpoint
      if (!question.multiplechoice) {
        // Select at least one question
        if (typeof question.answerReply !== 'number') return
        score = question.answers[question.answerReply].correct ? 1 : 0
        answeredArray[question.answerReply] = true
      } else {
        // Select at least one question
        if (!question.answerReply.length) return
        let count = 0
        // Count correct answers
        question.answers.forEach((e, i) => {
          if (e.correct && question.answerReply.includes(i)) count++
        })
        // Build answered array
        question.answerReply.forEach((e) => {
          answeredArray[e] = true
        })
        score = count / question.answersrequired
        if (score > 1) score = 1
      }
      if (score !== 1) {
        this.$toast.error('You answered incorrectly')
        this.updateQuestionHistory(question.qpos, answeredArray, score)
        return
      }
      this.isLoadable = true
      this.updateQuestionCorrect(question.qpos, answeredArray, score)
      this.$set(this.questions[index], 'score', 1)
    },
    updateQuestionCorrect(qpos, answers, score) {
      const quesData = this.userdetails.courses[this.courseid].questions
      quesData[qpos].answered = answers
      quesData[qpos].score = score
      this.currentCourseRef.update({ questions: quesData })
    },
    updateQuestionHistory(qpos, answers, score) {
      const quesData = this.userdetails.courses[this.courseid].questions
      quesData[qpos].history = quesData[qpos].history || []
      quesData[qpos].history.push({
        answers,
        pass: false,
        time: new Date(),
        score
      })
      this.currentCourseRef.update({ questions: quesData })
    },
    async initCourse() {
      const courseData = this.courseData
      this.questions = []
      this.previewCount = 0
      this.dataURL = courseData.downloadurl
      courseData.questions.forEach((item, id) => {
        item.qpos = id
        item.type = 'question'
        this.$set(item, 'answerReply', [])
        if (item.score === 1) {
          // answered correctly
          if (!item.multiplechoice)
            item.answerReply = item.answers.findIndex((val) => val.correct)
          else
            item.answerReply = item.answers.reduce((arr, e, i) => {
              if (e.correct) arr.push(i)
              return arr
            }, [])
        }
        this.questions.push(item)
      })
      this.questions.push({
        type: 'signoff',
        isSigned: !!courseData.signeddate,
        signeddate: courseData.signeddate
      })
      for (let i = 0; i < this.questions.length; i++) {
        const type = this.questions[i].type
        if (type === 'question' && this.questions[i].score === 1) continue
        this.loadPoints.push({ pos: i + 1, type })
      }
      this.$nextTick(() => {
        this.previewCount = this.questions.length
        this.setPreviewCount()
      })
    },
    async signOffCourse(index) {
      const date = new Date()
      this.$set(this.questions[index], 'isSigned', true)
      this.$set(this.questions[index], 'signeddate', date)
      this.isLoadable = false
      this.currentCourseRef.update({ signeddate: date })
      this.$nuxt.$loading.start()
      const doc = new JsPDF('l', 'pt', [720, 400])
      const width = doc.internal.pageSize.getWidth()
      const height = doc.internal.pageSize.getHeight()
      const quesArray = []
      for (const item of this.$refs.questions) {
        quesArray.push(domtoimage.toPng(item.$el))
      }
      const quesImgs = await Promise.all(quesArray)
      let quesIndex = 0
      doc.text('Course Title: ' + this.courseData.title.original, 100, 100)
      doc.text('Trainee: ' + this.userdetails.name, 100, 150)
      for (const item of this.questions) {
        doc.addPage()
        if (item.type === 'question') {
          doc.addImage(quesImgs[quesIndex++], 0, 0, width, height)
          continue
        }
        if (item.type === 'signoff') {
          doc.setFillColor('#80deea')
          doc.rect(0, 0, width, height, 'F')
          doc.text('Signed at ' + item.signeddate, 100, 150)
          continue
        }
        const img = new Image()
        img.src = item.url
        img.setAttribute('crossOrigin', 'anonymous')
        doc.addImage(img, 0, 0)
      }
      const storageRef = Storage.ref(
        this.courseid + '/' + this.courseid + '_course.pdf'
      ).put(doc.output('blob'))
      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        (error) => {
          console.log(error.message)
        },
        () => {
          this.$nuxt.$loading.finish()
          this.$toast.success('Upload Course pdf finished')
        }
      )
      const img = new Image()
      img.src = require('~/assets/certificate.png')
      img.onload = () => {
        const docCert = new JsPDF('l', 'pt', [img.width, img.height])
        docCert.addImage(img, 0, 0, img.width, img.height)
        docCert.setFontSize(24)
        docCert.text(this.userdetails.name, 350, 280)
        docCert.text('Title: ' + this.courseData.title.original, 240, 400)
        docCert.text(new Date().toLocaleString(), 260, 500)
        const certRef = Storage.ref(
          this.courseid + '/' + this.courseid + '_certification.pdf'
        ).put(docCert.output('blob'))
        certRef.on(
          `state_changed`,
          (snapshot) => {
            this.progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          },
          (error) => {
            console.log(error.message)
          },
          () => {
            this.$toast.success('Upload certification pdf finished')
          }
        )
      }
    },
    loadmore() {
      this.previewCount += 5
      this.setPreviewCount()
      if (this.previewCount > this.questions.length)
        this.previewCount = this.questions.length
      this.busy = false
    },
    load(item) {
      if (item === undefined) return
      this.loading['item' + item.id] = false
      item.loading = false
    },
    setPreviewCount() {
      if (!this.loadPoints.length) return
      if (this.previewCount > this.loadPoints[0].pos) {
        this.previewCount = this.loadPoints[0].pos
        this.loadPoints.shift()
      }
      const data = this.questions[this.previewCount - 1]
      if (data.type === 'question' && data.score !== 1) this.isLoadable = false
    },
    scroll(event) {
      console.log('log', event.target)
      const height = event.target.getBoundingClientRect().height
      if (event.target.scrollTop + height + 20 > event.target.scrollHeight)
        setTimeout(this.loadmore(), 1000)
    }
  }
}
</script>
