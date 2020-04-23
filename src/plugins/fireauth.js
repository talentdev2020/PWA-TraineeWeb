import Vue from 'vue'
import VueObserveVisibility from 'vue-observe-visibility'
import { auth, CloudStore } from '@/services/fireinit.js'
Vue.use(VueObserveVisibility)

export default (context) => {
  const { store } = context
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      store.commit('setUser', user)
      if (user === null) {
        resolve()
        return
      }
      const data = (
        await CloudStore.collection('userdetails')
          .doc(user.uid)
          .get()
      ).data()
      store.commit('setUserDetails', data)
      resolve()
    })
  })
}
