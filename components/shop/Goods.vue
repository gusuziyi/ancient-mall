<template>
	<div class="wrapper">
		<nuxt-link :to="'/showDetail/' + goods.cid">
			<div class="goods">
				<img :src="goods.imgs.hot" class="goods-img" />
				<div class="goods-title">{{ goods.name }}</div>
				<div class="goods-price">
					<span class="price">￥{{ goods.price }}</span>
					<span class="ori-price">原价：￥{{ goods.oriPrice }}</span>
				</div>
				<div class="goods-hot">热卖爆款：{{ goods.attrs.type }}</div>
				<div class="goods-sell">已售出:{{ goods.sellNum }}</div>
			</div>
		</nuxt-link>
		<span class="fav" v-if="!fav" @click="onfav(true)">
			收藏
			<i class="el-icon-star-off"></i>
		</span>
		<span class="fav" v-else="" @click="onfav(false)">
			取消收藏
			<i class="el-icon-star-on"></i>
		</span>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import axios from 'axios'
export default {
	computed: {
		...mapState({
			userInfo:state=>state.user.userInfo
		}),
		/* 
		* becouse the props goods is read-only ,so when click the fav button 
		* we have to return a view change by computed  updateView for a temp time 
		* when step into this page for twice time the db will work
		* */
		fav(){
			if(this.updateView){
				return this.isFav
			}else{
				return this.goods.fav
			}
		}
	},
	props: {
		goods: Object
	},
	data(){
		return {
			updateView:false,
			isFav:false
		}
	},
	methods: {
	   async onfav(isFav) {
			let goods=this.goods
			goods.fav=isFav
			let {data:{code,updateView}}=await axios.post('/goods/changeFav',{id:goods.id,isFav})
			let favPath=isFav?"fav":"delfav"
			let {data:{code:code_fav,userfav}}=await axios.post('/user/'+favPath,{username:this.userInfo.name,goods})
			if(code_fav==401 || code==401){
				this.$router.push({path:"/login"})
			}else if(code_fav==2000||code_fav==2001){
				if(code==2000){
					this.isFav=isFav
					this.updateView=updateView
					this.$message({
						message: isFav?"收藏成功":"取消收藏成功",
						type: 'success',
						duration: 3000,
						center: true,
						customClass: 'message-info'
					});
				}
			}
		},
		async onunFav(){
			let {data:{code,updateView}}=await axios.post('/goods/changeFav',{id:this.goods.id,isFav:false})
			let {data:{code:code_fav,userfav}}=await axios.post('/user/delfav',{username:this.userInfo.name,goods:this.goods})
			if(code_fav==401 || code==401){
				this.$router.push({path:"/login"})
			}else if(code_fav==2000||code_fav==2001){
				if(code==2000){
					this.isFav=false
					this.updateView=updateView
					this.$message({
						message: "取消收藏成功",
						type: 'success',
						duration: 3000,
						center: true,
						customClass: 'message-info'
					});
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
.wrapper{
	position: relative;
		a {
			text-decoration: none;
			color: grey;
		}
		.goods {
			&:hover {
				opacity: 1;
				border: 1px solid purple;
			}
			opacity: 0.95;
			border: 1px solid grey;
			border-radius: 4px;
			width: 23rem;
			overflow: hidden;
			&-img {
				width: 23rem;
				height: 16rem;
			}
			&-title {
				margin: 1rem;
				font-size: 1.5rem;
				color: purple;
			}
			&-price {
				margin: 0.8rem;
				.price {
					font-size: 1.5rem;
					color: orangered;
					margin-right: 0.5rem;
				}
				.ori-price {
					text-decoration: line-through;
				}
			}
			&-hot {
				font-size: 1rem;
				margin: 2rem 1rem 0.5rem 1.2rem;
			}
			&-sell {
				display: flex;
				justify-content: space-between;
				margin: 0.5rem 1rem 1rem 1.2rem;
				font-size: 1rem;
			}
		}
		.fav {
			position: absolute;
			bottom: 0rem;
			right: 0rem;
			padding: 1rem;
			z-index: 77;
			i {
				margin-left: 0.5rem;
			}
			.el-icon-star-on {
				color: orangered;
			}
		}
}

</style>
