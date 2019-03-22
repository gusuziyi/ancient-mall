<template>
	<div class='wrapper'>
		<span class="aside"><img :src="weibo.pic[0].img" alt="" /></span>
		<div class='right'>
			<span class="header"><span class="w-author">{{ weibo.author }}</span>于{{ weibo.date }}  上架了</span>
			<article class="w-title">【{{ weibo.department }}】类热销商品：{{ weibo.title }}</article>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		weibo: {}
	},
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="less" scoped>
	.wrapper{
		display: flex;
		justify-content: space-between;
		height: 4rem;
		padding: .5rem 0rem .5rem 1rem;
		.aside {
			width: 6rem;
			img {
				width: 6rem;
				height: 4rem;
				border-radius: .3rem;
			}
		}
		.right{
			width: 16rem;
			height: 4rem;
			padding-top: .3rem;
			.w-author{
				color: purple;
				font-size: 1rem;
				margin-right: 1rem;
			}
			.w-title{
				margin-top: .8rem;
				color: purple;
				padding-right: .5rem;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				margin-left: -.4rem;
			}
		}
	}

</style>
