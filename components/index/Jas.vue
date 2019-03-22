<template>
	<vue-draggable-resizable :draggable="draggable">
		<el-container class="warpper">
			<el-header class="q-header">
				{{ title }}
				<i class="el-icon-circle-close" @click="close"></i>
			</el-header>
			<el-main class="main" id="jasDialogue">
				<article v-for="(item, idx) in allContentList" :key="idx">
					<div class="msg-div fl" v-if="item.speaker == 'jas'">
						<img :src="jasImgAva" alt="" class="img" />
						<span class="msg fl" v-if="item.type == 'text'">{{ item.value }}</span>
						<img
							:src="item.value"
							alt=""
							class="msg-answer-img fl"
							v-if="item.type == 'image'"
						/>
					</div>
					<div class="msg-div fr" v-if="item.speaker == 'me'">
						<img
							:src="item.value"
							alt=""
							class="msg-answer-img fr"
							v-if="item.type == 'image'"
						/>
						<span class="msg fr" v-if="item.type == 'text'">{{ item.value }}</span>
						<img :src="meImgAva" alt="" class="img" />
					</div>
				</article>
			</el-main>
			<el-footer class="q-footer">
				<el-input
					type="textarea"
					:rows="3"
					v-model="input"
					class="input"
					@focus="(draggable = false), (showQuickReply = false)"
					@blur="draggable = true"
					@keyup.enter.native='chat'
				></el-input>
				<el-button type="primary" size="small" @click="clear" class="btn close">
					清空
				</el-button>
				<el-upload
					action=""
					:show-file-list="false"
					:on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload"
					:http-request="avatarUpload"
				>
					<el-button size="small" type="primary" class="btn chat-pic">斗图</el-button>
				</el-upload>
				<el-button type="primary" size="small" @click="chat" class="btn chat">
					发送
				</el-button>
				<dl class="quick-reply" v-if="showQuickReply">
					<dd v-for="(item, idx) in quickReply" :key="idx" @click="onquickReply(item)">
						{{ item }}
					</dd>
				</dl>
			</el-footer>
		</el-container>
	</vue-draggable-resizable>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import VueDraggableResizable from 'vue-draggable-resizable';
import OSS from 'ali-oss';
import axios from '~/public/axios'
export default {
	props: {
		isRealMan: Boolean
	},
	computed: {
		...mapState({
			meImgAva: state => state.jas.meImgAva,
			userInfo: state => state.user.userInfo
		})
	},
	async created() {
		/* init chat view */
		this.title = this.isRealMan ? '人工客服' : '智慧小茉';
		this.jasImgAva = this.isRealMan
			? require('~/assets/jas/jasMan.jpg')
			: require('~/assets/jas/jas.jpg');
		let textValue = this.isRealMan ? '请输入问题,我将为您转接人工客服' : '客服小茉,陪你到天明~';
		this.allContentList = [{ speaker: 'jas', type: 'text', value: textValue }];
		if (this.isRealMan) {
			return;
		}
		/* init chat history */
		let {
			status,
			data: { code, chatsArr }
		} = await axios.post('jas/getChat', {
			name: this.userInfo.name,
			isRealMan: this.isRealMan
		});
		if (code == 2000) {
			//chat history  is empty ,show jas hello
			if (chatsArr[0].speaker == '') {
				chatsArr = [{ speaker: 'jas', type: 'text', value: textValue }];
			}
			this.allContentList = chatsArr;
		} else if (code == 4004) {
			this.allContentList = [{ speaker: 'jas', type: 'text', value: textValue }];
		}
	},
	updated() {
		// to keep scrollbar always in the bottom
		this.$nextTick(function() {
			let div = document.getElementById('jasDialogue');
			div.scrollTop = div.scrollHeight;
		});
	},
	components: {
		VueDraggableResizable
	},
	data() {
		return {
			title: '智慧小茉',
			draggable: true,
			jasImgAva: '',
			input: '',
			allContentList: [{ speaker: '', type: '', value: '' }],
			showQuickReply: false,
			quickReply: ['哦', '是吗', '好,我知道了', '真的吗?', '然后呢']
		};
	},

	methods: {
		...mapMutations({
			setShowJas: 'jas/setShowJas'
		}),
		async avatarUpload(item) {
			let client = await this.initOSS();
			// format like: 'lily/tempChatPic/hi.jpg'
			let storePath = 'users/' + this.userInfo.name + '/tempChatPic/' + item.file.name;
			return client.put(storePath, item.file); // OSS upload
		},
		handleAvatarSuccess(res, file) {
			this.allContentList.push({ speaker: 'me', type: 'image', value: res.url });
			this.helloJas(res.url, 'image');
		},
		beforeAvatarUpload(file) {
			const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
			const isLt512k = file.size / 1024 < 512;
			if (!isJPG) {
				this.$message.error('图片只能是 JPG或PNG 格式!');
			}
			if (!isLt512k) {
				this.$message.error('图片大小不能超过 512k!');
			}
			return isJPG && isLt512k;
		},
		async initOSS() {
			let {
				status,
				data: { code, OSS_INFO }
			} = await this.$axios.get('jas/initOSS');
			if(code!=2000){
			 	OSS_INFO = require('../../server/router/cfg.js')
			}
			let client = new OSS({
				region: OSS_INFO.region,
				accessKeyId: OSS_INFO.accessKeyId,
				accessKeySecret: OSS_INFO.accessKeySecret,
				bucket: OSS_INFO.bucket
			});
			return client;
		},
		async close() {
			this.setShowJas(false);
			/* store chat history */
			let {
				status,
				data: { code, msg }
			} = await axios.post('jas/setChat', {
				name: this.userInfo.name,
				chat: this.allContentList,
				isRealMan: this.isRealMan
			});
		},
		chat() {
			if (!this.input) {
				this.showQuickReply = true;
				return;
			}
			this.allContentList.push({ speaker: 'me', type: 'text', value: this.input });
			/* get a answer */
			this.helloJas(this.input, 'text');
            this.input=''
		},
		onquickReply(text) {
			this.showQuickReply = false;
			this.allContentList.push({ speaker: 'me', type: 'text', value: text });
			/* get a answer */
			this.helloJas(text, 'text');
		},
		async helloJas(text, type) {
			if (!this.isRealMan) {
				/* get a answer by user question */
				let {
					status,
					data: { code, answers }
				} = await this.$axios.post('/jas/helloJas', { text, type });
				if (code == 2000) {
					for (let answer of answers) {
						this.allContentList.push(answer);
					}
				} else {
					this.allContentList.push({
						speaker: 'jas',
						type: 'text',
						value: '服务器挂了,显然我就变弱智了~~(>_<)~~'
					});
				}
			} else {
				let {
					status,
					data: { code, answers }
				} = await this.$axios.post('/jas/callJasMan', { text, type });
				this.allContentList.push({
					speaker: 'jas',
					type: 'text',
					value: '正在连线人工客服,请等待...'
				});
				
			}
		},
		async clear() {
			this.input = '';
			this.allContentList = [{ speaker: '', type: '', value: '' }];
			/* delete chat history */
			//not equal 1 means has many chats history
			if (this.allContentList.lenth != 1) {
				/* delete text chat history  delete from mongodb*/
				await axios.post('jas/removeChat', {
					name: this.userInfo.name,
					isRealMan: this.isRealMan
				});
				/* delete image chat history */
				let client = await this.initOSS();
				let storePath = 'users/' + this.userInfo.name + '/tempChatPic/';
				let allTempChatPic = await client.list({ prefix: storePath });
				if (allTempChatPic.objects) {
					allTempChatPic = allTempChatPic.objects.map(item => item.name);
					await client.deleteMulti(allTempChatPic); // OSS delete
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import './Jas.less';
</style>
<style lang="less">
.input {
	.el-textarea__inner {
		border: none;
	}
}
</style>
