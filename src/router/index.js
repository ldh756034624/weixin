
export default [
    {
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
      path:'/active/hongbao',
      name:'hongbao',
      meta: { auth: true },
      component (resolve) {require(['@/views/active/hongbao'], resolve)} //红包活动页
    },{
      path:'/active/hongbaoCode',
      name:'hongbaoCode',
      meta: { auth: false },
      component (resolve) {require(['@/views/active/hongbaoCode'], resolve)}
    },{
      path:'/active/prizeResult',
      component (resolve) {require(['@/views/active/prizeResult'], resolve)}
    },{
      path:'/active/prizeRecord',
      component (resolve) {require(['@/views/active/prizeRecord'], resolve)}
    },{
      path:'/active/searchIsReally',
      component (resolve) {require(['@/views/active/searchIsReally'], resolve)} //查询真伪
    },{
    	path:'/TestVux',
    	name:'TestVux',
    	component (resolve) {require(['@/components/HelloFromVux'], resolve)}
    },{
      path:'/account/personal',
      name:'accountPersonal',
      meta: { auth: true },
      component (resolve) {require(['@/views/account/personal'], resolve)} //个人账户
    },{
      path:'/account/purse',
      name:'accountPurse',
      meta: { auth: false },
      component (resolve) {require(['@/views/account/purse'], resolve)} //我的钱包
    },{
      path:'/account/setting',
      component (resolve) {require(['@/views/account/setting'], resolve)} //我的钱包  
    },{
      path:'/account/purseParticulars',
      component (resolve) {require(['@/views/account/purseParticulars'], resolve)} //钱包明细
    },{
      path:'/account/funds',
      component (resolve) {require(['@/views/account/funds'], resolve)} //提现
    },{
      path:'/account/chooseBank',
      component (resolve) {require(['@/views/account/chooseBank'], resolve)} //选择银行卡 
    },{
      path:'/account/addBank',
      component (resolve) {require(['@/views/account/addBank'], resolve)} //添加银行卡 
    },{
      path:'/account/phoneRecharge',
      component (resolve) {require(['@/views/account/phoneRecharge'], resolve)} //手机充值
    },{
      path:'/account/ddExchange',
      component (resolve) {require(['@/views/account/ddExchange'], resolve)} //滴滴券兑换
    },{
      path:'/account/result',
      component (resolve) {require(['@/views/account/result'], resolve)} //手机充值,滴滴券兑换结果页
    },{
      path:'/my/vMoney',
      component (resolve) {require(['@/views/my/vMoney'], resolve)} //V币
    },{
      path:'/my/vMoneyParticulars',
      component (resolve) {require(['@/views/my/vMoneyParticulars'], resolve)} //V币明细
    },{
      path:'/my/cupon',
      component (resolve) {require(['@/views/my/cupon'], resolve)} //我的卡券
    },{
      path:'/my/myCard',
      component (resolve) {require(['@/views/my/myCard'], resolve)} //我的卡券
    },{
      path:'/my/myOrder',
      component (resolve) {require(['@/views/my/myOrder'], resolve)} //我的订单
    },{
      path:'/my/orderDetail',
      component (resolve) {require(['@/views/my/orderDetail'], resolve)} //订单详情
    },{
      path:'/account/infoChange',
      component (resolve) {require(['@/views/account/infoChange'], resolve)} //资料修改
    },{
      path:'/account/bindPhone',
      component (resolve) {require(['@/views/account/bindPhone'], resolve)} //绑定手机号
    },{
      path:'/deal/platformDeal',
      name:'aboutUs',
      component (resolve) {require(['@/views/deal/platformDeal'], resolve)} //平台规范
    }
  ]