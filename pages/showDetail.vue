<template>
	<div class="warpper">
		<section class="assort">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
				<el-breadcrumb-item :to="'/shop/'+goods.shopCid ">{{ goods.shopName }}</el-breadcrumb-item>
				<el-breadcrumb-item :to="'/list/'+goods.department">{{ goods.department }}</el-breadcrumb-item>
				<el-breadcrumb-item>{{ goods.name }}</el-breadcrumb-item>
			</el-breadcrumb>
		</section>
		<Jas v-if="showJas.visible" :isRealMan="showJas.isRealMan" />
		<section class="goods-info">
			<Picture :curImg="oriImg" @changeImg='changeImg'/>
			<div class="goods">
				<div class="goods-title">
					{{ goods.name }}
					<div class="jas">
						<a @click="goJas(false)">
							<i class="icon-message iconfont"></i>
							智慧客服
						</a>
						<a @click="goJas(true)">
							<i class="icon-user iconfont"></i>
							人工客服
						</a>
					</div>
				</div>
				<div class="goods-price">
					<div class="goods-price-num">¥{{ sku.price * num }}</div>
					<section class="goods-price-count">
						<div class="goods-price-count-num">{{ sku.count }}折</div>
						<div class="goods-price-count-oriprice">¥{{ sku.oriPrice }}</div>
					</section>
					<div class="goods-price-resttime">超低折扣距离结束 : {{ restTime }}</div>
				</div>
				<div class="goods-size">
					<div class="goods-size-size">
						<span class="title">尺寸</span>
						<el-radio-group size="medium" v-model="sku.size" @change="chooseSize">
							<el-radio-button
								:disabled="item.disabled"
								:label="item.value"
								v-for="(item, idx) in sizeShowArr"
								:key="idx"
							></el-radio-button>
						</el-radio-group>
						<i class="el-icon-circle-close" v-if="isChooseSize" @click="clearSize"></i>
					</div>
					<div class="goods-size-type">
						<span class="title">类型</span>
						<el-radio-group size="medium" v-model="sku.type" @change="chooseType">
							<el-radio-button
								:disabled="item.disabled"
								:label="item.value"
								v-for="(item, idx) in typeShowArr"
								:key="idx"
							></el-radio-button>
						</el-radio-group>
						<i class="el-icon-circle-close" v-if="isChooseType" @click="clearType"></i>
					</div>
				</div>
				<div class="goods-addr">
					<span class="title">配送至</span>
					<el-cascader
						:options="addrOption"
						v-model="selectedAddr"
						@change="onselcetAddr"
						placeholder="选择地区"
					></el-cascader>
					<span class="nearly-inventory" v-if="nearlyInventory">
						最近
						<span v-if="hasTypeAndSize">有货</span>
						<span v-else="">仓库</span>
						{{ nearlyInventory }}
					</span>
				</div>
				<div class="input-number">
					<span class="title">数量</span>
					<el-input-number v-model="num" :min="1" size="medium"></el-input-number>
					<span class="inventory" v-if="inventoryNum">库存 {{ inventoryNum }}</span>
				</div>
				<div class="btn-div-detail">
					<el-button type="primary" @click="putInCart">加入购物车</el-button>
					<el-button type="primary" @click="onBuy">立即购买</el-button>
				</div>
				<div class="goods-share">
					<nuxt-link :to="'/shop/'+goods.shopCid">
						<i class="iconfont icon-shop"></i>
						<span>{{goods.shopName}}</span>
					</nuxt-link>
					<span class="fav" v-if="!fav" @click="onfav(true)">
						收藏商品
						<i class="el-icon-star-off"></i>
					</span>
					<span class="fav" v-else @click="onfav(false)">
						取消收藏
						<i class="el-icon-star-on"></i>
					</span>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Picture from "~/components/detail/Picture.vue"
import Jas from '~/components/index/Jas.vue';
import CityCoord from '~/db/CityCoord.json'
import Inventory from '~/db/Inventory.json'
import sutil from '~/public/util'
import axios from '~/public/axios'
export default {
	computed: {
		...mapState({
			curLocation:state=>state.geo.curLocation,
			userInfo:state=>state.user.userInfo,
			showJas: state => state.jas.showJas,
			lastCart:state=>state.user.lastCart
		}),
		/* 
		 * if updateView is true , means user has clicked the fav button ,
		 * and has already return . db now is update ,so in front we set updateView to update view
		 * */
		fav(){
			if(this.updateView){
				return this.isFav
			}else{
				return this.goods.fav
			}
		}
	},
	components:{
		Picture,Jas
	},
	data() {
		return {
			restTime: '',
			/*  sizeShowArr:[disabled:false,value:"large"]*/
			sizeShowArr: [],
			typeShowArr: [],
			/*  inventoryNum:3, nearlyInventory:Tokyo, inventorys:[{}]*/
			inventoryNum: '',
			inventorys:[],
			nearlyInventory:"",
			//control clear botton diaplay
			isChooseSize: false,
			isChooseType: false,
			hasTypeAndSize:false,
			sku: {
				skuCid: '',
				type: '',
				size: '',
				price: '',
				oriPrice: '',
				count: ''
			},
			num: 1,
			selectedAddr:[] ,
			goods:{},
			curImg:'',
			oriImg:'',
			addrOption:[],
			isLogin:false,
			isFav:false,
			updateView:false
		};
	},
	/* because use the asyncData ,the props cid from vue-router is not needed */
	props: {
		cid: String
	},
	methods: {
		...mapMutations({
			setUser: 'user/setUser',
			setMeImgAva: 'jas/setMeImgAva',
			setShowJas: 'jas/setShowJas',
			setLastCart: 'user/setLastCart'
		}),
		goJas(isRealMan) {
			this.setShowJas({ visible: true, isRealMan });
		},
		changeImg(val){
			this.curImg=val
		},
		judgeLogin(){
			if(!this.userInfo){
				this.$message({
					message: "请登录",
					type: 'error',
					duration: 3000,
					center: true,
					customClass: 'message-info'
				});
				this.$router.push({path:"/login?redirect="+this.$route.path})
				return false
			}else{
				return true
			}
		},
		judgeChooseSku(){
			if(!this.hasTypeAndSize){
				this.$message({
					message: "请选择尺寸和型号",
					type: 'error',
					duration: 3000,
					center: true,
					customClass: 'message-info'
				});
				return false
			}else{
				return true
			}
		},
		judgeTimeInterval(){
			let that=this
			if(this._timer5){
				this.$message({
					message: "5秒内仅可点击一次",
					type: 'error',
					duration: 3000,
					center: true,
					customClass: 'message-info'
				});
				return false
			}else{
				this._timer5=setTimeout(()=>{
					that._timer5=null
				},5000)
				return true
			}
		},
		async putInCart(){
			if(!this.judgeLogin()) return
			if(!this.judgeChooseSku()) return
			if(!this.judgeTimeInterval()) return
		
			let {name:username,safeInfo,identity,fav}=this.userInfo,
				userInfo={username,email:safeInfo[0].email,identity,fav}
			let {shopName,shopCid,department}=this.goods,
				shopInfo={shopName,shopCid,department}
			let {cid,name}=this.goods,
				goodsesInfo={
					cid,
					name,
					department,
					imgs:this.curImg,
					num: this.num,
					sku: this.sku,
					inventorys: this.inventorys,
					time:new Date().getTime()
				}
			let {data:{code,result}}=await axios.post("/goods/userCart",{userInfo,shopInfo,goodsesInfo})
			if(code==2000){
				await axios.post("/goods/last",{userInfo,shopInfo,goodsesInfo})
				let lastCart=this.lastCart
				lastCart.unshift({userInfo,shopInfo,goodsesInfo})
				while(lastCart.length>2){
					lastCart.pop()
				}
				this.setLastCart(lastCart)
				this.$message({
					message: "加入购物车成功",
					type: 'success',
					duration: 3000,
					center: true,
					customClass: 'message-info'
				});
			}
		},
		async onBuy(){
			if(!this.judgeLogin()) return
			if(!this.judgeChooseSku()) return
			if(!this.judgeTimeInterval()) return
				
			let payList={
				cid:new Date().getTime()+"_"+this.userInfo.name,
				state:"create",
				username:this.userInfo.name,
				userInfo:this.userInfo,
				goods:this.goods,
				imgs:this.curImg,
				num: this.num,
				totalPrice:(this.num*this.sku.price).toFixed(2),
				sku: this.sku,
				inventorys: this.inventorys,
				createTime: new Date().toLocaleString('zh', { hour12: false })
			}
			let {data:{code}}=await axios.post("/list/payList",{payList})
			if(code==2000){
				this.$router.push({path:'/payList/create'})
			}else{
				this.$message({
					message: "数据库错误,错误码${code}",
					type: 'error',
					duration: 3000,
					center: true,
					customClass: 'message-info'
				});
			}
		},
		/* 
		 * on  click button  fav
		 * */
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
		/* Count down */
		beginRestTime() {
			let totolSeconds = this.goods.restTime * 60 * 60;
			this._timer = setInterval(() => {
				if (totolSeconds <= 0) clearInterval(this._timer);
				let hour = Math.floor(totolSeconds / 60 / 60);
				let minutes = Math.floor(totolSeconds / 60 - hour * 60);
				let seconds = Math.floor(totolSeconds - hour * 3600 - minutes * 60);
				(seconds = seconds < 10 ? '0' + seconds : seconds),
					(minutes = minutes < 10 ? '0' + minutes : minutes),
					(hour = hour < 10 ? '0' + hour : hour),
					(this.restTime = `${hour}:${minutes}:${seconds}`);
				totolSeconds--;
			}, 1000);
		},

		/* get the nearest inventory ,trigger at change city or both choose size and type*/
		onselcetAddr() {
			let destCity=this.selectedAddr.length?this.selectedAddr[1]:""
			let destAddrCoord=[]
			let hasTypeAndSize=false
			if(CityCoord.cityMap.hasOwnProperty(destCity)){
				destAddrCoord=CityCoord.cityMap[destCity]
				let shopCid=this.goods.shopCid
				let inventorys=this.inventorys||[{locationCity:"暂无仓库信息",targetNum:"暂无库存信息"}]
				let nearlyInventory=''
				let inventoryNum=0
				let distanceToStore=9999
				/* find  all inventorys of the shop */
				if(!inventorys.length){
					Inventory.forEach(store=>{
						if(store.shopCid==shopCid){
							inventorys.push(store)
						}
					})
				}
				/* has set inventorys of the shop which has sku in function updataSku */
				inventorys.forEach(store=>{
					let newDistance = sutil.getDistance(destAddrCoord[0],destAddrCoord[1],store.location[0],store.location[1])
					if(distanceToStore>newDistance){
						distanceToStore=newDistance
						nearlyInventory=store.locationCity
						if(store.targetNum){
							inventoryNum=store.targetNum
						}
					}
				})
				this.nearlyInventory=nearlyInventory
				this.inventorys=inventorys
				if(this.hasTypeAndSize)
					this.inventoryNum = inventoryNum
			}else{
				this.inventorys=[]
				this.nearlyInventory='暂无仓库信息'
			}
		},
		chooseSize(val) {
			let skus = this.goods.vars;
			let typeShowArr = this.typeShowArr;
			this.isChooseSize = true;
			typeShowArr = typeShowArr.map(i => ({ disabled: true, value: i.value }));
			skus.forEach(item => {
				if (item.attrs.size == val) {
					for (let i = 0; i < typeShowArr.length; i++) {
						if (typeShowArr[i].value == item.attrs.type) {
							typeShowArr[i].disabled = false;
						}
					}
				}
			});
			this.typeShowArr = typeShowArr;
			this.updataSku();
		},
		clearSize() {
			this.initSku();
			this.isChooseSize = false;
			this.inventorys=[]
			this.hasTypeAndSize=false
		},
		chooseType(val) {
			let skus = this.goods.vars;
			let sizeShowArr = this.sizeShowArr;
			this.isChooseType = true;
			sizeShowArr = sizeShowArr.map(i => ({ disabled: true, value: i.value }));
			skus.forEach(item => {
				if (item.attrs.type == val) {
					for (let i = 0; i < sizeShowArr.length; i++) {
						if (sizeShowArr[i].value == item.attrs.size)
							sizeShowArr[i].disabled = false;
					}
				}
			});
			this.sizeShowArr = sizeShowArr;
			this.updataSku();
		},
		clearType() {
			this.initSku();
			this.isChooseType = false;
			this.inventorys=[]
			this.hasTypeAndSize=false
		},
		/* updete the view for sku's price ,count , inventory and so on ,when choose size or type will trigger */
		async updataSku() {
			let sku = this.sku;
			let goods = this.goods;
			let skus = goods.vars;
			let hasInventory = false;
			if (sku.size && sku.type) {
				this.hasTypeAndSize=true
				/* update this sku view  */
				skus.forEach(item => {
					if (item.attrs.size == sku.size && item.attrs.type == sku.type) {
						sku.skuCid = item.sku;
						sku.price = item.price;
						sku.oriPrice = item.oriPrice;
						sku.count = ((10 * item.price) / item.oriPrice).toFixed(1);
						/*
						* in real ,should find sku in invnetory db by sku.cid and goods.shopCid
						*  here is simulation */
						hasInventory = true;
						this.sku = sku;
					}
				});
				if (hasInventory) {
						let {data:{code,inventorys}}=await this.$axios.get('/goods/inventorys',{params:{shopCid:goods.shopCid,sku:sku.skuCid}})
						if(code==2000){
							this.inventorys=inventorys
							/*computed the nearest inwentory which has target goods skus*/
							this.onselcetAddr()
						}else{
							this.inventoryNum = "【错误:显示实时库存,需连接数据库】"
						}
				} else {
					this.inventoryNum = '暂无库存';
				}
			} else {
				sku.price = goods.price;
				sku.oriPrice = goods.oriPrice;
				sku.count = ((10 * goods.price) / goods.oriPrice).toFixed(1);
				this.inventoryNum = '请选取类型';
			}
		},
		initSku() {
			this.sku.size = '';
			this.sku.type = '';
			let goods = this.goods;
			/* type and size , remove repeat */
			let typeShowArr = [],
				sizeShowArr = [];
			goods.vars.forEach(item => {
				typeShowArr.push(item.attrs.type);
				sizeShowArr.push(item.attrs.size);
			});
			sizeShowArr = [...new Set(sizeShowArr)];
			typeShowArr = [...new Set(typeShowArr)];
			this.typeShowArr = typeShowArr.map(i => ({ disabled: false, value: i }));
			this.sizeShowArr = sizeShowArr.map(i => ({ disabled: false, value: i }));
			this.isChooseSize = false;
			this.isChooseType = false;
			this.updataSku();
		},

		initUser() {
			let userInfo = localStorage.getItem('userInfo') || localStorage.getItem('tempUserInfo');
			if (userInfo) {
				userInfo = JSON.parse(userInfo);
				this.setUser(userInfo);
				this.setMeImgAva(userInfo.img);
			}
		},
		async initGoods() {
			/* try to connect koa db router */
				let [rGoods,rAddr]= await Promise.all([
					 this.$axios.get('/goods/getOneGoods?cid=' + this.cid),
					 this.$axios.get('/geo/province'),
				])
				let {data: { code:code_goods, goods }} = rGoods;
				let {data: { code:code_addr, province }} = rAddr;
				/* addr db is exist */
				if(code_addr==2000){
					province=province.map(i=>({
						value:i.name,
						label:i.name,
						children:i.citys.map(city=>({
							value:city,
							label:city
						}))
					}))
				}else{
					/* addr db is  not exist ,data comes from local json*/
					const allProvinces=require('~/db/Province.json')
					if(allProvinces.length){
						province = allProvinces.map(item => {
							return {
								value: item.name.replace(/[省市]/, ''),
								label:item.name.replace(/[省市]/, ''),
								children: item.city.map(city => ({
									value:sutil.trimCity(city.name),
									label:sutil.trimCity(city.name)
									})
								)
							}
						})
					}else{
						/* local json is be deleted */
						province=[
							{
								value:"缺少数据库",
								label:"缺少数据库",
								children:[{
									value:'need db!',
									label:'need db!'
								},{
									value:'无定位的南宁',
									label:'无定位的南宁'
								},
								{
									value:'无定位的广州',
									label:'无定位的广州'
								}],
							}]
					}
				}
				/* db is connect ,then return global var */
				if (code_goods == 2000) {
						this.goods=goods
						this.curImg=goods.imgs.hot
						this.oriImg=goods.imgs.hot
						this.addrOption=province
						return true
				} else {
					/* not find goods info in db ,try to find in local db json ,then return global var*/
					const allGoods=require('../db/Goodses.json')
					if(!allGoods.length){
						this.$router.replace('/404');
						return false
					}else{
						let goods={}
						allGoods.forEach(i=>{
							if(i.cid==this.cid)
								goods=i
						})
						this.goods=goods
						this.curImg=goods.imgs.hot
						this.oriImg=goods.imgs.hot
						this.addrOption=province
						return true
					}
				}
		},
		async getUserInfo(){
			let {data: { code: code_user, user }}= await axios.get('/user/curUser')
			if (code_user == 2000) {
				this.setUser(user)
				this.setMeImgAva(user.img)
				return true 
			}else{
				return false 
			}
		}
	},
	async mounted() {
		if(!this.userInfo){
			this.isLogin=await this.getUserInfo()
		}
		let hasGoods=await  this.initGoods()
		if(hasGoods){
			this.beginRestTime();
			this.initSku();
			/* init user's location city  */
			this.selectedAddr.push(this.curLocation.province,this.curLocation.city)
			/* query nearly inventory to user's city */
			this.onselcetAddr()
		}
	},
	
};
</script>

<style lang="less" scoped>
@import 'src/showDetail.less';
</style>
<style lang="less">
.assort {
	.el-breadcrumb__inner {
		font-size: 1rem;
	}
	.el-breadcrumb__inner.is-link{
		font-weight: normal;
		color: #606266;
		&:hover{
			color: purple;
		}
	}
}
.input-number {
	.el-input-number {
		width: 13rem;
	}
	.el-input-number__decrease {
		background-color: purple;
		border: none;
		border-radius: 2px 0 0 2px;
		&:hover {
			color: white;
		}
	}
	.el-input-number__increase {
		background-color: purple;
		border: none;
		border-radius: 0 2px 2px 0;
		&:hover {
			color: white;
		}
	}
	.el-input__inner {
		text-align: center;
		padding: 0;
		color: purple;
	}
}
.el-cascader-menus {
	.el-cascader-menu__item:focus:not(:active) {
		background-color: purple;
		color: white;
	}
}
.goods-addr {
	.el-cascader {
		width: 13rem;
	}
	.el-cascader .el-input.is-focus .el-input__inner {
		border-color: purple;
		color: purple;
	}
}
.btn-div-detail {
	.el-button {
		min-width: 8rem;
	}
}
</style>
