<template>
  <v-layout>
    <v-flex class="text-center">
      <v-container v-if="!isWaiting" align="center" fluid>
        <v-form ref="form" fluid>
          <v-row justify="center">
            <v-col cols="12" md="6">
              <h1>Your Details</h1>
              <v-text-field
                v-model="fname"
                :rules="nameRules"
                label="Family Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="gname"
                :rules="nameRules"
                label="Given Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>

              <v-text-field
                v-model="emailconfirm"
                :rules="emailConfirmationRules"
                label="Confirm Email"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                name="input-10-1"
                label="Password"
                hint="At least 8 characters"
                counter
              ></v-text-field>

              <v-text-field
                v-model="teamname"
                :rules="nameRules"
                label="Team/Org Name"
                required
              ></v-text-field>

              <v-menu
                v-model="birthMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="computedDateFormatted"
                    @blur="birthday = parseDate(dateFormatted)"
                    v-on="on"
                    label="Date of Birth"
                    readonly
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="birthday"
                  @input="birthMenu = false"
                  no-title
                ></v-date-picker>
              </v-menu>
              <v-row>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="countryCode"
                    :items="items"
                    item-text="name"
                    item-value="iso2"
                    label="Country Code"
                    return-object
                    single-line
                    md="6"
                  >
                    <template slot="item" slot-scope="data">
                      <v-list-item-icon>
                        <div :class="['vti__flag', data.item.iso2]" />
                      </v-list-item-icon>
                      <v-list-item-title>{{
                        data.item.name
                      }}</v-list-item-title>
                    </template>
                    <template slot="selection" slot-scope="data">
                      <div :class="['vti__flag', data.item.iso2]" />
                      <v-list-item-title class="ml-4">
                        {{ data.item.dialCode }}
                      </v-list-item-title>
                    </template>
                  </v-select>
                </v-col>
                <v-col md="8">
                  <v-text-field
                    v-model="nationalNumber"
                    label="Mobile/Cell"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col md="6">
              <h1>Billing Details</h1>
              <v-text-field
                v-model="organization"
                :rules="requireRules"
                label="Organization"
                required
              ></v-text-field>

              <v-text-field
                v-model="address"
                :rules="requireRules"
                label="Address"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-btn @click="signup" color="success" class="mr-4">
            Sign up
          </v-btn>
        </v-form>
      </v-container>
      <p v-else>Please wait while assigning course...</p>
    </v-flex>
  </v-layout>
</template>
<style>
form {
  width: 100%;
}
</style>
<script>
import { countries } from '~/assets/countrycodes.js'
import { CloudStore } from '@/services/fireinit.js'
export default {
  middleware({ store, redirect, route }) {
    // If the user is not authenticated
    if (store.state.templatecode.team === undefined) return redirect('/')
  },
  data: (vm) => ({
    name: '',
    fname: '',
    gname: '',
    teamname: '',
    birthday: '',
    dateFormatted: '',
    organization: '',
    address: '',
    nationalNumber: '',
    countryCode: [],
    items: countries,
    show1: false,
    birthMenu: false,
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    emailconfirm: '',
    password: '',
    rules: {
      required: (value) => !!value || 'Required.',
      min: (v) => v.length >= 8 || 'Min 8 characters'
    },

    requireRules: [(v) => !!v || 'Field is required'],
    isWaiting: true
  }),
  computed: {
    // Computed properties from Vuex
    user() {
      return this.$store.getters.activeUser
    },
    emailConfirmationRules() {
      return [
        () => this.email === this.emailconfirm || 'E-mail must match',
        (v) => !!v || 'Confirmation E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ]
    },
    computedDateFormatted() {
      return this.formatDate(this.birthday)
    }
  },
  watch: {
    birthDay(val) {
      this.dateFormatted = this.formatDate(this.birthday)
    }
  },
  async created() {
    console.log('middleware', this.$store.state.templatecode)
    const templateId = this.$store.state.templatecode.template
    const teamId = this.$store.state.templatecode.team
    let doc = await CloudStore.collection('coursetemplates')
      .doc(templateId)
      .get()
    const templateData = doc.data()
    if (this.user) {
      console.log(this.$store.state.userdetails)
      const teamslist = this.$store.state.userdetails.teamslist || []
      if (teamslist.includes(teamId)) {
        doc = await CloudStore.collection('teams')
          .doc(teamId)
          .get()
        const teamData = doc.data()
        const val = {}
        const now = Date.now().toString()
        const key = 'assignreq.' + this.user.uid + '.' + now
        val[key] = {
          teamid: teamId,
          reqby: this.user.uid,
          status: 'Requested',
          duedate: new Date(),
          AdminId: Object.keys(teamData.admins)
        }
        CloudStore.collection('coursetemplates')
          .doc(templateId)
          .update(val)
        CloudStore.collection('coursetemplates')
          .doc(templateId)
          .onSnapshot((doc) => {
            const docData = doc.data()
            const reqObj = docData.assignreq[this.user.uid][now]
            if (reqObj.status === 'Done') {
              CloudStore.collection('userdetails')
                .doc(this.user.uid)
                .onSnapshot((udoc) => {
                  const uData = udoc.data()
                  if (uData.courses[reqObj.courseid] !== undefined) {
                    this.$store.commit('setCourseid', reqObj.courseid)
                    this.$router.push('/course')
                  }
                })
            }
          })
        console.log(val)
      } else if (templateData.courseData.guestaccess) {
        console.log('sdf')
      } else this.$router.push('/')
      console.log('middleware', teamslist.includes(teamId))
    } else {
      this.isWaiting = false
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    async signup() {
      if (this.$refs.form.validate()) {
        const phoneNumber = this.countryCode.dialCode + this.nationalNumber
        const res = await this.$axios.get(
          'http://apilayer.net/api/validate?access_key=f59c1eae37095feab5e4978e83731cb7&number=' +
            phoneNumber
        )
        if (!res.data.valid) {
          this.$toast.error('Phone number is not valid')
          return
        }
        this.$axios
          .post(
            'https://europe-west2-tr-staging-8964c.cloudfunctions.net/api/user/register',
            {
              email: this.email,
              password: this.password,
              firstName: this.fname,
              lastName: this.gname,
              teamName: this.teamname,
              organisation: this.organization,
              address: this.address,
              DOB: this.computedDateFormatted,
              phoneNumber
            }
          )
          .then((res) => {
            const resData = res.data
            if (resData.status === 1) {
              this.$router.push('/signin')
              console.log(resData)
            } else {
              this.$toast.error(resData.error.code + resData.error.message)
            }
          })
      }
    }
  }
}
</script>
