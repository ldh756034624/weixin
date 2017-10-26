import wx from 'weixin-js-sdk'
let wxAuth = {};
wxAuth.wxSign = function(self){   //获取微信分享签名参数
  let rcmurl = "/icepeak/js/config";
  return new Promise((resolve,reject)=>{
    self.$http.get(rcmurl,{params:{"url":location.href.split("#")[0]}}).then((res)=>{
      wxAuth.wxConfig(res.data.data);
      resolve(res.data);
    }).catch((error)=>{
      console.log(error);
      reject(error);
    })
  });
};
wxAuth.wxConfig=function(config){   //微信参数初始化
  wx.config({
    debug: false,
    appId: config.appId,
    timestamp: config.timestamp,
    nonceStr: config.nonceStr,
    signature: config.signature,
    jsApiList: ['getLocation','scanQRCode']
  });
}

export default wxAuth;