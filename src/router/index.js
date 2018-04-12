export default [
  {
    path: "/",
    redirect: "/active/hongbao"
    // name:'homeIndex',
    // component (resolve) {require(['@/views/index'], resolve)}
  },
  {
    path: "/index",
    redirect: "/active/hongbao"
    // name:'homeIndex',
    // component (resolve) {require(['@/views/index'], resolve)}
  },
  {
    path: "/login",
    name: "login",
    component(resolve) {
      require(["@/views/login"], resolve)
    }
  },
  {
    path: "/active/hongbao",
    name: "开盖扫红包",
    meta: { auth: true },
    component(resolve) {
      require(["@/views/active/hongbao"], resolve)
    } //红包活动页
  },
  {
    path: "/active/oneRich",
    name: "1号大富贵",
    meta: { auth: true },
    component(resolve) {
      require(["@/views/active/oneRich"], resolve)
    } //1号大富贵
  },
  {
    path: "/active/oneRichRecord",
    name: "1号大富贵个人开奖记录",
    meta: { auth: true },
    component(resolve) {
      require(["@/views/active/oneRichRecord"], resolve)
    } //1号大富贵人开奖记录
  },
  {
    path: "/active/project",
    name: "专题活动",
    meta: { auth: true },
    component(resolve) {
      require(["@/views/active/activityProject"], resolve)
    } //专题活动
  },
  {
    path: "/active/hongbaoCode",
    name: "hongbaoCode",
    meta: { auth: false },
    component(resolve) {
      require(["@/views/active/hongbaoCode"], resolve)
    }
  },
  {
    path: "/active/prizeResult",
    component(resolve) {
      require(["@/views/active/prizeResult"], resolve)
    }
  },
  {
    path: "/active/prizeRecord",
    component(resolve) {
      require(["@/views/active/prizeRecord"], resolve)
    }
  },
  {
    path: "/active/searchIsReally",
    component(resolve) {
      require(["@/views/active/searchIsReally"], resolve)
    } //查询真伪
  },
  {
    path: "/TestVux",
    name: "TestVux",
    component(resolve) {
      require(["@/components/HelloFromVux"], resolve)
    }
  },
  {
    path: "/shop",
    component(resolve) {
      require(["@/views/shop/index"], resolve)
    } //商城
  },
  {
    path: "/shopList",
    component(resolve) {
      require(["@/views/shop/list"], resolve)
    } //商品列表
  },
  {
    path: "/shopDataile",
    component(resolve) {
      require(["@/views/shop/detaile"], resolve)
    } //商品详情
  },
  {
    path: "/shopOrder",
    component(resolve) {
      require(["@/views/shop/order"], resolve)
    } //商品订单
  },
  {
    path: "/addrList",
    component(resolve) {
      require(["@/views/address/list"], resolve)
    } //地址列表
  },
  {
    path: "/addrChange",
    component(resolve) {
      require(["@/views/address/change"], resolve)
    } //地址编辑
  },
  {
    path: "/account/personal",
    name: "accountPersonal",
    meta: { auth: true },
    component(resolve) {
      require(["@/views/account/personal"], resolve)
    } //个人账户
  },
  {
    path: "/account/purse",
    name: "accountPurse",
    meta: { auth: false },
    component(resolve) {
      require(["@/views/account/purse"], resolve)
    } //我的钱包
  },
  {
    path: "/account/setting",
    component(resolve) {
      require(["@/views/account/setting"], resolve)
    } //设置
  },
  {
    path: "/account/problems",
    component(resolve) {
      require(["@/views/account/problems"], resolve)
    } //常见问题
  },
  {
    path: "/account/articleDetail",
    component(resolve) {
      require(["@/views/account/articleDetail"], resolve)
    } //文章详情
  },
  {
    path: "/account/noticeDetail",
    component(resolve) {
      require(["@/views/account/noticeDetail"], resolve)
    } //公告详情
  },
  {
    path: "/account/descDetail",
    component(resolve) {
      require(["@/views/account/descDetail"], resolve)
    } //酒元说明
  },
  {
    path: "/account/purseParticulars",
    component(resolve) {
      require(["@/views/account/purseParticulars"], resolve)
    } //钱包明细
  },
  {
    path: "/account/funds",
    component(resolve) {
      require(["@/views/account/funds"], resolve)
    } //提现
  },
  {
    path: "/account/chooseBank",
    component(resolve) {
      require(["@/views/account/chooseBank"], resolve)
    } //选择银行卡
  },
  {
    path: "/account/addBank",
    component(resolve) {
      require(["@/views/account/addBank"], resolve)
    } //添加银行卡
  },
  {
    path: "/account/phoneRecharge",
    component(resolve) {
      require(["@/views/account/phoneRecharge"], resolve)
    } //手机充值
  },
  {
    path: "/account/ddExchange",
    component(resolve) {
      require(["@/views/account/ddExchange"], resolve)
    } //滴滴券兑换
  },
  {
    path: "/account/result",
    component(resolve) {
      require(["@/views/account/result"], resolve)
    } //手机充值,滴滴券兑换结果页
  },
  {
    path: "/account/feedback",
    name: "意见反馈",
    component(resolve) {
      require(["@/views/account/feedback"], resolve)
    } // 意见反馈
  },
  {
    path: "/account/hongbao",
    component(resolve) {
      require(["@/views/account/hongbao"], resolve)
    } //红包活动
  },
  {
    path: "/account/hongbao/result",
    component(resolve) {
      require(["@/views/account/result2"], resolve)
    } //红包结果页
  },
  {
    path: "/account/promotion",
    component(resolve) {
      require(["@/views/account/promotion"], resolve)
    } //红包活动
  },
  {
    path: "/account/bankto",
    component(resolve) {
      require(["@/views/account/bankto"], resolve)
    } //转账
  },
  {
    path: "/account/transferInfo",
    component(resolve) {
      require(["@/views/account/transferInfo"], resolve)
    } //转账明细
  },
  {
    path: "/account/success",
    name: "转账成功",
    component(resolve) {
      require(["@/views/account/success"], resolve)
    } //转账成功页
  },
  {
    path: "/account/redPaperAmount",
    component(resolve) {
      require(["@/views/account/redPaperAmount"], resolve)
    } //红包金额
  },
  {
    path: "/my/vMoney",
    component(resolve) {
      require(["@/views/my/vMoney"], resolve)
    } //V币
  },
  {
    path: "/my/vMoneyParticulars",
    component(resolve) {
      require(["@/views/my/vMoneyParticulars"], resolve)
    } //V币明细
  },
  {
    path: "/my/vUpdate",
    component(resolve) {
      require(["@/views/my/vUpdate"], resolve)
    } //V币升级
  },
  {
    path: "/my/cupon",
    component(resolve) {
      require(["@/views/my/cupon"], resolve)
    } //我的卡券
  },
  {
    path: "/my/myCard",
    component(resolve) {
      require(["@/views/my/myCard"], resolve)
    } //我的银行卡
  },
  {
    path: "/my/myOrder",
    component(resolve) {
      require(["@/views/my/myOrder"], resolve)
    } //我的订单
  },
  {
    path: "/my/orderDetail",
    component(resolve) {
      require(["@/views/my/orderDetail"], resolve)
    } //订单详情
  },
  {
    path: "/my/sign",
    component(resolve) {
      require(["@/views/my/sign"], resolve)
    } // 签到
  },
  {
    path: "/my/signRecord",
    name: "签到记录",
    component(resolve) {
      require(["@/views/my/signRecord"], resolve)
    } // 签到记录
  },
  {
    path: "/account/infoChange",
    component(resolve) {
      require(["@/views/account/infoChange"], resolve)
    } //资料修改
  },
  {
    path: "/account/bindPhone",
    component(resolve) {
      require(["@/views/account/bindPhone"], resolve)
    } //绑定手机号
  },
  {
    path: "/deal/platformDeal",
    name: "aboutUs",
    component(resolve) {
      require(["@/views/deal/platformDeal"], resolve)
    } //平台规范
  },
  {
    path: "/hotel/list",
    name: "酒店列表",
    component(resolve) {
      require(["@/views/hotel/list"], resolve)
    } // 酒店列表
  },
  {
    path: "/hotel/detail",
    name: "酒店详情",
    component(resolve) {
      require(["@/views/hotel/detail"], resolve)
    } // 酒店详情
  },
  {
    path: "/hotel/fill",
    name: "订单填写",
    component(resolve) {
      require(["@/views/hotel/fill"], resolve)
    } // 酒店订单填写
  },
  {
    path: "/hotel/pay",
    name: "在线支付",
    component(resolve) {
      require(["@/views/hotel/pay"], resolve)
    } // 酒店订单支付
  },
  {
    path: "/hotel/success",
    name: "支付成功",
    component(resolve) {
      require(["@/views/hotel/success"], resolve)
    } // 酒店支付成功
  },
  {
    path: "/hotel/fail",
    name: "支付失败",
    component(resolve) {
      require(["@/views/hotel/fail"], resolve)
    } // 酒店支付失败
  },
  {
    path: "/hotel/orderDetail",
    name: "订单详情",
    component(resolve) {
      require(["@/views/hotel/order_detail"], resolve)
    } // 酒店订单详情
  },
  {
    path: "/hotel/orderList",
    name: "酒店订单",
    component(resolve) {
      require(["@/views/hotel/order_list"], resolve)
    } // 酒店订单列表
  },
  {
    path: "/bbs",
    name: "欢乐之家",
    component(resolve) {
      require(["@/views/bbs/home"], resolve)
    } // 社区BBS
  },
  {
    path: "/bbs/search",
    name: "社区BBS搜索",
    component(resolve) {
      require(["@/views/bbs/search"], resolve)
    } // 社区BBS搜索
  },
  {
    path: "/bbs/add",
    name: "发帖",
    component(resolve) {
      require(["@/views/bbs/add"], resolve)
    } // 新增帖子
  },
  {
    path: "/bbs/detail/:id",
    name: "帖子详情",
    component(resolve) {
      require(["@/views/bbs/detail"], resolve)
    } // 文章内文
  },
  {
    path: "/bbs/report/:id",
    name: "文章举报",
    component(resolve) {
      require(["@/views/bbs/report"], resolve)
    } // 文章举报
  },
  {
    path: "/bbs/history",
    name: "我的帖子",
    component(resolve) {
      require(["@/views/bbs/history"], resolve)
    } // 我的帖子
  },
  {
    path: "/bbs/list/:id",
    name: "文章分类",
    component(resolve) {
      require(["@/views/bbs/list"], resolve)
    } // 文章分类
  },
  {
    path: "/recharge/index",
    name: "充值",
    component(resolve) {
      require(["@/views/recharge/index"], resolve)
    } // 充值
  },
  {
    path: "/recharge/success",
    name: "充值成功",
    component(resolve) {
      require(["@/views/recharge/success"], resolve)
    }
  },
  {
    path: "/recharge/fail",
    name: "充值失败",
    component(resolve) {
      require(["@/views/recharge/fail"], resolve)
    }
  },
  {
    path: "/travel",
    name: "旅游健康卡",
    component(resolve) {
      require(["@/views/travel/index"], resolve)
    }
  },
  {
    path: "*",
    name: "home",
    component(resolve) {
      require(["@/views/active/hongbao"], resolve)
    }
  }
]
