<template>
  <v-layout>
    <v-flex class="text-center">
      <v-container align="center">
        <v-form ref="form">
          <v-row justify="center">
            <v-col cols="12" md="6">
              <h1>Sign in</h1>
              <v-divider class="my-5"></v-divider>

              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                name="input-10-1"
                label="Normal with hint text"
                hint="At least 8 characters"
                counter
              ></v-text-field>

              <v-col cols="12" md="12">
                <v-btn @click="signin" color="success" class="mr-4">
                  Sign in
                </v-btn>
              </v-col>
              <v-divider class="my-5"></v-divider>
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
                <v-col cols="12" md="12">
                  <v-btn @click="signinWithPhone" color="success" class="mr-4">
                    Sign in with Phone
                  </v-btn>
                </v-col>
              </v-row>
              <v-checkbox v-model="checkbox" label="Remember me"></v-checkbox>
            </v-col>
          </v-row>
          <v-row cols="12">
            <div id="recaptcha-container"></div>
            <v-col cols="12" md="12">
              <v-btn @click="signin" color="success" class="mr-4">
                Sign in with Google
              </v-btn>
            </v-col>
            <v-col cols="12" md="12">
              <v-btn @click="signin" color="success" class="mr-4">
                Sign in with Microsoft
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-dialog v-model="dialog" max-width="600">
          <v-card>
            <v-card-title class="headline"
              >Enter Confirmation Code</v-card-title
            >

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="confirmationCode"
                      label="Confirmation Code*"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>

              <v-btn @click="dialog = false" color="green darken-1" text>
                Cancel
              </v-btn>

              <v-btn @click="confirmSMS" color="green darken-1" text>
                Send
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<style>
form {
  width: 100%;
}
</style>
<script>
import { auth, firebaseApp as firebase } from '@/services/fireinit.js'
import { countries } from '~/assets/countrycodes.js'

export default {
  data: () => ({
    checkbox: true,
    address: '',
    nationalNumber: '',
    show1: false,
    countryCode: [],
    items: countries,
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
    password: 'password',
    rules: {
      required: (value) => !!value || 'Required.',
      min: (v) => v.length >= 8 || 'Min 8 characters',
      emailMatch: () => "The email and password you entered don't match"
    },
    dialog: false,
    recaptchaVerifier: [],
    confirmationCode: '',
    confirmationResult: []
  }),

  created() {
    this.$axios
      .get('https://extreme-ip-lookup.com/json/')
      .then((res) => {
        this.items.map((item) => {
          if (item.iso2.toUpperCase() === res.data.countryCode)
            this.countryCode = item
        })
      })
      .catch((err) => {
        console.log(err)
      })
  },
  mounted() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container'
    )
  },
  methods: {
    signin() {
      if (this.$refs.form.validate()) {
        auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            this.$store.dispatch('signInWithEmail', user.user)
            this.$router.push('/')
          })
          .catch(function(error) {
            // Handle Errors here.
            const errorCode = error.code
            const errorMessage = error.message
            alert('oops' + errorMessage + errorCode)
          })
      }
    },
    signinWithPhone() {
      const applicationVerifier = this.recaptchaVerifier
      const phoneNumberString = this.countryCode.dialCode + this.nationalNumber // this.countryCode.dialCode + this.nationalNumber
      this.$axios
        .post(
          'https://us-central1-tr-staging-8964c.cloudfunctions.net/api/user/getUserWithPhone',
          {
            phoneNumber: phoneNumberString
          }
        )
        .then((res) => {
          const resData = res.data
          if (resData.status !== 1) {
            alert('User not exist signup first')
            this.$router.push('/signup')
            console.log(resData)
          }
        })
      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumberString, applicationVerifier)
        .then((confirmationResult) => {
          console.log(confirmationResult)
          this.dialog = true
          this.confirmationResult = confirmationResult
          this.recaptchaVerifier.clear()
        })
        .catch(function(error) {
          console.error('SMS not sent', error)
        })
    },
    confirmSMS() {
      this.dialog = false
      this.confirmationResult
        .confirm(this.confirmationCode)
        .then((result) => {
          this.$router.push('/')
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  }
}
</script>
