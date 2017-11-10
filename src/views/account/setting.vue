<template>
	<div class="page versionPage">
    <p class="flexBox">版本信息 <span class='flex1 alignR'>Ver 1.0</span></p>
    <x-button class='bottomBtn gradientBtn' @click.native="">退出当前帐号</x-button>
    
  </div>
</template>

<style scoped lang='less'>
  .versionPage{
    background: #fff;
    .flexBox{
      padding: 30/40rem;
      font-size: 30/40rem;
    }
    .flex1{
      color: #999;
    }
  }
  .bottomBtn{
    height: 100/40rem;
    line-height: 100/40rem;
    color: #fff;
    position: fixed;
    bottom: 0;
    border-radius: 0;
    width: 100%;
    text-align: center;
    font-size: 32/40rem;
  }
</style>
