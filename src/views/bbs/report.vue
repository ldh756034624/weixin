<template>
  <div class="detailBox">
    <group>
      <radio :options="reportData" v-model="content"></radio>
    </group>
    <div class="onBtn" @click="onReport">提交</div>
  </div>
</template>
<script>
  import { Radio, Group } from 'vux'
  export default {
    data () {
      return {
        id: this.$route.params.id,
        reportData: [],
        content: ''
      }
    },
    mounted() {
      const self = this
      self.$http.get('h9/api/stick/getReportType')
        .then(function (res) {
          if (res.data.code == 0) {
            self.reportData = res.data.data
            self.content = res.data.data[0]
          }
        })
    },
    methods: {
      onReport () {
        const self = this
        const data = {
          content: self.content,
          stickId: self.id
        }
        self.$http.post('h9/api/stick/report/' + self.id, data)
        .then(function (res) {
          if (res.data.code == 0) {
            _g.toastMsg('success', '举报成功')
            setTimeout(() => {
              self.$router.push({ path: '/bbs', replace: true })
            }, 1500)
          }
        })
      }
    },
    components: {
      Radio,
      Group
    }
  }
</script>
<style scoped>
.onBtn {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 50px;
  background: #627984;
  line-height: 50px;
  color: #fff;
  font-size: 16px;
  text-align: center;
}
</style>
