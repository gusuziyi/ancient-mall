<template>
    <div class="warpper">
        <div class="header">
            作者: 千茉紫依
            <a href="">个人简历</a>
        </div>
        <footer>
            <a href="https://www.douban.com/people/55851213/">
                <i class="iconfont icon-user"></i>
                豆瓣空间
            </a>
            <a href="https://github.com/gusuziyi">
                <i class="icon-github-fill iconfont"></i>
                Github
            </a>
            <a href="https://www.jianshu.com/u/1e7c96e7e09f">
                <i class="iconfont icon-code"></i>
                简书博客
            </a>
            <a @click="showPic = !showPic">
                <i class="icon-wechat-fill iconfont"></i>
                微信号
                <img src="./src/wx.jpg" class="wx-img" v-if="showPic" />
            </a>
           <a @click="showQQ = !showQQ">
                <i class="icon-QQ iconfont"></i>
                QQ号
                <div class="qq" v-if="showQQ">2434711272</div>
            </a>
        </footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showPic: false,
            showQQ:false
        };
    }
};
</script>

<style lang="less" scoped="">
.warpper {
    padding-top: 1rem;
    width: 70rem;
    text-align: center;
    margin: auto;
    margin-bottom: 1rem;
    color: grey;
    .header {
        margin-bottom: 0.5rem;
    }
    a {
        text-decoration: none;
        cursor: pointer;
        color: grey;
        &:hover {
            color: purple;
        }
        margin: 1rem 0.5rem;
        position: relative;
        .wx-img {
            position: absolute;
            width: 7rem;
            height: 7rem;
            bottom: 1.5rem;
            right: -1rem;
            border: 2px solid purple;
        }
        .qq{
           position: absolute;
           width: 7rem;
           height: 2rem;
           bottom: 1.5rem;
           right: -2rem; 
           background-color: purple;
           color: white;
           display: flex;
           align-items: center;
           justify-content: center;
           border-radius: 4px;
        }
    }
}
</style>
