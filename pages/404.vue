<template>
	<el-container class="container is404c">
		<div class="title">~(>_<)~页面不见啦</div>
		<div class="is404">
			<el-button type="primary" size="midum" @click='$router.go(-1)'>返回上一页</el-button>
			<div class="info-div">
				<div class="item ">错误号:404</div>
				<div class="item ">错误信息:未找到对应页面</div>
			</div>
		</div>
	</el-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	layout: 'noFooter',
	methods: {
		...mapMutations({
			setUser: 'user/setUser',
			setMeImgAva: 'jas/setMeImgAva'
		})
	},
	mounted() {
         let name= this.$route.query
		let userInfo = localStorage.getItem('userInfo') || localStorage.getItem('tempUserInfo');
		if (userInfo) {
			userInfo = JSON.parse(userInfo);
			this.setUser(userInfo);
			this.setMeImgAva(userInfo.img);
		}
       
	},
};
</script>

<style lang="less" scoped>
@import './src/register.less';
</style>
