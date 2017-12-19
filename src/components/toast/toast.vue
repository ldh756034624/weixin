<template>
  <div class="vux-toast" v-show='props_show'>
    <!-- 此处input只做双向数据绑定用(props 的value 属性必须有)-->
    <input ref='input' v-bind:value='value' style="display:none">
    <!-- 
    <div class="weui_mask_transparent" v-show="props_show"></div>
      <transition  :name="transition">
        <div class="weui_toast" :style="{width: width}" :class="toastClass" v-show="props_show">
          <i class="weui_icon_toast" v-show="type !== 'text'"></i>
          <p class="weui_toast_content" v-if="text" v-html="text"></p>
          <p class="weui_toast_content" v-else><slot></slot></p>
        </div>
      </transition> -->
      <div class="vuxBox">
          <div class="vuxCont" >{{props_text}}</div>
      </div>
      
  </div>
</template>
<script>
export default {
  mounted(){
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    time: {
      type: Number,
      default: 2000
    },
    value:'',
    text: String
  },
  methods: {
    
  },
  data () {
    return {
      props_show: false,
      props_text:'',
      timers: []
    }
  },
  methods: {
  /*countdown () {
      const t = setTimeout(() => {
       this.props_show = false;
        this.props_text = {}
        clearTimeout(this.time)
      }, this.time || 3000)
      this.timers.push(t)
  },*/
},
watch: {
  show (val) {
    console.log(val)
    this.props_show=val;
    this.props_text=this.text;
    setTimeout(() => {
       this.props_show = false;
        this.props_text = {}
      }, this.time || 3000)
   /* if(val){
      this.timers.forEach((timer) => {
        window.clearTimeout(timer)
      })
      this.timers = []
      this.countdown()
    }*/
  },
  props_show(val) {
    console.log(val)
    console.log("props_show"+this.props_show)
    this.$emit("input",val);
     this.$emit('toast.show', val)
     this.$emit('show', val)
  }
},
  /*computed: {
    toastClass () {
      return {
        'weui_toast_forbidden': this.type === 'warn',
        'weui_toast_cancel': this.type === 'cancel',
        'weui_toast_success': this.type === 'success',
        'weui_toast_text': this.type === 'text'
      }
    }
  },*/
  /*watch: {
    show (val) {
      //this.show = val
      console.log('show')
      setTimeout(() => {
          this.show = false
        }, this.time)
    },*//*
    value (val) {
      this.props_show = val
      console.log('va')
    },
    props_show (val) {
      console.log('pr')
      if (val) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.props_show = false
          this.$emit('on-hide')
        }, this.time)
      }
      this.$emit('input', val)
    }
  }*/
}
</script>
<style >
    .vux-toast{
      position: fixed;
      width: 100%;
      height: 100%;
      display: table;
      top: 0;
     
    }
    .vuxBox{
      display: table-cell;
      vertical-align: middle;
    }
    .vuxCont{
      max-width: 120px;
      margin: 0 auto;
      text-align: center;
      color: #fff;
      padding: 1rem;
      border-radius: 10px;
      background-color: rgba(0,0,0,0.7);
    }
</style>