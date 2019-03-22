<template>
	<section class="warpper">
		<Jas v-if="showJas.visible" :isRealMan="showJas.isRealMan" />
		<section class="err" v-if="isErr">{{ errMsg }}</section>
		<section v-else class="shop">
			<div class="shop-info">
				<div class="shop-info-title">
					<span class="title">{{ shop.shopName }}</span>
					<el-rate
						v-model="shop.star"
						disabled
						show-text
						text-color="#ff9900"
						:texts="rateText"
					></el-rate>
				</div>
				<div class="shop-info-city">
					{{ shopAddr.country }}
					<span class="city">{{ shopAddr.province }}</span>
					{{ shopAddr.city }}
				</div>
				<div class="shop-info-addr">地址：{{ shopAddr.addr }}</div>
				<div class="shop-info-department">主营业务：{{ shop.department }}</div>
				<div class="shop-info-inventorys">下辖仓库：{{ storeMsg }}</div>
			</div>
			<div class="shop-info-map" id="map">
				<Amap id="map" :mapData="mapData" />
			</div>
			<div class="shop-info-inventory-map" id="inventoryMap">
				<Amap id="inventoryMap" :mapData="mapData" />
			</div>
		</section>
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
import { mapState, mapMutations } from 'vuex';
import Amap from '~/components/shop/Amap.vue';
import Goods from '~/components/shop/Goods.vue';
import Jas from '~/components/index/Jas.vue';
import axios from '~/public/axios';
export default {
	components: {
		Amap,
		Goods,
		Jas
	},
	computed: {
		...mapState({
			showJas: state => state.jas.showJas
		})
	},
	props: {
		shopCid: String
	},
	data() {
		return {
			rateText: ['极差', '失望', '一般', '满意', '惊喜'],
			valueSort: true,
			sellSort: true,
			discountSort: true,
		};
	},
	methods: {
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
		async getUserInfo() {
			let {
				data: { code: code_user, user }
			} = await axios.get('/user/curUser');
			if (code_user == 2000) {
				this.setUser(user);
				this.setMeImgAva(user.img);
			}
		},
		...mapMutations({
			setUser: 'user/setUser',
			setMeImgAva: 'jas/setMeImgAva',
		})
	},
	async mounted() {
		if (!this.userInfo) {
			await this.getUserInfo();
		}
	},
  /* init shop's  options */
	async asyncData(ctx) {
		let {shopCid} = ctx.params;
		let [rShop, rGoodses, rInventorys] = await Promise.all([
			ctx.$axios.get('/shop/shop', { params: { shopCid } }),
			ctx.$axios.get('/shop/goodses', { params: { shopCid } }),
			ctx.$axios.get('/shop/inventorys', { params: { shopCid } })
		]);
		let {
			data: { code: code_shop, shop }
		} = rShop;
		let {
			data: { code: code_goodses, goodses }
		} = rGoodses;
		let {
			data: { code: code_inventorys, inventorys }
		} = rInventorys;
		if (code_shop == 2000 && code_goodses == 2000) {
			let storeMsg = '';
			let storeArr = inventorys.map(inventory => {
				storeMsg += inventory.locationCity + inventory.storeName + '号仓库、';
				return {
					storeLocation: inventory.location,
					storeName: inventory.locationCity + inventory.storeName + '号仓库',
					locationCity: inventory.locationCity,
					shopName: inventory.shopName
				};
			});
			storeMsg = storeMsg.substring(0, storeMsg.length - 1);
			goodses = goodses.concat(goodses, goodses);
			return{
				shop :shop,
				goodses :goodses,
				inventorys :inventorys,
				storeArr :storeArr,
				storeMsg :storeMsg,
				shopAddr :shop.address,
				isErr :false,
				/* to init shopMap and inventoryMap */
				mapData :{
					location: shop.location,
					shopName: shop.shopName,
					offset: [0, 20],
					storeArr
				}
			}
		} else {
			return{
				errMsg : '店铺初始化失败,请检查数据库',
				isErr : true
			}
		}
	},
	
};
</script>

<style lang="less" scoped>
@import './src/shop.less';
</style>
<style lang="less">
.warpper {
}
</style>
