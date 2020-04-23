// import createPersistedState from 'vuex-persistedstate'
// import Cookies from 'js-cookie'
// export default async ({ app, router, store, Vue }) => {
//   const cookies = process.env.SERVER
//     ? Cookies.parseSSR(ssrContext)
//     : Cookies

//   createPersistedState({

//       storage: {
//         getItem: key => JSON.stringify(cookies.get(key)),
//         setItem: (key, value) => cookies.set(key, value),
//         removeItem: key => cookies.remove(key)
//       }
//   })(store)
// }
