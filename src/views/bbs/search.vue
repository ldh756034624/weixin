<template>
  <div>
    <div class="top vux-1px-b">
      <div class="search"><i class="weui-icon weui_icon_search weui-icon-search"></i><input type="text" placeholder="搜索" name="search" v-model="search"></div>
    </div>
    <div class="searchList">
      <div class="searchItem vux-1px-b" v-for="item in searchList" @click="neargoods(item.id)">
        <div class="title">{{item.title}}</div>
        <div class="name"><p>{{item.userName}}</p><p>{{item.createTime}}</p></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        search: '',
        searchList: []
      }
    },
    mounted() {
      this.setTitle('搜索');
    },
    methods: {
      // id 商店ID
      neargoods (id) {
        // 跳转到水站介绍
        this.$router.push({path: '/bbs/detail/'+id})
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
    }
  }
</script>

<style scoped>
  .top {
    display: flex;
    height: 45px;
    align-items: center;
    font-size: 15px;
    background-color: #fff;
  }
  .search {
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    background-color: #F2F4F5;
    border-radius: 22px;
    width: 100%;
    margin: 0 15px;
    display: flex;
    align-items: center;
  }
  .search .weui-icon-search {
    font-size: 15px;
    margin-right: 6px;
  }
  .search input {
    height: 100%;
    width: 100%;
    color: #999;
    background-color: #F2F4F5;
    display: inline-block;
    border: none;
  }
  .searchList {
    padding-left: 15px;
    background-color: #fff;
  }
  .searchItem {
    height: 60px;
    display: flex;
    align-items: center;
  }
  .title {
    font-size: 15px;
    color: #333333;
    color: #4c4c4c;
    flex: 1;
  }
.name {
  font-size: 12px;
color: #999999;
line-height: 12px;
}
.name p:first-child{
  padding-bottom: 8px;
}
</style>
