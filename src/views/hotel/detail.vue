<template>
  <div class="page">
    <!--顶部大图-->
    <div class="hotel-img">
      <img src="">
    </div>
    <!--酒店地址信息评分等-->
    <div class="hotel-info">
      <p class="top">
        <span class="address">庐阳区宿州北路318号近明光路</span>
        <span class="rate">5.0分</span>
      </p>
      <p class="bottom">酒店预定时间为08:00至20:00，其他时间暂不支持预定！</p>
    </div>
    <!--预定时间-->
    <div class="choose-time">
      <div class="time">
        <p class="desc">入住</p>
        <p class="date">12月13日</p>
      </div>
      <div class="time">
        <p class="desc">离店</p>
        <p class="date">12月13日</p>
      </div>
    </div>
    <!--预定列表-->
    <group class="hotel-detail-link">
      <cell title="预定(2)" value="详情" is-link></cell>
    </group>
    <div class="list-wrapper">
      <ul>
        <li class="bed-item" v-for="i in 10">
          <div class="left">
            <p class="title">皇冠高级房(单早）</p>
            <p class="desc">单早 ︳大床</p>
          </div>
          <div class="right">
            <div class="price">
              <p class="org-price">门市价：<span class="del">740</span></p>
              <p class="now-price">￥<span>420</span></p>
            </div>
            <div class="brand">
              <p class="title">订</p>
              <p class="desc">不可取消</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <group>
      <datetime v-model="startTime" @on-change="change" :show.sync="startshow"></datetime>
      <datetime v-model="endTime" @on-change="change" :show.sync="endshow"></datetime>
    </group>
  </div>
</template>
<script>
  import {Cell, Group, Datetime} from 'vux'

  export default {
    data() {
      return {
        startTime: '2017-01-01',
        endTime:'2017-01-02',
        startshow: false,
        endshow: false,
        searchText: '',
        showCity:
          false,  // 显示城市列表
      }
    },
    created() {
    },
    components: {
      Cell,
      Group,
      Datetime
    }
  }

</script>

<style scoped lang='less'>
  .page {
    height: 100%;
    position: relative;
    line-height: 1;
    background: #f2f2f2;
  }

  .hotel-img {
    img {
      width: 100%;
      height: 245px;
    }
  }

  .hotel-info {
    margin-bottom: 10px;
    background: #fff;
    padding: 15px;
    font-size: 12px;
    .top {
      margin-bottom: 7px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .address {
        color: #333;
      }
      .rate {
        font-weight: bold;
        font-size: 18px;
        color: #627984;
      }
    }
    .bottom {
      color: #999999;
    }
  }

  .choose-time {
    background: #fff;
    padding: 10px 0;
    display: flex;
    .time {
      flex: 1;
      text-align: center;
      &:first-child {
        border-right: 1px solid #f2f2f2;
      }
      .desc {
        margin-bottom: 7px;
        font-size: 12px;
        color: #999999;
      }
      .date {
        font-size: 15px;
        font-weight: bold;
        color: #627984;
      }
    }
  }

  .list-wrapper {
    padding: 0 15px;
    background: #fff;
    .bed-item {
      display: flex;
      padding: 17px 0 20px;
      border-bottom: 1px solid #f2f2f2;
      .left {
        flex: 1;
        border-right: 1px solid #f2f2f2;
        .title {
          margin-bottom: 14px;
          font-size: 15px;
          color: #333333;
        }
        .desc {
          font-size: 12px;
          color: #666666;
        }
      }
      .right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .price {
          text-align: right;
          margin-right: 12px;
          .org-price {
            margin-bottom: 7px;
            font-size: 12px;
            color: #999999;
            .del {
              text-decoration: line-through;
            }
          }
          .now-price {
            font-size: 12px;
            color: #E57B7B;
            & > span {
              font-size: 20px;
            }
          }
        }
        .brand {
          height: 44px;
          width: 44px;
          color: #fff;
          border-radius: 4px;
          border: 1px solid #E57B7B;
          text-align: center;
          .title {
            height: 27px;
            line-height: 27px;
            font-size: 16px;
            background: #E57B7B;
          }
          .desc {
            height: 17px;
            line-height: 17px;
            font-size: 10px;
            color: #999999;
          }
        }
      }
    }
  }
</style>

<style lang='less'>
  .hotel-detail-link {
    .weui-cells {
      font-size: 12px;
      .weui-cell {
        padding: 14px 15px;
        .weui-cell__ft {
          color: #627984;
        }
      }
    }
  }
</style>
