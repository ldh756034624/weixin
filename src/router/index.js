
import Hello from '@/components/Hello'

export default [
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    },{
    	path:'*',
    	name:'home',
    	component (resolve) {require(['@/views/index'], resolve)}
    },{
      path:'/index',
      name:'homeIndex',
      component (resolve) {require(['@/views/index'], resolve)}
    },{
      path:'/login',
      name:'login',
      component (resolve) {require(['@/views/login'], resolve)}
    },{
    	path:'/TestVux',
    	name:'TestVux',
    	component (resolve) {require(['@/components/HelloFromVux'], resolve)}
    },{
    	path:'/unused/publish',
    	name:'unusedPublish',
      meta: { auth: true },
    	component (resolve) {require(['@/views/unused/publish'], resolve)}
    },{
      path:'/sale/publish',
      name:'salePublish',
      meta: { auth: true },
      component (resolve) {require(['@/views/sale/publish'], resolve)}
    },{
      path:'/donate/publish',
      name:'donatePublish',
      meta: { auth: true },
      component (resolve) {require(['@/views/donate/publish'], resolve)}
    },{
      path:'/account/personal',
      name:'accountPersonal',
      meta: { auth: false },
      component (resolve) {require(['@/views/account/personal'], resolve)} //个人账户
    },{
      path:'/account/mypublish',
      name:'accountMypublish',
      meta: { auth: true },
      component (resolve) {require(['@/views/account/myPublish'], resolve)} //我发布的
    },{
      path:'/account/mysell',
      name:'accountSell',
      meta: { auth: true },
      component (resolve) {require(['@/views/account/mySell'], resolve)} //我卖出的
    },{
      path:'/account/changePrice',
      name:'changePrice',
      meta: { auth: true },
      component (resolve) {require(['@/views/account/changePrice'], resolve)} //修改价格
    },{
      path:'/account/mybuy',
      name:'accountBuy',
      meta: { auth: true },
      component (resolve) {require(['@/views/account/myBuy'], resolve)} //我买到的
    },{
      path:'/account/mycollection',
      name:'accountMyCollection',
      meta: { auth: true },
      component (resolve) {require(['@/views/account/myCollection'], resolve)} //我收藏的
    },{
      path:'/account/orderdetail',
      name:'accountOrderDetail',
      meta: { auth: true },
      component (resolve) {require(['@/views/account/orderDetail'], resolve)} //订单详情
    },{
      path:'/unused/detaile',
      name:'unusedDetaile',
      component (resolve) {require(['@/views/unused/detaile'], resolve)}
    },{
      path:'/unused/paysuccess',
      name:'unusedPaysuccess',
      component (resolve) {require(['@/views/unused/paysuccess'], resolve)}
    },{
      path:'/sale/detaile',
      name:'saleDetaile',
      component (resolve) {require(['@/views/sale/detaile'], resolve)}
    },{
      path:'/donate/detaile',
      name:'donateDetaile',
      component (resolve) {require(['@/views/donate/detaile'], resolve)}
    },{
      path:'/search/search',
      name:'search',
      component (resolve) {require(['@/views/search/search'], resolve)} //搜索
    },{
      path:'/sale/payensure',
      name:'salePayensure',
      // meta: { auth: true },
      component (resolve) {require(['@/views/sale/payensure'], resolve)}
    },{
      path:'/account/addaddress',
      name:'accountAddaddr',
      meta: { auth: true },
      component (resolve) {require(['@/views/account/addAddress'], resolve)}
    },{
      path:'/account/addresslist',
      name:'accountAddaddrlist',
      meta: { auth: true },
      component (resolve) {require(['@/views/account/addressList'], resolve)}
    },{
      path:'/unused/buy',
      name:'unusedBuy',
      //meta: { auth: true },
      component (resolve) {require(['@/views/unused/buy'], resolve)}
    },{
      path:'/unused/pay',
      name:'unusedpay',
      meta: { auth: true },
      component (resolve) {require(['@/views/unused/pay'], resolve)}
    },{
      path:'/account/moreset',
      name:'accountmoreSet',
      meta: { auth: true },
      component (resolve) {require(['@/views/account/moreSet'], resolve)}
    },{
      path:'/account/advice',
      name:'accountAdvice',
      meta: { auth: true },
      component (resolve) {require(['@/views/account/advice'], resolve)}
    },{
      path:'/account/complaint',
      name:'accountComplaint',
      meta: { auth: true },
      component (resolve) {require(['@/views/account/complaint'], resolve)}
    },{
      path:'/message',
      name:'message',
      component (resolve) {require(['@/views/message/message'], resolve)}
    },{
      path:'/account/perMsg',
      name:'accountPerMsg',
      meta: { auth: true },
      component (resolve) {require(['@/views/account/perMsg'], resolve)}
    },{
      path:'/account/setNick',
      name:'accountSetNick',
      component (resolve) {require(['@/views/account/setNick'], resolve)}
    },{
      path:'/operate/express',
      name:'express',
      component (resolve) {require(['@/views/operate/express'], resolve)} //我要发货
    },{
      path:'/operate/bindPhone',
      name:'bindPhone',
      component (resolve) {require(['@/views/operate/bindPhone'], resolve)} //绑定手机号
    },{
      path:'/unused/changePrice',
      name:'changePrice',
      component (resolve) {require(['@/views/unused/changePrice'], resolve)} //修改价格
    },{
      path:'/operate/expressMsg',
      name:'expressMsg',
      component (resolve) {require(['@/views/operate/expressMsg'], resolve)} //物流详情
    },{
      path:'/back/apply',
      name:'backApply',
      component (resolve) {require(['@/views/back/apply'], resolve)} //退款申请
    },{
      path:'/back/detaile',
      name:'backDetaile',
      component (resolve) {require(['@/views/back/detaile'], resolve)} //退款详情
    },{
      path:'/back/arbitration',
      name:'arbitration',
      component (resolve) {require(['@/views/back/arbitration'], resolve)} //申请仲裁
    },{
      path:'/back/arbitrationDetail',
      name:'arbitrationDetail',
      component (resolve) {require(['@/views/back/arbitrationDetail'], resolve)} //仲裁详情
    },{
      path:'/back/showMoney',
      name:'showMoney',
      component (resolve) {require(['@/views/back/showMoney'], resolve)} //查看钱款
    },{
      path:'/search/searchRecord',
      name:'searchRecord',
      component (resolve) {require(['@/views/search/searchRecord'], resolve)} //搜索记录
    },{
      path:'/account/aboutUs',
      name:'aboutUs',
      component (resolve) {require(['@/views/account/aboutUs'], resolve)} //关于我们
    },{
      path:'/deal/platformDeal',
      name:'aboutUs',
      component (resolve) {require(['@/views/deal/platformDeal'], resolve)} //平台规范
    },{
      path:'/deal/userDeal',
      name:'aboutUs',
      component (resolve) {require(['@/views/deal/userDeal'], resolve)} //用户保证金协议
    },{
      path:'/deal/waiterDeal',
      name:'aboutUs',
      component (resolve) {require(['@/views/deal/waiterDeal'], resolve)} //服务协议
    },
  ]