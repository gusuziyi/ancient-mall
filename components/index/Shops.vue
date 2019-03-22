<template>
	<div class="wraper">
		<dl class="q-header" @mouseover="mover">
			<dt class="q-title">美妆精选</dt>
			<dd :class="{ active: activeTag == 'hot' }" tag="hot">正在热卖</dd>
			<dd :class="{ active: activeTag == 'trend' }" tag="trend">潮流推荐</dd>
			<dd :class="{ active: activeTag == 'group' }" tag="group">拼团秒杀</dd>
			<dd :class="{ active: activeTag == 'suit' }" tag="suit">美妆套餐</dd>
		</dl>
		<div class="show">
			<dl class="q-list">
				<dd class="goods" v-for="(goods, idx) in curGoodses" :key="idx" >
					<nuxt-link :to="{path:'/showDetail/'+goods.cid}">
						<img class="goods-pic" :src="goods.imgs.cut" alt="" />
						<div class="goods-title">{{goods.name}}</div>
						<div class="goods-size">
							<span class="type">{{goods.attrs.type}}</span>
							<span class="size">{{goods.attrs.size}}</span>
						</div>
						<div class="goods-price-div">
							<div>
								<span class="price">{{goods.price}}</span>
								<span class="ori-price">原价{{goods.oriPrice}}元</span>
							</div>
							<span class="area">{{goods.shopName}}</span>
						</div>
					</nuxt-link>
				</dd>
			</dl>
		</div>
	</div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import Goodses from '~/db/Goodses.json'
export default {
	computed: {
		...mapState({
			hotGoodses:state=>state.goods.hotGoodses
		})
	},
	data() {
		return {
			activeTag: 'hot',
			curGoodses:[]
		};
	},
	mounted(){
		this.curGoodses=this.hotGoodses
	},
	methods: {
		/* move the mouse to change tag  */
		mover(e) {
			let dom = e.target;
			if (dom.tagName.toLowerCase() == 'dd') {
				let tag = dom.getAttribute('tag');
				this.activeTag = tag;
				this.getCurGoodses(tag)
			}
		},
		/*  
		 * simulate get data from db when move the mouse to change tag 
		 * */
		getCurGoodses(tag){
			if(tag=='hot'){
				this.curGoodses=this.hotGoodses
				return
			}
			if(tag=='trend'){
				Goodses.sort((a,b) => (a.price - b.price));
				this.curGoodses=Goodses.slice(2,8)
			}
			if(tag=='group'){
				Goodses.sort((a,b) => (a.cid - b.cid));
				this.curGoodses=Goodses.slice(8,14)
			}
			if(tag=='suit'){
				Goodses.sort((a,b) => (a.price / a.oriPrice - b.price / b.oriPrice));
				this.curGoodses=Goodses.slice(5,11)
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import './Shops.less';
</style>
