<template>
  <div class="addBox">
    <group gutter="0">
      <x-input v-model="value" placeholder="请输入标题"></x-input>
    </group>
    <quill-editor v-model="content"
                  ref="myQuillEditor"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)">
        </quill-editor>
        <div class="botBox"><div class="addr">所在位置</div><div class="classly">帖子分类 ></div></div>
        <div class="btnBox">发布</div>
  </div>
</template>
<script>
import {
    Group,
    XInput
  } from 'vux'
  import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
  export default {
    data () {
      return {
        value: '',
        content: '',
        editorOption: {
          placeholder: '分享新鲜事',
          modules: {
            toolbar: [
              ['image']
            ],

            history: {
              delay: 1000,
              maxStack: 50,
              userOnly: false
            }
          }
        }
      }
    },
    methods: {
      onEditorBlur(editor) {
        // console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        // console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        // console.log('editor ready!', editor)
      }
    },
    watch: {
      search (val) {
        // 获取搜索接口
        const params = {
          str: val
        }
        const self = this
        self.$http.get('h9/api/stick/search', {params: params})
          .then(function (res) {
            if (res.data.code == 0) {
              self.searchList = res.data.data.data
            }
          })
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    components: {
      XInput,
      Group,
      quillEditor
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
  }
</style>
