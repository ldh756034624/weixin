<template>
  <div class="page feedback-wrapper">
    <group>
      <cell title="反馈类型" :value="actionVal" is-link @click.native="actionShow = true"></cell>
      <!--todo actionsheet-->
      <actionsheet v-model="actionShow" :menus="actionMenu" @on-click-menu="actionClick"></actionsheet>
    </group>

    <div class="edit-wrapper">
      <div class="text-area">
        <textarea v-model="text" placeholder="我们力求向您提供更优质的服务，期待您的宝贵意见！"></textarea>
      </div>
      <div class="edit-bottom">
        <uploader
          :max="3"
          :images="images"
          :handle-click="false"
          :show-header="false"
          :readonly="false"
          :upload-url="uploadUrl"
          :params="params"
          size="normal"
          @add-image="addImageMethod"
          @remove-image="removeImageMethod"
        ></uploader>
      </div>
      <div class="hidename-wrapper" @click="isHideName = !isHideName">
        <i class="check-box" :class="isHideName ? 'checked' : ''"></i>
        匿名
      </div>
    </div>

    <p class="connect-content">
      您的联系方式(选填，方便我们联系您)
    </p>

    <div class="input-wrapper">
      <input type="text" v-model="phone" class="phone-input" placeholder="手机号/QQ号/微信号">
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
    mounted() {
      this.setTitle('意见反馈');
    },
    data() {
      return {
        actionMenu: {
          value1: '功能建议',
          value2: '程序错误',
          value3: '数据问题',
          value4: '其他'
        },
        actionShow: false,
        actionVal: '功能建议',
        text: '',
        uploadUrl: 'sdjfiodsjifo',
        // images数据格式[ { url: '/url/of/img.ong' }, ...]
        images: [],
        // 上传图片时带的参数
        params: {},
        isHideName: true,
        phone: null,
      }
    },
    methods: {
      actionClick(key) {
        this.actionVal = this.actionMenu[key]
      },
      addImageMethod() {
      },
      removeImageMethod() {
      },
      submit() {
        _g.toastMsg('success','提交成功')
      }
    },
    components: {
      Group, Cell, Actionsheet, Uploader
    },
  }

</script>
<style scoped lang='less'>
  .page {
    padding-top: 10px;
    line-height: 1;
    background: rgb(242, 242, 242);
  }

  .edit-wrapper {
    position: relative;
    margin-top: 10px;
    background: #fff;
    padding: 18px 15px 0;
    .text-area {
      margin-bottom: 18px;
      textarea {
        width: 345px;
        height: 102px;
        font-size: 12px;
        border: none;
        resize: none;
      }
      textarea:focus {
        border: none;
      }
    }
    .hidename-wrapper {
      position: absolute;
      right: 16px;
      bottom: 15px;
      display: flex;
      align-items: center;
      font-size: 15px;
      .check-box {
        margin-right: 10px;
        height: 18px;
        width: 18px;
        background-image: url("../../assets/img/account/duihao_kong@2x.png");
        background-size: 100% 100%;
        &.checked {
          background-image: url("../../assets/img/account/duihao@2x.png");
        }
      }
    }
  }

  .connect-content {
    margin-left: 15px;
    line-height: 33px;
    font-size: 12px;
    color: #999999;
  }

  .phone-input {
    display: block;
    height: 50px;
    width: 100%;
    font-size: 15px;
    padding-left: 15px;
    border: none;
  }

  .submit-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    .submit {
      height: 50px;
      line-height: 50px;
      background: #627984;
      color: #fff;
      text-align: center;
      font-size: 16px;
    }
  }

</style>
<style lang='less'>
  .feedback-wrapper {
    .weui-cells:before, .weui-cells:after, .weui-cell:before {
      border: none;
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
