<template>
	<el-container class="container">
		<div class="title">美妆小铺</div>
		<div class="warpper">
			<div class="login-div">
				<span class="item login active">登录</span>
				<span class="item register"><nuxt-link to="/register">注册</nuxt-link></span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="ruleForm" size="small">
				<el-form-item prop="name">
					<el-input v-model="ruleForm.name" placeholder="你的昵称">
						<i slot="prefix" class="icon-user iconfont el-input__icon"></i>
					</el-input>
				</el-form-item>
				<el-form-item prop="pass">
					<el-input
						v-model="ruleForm.pass"
						placeholder="登录密码"
						@focus="passErrorInfo = false"
						type="password"
					>
						<i slot="prefix" class="icon-edit-square iconfont el-input__icon"></i>
					</el-input>
				</el-form-item>
				<el-form-item prop="remember">
					<el-checkbox
						v-model="ruleForm.remember"
						label="记住我"
						:checked="true"
					></el-checkbox>
					<nuxt-link to="/forget" class="forget">忘记密码?</nuxt-link>
				</el-form-item>

				<el-form-item class="btn-div btn-div-login">
					<el-button type="primary" @click="submitForm('ruleForm')" class="login">
						登录
					</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
					<el-button class="goback"><nuxt-link to="/">返回首页</nuxt-link></el-button>
				</el-form-item>
			</el-form>
			<div class="more-login">
				<div class="more-title">社交帐号登录</div>
				<div class="links">
					<a href=""><i class="icon-github-fill iconfont "></i></a>
					<a href=""><i class="icon-wechat-fill iconfont "></i></a>
					<a href=""><i class="icon-weibo iconfont "></i></a>
				</div>
			</div>
		</div>
	</el-container>
</template>

<script>
import CryptoJS from 'crypto-js';
import axios from '~/public/axios';
import { mapMutations } from 'vuex';
export default {
	layout: 'blank',
	data() {
		const checkExist = async (rule, value, callback) => {
			let {
				status,
				data: { code, msg }
			} = await this.$axios.get(`/user/checkExist?name=${value}`);
			if (code == 2000) {
				callback();
			} else {
				callback(new Error(msg));
			}
		};
		const checkLogin = async (rule, value, callback) => {
			if (!this.passErrorInfo) {
				callback();
			} else {
				callback(new Error(this.passErrorMsg));
			}
		};
		return {
			ruleForm: {
				name: '',
				pass: '',
				remember: false
			},
			rules: {
				name: [
					{ required: true, message: '请输入您的昵称', trigger: 'blur' },
					{ min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' },
					{ validator: checkExist, trigger: 'blur' }
				],
				pass: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ validator: checkLogin, message: '密码错误', trigger: 'blur' }
				]
			},
			passErrorMsg: '',
			passErrorInfo: false,
		};
	},
	mounted() {
		let userInfo = localStorage.getItem('userInfo');
		if (userInfo) {
			userInfo = JSON.parse(userInfo);
			// remember me
			let bytes = CryptoJS.AES.decrypt(userInfo.pass, 'secret key ancient');
			userInfo.pass = bytes.toString(CryptoJS.enc.Utf8);
			this.ruleForm.name = userInfo.name;
			this.ruleForm.pass = userInfo.pass;
		}
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.login();
				} else {
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		...mapMutations({
			setUser: 'user/setUser',
			setMeImgAva: 'jas/setMeImgAva',
		}),
		async login() {
			let { name, pass, remember } = this.ruleForm;
			/* 
			we must use 'username' and 'password' for LocalStrategy params ,
			if not ,mistake  Missing credentials 4004 will appear
			 */
			let {
				status,
				data: { code, msg, user }
			} = await axios.post('/user/login', { username: name, password: pass });
			//redirect to / with no history
			if (code == 2000) {
				//the pass in the server is in MD5 encrypt, so localStorage should use ruleForm
				user.pass = CryptoJS.AES.encrypt(pass, 'secret key ancient').toString();
				user.login = true;
				if (remember) {
					// remember me
					localStorage.setItem('userInfo', JSON.stringify(user));
				} else {
					// not remember me
					if (localStorage.getItem('userInfo')) {
						localStorage.setItem('userInfo', '');
					}
					localStorage.setItem('tempUserInfo', JSON.stringify(user));
				}
				this.setUser(user)
				this.setMeImgAva(user.img)
				this.$message({
					message: msg,
					type: 'success',
					duration: 2000,
					center: true,
					customClass: 'message-info'
				});
				if(this.$route.query.redirect){
					let {redirect}=this.$route.query
					let arr=redirect.split("/")
					let path=arr[1]
					let cid=arr[2]||""
          if(!path){
            this.$router.push({path:'/'})
            return
          }
					if(cid){
						this.$router.push({path:'/'+path+'/'+cid})
					}else{
						this.$router.push({path:'/'+path})
					}
				}else{
					 this.$router.push({path:'/'})
				}
				
			} else {
				this.passErrorInfo = true;
				this.passErrorMsg = msg;
				//if not match password trigger the validate to show error
				this.$refs.ruleForm.validateField('pass', Error => {});
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import './src/register.less';
</style>
<style lang="less">
.warpper {
	.ruleForm {
		.el-form-item {
			margin-bottom: 1.2rem;
			.el-button--mini {
				text-align: center;
				width: 6rem;
				padding-top: 0.5rem;
				padding-bottom: 0.5rem;
			}
		}
		.el-form-item__content {
			margin-left: 0.3rem !important;
			width: 13rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.el-input--small {
				width: 13rem;
			}
			.el-form-item__success {
				color: #67c23a;
				font-size: 12px;
				line-height: 1;
				padding-top: 4px;
				position: absolute;
				top: 100%;
				left: 0;
				padding-top: 2px;
			}
			.el-input__icon {
				left: -0.3rem;
			}
			.el-checkbox {
				margin-left: -3rem;
			}
			.forget {
				color: #999;
				text-decoration: none;
				margin-right: -3rem;
			}
			.el-checkbox__input.is-checked + .el-checkbox__label {
				color: purple;
			}
		}
	}
}
</style>
