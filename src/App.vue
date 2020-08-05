<template>
  <div id="app" >
    <router-view></router-view>
  </div>
</template>

<script>
	var vm;
    export default {
        beforeCreate(){
        	if(!this.$store.getters['userCenter/getToken'] && this.$store.getters['userCenter/getToken'].length <=0){
        		this.$router.push('/login');  // 正常登录
        		return;
        	}
        },
        mounted(){
            //浏览器后退和前进按钮的处理
            window.onpopstate = () => {
                history.go(1);
            }
        }
    }
</script>
<style  >
/*@import "./assets/css/main.css";*/
@import "./assets/theme/theme-369FDD/color-369FDD.css";   /*蓝色主题*/
@import "./assets/font/iconfont.css";   /*蓝色主题*/
</style>
