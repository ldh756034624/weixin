<template>
  <div class="detailBox">
    <div class="typename">#{{detailData.typeName}}#</div>
    <div class="title">{{detailData.title}}</div>
    <div class="user">
      <img :src="detailData.userAvatar">
      <div>
        <div>{{detailData.userName}}</div>
        <p>{{detailData.createTime}}</p>
      </div>
    </div>
    <div class="content" v-html="detailData.content">
    </div>
    <div class="reward" @click="showToast = true">打赏</div>
    <div class="rewardBox" v-if="detailData.stickRewardUserList">
      <p>{{detailData.stickRewardUserList.length}}人打赏</p>
      <div class="rewardUser">
        <img v-for="item in detailData.stickRewardUserList" :src="item.avatar">
      </div>
    </div>
    <div class="banner" v-if="detailData.images&&detailData.images.length>0"><img :src="img" v-for="img in detailData.images"></div>
    <div class="tool">
      <div class="toolL">
        <span>阅读 {{detailData.readCount}}</span>
        <span>回复 {{detailData.answerCount}}</span>
      </div>
      <div class="toolR">
        <span @click="onlike(id, 1)"><i class="linkIcon"></i> <i style="vertical-align: 3px;">{{detailData.likeCount}}</i></span>
        <span @click="show = true"><i class="moreIcon"></i></span>
      </div>
    </div>
    <div class="Comment">

      <div class="userItem" v-for="item in commentData" :key="item.id">
        <div class="userImg"><img :src="item.avatar" alt=""></div>
        <div style="width: 100%;overflow: hidden;flex: 1;">
        <div class="userBox">
          <div class="userL">
            <div class="userName">{{item.nickName}} <i class="sexIcon" v-if="item.sex"></i></div>
            <div class="usercomment">{{item.content}}</div>
            <div class="userB">{{item.spaceTime + ' ' + item.floor+'楼'}}</div>
          </div>
          <div class="userR">
            <div class="zan" @click="onlike(item.id, 2)"><i class="zanIcon"></i> {{item.likeCount}}</div>
            <div class=""><span @click="addCommentFloor(item)">回复</span> <span v-if="userId === item.commentUserId" @click="deleteFloor(item.id)">删除</span></div>
          </div>
        </div>
        <div class="reCont" v-if="item.list.length > 0">
          <p v-for="list in item.list"><span class="reName">{{list.nickName+'：'}} </span><span class="reCon"> {{list.content}}</span> <span class="reDate">{{list.spaceTime}}</span><span class="reDelete" v-if="userId === list.commentUserId" @click="deleteFloor(list.commentId)">删除</span></p>
        </div>
        </div>
      </div>
    </div>
    <div class="addComment">
      <div class="addCommentBox">
        <input type="text" name="" :placeholder="placeholderTxt" v-model="content" v-focus="focusStatus">
        <div class="addBtn" @click="addComment">发表</div>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="show" is-transparent>
        <div style="width: 100%;background: #F2F2F2;">
          <div class="popupItem" @click="onEdit" v-if="userId === detailData.userId">编辑</div>
          <div class="popupItem" @click="deleteDetail" v-if="userId === detailData.userId">删除</div>
          <div class="popupItem" @click="goReport" v-if="userId !== detailData.userId">举报</div>
         <div class="popupItem" style="margin-top:4px;" @click="show = false">取消</div>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showToast" class="dialog-demo" hide-on-blur>
        <div class="rewardDialog">
            <img :src="detailData.userAvatar">
            <p class="rewardTs">“打赏也是一种认可”</p>
            <textarea rows="3" v-model="words" cols="20" placeholder="给Ta留言" class="rewardText">
              </textarea>
            <p class="rewardX">选择支付金额</p>
            <div class="rewardCon">
              <div class="rewardItem vux-1px" v-for="item in rewardList" @click="onReward(item)">{{item+'元'}}</div>
            </div>
            <p class="rewardTips">注：打赏的收益归作者，非平台</p>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <popup v-model="playshow" is-transparent>
        <div style="width: 100%;background: #fff;">
          <div class="popupItem vux-1px-b">支付</div>
          <div class="popupItem playType">商品类型：赞赏</div>
          <div class="popupItem vux-1px-b playType">支付金额：{{rewardData.rewardMoney}}元</div>
         <div class="popupItem vux-1px-b playType">酒元支付：(余额￥{{rewardData.balance}}）</div>
         <div class="popupItem playBtn"><span @click="playshow = false" class="payitem">取消</span> <span @click="onPlay" class="payitem ok">确认支付</span></div>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
import {
  TransferDom, Popup, XDialog
  } from 'vux'
  export default {
    directives: {
      TransferDom,
      focus: {
        inserted: function (el, {value}) {
          if (value) {
            el.focus();
          }
        }
      }
    },
    data () {
      return {
        content: '',
        words: '', // 打赏留言
        show: false,
        showToast: false,
        placeholderTxt: '说点什么',
        playshow: false,
        focusStatus: false,
        loding: false,
        id: this.$route.params.id,
        userId: JSON.parse(localStorage.getItem('_user')).id,
        stickCommentId: '',
        notifyUserId: '',
        detailData: {},
        commentData: [],
        rewardList: [1, 2, 5, 10 ,20 ,50],
        rewardData: {}
      }
    },
    mounted() {
      const self = this
      self.setTitle('帖子详情');
      self.$http.get('h9/api/stick/detail/'+self.id)
        .then(function (res) {
          if (res.data.code == 0) {
            self.detailData = res.data.data
          }
        })
        self.commentList(1)
    },
    methods: {
      onReward (num) {
        const self = this
        const data = {
          reward: num,
          words: self.words,
          stickId: self.id
        }
        self.$http.post('h9/api/stick/rewardJiuyuan', data)
        .then(function (res) {
          if (res.data.code == 0) {
            self.words = ''
            self.showToast = false
            self.rewardData = res.data.data
            self.playshow = true
          }
        })
      },
      onPlay () {
        const self = this
        const data = {
          reward: self.rewardData.rewardMoney,
          words: self.rewardData.words,
          stickId: self.id
        }
        self.$http.post('h9/api/stick/reward', data)
        .then(function (res) {
          if (res.data.code == 0) {
            self.playshow = false
            _g.toastMsg('success', '支付成功')
          }
        })
      },
      onEdit () {
        this.$router.push({ path: '/bbs/add?id='+this.id, replace: true })
      },
      deleteDetail () {
        const self = this
        self.$http.post('h9/api/stick/delete/'+self.id)
        .then(function (res) {
          if (res.data.code == 0) {
            _g.toastMsg('success', '删除成功')
            setTimeout(() => {
              self.$router.push({ path: '/bbs', replace: true })
            }, 1500)
          }
        })
      },
      deleteFloor (id) {
        const self = this
        self.$http.post('h9/api/stick/commentDelete/'+id)
        .then(function (res) {
          if (res.data.code == 0) {
            _g.toastMsg('success', '删除成功')
          }
        })
      },
      onlike (id, type) {
        const self = this
        const data = {
          id: id,
          type: type
        }
        self.$http.post('h9/api/stick/like', data)
        .then(function (res) {
          if (res.data.code == 0) {
            _g.toastMsg('success', '点赞成功')
          }
        })
      },
      goReport: function () {
          this.$router.push({path: '/bbs/report/'+this.id})
      },
      commentList (page) {
        const self = this
        const params = {
          page: page,
          limit: 10,
          stickId: self.id
        }
        self.$http.get('h9/api/stick/getComment/', {params: params})
        .then(function (res) {
          if (res.data.code == 0) {
            self.commentData = res.data.data.data
          }
        })
      },
      addCommentFloor (item) {
        this.placeholderTxt = '回复: '+ item.nickName
        this.notifyUserId = item.commentUserId
        this.stickCommentId = item.id
        this.focusStatus = true
      },
      addComment () {
        const self = this
        if (self.loding) {
          return
        }
        let data = {
          content: self.content,
          stickId: self.id
        }
        if (self.stickCommentId) {
          data.notifyUserId = self.notifyUserId
          data.stickCommentId = self.stickCommentId
        }
        self.loding = true
        self.$http.post('h9/api/stick/addComment', data)
        .then(function (res) {
          self.loding = false
          if (res.data.code == 0) {
            self.content = ''
            self.notifyUserId = ''
            self.stickCommentId = ''
            self.focusStatus = false
            self.placeholderTxt = '说点什么'
            _g.toastMsg('success', '回复成功')
          }
        })
      }
    },
    components: {
      Popup,
      XDialog
    }
  }
</script>
<style scoped>

.detailBox {
  padding: 0 15px;
  background-color: #fff;
}
  .typename {
    font-size: 18px;
    color: #2687D5;
    line-height: 18px;
    padding: 18px 0 12px;
  }
  .title {
    font-size: 18px;
    color: #333;
    line-height: 18px;
  }
  .user {
    display: flex;
    align-items: center;
    font-size: 15px;
    color: #333333;
    line-height: 15px;
    height: 50px;
    margin-top: 12px;
    margin-bottom: 15px;
  }
  .user img {
    width: 50px;
    height: 50px;
    margin-right: 8px;
  }
  .user p {
    color: #999999;
    font-size: 12px;
    line-height: 12px;
    padding-top: 8px;
  }
  .content {
    margin-bottom: 35px;
    font-size: 15px;
  color: #333333;
  line-height: 15px;
  }
  .reward {
    background: #E57B7B;
  border-radius: 4px;
  font-size: 16px;
color: #FFFFFF;
width: 82px;
height: 40px;
line-height: 40px;
text-align: center;
margin: 0 auto 18px;
  }
  .rewardBox {
    text-align: center;
    margin: 0 auto;
  }
  .rewardBox p {
    font-size: 12px;
color: #999999;
line-height: 12px;
margin-bottom: 10px;
  }
  .rewardUser img {
    width: 30px;
    height: 30px;
    margin-right: 4px;
    border-radius: 15px;
  }
  .banner {
    margin: 15px 0 32px;
    height: 98px;
    overflow: hidden;
  }
  .banner img {
    height: 100%;
    width: 100%;
  }
  .tool {
    font-size: 12px;
color: #999999;
line-height: 12px;
display: flex;
justify-content: space-between;
    align-items: center;
  }
  .tool .toolL span {
    margin-right: 20px;
  }
  .tool .toolR span {
    margin-left: 20px;
  }
  .tool i {
    display: inline-block;
  }
  .linkIcon {
    width: 16px;
    height: 16px;
    background: url('../../assets/img/bbs/xin@2x.png') no-repeat top center;
    background-size: 16px 16px;
  }
  .moreIcon {
    width: 22px;
    height: 22px;
    background: url('../../assets/img/bbs/gengduo@2x.png') no-repeat center;
    background-size: 22px 22px;
  }
  .Comment {
    padding: 15px 0 60px;
  }
  .userItem {
    display: flex;
    padding: 11px 0 18px;
  }
  .userImg {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin-right: 10px;
    overflow: hidden;
  }
  .userImg img {
    width: 100%;
    height: 100%;
  }
  .userBox {
    padding-top: 9px;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .userL {
    flex: 1;
  }
  .userR {
    /*width: 76px;*/
    text-align: right;
    margin-top: 4px;
    font-size: 14px;
color: #627984;
line-height: 14px;
  }
  .userR span {
    margin-left: 20px;
  }
  .userName {
    font-size: 14px;
    color: #666666;
    line-height: 14px;
  }
  .sexIcon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('../../assets/img/bbs/nan@2x.png') no-repeat center;
    background-size: 16px 16px;
    vertical-align: -2px;
  }
  .zanIcon {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url('../../assets/img/bbs/zan@2x.png') no-repeat center;
    background-size: 14px 14px;
  }
  .zan {
    font-size: 12px;
color: #999999;
line-height: 12px;
    margin-bottom: 18px;
  }
  .reCont {
    background: #F2F2F2;
    width: 100%;
    margin-top: 8px;
    font-size: 14px;
color: #999999;
line-height: 14px;
padding: 5px 10px;
  }
  .reCon {
    color: #333333;
    margin-right: 15px;
  }
  .reCont p {
    padding: 5px 0;
  }
  .usercomment {
    font-size: 16px;
color: #333333;
line-height: 16px;
padding: 10px 0;
  }
  .userB {
    font-size: 12px;
color: #CCCCCC;
line-height: 12px;
  }
  .addComment {
    position: fixed;
    bottom: 0;
    height: 60px;
    width: 100%;
    left: 0;
    background-color: #F2F2F2;
  }
  .addCommentBox {
    padding: 10px 15px 12px;
    display: flex;
  }
  .addCommentBox .addBtn {
    background: #627984;
    border-radius: 4px;
    font-size: 15px;
  color: #FFFFFF;
 text-align: center;
 line-height: 38px;
 width: 50px;
 height: 38px;
 margin-left: 8px;
  }
  .addCommentBox input {
    flex: 1;
    background: #FFFFFF;
    border-radius: 4px;
    border: none;
    height: 38px;
    line-height: 38px;
    padding: 0 10px;
  }
  .popupItem {
    height: 60px;
    line-height: 60px;
    text-align: center;
    background-color: #fff;
    font-size: 15px;
    color: #333333;
  }
  .popupItem.playType {
    text-align: left;
    padding-left: 30px;
  }
  .rewardDialog {
    background: #FFFFFF;
border-radius: 4px;
text-align: center;
padding: 0 15px;
  }
  .rewardDialog img {
    display: block;
    width: 70px;
    height: 70px;
    border-radius: 35px;
    margin: 18px auto 10px;
  }
  .rewardTs {
    font-size: 14px;
color: #666666;
line-height: 14px;
  }
  .rewardText {
    background: #F2F2F2;
    font-size: 14px;
color: #999999;
line-height: 14px;
border: none;
padding: 10px;
width: 90%;
margin-top: 10px;
  }
  .rewardX {
    font-size: 14px;
color: #666666;
line-height: 14px;
text-align: left;
  }
  .rewardCon {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: row;
    margin: 5px 0;
  }
  .rewardItem {
    border-radius: 4px;
    font-size: 16px;
    width: 66px;
    height: 38px;
    line-height: 38px;
    color: #627984;
    margin: 5px 10px;
    flex: 1 1 auto;
  }
  .rewardItem:before {
    border: 1px solid #627984;
    color: #627984;
  }
  .rewardTips {
    font-size: 12px;
color: #999999;
line-height: 12px;
padding: 4px 0 14px;
  }
  .playBtn {
    padding: 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .payitem {
    background: #D8D8D8;
border-radius: 4px;
display: inline-block;
width: 106px;
height: 44px;
line-height: 44px;
text-align: center;
font-size: 16px;
color: #666666;
  }
  .payitem.ok {
    color: #fff;
    background: #627984;
  }
  .reDelete {
    float: right;
    margin-right: 20px;
        color: #627984;
  }
</style>
<style type="text/css">
  .content img {
    max-width: 100%;
  }
</style>