<template>
	<el-container class="container">
		<div class="title">美妆小铺</div>
		<div class="warpper">
			<div class="login-div">
				<span class="item login "><nuxt-link to="/login">登录</nuxt-link></span>
				<span class="item register active">注册</span>
			</div>
			<el-form
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="100px"
				class="ruleForm"
				size="small"
			>
				<el-form-item prop="name">
					<el-input v-model="ruleForm.name" placeholder="你的昵称">
						<i slot="prefix" class="icon-user iconfont el-input__icon"></i>
					</el-input>
				</el-form-item>
				<el-form-item prop="pass">
					<el-input v-model="ruleForm.pass" placeholder="登录密码" type="password">
						<i slot="prefix" class="icon-edit-square iconfont el-input__icon"></i>
					</el-input>
				</el-form-item>
				<el-form-item prop="cpass">
					<el-input v-model="ruleForm.cpass" placeholder="确认密码" type="password">
						<i slot="prefix" class="icon-edit-square iconfont el-input__icon"></i>
					</el-input>
				</el-form-item>
				<el-form-item prop="email">
					<el-input v-model="ruleForm.email" placeholder="验证邮箱">
						<i slot="prefix" class="icon-mail iconfont el-input__icon"></i>
					</el-input>
					<div
						v-if="verCodeInfo"
						:class="verCodeError ? 'el-form-item__error' : 'el-form-item__success'"
					>
						{{ verCodeInfo }}
					</div>
				</el-form-item>
				<el-form-item prop="verCode">
					<el-input
						class=" verCode"
						v-model="ruleForm.verCode"
						placeholder="验证码"
					></el-input>
					<el-button size="mini" type="primary" @click="sendEmail" :disabled="!isTimeout">
						发送验证码
						<span v-if="timeout">({{ timeout }})</span>
					</el-button>
				</el-form-item>
				<el-form-item class="btn-div">
					<el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
					<el-button><nuxt-link to="/">返回首页</nuxt-link></el-button>
				</el-form-item>
			</el-form>
		</div>
	</el-container>
</template>

<script>
import axios from 'axios';
import CryptoJS from 'crypto-js';
export default {
	layout: 'blank',
	data() {
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {
				if (this.ruleForm.cpass !== '') {
					this.$refs.ruleForm.validateField('cpass');
				}
				callback();
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.ruleForm.pass) {
				callback(new Error('两次密码不一致'));
			} else {
				callback();
			}
		};
		const checkRepeat = async (rule, value, callback) => {
			let {
				status,
				data: { code, msg }
			} = await this.$axios.get(`/user/checkRepeat?name=${value}`);
			if (code == 2000) {
				callback();
			} else {
				callback(new Error(msg));
			}
		};
		const checkCode = async (rule, value, callback) => {
			let {
				status,
				data: { code, msg }
			} = await this.$axios.get(`/user/checkCode`, {
				params: { code: value, name: this.ruleForm.name }
			});
			if (code == 2000) {
				callback();
			} else {
				callback(new Error(msg));
			}
		};
		return {
			ruleForm: {
				name: '',
				pass: '',
				cpss: '',
				email: '',
				verCode: ''
			},
			rules: {
				name: [
					{ required: true, message: '请输入您的昵称', trigger: 'blur' },
					{ min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' },
					{ validator: checkRepeat, trigger: 'blur' }
				],
				pass: [{ validator: validatePass, trigger: 'blur' }],
				cpass: [{ validator: validatePass2, trigger: 'blur' }],
				email: [
					{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
					{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'hange'] }
				],
				verCode: [
					{ required: true, message: '验证码不能为空', trigger: 'blur' },
					{ min: 4, max: 4, message: '长度为4个字符', trigger: 'blur' },
					{ validator: checkCode, trigger: 'blur' }
				]
			},
			verCodeInfo: '',
			verCodeError: false,
			timeout: 0,
			isTimeout: true
		};
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.register();
				} else {
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		async register() {
			let { name, pass, email } = this.ruleForm;
			let {
				status,
				data: { code, msg, newUser }
			} = await this.$axios.post('/user/register', {
				name,
				pass: CryptoJS.MD5(pass).toString(),
				email
			});
			newUser.pass = CryptoJS.AES.encrypt(pass, 'secret key ancient').toString();
			newUser.login = false;
			if (code == 2000) {
				// remember me
				localStorage.setItem('userInfo', JSON.stringify(newUser));
				this.$message({ message: msg, type: 'success' ,duration:4000,center: true,customClass:'message-info'});
				this.$router.replace({ path: '/improveInfo' });
			} else {
				this.$message.error(msg);
			}
		},
		async sendEmail() {
			//check name and email must has value
			this.$refs.ruleForm.validateField('name');
			this.$refs.ruleForm.validateField('email');
			let validateArray = ['name', 'email'];
			let error = false;
			await Promise.all(
				validateArray.map(item => {
					return this.$refs.ruleForm.validateField(item, Error => {
						if (Error) error = true;
					});
				})
			);
			// send email
			if (!error) {
				let {
					status,
					data: { code, msg }
				} = await this.$axios.post('user/sendEmail', {
					name: this.ruleForm.name,
					email: this.ruleForm.email
				});
				code == 2000 ? (this.verCodeError = false) : (this.verCodeError = true);
				// code infomation show 5s in views
				this.verCodeInfo = msg;
				setTimeout(() => (this.verCodeInfo = ''), 5000);
				//count down for 60s ,can send email repeat
				let timeout = 60;
				this._timer = setInterval(() => {
					let that = this;
					this.isTimeout = false;
					this.timeout = timeout--;
					if (timeout < 0) {
						clearInterval(that._timer);
						this.isTimeout = true;
					}
				}, 1000);
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import './src/register.less';
</style>
<style lang="less">
	.message-info{
		i,p{
			color: purple!important;
		}
	}
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
		}
	}
}
</style>
