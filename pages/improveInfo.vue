<template>
    <el-container class="container ">
        <div class="title">美妆小铺</div>
        <div class="warpper">
            <div class="login-div"><span class="item register active improve">完善信息</span></div>
            <el-form :model="ruleForm" ref="ruleForm" class="ruleForm" size="small">
                <el-form-item prop="url">
                    <el-upload
                        class="upload-demo"
                        drag
                        action=""
                        :before-upload="beforeAvatarUpload"
                        :http-request="avatarUpload"
                        :on-success="handleAvatarSuccess"
                        multiple
                    >
                        <i class="el-icon-upload" v-if="!ruleForm.url"></i>
                        <img :src="ruleForm.url" class="avatar-img" v-if="ruleForm.url" />
                        <div class="el-upload__text">
                            将头像拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item prop="QQ">
                    <el-input v-model="ruleForm.QQ" placeholder="你的QQ号">
                        <i slot="prefix" class="icon-user iconfont el-input__icon"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="date">
                    <el-date-picker
                        type="date"
                        placeholder="你的生日"
                        v-model="ruleForm.date"
                        default-value="1991/10/19"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item class="btn-div">
                    <el-button type="primary" @click="updateUserInfo">完成</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <el-button type="primary" class="btn">
                        <nuxt-link to="/login">跳过</nuxt-link>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-container>
</template>

<script>
import lang from 'element-ui/lib/locale/lang/zh-CN';
import locale from 'element-ui/lib/locale';
locale.use(lang);
import { mapState, mapMutations } from 'vuex';
import OSS from 'ali-oss';
export default {
    layout: 'blank',
    props: {},
    data() {
        return {
            ruleForm: {
                QQ: '',
                date: '',
                url: ''
            },
            userInfo: {}
        };
    },
    computed: {
        ...mapState({
            name: state => state.user.name
        })
    },
    methods: {
        async updateUserInfo() {
            let ruleForm = this.ruleForm;
            if (!ruleForm.QQ && !ruleForm.date && !ruleForm.url) {
                this.$message.error('请至少修改一项数据');
                return;
            }
            let {
                status,
                data: { code }
            } = await this.$axios.post('/user/updateUserInfo', {
                name: this.userInfo.name,
                QQ: ruleForm.QQ,
                date: ruleForm.date,
                url: ruleForm.url
            });
            if (code == 2000) {
                this.$message({
                    message: '修改成功,请登录 ',
                    type: 'success'
                });
                this.$router.replace({ path: '/login' });
            } else {
                this.$message.error('数据库错误');
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
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
        async avatarUpload(item) {
            let client = await this.initOSS();
            // format like: 'lily/avatar/hi.jpg'
            let storePath = 'users/' + this.userInfo.name + '/avatar/' + item.file.name;
            return client.put(storePath, item.file); // OSS upload
        },
        handleAvatarSuccess(res, file) {
            this.ruleForm.url = res.url;
            this.$message({
                message: '头像上传成功 ',
                type: 'success'
            });
        },
        async initOSS() {
            let {
                status,
                data: { code, OSS_INFO }
            } = await this.$axios.get('jas/initOSS');
            if (code != 2000) {
                this.$message.error('无法初始化OSS对象,请检查koa安装情况');
                return;
            }
            let client = new OSS({
                region: OSS_INFO.region,
                accessKeyId: OSS_INFO.accessKeyId,
                accessKeySecret: OSS_INFO.accessKeySecret,
                bucket: OSS_INFO.bucket
            });
            return client;
        },
        getUser() {
            let user = localStorage.getItem('userInfo');
            if (!user) {
                this.$message.error('请先注册');
                this.$router.replace({ path: '/register' });
                return;
            } else {
                user = JSON.parse(user);
                this.userInfo = user;
            }
        }
    },
    mounted() {
        this.getUser();
    },
    async asyncData(ctx) {}
};
</script>

<style lang="less" scoped>
@import './src/register.less';
@import './src/improveInfo.less';
</style>
<style lang="less">
.warpper {
    .el-upload-dragger {
        width: 13rem;
        height: 8rem;
        i {
            margin: 1.5rem 0 0.8rem;
        }
        margin-bottom: -0.5rem;
    }
    .el-date-editor {
        width: 13rem;
    }
    .el-input__icon {
        position: relative;
        width: 17px;
        margin-left: 0.5rem;
    }
}
</style>
