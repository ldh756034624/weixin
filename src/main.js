// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
// import VueResource from 'vue-resource'
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
    hasNet:true,
    dialogUnShow:true,
    dialogUnText:'',
    payType:'',
    payGoodId:'',
  },

  actions: {
  },
  mutations: {
  },
  getters: {
    hasNet: state=> {
      return state.hasNet
    },
    dialogUnShow: state=> {
      return state.dialogUnShow
    },
    dialogUnText: state=> {
      return state.dialogUnText
    },
    payType: state=> {
      return state.payType
    },
    payGoodId: state=> {
      return state.payGoodId
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
        //分页
        getCurrentValue:function(value){
          this.pullupStatus = value.pullupStatus;
          this.pulldownStatus = value.pulldownStatus;
        },
        testFn:function(){
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
        mxShare: function(_url,param,callback){  //获取分享内容
          // alert(JSON.stringify(param))
          if(!arguments.length){
            sharePara({
              title: ''
            });
            return false;
          }
          this.$http.get(_url,{params:param}).then(function(res) {
            sharePara(res.data);
          });
          function sharePara(data){
            // wx.ready(function () {
            wx.onMenuShareAppMessage({
              title: data.title,
              desc: data.content,
              link: data.link,
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              imgUrl: data.iconUrl,
              success: function () {
                // this.$broadcast('share-close');
                return;
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                return;
                // 用户取消分享后执行的回调函数
              }
            });
            wx.onMenuShareTimeline({
              title: data.title,
              link: data.link,
              imgUrl: data.iconUrl,
              success: function () {
                return;
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                return;
                // 用户取消分享后执行的回调函数
              }
            });
            wx.onMenuShareQQ({
              title: data.title,
              desc: data.content,
              link: data.link,
              imgUrl: data.iconUrl,
              success: function () {
                return;
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                return;
                // 用户取消分享后执行的回调函数
              }
            });
            // });
          }
        }
    },

})
Vue.filter('price2', function (value) {
  if(typeof value ==  'string'){
    value = parseFloat(value);
  }
  if(!value) value = 0;
  return value.toFixed(2);
})
//Vue.component('toast',require('./components/toast/toast'));
//Vue.component('toast',Toast);
// Vue.http.options.emulateJSON = false;
let userdata = JSON.parse(localStorage.getItem('_user'))
let token = '';
router.beforeEach((to, from, next) => {
  if (from.path == '/account/moreset') {
    token = ''
  }
  // 是否一级导航
  if (to.path.replace(/[^/]/g, '').length > 1) {
    router.app.isIndex = false
  } else {
    router.app.isIndex = true
  }
  // 验证是否登陆
  if (to.meta.auth) {
    if (!token) {
      userdata = JSON.parse(localStorage.getItem('_user'))
      if (userdata) {
        token = userdata.token
      }
    }
    if (token) {
      next()
    } else {
      _g.toastMsg('error', '未登录')
      setTimeout(() => {
        router.push({path: '/login?path=' + to.path,replace: true})
      }, 1500)
    }
  } else {
    next()
  }
})
router.afterEach((to, from, next) => {
  // 验证是否登陆
  if (to.meta.auth) {
    if (!token) {
      _g.toastMsg('error', '未登录')
      setTimeout(() => {
        router.push({path: '/login?path=' + to.path, replace: true})
      }, 1500)
    }
  }
  if (to.path.replace(/[^/]/g, '').length > 1) {
    router.app.isIndex = false
  } else {
    router.app.isIndex = true
  }
})
//ajax 拦截   全局做判断
let url = document.location.href.split('#')[0]
let seturl = ''

if (url.indexOf('weixin-usedgoods.thy360.com')!=-1) {
  seturl = 'https://weixin-usedgoods.thy360.com'
}else{
  seturl = 'https://api-dev-usedgoods.thy360.com'
}
Vue.http.defaults.baseURL = seturl
Vue.http.defaults.timeout = 1000 * 15
// Vue.http.defaults.headers.token = userdata ? userdata.token : ''
// Vue.http.defaults.headers['Content-Type'] = 'application/json'
Vue.http.interceptors.request.use(
  config => {
    if (JSON.parse(localStorage.getItem('_user'))) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.token = JSON.parse(localStorage.getItem('_user')).token;
    } else {
      config.headers.token ='';
      token = ''
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
    if(response.data.statusCode==4005){
      store.state.dialogUnShow=false
      store.state.dialogUnText=response.data.msg
    }
    if(response.data.statusCode==500){
      store.state.hasNet=false
    }
    return response;
  },
  err =>{
    store.state.hasNet=false
  },
  error => {
    if (error.response) {
      if(error.response.statusCode=402){
            store.state.hasNet=true
           _g.toastMsg('error', '请先绑定手机号')
            setTimeout(() => {
              router.replace('/operate/bindPhone')
            }, 1500)
      }else{
          switch (error.response.status) {
            case 401:
              // 返回 401 清除token信息并跳转到登录页面
              //localStorage.setItem("token","");
                setTimeout(() => {
                  router.replace('/login')
                }, 1500)
                break;
            case 404:
              store.state.hasNet=false
              _g.toastMsg('error', '404')
              break;    
            case 500:
              store.state.hasNet=false
              _g.toastMsg('error', '接口服务异常')
              break;
            case 502:
              store.state.hasNet=false
              _g.toastMsg('error', '接口服务异常')
              break;
          }
      }
      
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
});

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app-box')
