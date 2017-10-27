<template>
  <div class="page">
      <div class="buyUnused">
          <main class='buyMain'>
              <div class="buyAdressBox">
                  <div class="buyAddrText value" v-if="address.contact" @click="goAddrList">
                      <p>收货人：{{address.contact}} <span class='right'>{{address.phone}}</span></p>
                      <p>收货地址：{{address.village}} {{address.room1}}</p>
                  </div>
                  <router-link to="/account/addaddress">
                    <div class="buyAddrText empty" v-if="!address.contact">
                        添加收货地址
                    </div>
                  </router-link>
              </div>
              <div class="borderline-wrap">
                <img src="../../assets/img/mian/borderImage.png" class="borderline">
              </div>
              <goodBox class='buyGoodsBox'  :ImgSrc='firstImage' :title='goodData.title' :price='goodData.sellingPrice' :hasDesc='hasDesc'> </goodBox>
              <div class="buyMoneyBox-wrap">
                <p class="buyMoneyBox vux-1px-b">运费<span class='redFont right'><i>¥</i>{{goodData.expressFee | price2}}</span></p>
                <p class="buyMoneyBox">总计<span class='redFont right'><i>¥</i>{{goodData.totalAmount | price2}}</span></p>
              </div>
          </main>
          <footer class='footerBtnBox'>
            <button class="BlueBtn buyBtn" @click='buyFn'>确认订单</button>
          </footer>
      </div>

  </div>
</template>

<script>
import goodBox from '@/components/goodBox'
var hyburl=  require('commonUrl')
export default {
  mounted(){
    this.setTitle('确认订单');
    this.init();
  },
  data () {
    return {
      goodsId:this.$route.query.goodsId,
      address:{},
      goodData:{},
      orderId:-1,
      firstImage:'',
      addrList: [],
      hasDesc:false,
    }
  },
  methods:{
    init(){
      let addressId = this.$route.query.addressId;
      if(addressId){
        this.getAddrList().then(()=>{
          this.getGoods();
        });
      }else{
        this.getGoods();
      }
    },
    getGoods(){
      let self =this
      self.$http.get('/sh/ja/v1/idleGoods/'+this.goodsId+'/ready')
        .then(function(res) {
          if(res.data.statusCode==0){
            self.goodData=res.data.data;
            if(!self.$route.query.addressId){
              self.address=res.data.data.address?res.data.data.address:{};
            }else{
              for(var i=0;i<self.addrList.length;i++){
                if(self.addrList[i].id==self.$route.query.addressId){
                  self.address=self.addrList[i]
                }
              }
            }
            self.firstImage=self.goodData.images[0];
          }
        })
    },
    buyFn(){
      let self=this;
      self.$http.post('/sh/ja/v1/order/submit',{addressId:self.address.id,goodsId:self.goodsId})
        .then(function(res) {
          if(res.data.statusCode==0){
              self.orderId=res.data.data.orderId
              //self.payFn();
              self.$router.push({path:'/unused/paysuccess',query:{orderId:self.orderId,price:res.data.data.payAmount,type:'payorder'}})
          }else{
            self.$vux.toast.show({
                text:  res.data.msg,
                type: 'text',
            })
          }

        })
    },
    goAddrList(){
      let query = this.$route.query;
      query.path = this.$route.path;
      query.addressId = '';
      this.$router.push({path: '/account/addresslist', query:query});
    },
    getAddrList(){
      let rcmurl = "/sh/ja/v1/address";
      return new Promise((resolve,reject)=>{
          this.$http.get(rcmurl,{limit:20,page:1}).then((res)=>{
            if(res.data.data.length>0){
              this.addrList = res.data.data;
            }
            resolve(res.data);
          }).catch((error)=>{
            console.log(error);
            reject(error);
          })
        });
    }
  },
   components: {
    goodBox
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
    .page{
      background-color: #eee;
      overflow: auto;
    }
    .buyUnused{
      padding: 20/40rem;
    }
    .buyMain{
      background-color:#fff;
      border-radius: 10/40rem;
      font-size: 30/40rem;
    }
     .buyAdressBox{
        display: flex;
     }
     .borderline-wrap{
       .borderline{
          height: 9/40rem;
          margin-bottom: 20/40rem;
          width: 100%;
       }
     }
     .buyAddr{
        width: 30/40rem;
        height: 40/40rem;
        margin: 21/40rem 30/40rem 0 0;
     }
     .buyAddrText{
        flex:1;
        color: #333;
        max-width: 570/40rem;
        &.empty{
          line-height: 140/40rem;
          font-size: 30/40rem;
          padding-left: 80/40rem;
          background-position: 30/40rem center;
          background-image: url('../../assets/img/mian/plus.png');
          background-size: 34/40rem 34/40rem;
          background-repeat: no-repeat;
        }
        &.value{
          padding: 30/40rem 00/40rem 30/40rem 90/40rem;
           max-width: 570/40rem;
          display:block;
          overflow:hidden;
          background-image: url('../../assets/img/mian/addr.png');
          background-size: 30/40rem 40/40rem;
          background-position: 30/40rem center;
          background-repeat: no-repeat;
        }
     }
     .buyGoodsBox{
        background-color: #FAFBFD;
     }
     .buyMoneyBox{
        padding: 30/40rem;
     }
     .buyMoneyBox i,.buyGoodsDesc i{
        font-size: 24/40rem;
        font-style: normal;
     }
     .footerBtnBox{
        padding: 0 10/40rem;
        .buyBtn{
          height: 90/40rem;
          margin-top: 60/40rem;
          font-size: 30/40rem;
        }
     }
     .goodImg{
        height: 200/40rem;
        width: 200/40rem;
     }
     .buyMoneyBox-wrap{
        padding: 0 20/40rem;
        .buyMoneyBox{
          padding: 30/40rem 10/40rem;
        }
     }
</style>
