<template>
  <div class="page feedback-wrapper">
    <group>
      <cell title="反馈类型" :value="actionVal" is-link @click.native="actionShow = true"></cell>
      <!--todo actionsheet-->
      <actionsheet v-model="actionShow" :menus="actionMenu" @on-click-menu="actionClick"></actionsheet>
    </group>

    <div class="edit-wrapper">
      <div class="text-area">
        <textarea maxlength="200" v-model="formData.advice" placeholder="我们力求向您提供更优质的服务，期待您的宝贵意见！"></textarea>
      </div>
      <div class="hidename-wrapper" @click="formData.anonymous = !formData.anonymous">
        <i class="check-box" :class="formData.anonymous ? 'checked' : ''"></i>
        匿名
      </div>
    </div>

    <p class="connect-content">
      您的联系方式(选填，方便我们联系您)
    </p>

    <div class="input-wrapper">
      <input type="text" v-model="formData.connect" class="phone-input" placeholder="手机号/QQ号/微信号">
    </div>

    <div class="submit-wrapper" @click="submit">
      <div class="submit">提交</div>
    </div>
  </div>
</template>
<script>
  import {Group, Cell, Actionsheet} from 'vux'
  import Uploader from 'vux-uploader'

  export default {
    created() {
      this.setTitle('意见反馈');
      this.getTypeList()
    },
    data() {
      return {
        actionMenu: {}, // 类型选择列表
        formData: {
          advice: '', // 意见内容
          anonymous: true,  // 是否匿名
          connect: null,  // 联系方式
          adviceType: 1 // adviceType
        },
        actionShow: false,
        actionVal: '功能建议'
      }
    },
    methods: {
      // 获取反馈类型
      getTypeList() {
        this.$http.get('h9/api/advice/adviceType').then(res => {
          let data = res.data
          if (data.code === 0) {
            data.data.forEach((item, index) => {
              this.actionMenu[item.key] = item.val
              if (index === 0) {
                this.formData.adviceType = item.key
                this.actionVal = item.val
              }
            })
          }
        })
      },
      // 选择类型时
      actionClick(key) {
        this.formData.adviceType = key
        this.actionVal = this.actionMenu[key]
      },
      // 提交
      submit() {
        if (!this.formData.advice) {
          _g.toastMsg('error', '请输入反馈内容')
          return
        }
        let data = this.formData
        data.anonymous = data.anonymous ? 1 : 0  // 是否匿名
        this.$http.post('h9/api/advice/sendAdvice', data).then(res => {
          let data = res.data
          if (data.code === 0) {
            _g.toastMsg('success', data.msg)
            this.$router.replace({path:"/account/setting"})
          }
        })
      }
    },
    components: {
      Group, Cell, Actionsheet, Uploader
    },
  }

</script>
<style scoped lang='less'>
  .page {
    padding-top: 20/40rem;
    line-height: 1;
    background: rgb(242, 242, 242);
  }

  .edit-wrapper {
    position: relative;
    overflow: hidden;
    margin-top: 20/40rem;
    background: #fff;
    padding: 36/40rem 30/40rem 30/40rem;
    .text-area {
      margin-bottom: 36/40rem;
      textarea {
        width: 690/40rem;
        height: 204/40rem;
        font-size: 24/40rem;
        border: none;
        resize: none;
      }
      textarea:focus {
        border: none;
      }
    }
    .hidename-wrapper {
      /*position: absolute;*/
      float: right;
      clear: both;
      right: 32/40rem;
      bottom: 30/40rem;
      display: flex;
      align-items: center;
      font-size: 30/40rem;
      .check-box {
        margin-right: 20/40rem;
        height: 36/40rem;
        width: 36/40rem;
        background-image: url("../../assets/img/account/duihao_kong@2x.png");
        background-size: 100% 100%;
        &.checked {
          background-image: url("../../assets/img/account/duihao@2x.png");
        }
      }
    }
  }

  .connect-content {
    margin-left: 30/40rem;
    line-height: 66/40rem;
    font-size: 24/40rem;
    color: #999999;
  }

  .phone-input {
    display: block;
    height: 100/40rem;
    width: 100%;
    font-size: 30/40rem;
    padding-left: 30/40rem;
    border: none;
  }

  .submit-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    .submit {
      height: 100/40rem;
      line-height: 100/40rem;
      background: #627984;
      color: #fff;
      text-align: center;
      font-size: 32/40rem;
    }
  }

</style>
<style lang='less'>
  .feedback-wrapper {
    .weui-cells:before, .weui-cells:after, .weui-cell:before {
      border: none;
    }
    .weui-cell__ft{
      font-size: 30/40rem;
    }
    .weui-cell {
      padding: 30/40rem;
    }
    .vux-label {
      font-size: 30/40rem;
    }
    .weui-cells, .vux-no-group-title {
      margin-top: 0;
    }
  }
</style>
