<template>
    <section class="shop-list">
        <Jas v-if="showJas.visible" :isRealMan="showJas.isRealMan" />
        <div v-if="!isEmpty">
            <section v-for="(shop, sidx) in carts" :key="sidx">
                <div class="shop">
                    <div class="shop-title">
                        <span>
                            <input
                                type="checkbox"
                                class="checkbox"
                                v-model="shop.checked"
                                @click="onpickShop(sidx)"
                            />
                            <span class="shop-title-name">店铺名:{{ shop.shopName }}</span>
                        </span>
                        <nuxt-link :to="'/shop/' + shop.shopCid">
                            进入店铺
                            <i class="el-icon-arrow-right"></i>
                        </nuxt-link>
                    </div>
                    <div class="shop-goods-list">
                        <section v-for="(goods, idx) in shop.goodses" :key="idx">
                            <el-row class="goods">
                                <el-col :span="1">
                                    <input
                                        type="checkbox"
                                        class="checkbox"
                                        v-model="goods.checked"
                                        @click="onpickGoods(sidx, idx)"
                                    />
                                </el-col>
                                <el-col :span="4">
                                    <img class="goods-img" :src="goods.imgs" alt="" />
                                </el-col>
                                <el-col :span="4" class="goods-title">
                                    <nuxt-link :to="'/showDetail/' + goods.cid">
                                        {{ goods.name }}
                                    </nuxt-link>
                                </el-col>
                                <el-col :span="4">
                                    类型:{{ goods.sku.type }}、尺寸:{{ goods.sku.size }}
                                </el-col>
                                <el-col :span="3">
                                    <el-input-number
                                        v-model="goods.num"
                                        class="input-number"
                                        :min="1"
                                        size="small"
                                        @change="changeNum(sidx, idx)"
                                    ></el-input-number>
                                </el-col>
                                <el-col :span="3" class="goods-num">
                                    ¥{{ goods.num * goods.sku.price }}
                                </el-col>
                                <el-col :span="3" class="goods-inventory">
                                    <div>发货地:{{ goods.inventorys[0].locationCity }}</div>
                                    库存量:{{ goods.inventorys[0].targetNum }}
                                    <span class="nervous" v-if="goods.inventorys[0].targetNum < 15">
                                        (紧张)
                                    </span>
                                </el-col>
                                <el-col :span="2" class="goods-btn">
                                    <el-button type="primary" @click="onDel(sidx, idx)">
                                        删除
                                    </el-button>
                                </el-col>
                            </el-row>
                        </section>
                    </div>
                </div>
            </section>
            <el-row class="all-check">
                <el-col :span="5">
                    <input
                        type="checkbox"
                        class="checkbox"
                        v-model="isAllCheck"
                        @click="onallCheck"
                    />
                    <span class="check-name" v-if="!isAllCheck">全选</span>
                    <span class="check-name" v-else="">反选</span>
                </el-col>
                <el-col :span="14" class="total">
                    <p>
                        共选择了
                        <span class="goods-num">{{ totalNum }}</span>
                        件商品、共
                        <span class="goods-num">{{ totalPrice | priceFormat }}</span>
                        元
                    </p>
                </el-col>
                <el-col :span="5" class="btn">
                    <el-button type="danger" size="middum" @click="buyAll">结算</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="empty" v-else="">{{ emptyMsg }}</div>
    </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import axios from '~/public/axios';
import Jas from '~/components/index/Jas.vue';
export default {
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
            showJas: state => state.jas.showJas
        })
    },
    components: {
        Jas
    },
    data() {
        return {
            isAllCheck: true,
            totalNum: 0,
            totalPrice: 0,
            emptyMsg: '购物车竟然空无一物 ~~o(>_<)o~~',
            carts: [],
            isEmpty: true
        };
    },
    methods: {
        ...mapMutations({
            setUser: 'user/setUser',
            setMeImgAva: 'jas/setMeImgAva'
        }),
        /*
         * we can use fetch function to swtich vuex to init userInfo before the page mount ,
         * detail is in below fetch function
         * */
        /*
		initUserFromLocalStorage() {
			let userInfo = localStorage.getItem('userInfo') || localStorage.getItem('tempUserInfo');
			if (userInfo) {
				userInfo = JSON.parse(userInfo);
				this.setUser(userInfo);
				this.setMeImgAva(userInfo.img);
			}
		}, */
        async buyAll() {
            let carts = this.carts;
            let payLists = [];
            /* put the checked goodes to payLists and  prepare for update the view*/
            carts.forEach((shop,sidx) => {
                shop.goodses.forEach((goods, idx) => {
                    if (goods.checked) {
                        let O_goods=goods
                        O_goods.shopName=shop.shopName
                        O_goods.shopCid=shop.shopCid
                        O_goods.department=shop.department
                        let payList = {
                            cid:new Date().getTime() +Math.random().toString().substring(2, 6) +'_' +this.userInfo.name,
                            state: 'create',
                            username: this.userInfo.name,
                            userInfo: this.userInfo,
                            goods: O_goods,
                            imgs: goods.imgs,
                            num: goods.num,
                            totalPrice: (goods.num * goods.sku.price).toFixed(2),
                            sku: goods.sku,
                            inventorys: goods.inventorys,
                            createTime: new Date().toLocaleString('zh', { hour12: false })
                        };
                        payLists.push(payList);
                        shop.goodses.splice(idx, 1);
                    }
                });
                if(!shop.goodses.length){
                    carts.splice(sidx, 1);
                }
            });
              /*  update the view*/
            await axios.put('/goods/userCart', { carts, username:this.userInfo.name });
            let {
                data: { code }
            } = await axios.post('/list/payLists', { payLists });
            if (code == 2000) {
                this.$router.push({ path: '/payList/create' });
            } else {
                this.$message({
                    message: '数据库错误,错误码${code}',
                    type: 'error',
                    duration: 3000,
                    center: true,
                    customClass: 'message-info'
                });
            }
        },
        onpickShop(sidx) {
            /* change the shop's all goodses to new  check state */
            let carts = this.carts;
            carts[sidx].checked = !carts[sidx].checked;
            carts[sidx].goodses.forEach(goods => {
                goods.checked = carts[sidx].checked;
            });
            this.carts = carts;
            this.ifAllCheck();
            this.checkNum_Price();
        },
        onpickGoods(sidx, idx) {
            /* change the goods checked state  */
            let carts = this.carts,
                shop = carts[sidx],
                goods = shop.goodses[idx];
            goods.checked = !goods.checked;
            /* new state: not choose  ,then the shop should be no choose yet*/
            if (!goods.checked) {
                shop.checked = false;
            } else {
                /* new state: is choose  ,then the judge shop is allcheck or not*/
                let shopIsAllCheck = true;
                shop.goodses.forEach(goods => {
                    if (!goods.checked) shopIsAllCheck = false;
                });
                shop.checked = shopIsAllCheck;
            }
            carts[sidx] = shop;
            carts[sidx].goodses[idx] = goods;
            this.carts = carts;
            this.ifAllCheck();
            this.checkNum_Price();
        },
        /* delete goods
         * delete goods first
         * then judge if the shop is empty ,if true delete shop*/
        async onDel(sidx, idx) {
            let carts = this.carts,
                shop = carts[sidx];
            let username = this.userInfo.name;
            shop.goodses.splice(idx, 1);
            carts[sidx] = shop;
            if (!shop.goodses.length) {
                carts.splice(idx, 1);
            }
            if (!carts.length) this.isEmpty = true;
            this.carts = carts;
            let {
                data: { code }
            } = await axios.put('/goods/userCart', { carts, username });
            if (code == 2000) {
                this.checkNum_Price();
            }else{
                this.showError();
            }
        },
        onallCheck() {
            this.isAllCheck = !this.isAllCheck;
            let carts = this.carts;
            carts.forEach(shop => {
                shop.checked = this.isAllCheck;
                shop.goodses.forEach(goods => {
                    goods.checked = this.isAllCheck;
                });
            });
            this.carts = carts;
            this.checkNum_Price();
        },
        /* check if shops are all checked to set isAllCheck state */
        ifAllCheck() {
            let carts = this.carts;
            let isAllCheck = true;
            carts.forEach(shop => {
                if (!shop.checked) {
                    isAllCheck = false;
                }
            });
            this.isAllCheck = isAllCheck;
        },
        /* show goodses totalNum and totalPrice */
        checkNum_Price() {
            let carts = this.carts,
                totalNum = 0,
                totalPrice = 0;
            /* location all checked goodses */
            carts.forEach(shop => {
                shop.goodses.forEach(goods => {
                    if (goods.checked) {
                        totalNum++;
                        totalPrice += goods.num * goods.sku.price;
                    }
                });
            });
            (this.totalNum = totalNum), (this.totalPrice = totalPrice);
        },
        /* on change goods num */
        async changeNum(sidx, idx) {
            let carts = this.carts;
            let username = this.userInfo.name;
            if (!carts[sidx].goodses[idx].num) carts[sidx].goodses[idx].num = 1;
            this.checkNum_Price();
            let {
                data: { code }
            } = await axios.put('/goods/userCart', { carts, username });
            if (code != 2000) {
                this.showError();
            }
        },
        showError() {
            this.$message({
                message: '存储失败,请检查数据库',
                type: 'error',
                duration: 3000,
                center: true,
                customClass: 'message-info'
            });
        },
        async getUserCarts() {
            let username = this.userInfo.name;
            let {
                data: {
                    code,
                    msg,
                    userCarts: { carts }
                }
            } = await axios.get('/goods/userCart', { params: { username } });
            if (code == 401) {
                this.$message({
                    message: msg,
                    type: 'error',
                    duration: 3000,
                    center: true,
                    customClass: 'message-info'
                });
                this.$router.redirect({ path: '/login' });
            }
            carts = carts.filter(i => i);
            if (carts.length) {
                carts.forEach(shop => {
                    shop.checked = true;
                    shop.goodses.forEach(goods => {
                        goods.checked = true;
                    });
                });
                this.carts = carts;
                this.checkNum_Price();
                this.isEmpty = false;
            } else {
                this.isEmpty = true;
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
        }
    },
    async created() {
        if (!this.userInfo) {
            let isLogin = await this.getUserInfo();
            if (!isLogin) {
                this.$router.replace({ path: '/login?redirect=/cart' });
                return;
            }
        }
        this.getUserCarts();
    },
    filters: {
        priceFormat: num => '￥' + num.toFixed(2)
    }
};
</script>

<style lang="less" scoped>
@import './src/cart.less';
</style>
<style lang="less">
.shop-list {
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
}
</style>
