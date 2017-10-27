<template>
    <div>
	<div class="appdown" @click='download()'>
		{{text}}
	</div>
    <alert v-model="isChecking">app正在审核中,请耐心等待</alert>
    </div>
</template>

<script>
import {Alert} from 'vux'
export default {
    props : {
        text : {
            type: String
        }
    },
     data () {
        return {
          isChecking:false,
        }
      },
    methods: {
    	download: function() {
    		let self = this;
            
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if(isAndroid){
                self.isChecking=true;
            }else{
                window.location = "https://itunes.apple.com/cn/app/%E7%8C%AA%E7%8C%AA%E9%9B%86%E5%B8%82/id1173387307?mt=8" 
            }
    		// window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.geometryfinance" 

    	},
    },
    components: {
        Alert
      },
}
</script>

<style type="text/css">
    .appdown{
        width: 100%;
        height: 100%
    }
</style>