<template>
	<section class="warpper">
		<Jas v-if="showJas.visible" :isRealMan="showJas.isRealMan" />
		<el-tabs v-model="activeName" @tab-click="onchangeTab">
			<el-tab-pane label="全部订单" name="all"></el-tab-pane>
			<el-tab-pane label="待付款" name="create"></el-tab-pane>
			<el-tab-pane label="待发货" name="pay"></el-tab-pane>
			<el-tab-pane label="待收货" name="deliver"></el-tab-pane>
			<el-tab-pane label="待评价" name="done"></el-tab-pane>
		</el-tabs>
		<div v-if="!isEmpty">
			<dl>
				<dd v-for="(list, idx) in curLists" :key="idx">
					<PayList
						:list="list"
						:activeName="activeName"
						@delList="onDelList(list)"
						@onpay="onpay(list, arguments)"
					/>
				</dd>
			</dl>
		</div>
		<div v-else class="empty">{{ emptyMsg }}</div>
	</section>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import PayList from '~/components/paylist/PayList.vue';
import Jas from '~/components/index/Jas.vue';
import axios from '~/public/axios';
export default {
	components: {
		PayList,Jas
	},
	/* user click from header  */
	props: {
		pickActive: String
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
			showJas: state => state.jas.showJas
		})
	},
	data() {
		return {
			activeName: '',
			allLists: [],
			curLists: [],
			isEmpty: null,
			emptyMsg: '暂无订单'
		};
	},
	methods: {
		...mapMutations({
			setUser: 'user/setUser',
			setMeImgAva: 'jas/setMeImgAva'
		}),
		onchangeTab(tab) {
			if (this.allLists[this.activeName].length) {
				this.curLists = this.allLists[this.activeName];
				this.isEmpty = false;
			} else {
				this.isEmpty = true;
			}
		},
		async onDelList(list, idx) {
			let {
				data: { code }
			} = await this.$axios.delete('/list/payList', { data: { cid: list.cid } });
			if (code == 2000) {
				this.getAllLists();
			}
		},
		async onpay() {
			// whichTime is from child emit and list is from parent params
			let [list, [whichTime]] = arguments;
			let {
				data: { code }
			} = await this.$axios.put('/list/payList', {
				cid: list.cid,
				value: new Date().toLocaleString('zh', { hour12: false }),
				whichTime
			});
			if (code == 2000) {
				let message=''
				if(whichTime == 'payTime' ){
					message='付款成功,等待卖家发货' 
				}else if(whichTime == 'doneTime' ){
					message='收货成功,发表一条评论吧' 
				} else if(whichTime == 'deliverTime' &&this.userInfo.identity=='admin'){
					message='发货成功,等待买家确认' 
				}
				this.$message({
					message,
					type: 'success',
					duration: 3000,
					center: true,
					customClass: 'message-info'
				});
				/* location the Goods the newest  state*/
				let path=whichTime.substr(0,whichTime.length-4)
				this.$router.push({path:'/payList/'+path})
			}
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
		async getAllLists() {
			let username = this.userInfo.name;
			let {
				data: { code, allLists }
			} = await axios.get('/list/allPayList', { params: { username } });
			//allLists is not empty but not ensure the others is empty or not 
			if (code == 2000) {
				this.allLists = allLists;
				if (allLists[this.activeName].length) {
					this.curLists = allLists[this.activeName];
					this.isEmpty = false;
				} else {
					this.isEmpty = true;
				}
			} else {
				// code is 4004 ,5003 or 2004
				this.isEmpty = true;
				this.allLists= {
					"all": [],
					"create": [],
					"pay": [],
					"deliver": [],
					"done": []
				}
			}
		},
		// seller click deliver button ,return is login state
		isClickSellerPay() {
			if (this.userInfo.identity == 'buyer') {
				this.$message({
					message: '请卖家登陆,以使用卖家发货功能',
					type: 'error',
					duration: 4000,
					center: true,
					customClass: 'message-info'
				});
				this.$router.replace({ path: '/login?redirect=/payList' });
				return false;
			} else if (this.userInfo.identity == 'admin') {
				this.$message({
					message: '卖家权限仅能使用发货功能',
					type: 'success',
					duration: 4000,
					center: true,
					customClass: 'message-info'
				});
				this.activeName = 'pay';
				return true;
			}
		}
	},
	async mounted() {
		/* init login state  */
		if (!this.userInfo) {
			let isLogin = await this.getUserInfo();
			if (!isLogin) {
				this.$router.replace({ path: '/login?redirect=/payList' });
				return;
			}
		}
		/* 
		* judge the props ,if pickActive has value ,it is comes from header click
		 * if pickActive is empty , it is comes from onGoodsBuy button  */
		if (this.pickActive) {
			if (this.pickActive == 'sellPay') {
				if (!this.isClickSellerPay()) return;
			} else {
				this.activeName = this.pickActive;
			}
		} else {
			this.activeName = 'create';
		}
		this.getAllLists();
	}
};
</script>

<style lang="less" scoped>
@import './src/payList.less';
</style>
<style lang="less">
.warpper {
	.el-tabs {
		display: block;
		margin: 1rem auto;
		margin-bottom: -1rem;
		width: 40rem;
		.el-tabs__nav-scroll {
			display: flex;
			justify-content: center;
			.el-tabs__item {
				font-size: 1rem;
				color: purple;
			}
		}
	}
}
</style>
