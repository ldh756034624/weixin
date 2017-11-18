// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import {encode} from '@/util/base64Code'
import RouterConfig from './router/index'
import App from './App'
import Home from './components/HelloFromVux'
import { AlertPlugin, ToastPlugin, AjaxPlugin } from 'vux'
import wx from 'weixin-js-sdk'
import _g from './helpers/global'

Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(AjaxPlugin)
Vue.use(VueRouter)
Vue.use(Vuex)
// Vue.use(VueResource)
const bus = new Vue()
window.bus = bus
window._g = _g

const routes = RouterConfig
const router = new VueRouter({
  routes
})
let store = new Vuex.Store({
  state:{
    longitude:0,
    latitude:0,
  },

  actions: {
  },
  mutations: {
    setLocal(state,item){
        state.longitude=item.longitude
        state.latitude=item.latitude
    },
  },
  getters: {
    longitude: state=> {
      return state.longitude
    },
    latitude: state=> {
      return state.latitude
    },
  },
  modules: {

  }
})
// var url = require('aUrl')
Vue.mixin({
    data: function() {
        return {
            toast : {
                show : false,
                msg : '',
            },
            isIndex:false,
            //分页
            pullupStatus:'default',
            pulldownStatus:'default',
            pulldefaultConfig:{
              height: 100,
              content: "",
              upContent: "",
              loadingContent: "",
              downContent: ""
            },
            page: {
                totalpage: 1,
                currPage: 1,
                limit: 5,
                hasNext: true
            },
            latitude:0,
            longitude:0,
        }
    },
    methods: {
        //分页
        getCurrentValue:function(value){
          this.pullupStatus = value.pullupStatus;
          this.pulldownStatus = value.pulldownStatus;
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
        loadMore (callback) {
          if(this.page.hasNext){
              setTimeout(() => {
                callback
              }, 2000)
          }
        },
        getWxCode:function(){
          let self=this;
          var redirectUrl=Vue.http.defaults.baseURL+'/h9-weixin/#/index'
          window.location.href=Vue.http.defaults.baseURL+'/h9/api/common/wechat/code?url='+encode(redirectUrl)
        },
        hasPhone:function(link){
          let self=this;
          let userObjItem=JSON.parse(localStorage.getItem('_user'))
          if(userObjItem){
            if(userObjItem.tel || localStorage.getItem('tel')){
              if(link==='/account/phoneRecharge'){
                self.$router.push({path:link,query:{type:'indexRecharge'}})
              }else if(link==='/account/ddExchange'){
                self.$router.push({path:link,query:{type:'indexddExchange'}})
              }else{
                self.$router.push({path:link})
              }
            }else{
              _g.toastMsg('error', '请先绑定手机号')
              setTimeout(function(){
                self.$router.replace({path:'/account/bindPhone',query:{path:link}})
              },1000)
            }
          }else{
            this.getWxCode();
          }
        },
        getDeal:function(code){
          let self=this;
          var p = new Promise(function(resolve, reject){
            self.$http.get('/h9/api/common/pageJson/'+code)
            .then(function(res) {
              resolve(res.data);
            })
          });
          return p;
        },
        getLocal:function(){
          wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                this.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                this.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                store.commit("setLocal",{
                    latitude:res.latitude,
                    longitude:res.longitude
                })
              }
          });
        },
    }

})
Vue.filter('price2', function (value) {
  if(typeof value ==  'string'){
    value = parseFloat(value);
  }
  if(!value) value = 0;
  return value.toFixed(2);
})
let userdata = JSON.parse(localStorage.getItem('_user'))
//ajax 拦截   全局做判断
let url = document.location.href.split('#')[0]
let seturl = ''

if (url.indexOf('weixin-test-h9.thy360.com')!=-1) {
  seturl = 'https://weixin-test-h9.thy360.com'
}else{
  seturl = 'https://weixin-dev-h9.thy360.com'
}
Vue.http.defaults.baseURL = seturl
Vue.http.defaults.timeout = 1000 * 15
Vue.http.defaults.headers['client'] = '3'
if(userdata){
  Vue.http.defaults.headers['imei'] = userdata.openId
}
// Vue.http.defaults.headers.token = userdata ? userdata.token : ''
Vue.http.interceptors.request.use(
  config => {
    if (JSON.parse(localStorage.getItem('_user'))) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.token = JSON.parse(localStorage.getItem('_user')).token;
    } else {
      config.headers.token ='';
    }
    return config;
  },
  err => {
    return Promise.reject(err);
});
Vue.http.interceptors.response.use(
  response => {
    if(response.status==200){
      store.state.hasNet=true
    }
    if(response.data.code==402){
      _g.toastMsg('error', '请先绑定手机号')
      setTimeout(() => {
        router.replace('/account/bindPhone')
      }, 1500)
    }
    if(response.data.code==401){
      this.getWxCode();
    }
    return response;
  },
  error => {
    if (error.response) {
      _g.toastMsg('error', '出错了')
    }
    return Promise.reject(error)   // 返回接口返回的错误信息
});


FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app-box')
