<template>
	<el-row class="body header" id="header">
		<el-col :span="10" class="header-left">
			<ul @mouseover="mover" @mouseleave="mout">
				<li class="home">
					<nuxt-link to="/">
						<i class="icon-home iconfont"></i>
						首页
					</nuxt-link>
				</li>
				<li class="cur-city">
					<nuxt-link to="/changeCity">
						<i class="el-icon-location"></i>
						{{ curLocation.city }}
					</nuxt-link>
				</li>
				<li class="geo-service">
					地理服务
					<div
						class="geo-service-div"
						v-if="userSelect == 'geo-service'"
						@mouseenter="menter"
						@mouseleave="mleave"
					>
						<span class="item change-area">
							<nuxt-link to="/changeCity">
								<img src="../../assets/layout/location.gif" alt="" />
								更改地区
							</nuxt-link>
						</span>
						<span class="item find-shop">
							<nuxt-link to="/findShops">
								<img src="../../assets/layout/map.gif" alt="" />
								查找门店
							</nuxt-link>
						</span>
					</div>
				</li>
				<li class="online-consult">
					在线咨询
					<div
						class="online-consult-div"
						v-if="userSelect == 'online-consult'"
						@mouseenter="menter"
						@mouseleave="mleave"
					>
						<div class="item">
							<a @click="goJas(false)">
								<img :src="jasImgAva" alt="" />
								智慧客服
							</a>
						</div>
						<div class="item">
							<a @click="goJas(true)">
								<img :src="jasManImgAva" alt="" />
								人工客服
							</a>
						</div>
					</div>
				</li>
			</ul>
		</el-col>
		<el-col :span="14" class="header-right">
			<ul @mouseover="mover" @mouseleave="mout">
				<li v-if="!isLogin">
					<nuxt-link :to="'/login?redirect='+$route.path">登录</nuxt-link>
					/
					<nuxt-link to="/register">注册</nuxt-link>
				</li>
				<li class="login" v-else="">
					<img
						:class="['user-pic', userSelect == 'login' ? 'active' : '']"
						:src="meImgAva"
						@mouseenter="userSelect = 'login'"
					/>
					<User-info
						class="login-div"
						v-if="userSelect == 'login'"
						@logout="isLogin = false"
					></User-info>
				</li>
				<li class="sign">
					签到有礼
					<div
						class="sign-div"
						v-if="userSelect == 'sign'"
						@mouseenter="menter"
						@mouseleave="mleave"
					>
						<Sign />
					</div>
				</li>
				<li class="cart" @click="redirect('cart')">
					购物袋
					<span class="num">3</span>
					<div
						class="cart-div islogin"
						v-if="showCart == 3"
						@mouseenter="menter"
						@mouseleave="mleave"
					>
						<div class="q-title">最近加入的宝贝:</div>
						<dl>
							<dd v-for="(goods, idx) in goodses" :key="idx">
								<nuxt-link to="/cart">
									<One-goods :goods="goods.goodsesInfo" ></One-goods>
								</nuxt-link>
							</dd>
						</dl>
						<div class="hr"></div>
						<el-button class="go-cart-btn" type="primary" size="small">
							<nuxt-link to="/cart">查看我的购物袋</nuxt-link>
						</el-button>
					</div>
					<div class="cart-div not-login" v-if="showCart == 1">
						<div class="q-title">好像还未登录！</div>
						<nuxt-link :to="'/login?redirect='+$route.path">
							<el-button type="primary" size="small">马上登录</el-button>
						</nuxt-link>
						<div class="q-title">查看购物袋吧！</div>
					</div>
				</li>
				<li class="order">
					我的订单
					<i class="el-icon-arrow-up" v-if="userSelect == 'order'"></i>
					<i class="el-icon-arrow-down" v-else></i>
					<dl
						v-if="userSelect == 'order'"
						class="order-div"
						@mouseenter="menter"
						@mouseleave="mleave"
					>
						<dd><nuxt-link to="/payList/create">待付款</nuxt-link></dd>
						<dd><nuxt-link to="/payList/pay">待发货</nuxt-link></dd>
						<dd><nuxt-link to="/payList/deliver">待收货</nuxt-link></dd>
						<dd><nuxt-link to="/payList/done">待评价</nuxt-link></dd>
						<dd><nuxt-link to="/payList/sellPay">卖家发货</nuxt-link></dd>
					</dl>
				</li>
				<li class="my" >
					小铺动态
					<i class="el-icon-arrow-up" v-if="userSelect == 'my'"></i>
					<i class="el-icon-arrow-down" v-else></i>
					<div
						class="my-div"
						@mouseenter="menter"
						@mouseleave="mleave"
						v-if="showCart == 4||showCart == 2"
					>
						<dl>
							<dd v-for="(weibo, idx) in weibos" :key="idx">
								<nuxt-link :to="'/showDetail/'+weibo.cid">
									<My-weibo :weibo="weibo"></My-weibo>
								</nuxt-link>
							</dd>
						</dl>
					</div>
					<!-- <div class="my-div not-login" v-if="showCart == 2">
						<div class="q-title">好像还未登录！</div>
						<nuxt-link :to="'/login?redirect='+$route.path">
							<el-button type="primary" size="small">马上登录</el-button>
						</nuxt-link>
						<div class="q-title">查看小铺动态吧！</div>
					</div> -->
				</li>
				<li class="list">
                    <a href="https://www.jianshu.com/p/f205a865aa5c">
                        设计思路
                    </a>
				</li>
			</ul>
		</el-col>
	</el-row>
</template>

<script>
import UserInfo from './header/UserInfo.vue';
import Sign from './header/Sign.vue';
import MyWeibo from './header/MyWeibo.vue';
import OneGoods from './header/OneGoods.vue';
import listData from './header/listData.js';
import { mapState, mapMutations } from 'vuex';
import CryptoJS from 'crypto-js';
import axios from '~/public/axios';
export default {
	components: {
		UserInfo,
		Sign,
		MyWeibo,
		OneGoods
	},
	computed: {
		...mapState({
			curLocation: state => state.geo.curLocation,
			meImgAva: state => state.jas.meImgAva,
			userInfo: state => state.user.userInfo,
			lastCart: state => state.user.lastCart
		})
	},
	async mounted() {
		if(!this.userInfo){
			this.isLogin=await this.getUserInfo()
		}else{
			this.isLogin=true
		}
		if(this.isLogin)
			 this.getCart()
	},
	watch: {
		userSelect(val) {
			/* code state for show cart 
			  0 not show 
			  1 show cart not login 
			  2 show my not login 
			  3 show cart
			  4 show my*/
			let code = 0;
			if (this.isLogin) {
				val == 'cart' ? (code = 3) : val == 'my' ? (code = 4) : (code = 0);
			} else {
				val == 'cart' ? (code = 1) : val == 'my' ? (code = 2) : (code = 0);
			}
			this.showCart = code;
		},
		lastCart(val){
			this.goodses=val
		}
	},
	data() {
		return {
			userSelect: '',
			isLogin: false,
			//showCart define in watch
			showCart: -1,
			listData: listData,
			jasImgAva: require('~/assets/jas/jas.jpg'),
			jasManImgAva: require('~/assets/jas/jasMan.jpg'),
			goodses: Array,
			weibos: listData.weibo
		};
	},
	methods: {
		async getUserInfo(){
			let {data: { code: code_user, user }}= await axios.get('/user/curUser')
			if (code_user == 2000) {
				this.setUser(user)
				this.setMeImgAva(user.img)
				return true 
			}else{
				return false 
			}
		},
		mover(e) {
			// it can babble so used for parent
			if (this._timer) {
				clearTimeout(this._timer);
				//remove flash exit from element div to header-link
			}
			let dom = e.target;
			if (dom.tagName.toLowerCase() == 'li') {
				this.userSelect = dom.className;
			}
		},
		mout() {
			let that = this;
			this._timer = setTimeout(() => {
				that.userSelect = '';
			}, 200);
		},
		menter() {
			// _timer for union menu is a good method
			clearTimeout(this._timer);
		},
		mleave() {
			this.userSelect = '';
		},
		...mapMutations({
			setShowJas: 'jas/setShowJas',
			setUser: 'user/setUser',
			setMeImgAva: 'jas/setMeImgAva',
			setLastCart: 'user/setLastCart',
		}),
		goJas(isRealMan) {
			this.setShowJas({ visible: true, isRealMan });
		},
		redirect(target) {
			this.$router.push({ path: '/' + target });
		},
		async getCart(){
			let {data:{code,lastGoodses}}=await axios.get("/goods/LastGoodsInCart",{params:{username:this.userInfo.name}})
			if(code==2000){
				this.setLastCart(lastGoodses)
				this.goodses=lastGoodses
			}
		},
	},
	
};
</script>

<style lang="less" scoped>
@import '~assets/layout/header.less';
</style>
