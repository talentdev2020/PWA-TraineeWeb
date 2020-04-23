import jcookies from 'js-cookie'


export const state = () => ({
  authenticated: null,
  userid:null,
  accesscode:null,
  email:null,
  dataurl:null,
  dataurls:[],
  teamlist:[],
  courselist:null,
  name:null,
  courseid:null,
  phone:null,
  language:'original'
})
export const mutations = {
  SET_USER (state, user) {
    state.userid = user
  },
  SET_DATAURL (state, url) {
    state.dataurl = url
  },
  SET_DATAURLS (state, urls) {
    let item = state.dataurls.filter(item=>item.courseid == urls.courseid)
    if(item.length ==0)
      state.dataurls.push(urls)

  },
  SET_TEAMLIST (state, teamlist) {
    state.teamlist = teamlist
  },
  SET_COURSELIST (state, courselist) {
    state.courselist = courselist
  },

  SET_PHONE (state, phone) {
    state.phone = phone
  },
  SET_AUTH (state, auth) {
    state.authenticated = auth
  },
  SET_CODE (state, code) {
    state.accesscode = code
  },
  SET_EMAIL (state, email) {
    state.email = email
  },
  SET_NAME (state, name) {
    state.name = name
  },
  SET_COURSEID (state, courseid) {

    state.courseid = courseid
  },
  SET_LANGUAGE (state, language) {
    state.language = language
  }

}


export const actions = {
 //nuxtServerInit is called by Nuxt.js before server-rendering every page

//  nuxtServerInit({ commit }, { req }) {
//   let authenticated = null
//   let email = null
//   let name = null
//   let accesscode = null
//   let userid = null
//   let courseid = null
//   let cookie = null;
//   if(req) {
//     console.log("init s");
//     if (req.headers && req.headers.cookie) {


//         cookie =req.headers.cookie.split(";")[0].split("=")[1];
//     }
//   }


//   if(cookie){
//       cookie = cookie.split('%22').join('"');
//       cookie = cookie.split('%2C').join(',');

//        let data  = JSON.parse(cookie);

//       try {
//         authenticated = data.authenticated;
//         userid = data.userid;
//         email = data.email;
//         name = data.name;
//         courseid = data.courseid
//         accesscode = data.accesscode;
//       } catch (err) {
//         // No valid cookie found
//       }
//     }



//   commit('SET_AUTH', authenticated)
//   commit('SET_USER', userid)
//   commit('SET_NAME', name)
//   commit('SET_EMAIL', email)
//   commit('SET_CODE', accesscode)
//   commit('SET_COURSEID', courseid)

// },
  setcourseid ({ commit }, { courseid }) {
        try {

        commit('SET_COURSEID', courseid)

        let cookie = jcookies.get('__session');
        let data  = JSON.parse(cookie);
        data.courseid = courseid;
        jcookies.set("__session", data);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            throw new Error('Bad credentials')
          }
          throw error
        }
      },
  login ({ commit }, { user,auth }) {
    try {

      commit('SET_USER', user)
      commit('SET_AUTH', auth)

    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  setemail ({ commit }, { email }) {
    try {
      commit('SET_EMAIL', email)

    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  setdataurl ({ commit }, { url }) {
    try {

      commit('SET_DATAURL', url)

    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  setcourselist ({ commit }, { courselist }) {
    try {

      commit('SET_COURSELIST', courselist)

    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  setteamlist ({ commit }, { teamlist }) {
    try {

      commit('SET_TEAMLIST', teamlist)

    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  setdataurls ({ commit }, { urls }) {
    try {

      commit('SET_DATAURLS', urls)

    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  setphone ({ commit }, { phone }) {
    try {
      commit('SET_PHONE', phone)

    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  setlanguage ({ commit }, { language }) {
    try {
      commit('SET_LANGUAGE', language)

    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  setname ({ commit }, { name }) {
    try {
      commit('SET_NAME', name)

    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  async setcode ({ commit }, { code }) {
    try {
      commit('SET_CODE', code)


    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  logout ({ commit }) {

    commit('SET_USER', null,null)
  }

}
