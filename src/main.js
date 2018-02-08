import Vue from 'vue'
// import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import {encode} from '@/util/base64Code'
import RouterConfig from './router/index'
import App from './App'
import {AlertPlugin, ConfirmPlugin, ToastPlugin, AjaxPlugin, LoadingPlugin} from 'vux'
import wx from 'weixin-js-sdk'
import _g from './helpers/global'

Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
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

// 设置标题
function setTitle(title) {
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
}

router.beforeEach((to, from, next) => {
  // 下面这段拦截用于处理：如果处于结果页，手机点击返回，分别做跳转
  // if (to.name) { // 设置标题
  //   setTitle(to.name)
  // }

  if (sessionStorage.isInResult === 'true') {
    if (from.path === '/account/result' && from.query.type === 'vMoneyExchange' && to.path === '/my/vUpdate' || from.path === '/account/purse' && to.path === '/account/result') {  // 如果来自v币兑换，点返回到个人中心
      sessionStorage.isInResult = false
      next('/account/personal')
    } else {
      next()
    }
  } else {
    next()
  }
  if(sessionStorage.paySuccess === "true"){
    if(from.path === '/hotel/success' && to.path === '/hotel/fill'){
      sessionStorage.paySuccess === false
      next('/index')
    }else if(from.path === '/hotel/orderDetail' && to.path === '/hotel/fill' ){
      sessionStorage.paySuccess === false
      next('/index')
    } else if(from.path === '/hotel/fail' && to.path === '/hotel/fill') {
      sessionStorage.paySuccess === false
      next('/index')
    } else{
      next()
    }
  }else{
    next()
  }
})
let store = new Vuex.Store({
  state: {
    longitude: 0,
    latitude: 0,
    showLoading: false,
  },

  actions: {},
  mutations: {
    setLocal(state, item) {
      state.longitude = item.longitude
      state.latitude = item.latitude
    },
    setLoading(state, item) {
      state.showLoading = item
    },
  },
  getters: {
    longitude: state => {
      return state.longitude
    },
    latitude: state => {
      return state.latitude
    },
    showLoading: state => {
      return state.showLoading
    },
  },
  modules: {}
})
// var url = require('aUrl')
Vue.mixin({
  data: function () {
    return {
      toast: {
        show: false,
        msg: '',
      },
      isIndex: false,
      showLoad: false,
      //分页
      pullupStatus: 'default',
      pulldownStatus: 'default',
      pulldefaultConfig: {
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
      latitude: 0,
      longitude: 0,
    }
  },
  methods: {
    //分页
    getCurrentValue: function (value) {
      this.pullupStatus = value.pullupStatus;
      this.pulldownStatus = value.pulldownStatus;
    },
    setTitle: function (title) {
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
    loadMore(callback) {
      if (this.page.hasNext) {
        setTimeout(() => {
          callback
        }, 2000)
      }
    },
    getWxCode: function () {
      let self = this;
      var redirectUrl = Vue.http.defaults.baseURL + '/h9-weixin/#/index'
      window.location.href = Vue.http.defaults.baseURL + '/h9/api/common/wechat/code?url=' + encode(redirectUrl)
    },
    hasPhone: function (link) {
      let self = this;
      let userObjItem = JSON.parse(localStorage.getItem('_user'))
      if (userObjItem) {
        if (userObjItem.tel || localStorage.getItem('tel')) {
          if (link === '/account/phoneRecharge') {
            self.$router.push({path: link, query: {type: 'indexRecharge'}})
          } else if (link === '/account/ddExchange') {
            self.$router.push({path: link, query: {type: 'indexddExchange'}})
          } else {
            self.$router.push({path: link})
          }
        } else {
          _g.toastMsg('error', '请先绑定手机号')
          setTimeout(function () {
            self.$router.replace({path: '/account/bindPhone', query: {path: link}})
          }, 1000)
        }
      } else {
        var redirectUrl = Vue.http.defaults.baseURL + '/h9-weixin/#/index'
        window.location.href = Vue.http.defaults.baseURL + '/h9/api/common/wechat/code?url=' + encode(redirectUrl)
      }
    },
    getDeal: function (code) {
      let self = this;
      var p = new Promise(function (resolve, reject) {
        self.$http.get('/h9/api/common/pageJson/' + code)
          .then(function (res) {
            resolve(res.data);
          })
      });
      return p;
    },
    getLocal: function () {
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          this.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          this.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          store.commit("setLocal", {
            latitude: res.latitude,
            longitude: res.longitude
          })
        }
      });
    },
  }

})
Vue.filter('price2', function (value) {
  if (typeof value == 'string') {
    value = parseFloat(value);
  }
  if (!value) value = 0;
  return value.toFixed(2);
})
let userdata = JSON.parse(localStorage.getItem('_user'))
//ajax 拦截   全局做判断
let url = document.location.href.split('#')[0]
let seturl = ''

if (url.indexOf('weixin-testnew-h9.thy360.com') != -1 || url.indexOf('localhost') != -1) {
  seturl = 'https://weixin-testnew-h9.thy360.com'
} else if (url.indexOf('weixin-dev-h9.thy360.com') != -1 || url.indexOf('172.16') != -1) {
  seturl = 'https://weixin-dev-h9.thy360.com'
} else {
  seturl = 'https://weixin-h9.thy360.com'
}
Vue.http.defaults.baseURL = seturl
Vue.http.defaults.timeout = 1000 * 15
Vue.http.defaults.headers['client'] = '3'
if (userdata) {
  Vue.http.defaults.headers['imei'] = userdata.openId
}
Vue.http.defaults.headers['version'] = '4.0'   // 固定版本号给后台

// Vue.http.defaults.headers.token = userdata ? userdata.token : ''
Vue.http.interceptors.request.use(
  config => {
    if (JSON.parse(localStorage.getItem('_user'))) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.token = JSON.parse(localStorage.getItem('_user')).token;
    } else {
      config.headers.token = '';
    }
    store.commit("setLoading", true)
    return config;
  },
  err => {
    return Promise.reject(err);
  });
Vue.http.interceptors.response.use(
  response => {
    if (response.status == 200) {
      store.state.hasNet = true
    }
    if (response.data.code == 402) {
      _g.toastMsg('error', '请先绑定手机号')
      setTimeout(() => {
        router.replace('/account/bindPhone')
      }, 1500)
    } else if (response.data.code == 401) {
      delete localStorage._user;
      var redirectUrl = document.location.href
      if (redirectUrl.indexOf('active/hongbao') == -1) {
        redirectUrl = Vue.http.defaults.baseURL + '/h9-weixin/#/index'
      }
      window.location.href = Vue.http.defaults.baseURL + '/h9/api/common/wechat/code?url=' + encode(redirectUrl)
    } else if (response.data.code != 0) {
      if (response.data.msg) {
        _g.toastMsg('error', response.data.msg)
      }
    } else {
      store.commit("setLoading", false)
    }
    return response;
  },
  error => {
    if (error.response) {
      _g.toastMsg('error', ' 网络连接异常，请稍后再试')
    }
    return Promise.reject(error)   // 返回接口返回的错误信息
  });


// FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app-box')
