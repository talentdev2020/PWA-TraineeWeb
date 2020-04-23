import { CloudStore } from '@/services/fireinit.js'
export default async function({ store, redirect, route }) {
  const path = route.path.substring(1)
  if (store.state.user === null) {
    console.log('logged out')
    if (path !== 'signin') return redirect('/signin')
  } else {
    if (path === 'signin') return redirect('/')
    else if (parseInt(path)) {
      const code = await CloudStore.collection('accesscodes')
        .doc(path)
        .get()
      if (!code.exists) return redirect('/')
      const data = code.data()
      const userdetails = store.state.userdetails
      // Check code type
      if (data.type === 'course') {
        if (!userdetails.courselist.includes(data.courseid))
          return redirect('/')
        else {
          store.commit('setCourseid', data.courseid)
          console.log(store.state.courseid)
          return redirect('/course')
        }
      } else if (data.type === 'template') {
        store.commit('setTemplateCode', {
          template: data.templateid,
          team: data.teamid
        })
        return redirect('/signup')
      }
    }
    // 1718385 1013591 263948
    console.log('logged in')
  }
  /*
  if (store.state.user === null && path === 'course') return redirect('/signin')
  if (
    store.state.user === null &&
    route.name !== 'signin' &&
    route.name !== 'signup'
  )
    return redirect('/signin')
    */
}
