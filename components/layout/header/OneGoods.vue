<template>
	<div class='wrapper'>
		<span class="aside"><img :src="goods.imgs" alt="" /></span>
		<div class='right'>
			<article class="w-title">{{ goods.name }}</article>
			<div class="w-info">类型:{{ goods.sku.type }}    尺寸:{{ goods.sku.size}}</div>
			<div class="del">
				<span class="w-price">￥{{goods.sku.price}}</span>
				<span>原价:￥{{goods.sku.oriPrice}} 折扣:{{goods.sku.count}}折</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		goods: Object
	},
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
			padding-top: .1rem;
			.w-title{
				color: purple;
				font-size: 1rem;
				color: purple;
				padding-right: .5rem;
				margin-right: 1rem;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				
			}
			.w-info{
				padding-right: .5rem;
				margin-top: .2rem;
			}
			.del{
				.w-price{
					font-size: 1rem;
					color: purple;
				}
				margin-top: .2rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-right: 1rem;
			}
		}
	}

</style>
