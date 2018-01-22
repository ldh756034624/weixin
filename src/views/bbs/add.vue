<template>
  <div class="addBox">
    <group gutter="0">
      <x-input v-model="form.title" placeholder="请输入标题"></x-input>
    </group>
    <quill-editor v-model="form.content"
                ref="myQuillEditor"
                :options="editorOption">
  </quill-editor>
        <div class="botBox"><div class="addr">所在位置</div><div class="classly" @click="show = true">帖子分类 ></div></div>
        <div class="btnBox" @click="onSubmit">发布</div>
        <div v-transfer-dom>
      <popup v-model="show" is-transparent>
        <div style="width: 100%;background: #F2F2F2;">
          <div class="popupItem" style="text-align:center;font-size: 18px;">帖子分类</div>
          <div class="popupItem" @click="onType(item.id)" v-for="item in CategoryList">{{item.name}}</div>
         <div class="popupItem" style="margin-top:4px;text-align:center;" @click="show = false">取消</div>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
import {
    Group,
    XInput,
    Popup,
    XDialog,
    TransferDom
  } from 'vux'
  import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {quillRedefine} from 'vue-quill-editor-upload'
import { quillEditor } from 'vue-quill-editor'
  export default {
    directives: {
      TransferDom
    },
    data () {
      return {
        show: false,
        form: {
          title: '',
          content: '',
          typeId: '',
          latitude: '',
          longitude: ''
        },
        CategoryList: [],
        editorOption: {}
      }
    },
    mounted() {
      const self = this
      self.$http.get('h9/api/stick/type/sample')
        .then(function (res) {
          if (res.data.code == 0) {
            self.CategoryList = res.data.data
            self.form.typeId = res.data.data[0].id
          }
        })
    },
    methods: {
      onSubmit() {
        const self = this
        if(!this.form.title){
          _g.toastMsg('error', '请输入标题!')
          return;
        }
        if(!this.form.content){
          _g.toastMsg('error', '请输入内容!')
          return;
        }
        const data = self.form
        self.$http.post('h9/api/stick/', data)
        .then(function (res) {
          if (res.data.code == 0) {
            self.form = {
              title: '',
              content: '',
              typeId: '',
              latitude: '',
              longitude: ''
            }
            _g.toastMsg('success', '发布成功')
          }
        })
      },
      onType (id) {
        this.form.typeId = id
        this.show = false
      }
    },
    created () {
      this.editorOption = quillRedefine(
        {
          // 图片上传的设置
          uploadConfig: {
            action: 'https://weixin-dev-h9.thy360.com/h9/api/file/uploadFile',  // 必填参数 图片上传地址
            // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
            // 你必须把返回的数据中所包含的图片地址 return 回去
            res: (respnse) => {
              return respnse.data
            },
            methods: 'POST',  // 可选参数 图片上传方式  默认为post
            // token: sessionStorage.token,  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
            name: 'file',  // 可选参数 文件的参数名 默认为img
            size: 20480,  // 可选参数   图片限制大小，单位为Kb, 1M = 1024Kb
            accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
          },
          // 以下所有设置都和vue-quill-editor本身所对应
          placeholder: '分享新鲜事',  // 可选参数 富文本框内的提示语
          theme: '',  // 可选参数 富文本编辑器的风格
          toolOptions: ['image'],  // 可选参数  选择工具栏的需要哪些功能  默认是全部
          handlers: {}  // 可选参数 重定义的事件，比如link等事件
        }
      )
      console.log(this.editorOption)
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    components: {
      XInput,
      Group,
      Popup,
      XDialog,
      quillEditor,
      quillRedefine
    }
  }
</script>

<style>
  .quill-editor:not(.bubble) .ql-container,
  .quill-editor:not(.bubble) .ql-container .ql-editor {
    height: 24rem;
    padding-bottom: 1rem;
  }
</style>
<style scoped>
  .addBox {
    padding: 0 15px;
    background-color: #fff;
    height: 100%;
    overflow: hidden;
  }
  .botBox {
  padding-top: 10px;
  padding-bottom: 8px;
  overflow: hidden;
  }
  .addr {
    background: #F2F2F2;
  border-radius: 30px;
  max-width: 100px;
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  color: #999999;
  text-align: center;
  overflow: hidden;
  padding: 0 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left;
  }
  .classly {
    font-size: 12px;
  color: #627984;
  float: right;
  }
  .btnBox {
    background: #627984;
    border-radius: 4px;
    font-size: 15px;
    color: #FFFFFF;
    width: 66px;
    text-align: center;
    height: 38px;
    line-height: 38px;
    float: right;
  }
  .popupItem {
    height: 60px;
    line-height: 60px;
    padding: 0 30px;
    background-color: #fff;
    font-size: 15px;
    color: #333333;
  }
</style>
