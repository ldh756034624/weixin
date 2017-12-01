<template>
		<div class="page addrChangePage">
      <group class='groupNoTop groupNoLine'>
        <x-input title='收货人' v-model='addressParams.name'></x-input>
        <x-input title='联系方式' v-model='addressParams.phone'></x-input>
        <addr ref='addres'></addr>
        <x-textarea title="详细地址" v-model="addressParams.address" placeholder='街道、楼牌号等'></x-textarea>
        <p class="default" @click='isDefault=!isDefault'><span class='defaultIcon ' :class="[isDefault ? 'hasSet':'unSet']"></span> 设为默认</p>
      </group>
      <footer>
        <div>
          <x-button class='bottomBtn gradientBtn' @click.native="save">保存</x-button>
        </div>
      </footer>
		</div>
</template>

<script>
import { Group,XInput,XButton,XTextarea,XSwitch,Popup,Cell,TransferDom,XAddress, Value2nameFilter as value2name, Name2valueFilter as name2value} from 'vux'
import list from '@/util/list.json'
import addr from '@/components/address'
export default {
  directives: {
    TransferDom
  },
  mounted() {
    let self=this;
    this.setTitle('添加新地址');
    console.log(JSON.parse(this.addrEditObj))
    console.dir(this.addrEditObj)
  },
  data() {
    return {
      showAddr:false,
      addressParams:{},
      address:[],
      isDefault:false,
      isEdit:this.$route.query.isEdit,
      addrEditObj:this.$route.query.addrObj
    }
  },
  methods:{
    save:function(){
      
      console.log(this.$refs.addres.province)
      console.log(this.$refs.addres.city)
      console.log(this.$refs.addres.distict)
      if(!this.$refs.addres.addr){
        _g.toastMsg('error','请选择地区')
        return;
      }
      this.addressParams.province=this.$refs.addres.province
      this.addressParams.city=this.$refs.addres.city
      this.addressParams.distict=this.$refs.addres.distict
      if(this.$refs.addres.distict.indexOf('所在')!=-1){
        this.addressParams.distict=''
      }
      if(this.isDefault===true){
        this.addressParams.defaultAddress=1
      }else{
        this.addressParams.defaultAddress=0
      }
      this.$http.post('h9/api/address/add',this.addressParams)
        .then((res)=>{
          if(res.data.code==0){
            console.log(this.addressParams)
            //this.$router.push({path:'/shopList',query:{type:type}})
          }
        })

    },
    logHide (str) {
      let self=this;
      console.log(self.address)
      var addr=value2name(self.address, list).split(' ')
      console.log(addr)
    }
  },
  components: {
    Group,XInput,XTextarea,XSwitch,XButton,Popup,Cell,XAddress,addr
  }
}
</script>
<style scoped lang='less'>
  .addrChangePage{
    padding-top: 20/40rem;
    background: #fff;
    .default{
      padding: 30/40rem 0;
      margin: 0 30/40rem;
      border-top:2/40rem solid #ddd;
      font-size: 30/40rem;
    }
    .defaultIcon{
      display: inline-block;
      vertical-align: middle;
      margin-right: 10/40rem;
      width: 31/40rem;
      height: 31/40rem;
    }
    .unSet{
      background: url('../../assets/img/addr/oval_copy2.png');
      background-size: 100%;
    }
    .hasSet{
      background: url('../../assets/img/addr/queding.png');
      background-size: 100%;
    }
  }
  
  .bottomBtn {
    height: 100/40rem;
    line-height: 100/40rem;
    color: #fff;
    position: fixed;
    bottom: 0;
    z-index: 9;
    border-radius: 0;
    width: 100%;
    text-align: center;
    font-size: 32/40rem;
  }
</style>
<style lang='less'>
  .addrChangePage{
    .weui-cell{
      padding: 30/40rem;
      font-size: 30/40rem;
    }
    .weui-label{
      font-size: 30/40rem;
      width: 150/40rem!important;
    }
    .weui-input,.vux-popup-picker-value,.weui-textarea{
      font-size: 30/40rem;
    }
    .vux-cell-box:before{
      border-top: none;
    }
  }
</style>