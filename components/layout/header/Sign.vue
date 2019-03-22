<template>
	<div>
		<el-steps id="steps" :active="signedDay" space="4rem">
			<el-step
				v-for="(item, idx) in aWeek"
				:key="idx"
				:title="item + '天'"
				icon="el-icon-success"
			></el-step>
		</el-steps>
		<div class="hr"></div>
		<section class="footer">
			<span>每天签到能获取经验，连续签到更享心动奖励</span>
			<el-button type="primary" icon="el-icon-success" size="small" @click="sign">
				签到
			</el-button>
		</section>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import axios from '~/public/axios'
export default {
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	data() {
		return {
			aWeek: [1, 2, 3, 4, 5, 6, 7],
			signedDay: 0
		};
	},
	 async created() {
         if (!this.userInfo) {
        	this.signedDay =  0;
        }else{
            this.signedDay = this.userInfo.userInfo[0].signedDay ;
        }
		
	},
	methods: {
		...mapMutations({
			setUser: 'user/setUser'
		}),
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
		async sign() {
            if (!this.userInfo) {
            	let isLogin = await this.getUserInfo();
            	if (!isLogin) {
                   this.$message.error('签到请先登录');
            		this.$router.replace({ path: '/login' });
            		return;
            	}
            }
			if (this.signedDay >= 7) {
				this.$message({
					message: '恭喜您,已连续登录七天',
					type: 'success',
					duration: 4000,
					center: true,
					customClass: 'message-info'
				});
				return;
			}
			let {
				status,
				data: { code, msg, newUserInfo, levelUp }
			} = await axios.post('/user/signDay', {
				name: this.userInfo.name
			});
			let messageState = 'error';
			if (code == 2000) {
				let { experience, rank, signedDay, money, ranks } = newUserInfo;
				//view for current component
				this.signedDay = signedDay;
				// view for refresh
				let localName = localStorage.getItem('userInfo') ? 'userInfo' : 'tempUserInfo';
				let userInfo = this.userInfo;
				userInfo.userInfo.splice(0, 1, newUserInfo);
				localStorage.setItem(localName, JSON.stringify(userInfo));
				// view for other component
				this.setUser(userInfo);
				messageState = 'success';
				if (levelUp) {
					msg = msg + ',金币+20,Exp+30,等级+1';
				} else {
					msg = msg + ',金币+20,Exp+30';
				}
			} else if (code == 4004) {
				this.signedDay = 0;
			} else if (code == 5003){
				this.$router.replace({ path: '/login' });
			}
			this.$message({
				message: msg,
				type: messageState,
				duration: 3000,
				center: true,
				customClass: 'message-info'
			});
		}
	}
};
</script>

<style lang="less">
#steps {
	.el-step__title {
		padding-left: 10px;
	}
	.el-step__head.is-success {
		color: mediumorchid;
		border-color: mediumorchid;
	}
	.el-step__title.is-success {
		color: mediumorchid;
	}
	.el-step__head.is-process {
		color: #c0c4cc;
		border-color: #c0c4cc;
	}
	.el-step__title.is-process {
		font-weight: normal;
		color: #c0c4cc;
	}
}
.hr {
	height: 1px;
	background-color: purple;
	margin: 0.5rem 1rem 0.5rem 0;
}
.footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: purple;
	margin-right: 10px;
	margin-top: 15px;
}
.message-info {
		i,
		p {
			color: purple !important;
		}
	
}
</style>
