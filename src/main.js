// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
// import VueResource from 'vue-resource'
import RouterConfig from './router/index'
import App from './App'
import { AlertPlugin, ToastPlugin, AjaxPlugin } from 'vux'
import wx from 'weixin-js-sdk'

FastClick.attach(document.body)

Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(AjaxPlugin)
Vue.use(VueRouter)
// Vue.use(VueResource)

const routes = RouterConfig

const router = new VueRouter({
  routes
})

// var url = require('aUrl')
Vue.mixin({
    data: function() {
      return {
        toast : {
          show : false,
          msg : '',
        },
        isIndex:false
      }
    },
    methods: {
      ajaxerr: function(msg) {
        this.toast.show = true
        this.toast.msg = msg
      },
      //定义一个全局提示方法
      toastFn : function(msg,callback) {
        this.toast.msg  = msg
        this.toast.show = true
        if(callback) {
            this.callback = callback
        }
      },
      setTitle: function(title){
        document.title = title;
        var iframe = document.createElement('iframe');
        iframe.style.visibility = 'hidden';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.onload = function () {
          setTimeout(function () {
              document.body.removeChild(iframe);
          }, 0);
        };
        document.body.appendChild(iframe);
      },
      device: function(){
        const ua = navigator.userAgent
        if(/(Android);?[\s\/]+([\d.]+)?/.test(ua)){
          return 'android';
        }else if(/(iPhone\sOS)\s([\d_]+)/.test(ua) || /(iPad).*OS\s([\d_]+)/.test(ua) || /(iPod)(.*OS\s([\d_]+))?/.test(ua)){
          return 'ios'
        }else{
          return '';
        }
      }
    },

})
//ajax 拦截   全局做判断
let url = document.location.href.split('#')[0]
let seturl = 'https://lottery.thy360.com'
// if (url == 'http://localhost:8080/') {
//   seturl = 'https://api-dev-usedgoods.thy360.com'
// } else if (url == 'https://weixin-dev-usedgoods.thy360.com/') {
//   seturl = 'https://api-dev-usedgoods.thy360.com'
// }
Vue.http.defaults.baseURL = seturl
Vue.http.defaults.timeout = 1000 * 300
Vue.http.defaults.headers['Content-Type'] = 'application/json'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
