<template>
	<el-row class="body banner">
		<div class="title">美妆小铺古风版</div>
		<div class="ranking">
			<nuxt-link to="/list">
				<el-button type="primary" size="small">排行榜</el-button>
			</nuxt-link>
			<SearchBar></SearchBar>
		</div>
	</el-row>
</template>

<script>
import SearchBar from './SearchBar.vue';
export default {
	components: {
		SearchBar
	},
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="less" scoped>
.banner {
	z-index: 4;
	margin: -8px;
	margin-top: -7rem;
	width: 80rem;
	height:18rem;
	background-image: url('./banner.jpg');
	background-repeat: no-repeat;
	background-position: 0 0;
	background-size: cover;
	.title{
		position: absolute;
		right: 9rem;
		top: 10.5rem;
		color: white;
		text-shadow: 0 0 5px  purple;
		font-size: 1.8rem;
		font-family: "华文琥珀"
	}
	.ranking {
		width: 19rem;
		position: absolute;
		display: flex;
		justify-content: space-between;
		align-items: center;
		right: 7rem;
		bottom: 3rem;
	}
}
</style>
