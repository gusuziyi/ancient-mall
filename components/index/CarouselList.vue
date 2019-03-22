<template>
	<div class="wrapper">
		<Option></Option>
		<el-carousel :interval="4000">
			<el-carousel-item v-for="(goods, idx) in hotGoodses" :key="idx" class="q-body">
				<nuxt-link :to="'/showDetail/'+goods.cid">
					<h4 class="q-title">{{ goods.name }}</h4>
					<img :src="goods.imgs.car" alt="" />
				</nuxt-link>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
import Option from './option/Option.vue';
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState({
			hotGoodses: state => state.goods.hotGoodses
		})
	},
	components: {
		Option
	},
	methods: {}
};
</script>

<style lang="less" scoped>
.wrapper {
	display: flex;
	justify-content: space-between;
	padding-top: 1rem;
	width: 70rem;
	height: 16rem;
	margin-top: 1rem;
}
</style>
<style lang="less">
.el-carousel {
	position: relative;
	width: 40rem;
	z-index: 0;
	height: 16rem;
	overflow-y: hidden;
	border-radius: 4px;
	.q-body {
		position: absolute;
		img {
			width: 40rem;
			height: 18rem;
		}
		.q-title {
			position: absolute;
			bottom: 2rem;
			right: 1rem;
			color: white;
			padding: 0.2rem 0.5rem 0.3rem 0.5rem;
			border-radius: 4px;
			background-color: rgba(90, 0, 70, 0.7);
		}
	}
}
</style>
