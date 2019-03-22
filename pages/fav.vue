<template>
    <section class="warpper">
        <Jas v-if="showJas.visible" :isRealMan="showJas.isRealMan" />
        <section class="err" v-if="isErr">{{ errMsg }}</section>
        <section class="goodses" v-else="">
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
import Goods from '~/components/shop/Goods.vue';
import Jas from '~/components/index/Jas.vue';
import { mapState,mapMutations } from 'vuex';
import axios from '~/public/axios';
export default {
	components: {
		Goods,Jas
	},

	async mounted() {
        if (!this.userInfo) {
        	let isLogin = await this.getUserInfo();
        	if (!isLogin) {
               this.$message.error('查看收藏夹请先登录');
        		this.$router.replace({ path: '/login?redirect=/payList' });
        		return;
        	}
        }
        let {
            data: { code, userfav }
        } = await axios.get('/user/fav', { params: { username: this.userInfo.name } });
        if (code == 2000) {
            let {favArr} =userfav
            this.goodses = favArr;
            this.isErr=false
        }else if (code == 4004){
            this.isErr=true
            this.errMsg='收藏夹空空如也'
        }else{
            this.isErr=true
            this.errMsg='查询失败,数据库错误'
        }

	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
			showJas: state => state.jas.showJas
		})
	},
	data() {
		return {
			goodses: [],
			valueSort: true,
			sellSort: false,
			discountSort: true,
			isErr:true,
			errMsg:""
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
        		return true;
        	} else {
        		return false;
        	}
        },
        ...mapMutations({
        	setUser: 'user/setUser',
        	setMeImgAva: 'jas/setMeImgAva'
        }),
	}
};
</script>

<style lang="less" scoped>
@import './src/list.less';
</style>
