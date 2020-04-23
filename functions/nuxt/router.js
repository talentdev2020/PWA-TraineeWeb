import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _7034e8f8 = () => interopDefault(import('..\\..\\src\\pages\\course.vue' /* webpackChunkName: "pages_course" */))
const _1e464072 = () => interopDefault(import('..\\..\\src\\pages\\forgotPassword.vue' /* webpackChunkName: "pages_forgotPassword" */))
const _71d3b910 = () => interopDefault(import('..\\..\\src\\pages\\login.vue' /* webpackChunkName: "pages_login" */))
const _afa7d40e = () => interopDefault(import('..\\..\\src\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/course",
    component: _7034e8f8,
    name: "course"
  }, {
    path: "/forgotPassword",
    component: _1e464072,
    name: "forgotPassword"
  }, {
    path: "/login",
    component: _71d3b910,
    name: "login"
  }, {
    path: "/",
    component: _afa7d40e,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
