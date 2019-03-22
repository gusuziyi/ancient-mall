<template>
	<section class="wrapper">
		<div class="q-title">{{this.userInfo.name}}</div>
		<div class="header">
			<span class="left">
				<el-tooltip effect="dark" content="紫星币" placement="top">
					<i class="iconfont icon-bold"></i>
				</el-tooltip>
				{{ userInfoView.money }}
			</span>
			<span class="right">
				<el-tooltip
					effect="dark"
					content="绑定邮箱"
					placement="top"
					v-if="!safeInfoView.emailVertify"
				>
					<el-badge is-dot class="item"><i class="iconfont icon-mail"></i></el-badge>
				</el-tooltip>
				<el-tooltip effect="dark" content="已绑定邮箱" placement="top" v-else>
					<el-badge><i class="iconfont icon-mail vertify"></i></el-badge>
				</el-tooltip>
				<el-tooltip
					effect="dark"
					content="绑定QQ"
					placement="top"
					v-if="!safeInfoView.QQVertify"
				>
					<el-badge is-dot class="item"><i class="iconfont icon-QQ"></i></el-badge>
				</el-tooltip>
				<el-tooltip effect="dark" content="已绑定QQ" placement="top" v-else>
					<el-badge><i class="iconfont icon-QQ vertify"></i></el-badge>
				</el-tooltip>
			</span>
		</div>
		<div class="experience">
			<div class="rank">
				<span>
					等级
					<i class="iconfont icon-crown"></i>
					{{ userInfoView.rank }}
				</span>
				<span class="exer-num">{{ userInfoView.experience }}/{{ totalExp }}</span>
			</div>
			<el-progress :percentage="percent" :show-text="false" color="purple"></el-progress>
		</div>

		<div class="footer">
			<nuxt-link to="/fav">
				<span class="fav">
					<i class="iconfont icon-calendar"></i>
					我的收藏
				</span>
			</nuxt-link>
            <nuxt-link to="/improveinfo">
                <span class="video">
                    <i class="el-icon-edit-outline"></i>
                    更改资料
                </span>
            </nuxt-link>
		</div>
		<div class="exit"><a @click="logout">退出</a></div>
	</section>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import axios from '~/public/axios';
export default {
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		}),
		/*params userInfo: {
				name: '',
				identity: '',
				img: '',
				userInfo: [{ money: Number, rank: Number, experience: Number,ranks:Array }],
				safeInfo: [{ email: String, emailVertify: Boolean ,QQ:String,QQVertify:Boolean}],
				login: false
			} */
		percent() {
			return (this.userInfo.userInfo[0].experience * 100) / this.totalExp;
		},
		totalExp() {
			return this.userInfo.userInfo[0].ranks[this.userInfo.userInfo[0].rank];
		}
	},
	created() {
		this.userInfoView = this.userInfo.userInfo[0]
		this.safeInfoView = this.userInfo.safeInfo[0]
	},
	data() {
		return {
			userInfoView: {},
			safeInfoView: {}
		};
	},
	methods: {
		...mapMutations({
			setUser: 'user/setUser',
			setMeImgAva: 'jas/setMeImgAva'
		}),
		async logout() {
			let {
				status,
				data: { code }
			} = await axios.get('/user/logout');
			if (code == 2000) {
				let userInfo = localStorage.getItem('userInfo');
				if (userInfo) {
					userInfo = JSON.parse(userInfo);
					userInfo.login = false;
					localStorage.setItem('userInfo', JSON.stringify(userInfo));
				} else {
					localStorage.setItem('tempUserInfo', '');
				}
				this.setUser('');
				this.setMeImgAva('');
				this.$emit('logout');
				this.$message({
					message: '已退出登录',
					type: 'success',
					duration: 2000,
					center: true,
					customClass: 'message-info'
				});
			}
		}
	}
};
</script>

<style lang="less" scoped>
.wrapper {
	padding-left: 1rem;
	padding-right: 1rem;
	.q-title {
		margin-top: 2rem;
		text-align: center;
		font-size: 1rem;
		color: purple;
	}
	.header {
		margin-top: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
			color: purple;
		}
		.right {
			.iconfont:hover {
				color: purple;
			}
			.vertify {
				color: purple;
			}
		}
	}
	.experience {
		margin-top: 0.5rem;
		.rank {
			display: flex;
			justify-content: space-between;
			color: purple;
			margin-bottom: 0.2rem;
			.exer-num {
				margin-top: 0.2rem;
				color: grey;
			}
		}
	}
	.footer {
		display: flex;
		justify-content: space-between;
		color: grey;
		margin-right: 0;
		margin-top: 1.5rem;
		a{
			color: grey;
			text-decoration: none;
		}
	}
	.exit {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		background-color: #f4f5f7;
		margin: 0.4rem -1rem 0 -1rem;
		padding-right: 1rem;
		height: 2rem;
		a {
			color: #666;
			text-decoration: none;
			&:hover {
				color: purple;
				cursor: pointer;
			}
		}
	}
}
</style>
