<template>
	<section class="warpper">
		<Jas v-if="showJas.visible" :isRealMan="showJas.isRealMan" />
		<Banner  />
		<section class="goodses">
			<div class="shop-sort">
				<span class="item">
					按价格
					<span v-if="valueSort">升序</span>
					<span v-else>降序</span>
					排序
				</span>
				<el-switch v-model="valueSort" inactive-color="purple" @change="sortPrice" />
				<span class="item after">
					按销量
					<span v-if="sellSort">升序</span>
					<span v-else>降序</span>
					排序
				</span>
				<el-switch v-model="sellSort" inactive-color="purple" @change="sortSell" />
				<span class="item after">
					按折扣力度
					<span v-if="discountSort">升序</span>
					<span v-else>降序</span>
					排序
				</span>
				<el-switch v-model="discountSort" inactive-color="purple" @change="sortDiscount" />
			</div>
			<div class="shop-goodses">
				<Goods v-for="(goods, idx) in goodses" :key="idx" class="goods" :goods="goods" />
			</div>
		</section>
	</section>
</template>

<script>
import Banner from '~/components/index/Banner.vue';
import Goods from '~/components/shop/Goods.vue';
import Jas from '~/components/index/Jas.vue';
import { mapState, mapMutations } from 'vuex';
const getAllGoodsFromDB = () => {
	return new Promise((resolve,reject) => {
			const db = require('../db/Goodses.json');
			if (db) {
				resolve({
					data: {
						code: 2000,
						allGoods: db
					}
				});
			} else{
				reject({
					data: {
						code: 4004
					}
				})
			}
	});
};
export default {
	props:{
		searchQuery:String
	},
	components: {
		Banner,
		Goods,
		Jas
	},
	async created() {
		try{
			let {data: { code, allGoods }}=await this.$axios.get('/goods/all')
			if (code == 2000) {
				this.goodses = allGoods;
				this.sortSell() 
			}
		}catch(e){
			let {data: { code, allGoods }}=	await getAllGoodsFromDB()
			if (code == 2000) {
				this.goodses = allGoods;
				this.sortSell() 
			}
		}
		/* 3/16
		* @param this.searchQuery  string type means has query by searchBar 
	    * if it is undefinde means it comes from ranking button 
		* 
		 */
		if(typeof this.searchQuery=='string'){
			let goodsesKeyWords=this.setGoodsKeyWords()
			let newGoodses=[]
			goodsesKeyWords.forEach(goodsKeyWords=>{
				goodsKeyWords.keyWords.forEach(keyWord=>{
					if(keyWord.indexOf(this.searchQuery)>-1)
					newGoodses.push(goodsKeyWords.goods)
				})
			})
			this.goodses=newGoodses
		}
	},
	computed: {
		...mapState({
			name: state => state.module.name,
			showJas: state => state.jas.showJas
		})
	},
	data() {
		return {
			goodses: [],
			valueSort: true,
			sellSort: false,
			discountSort: true,
		};
	},
	methods: {
		/* 
		 * set keyWords for goodses to search , 
		 * the item in array has name, cid , complete goods info and  keyWords
		 * */
		setGoodsKeyWords(){
			let goodses=this.goodses
			return	goodses.map(goods => {
						let skus=[]
						goods.vars.forEach(sku=>{
							skus.push(...Object.values(sku.attrs))
						})
						let goodsKeyWords=[goods.name,goods.department,...Object.values(goods.attrs),goods.shopName,...skus]
						return {
							name:goods.name,
							cid:goods.cid,
							goods,
							keyWords:[...new Set(goodsKeyWords)]
						} 
					});
		},
		sortPrice() {
			let goodses = this.goodses;
			this.goodses = goodses.sort((a, b) => {
				let r = this.valueSort ? a.price - b.price : b.price - a.price;
				return r;
			});
		},
		sortSell() {
			let goodses = this.goodses;
			this.goodses = goodses.sort((a, b) => {
				let r = this.sellSort ? a.sellNum - b.sellNum : b.sellNum - a.sellNum;
				return r;
			});
		},
		sortDiscount() {
			let goodses = this.goodses;
			this.goodses = goodses.sort((a, b) => {
				let r = this.discountSort
					? b.price / b.oriPrice - a.price / a.oriPrice
					: a.price / a.oriPrice - b.price / b.oriPrice;
				return r;
			});
		},
	},
	
};
</script>

<style lang="less" scoped>
@import './src/list.less';
</style>
