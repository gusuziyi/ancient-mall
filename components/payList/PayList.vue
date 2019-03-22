<template>
	<div class="shop">
		<div class="shop-title">
			<span>
				<span class="shop-title-name">店铺名: {{ list.goods.shopName }}</span>
			</span>
			<nuxt-link :to="'/shop/' + list.goods.shopCid">
				进入店铺
				<i class="el-icon-arrow-right"></i>
			</nuxt-link>
		</div>
		<div class="shop-goods-list">
			<el-row class="goods">
				<el-col :span="6" class="goods-img">
					<nuxt-link :to="'/showDetail/' + list.goods.cid">
						<img :src="list.imgs" alt="" />
					</nuxt-link>
				</el-col>
				<el-col :span="6" class="goods-title">
					<nuxt-link :to="'/showDetail/' + list.goods.cid">
						<div class="title">{{ list.goods.name }}</div>
					</nuxt-link>
					<div class="item">类型: {{ list.sku.type }}、尺寸: {{ list.sku.size }}</div>
					<div class="item">原价: ￥{{ list.sku.oriPrice }}、数量: {{ list.num }}</div>
					<div class="item">折扣: {{ count }}、实付总价: ￥{{ list.totalPrice }}</div>
				</el-col>
				<el-col :span="6" class="goods-time">
					<div class="item">生成时间: {{ list.createTime }}</div>
					<div class="item">
						付款时间: {{ list.payTime ? list.payTime : '---------------------' }}
					</div>
					<div class="item">
						发货时间:
						{{ list.deliverTime ? list.deliverTime : '---------------------' }}
					</div>
					<div class="item">
						收货时间: {{ list.doneTime ? list.doneTime : '---------------------' }}
					</div>
				</el-col>
				<el-col :span="6" class="goods-state">
					<div class="state">当前状态: {{ state }}</div>
					<div class="item">
						发货仓库: {{ list.inventorys[0].locationCity }}
						{{ list.inventorys[0].location }}
					</div>
					<div class="ori-price">
						<el-button
							type="primary"
							size="small"
							@click="onshowDeliver(false)"
							v-if="
								showButton == 'create' ||
									showButton == 'pay' ||
									showButton == 'deliver'
							"
						>
							物流预估
						</el-button>
						<el-button
							type="primary"
							size="small"
							@click="onshowDeliver(true)"
							v-if="showButton == 'all' || showButton == 'done'"
						>
							物流回顾
						</el-button>
						<el-button
							type="primary"
							icon="el-icon-success"
							size="small"
							@click="onpay('payTime')"
							v-if="showButton == 'create'"
						>
							付款
						</el-button>
						<el-button
							type="primary"
							icon="el-icon-success"
							size="small"
							@click="onpay('deliverTime')"
							v-if="showButton == 'send'"
						>
							发货
						</el-button>
						<el-button
							type="primary"
							icon="el-icon-info"
							size="small"
							@click="notice(true)"
							v-if="showButton == 'pay'"
						>
							提醒发货
						</el-button>
						<el-button
							type="primary"
							icon="el-icon-success"
							size="small"
							@click="onpay('doneTime')"
							v-if="showButton == 'deliver'"
						>
							收货
						</el-button>
						<el-button
							type="primary"
							icon="el-icon-edit-outline"
							size="small"
							@click="notice(false)"
							v-if="showButton == 'done'"
						>
							评价
						</el-button>
						<el-button
							type="primary"
							icon="el-icon-error"
							size="small"
							@click="ondel"
							v-if="
								showButton == 'create' ||
									showButton == 'all' ||
									showButton == 'done'
							"
						>
							删除
						</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import { mapState,mapMutations } from 'vuex';
export default {
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		}),
		/* chow count */
		count() {
			return ((this.list.sku.price * 10) / this.list.sku.oriPrice).toFixed(2) + '折';
		},
		state() {
			switch (this.list.state) {
				case 'create':
					return '等待买家付款';
					break;
				case 'pay':
					return '等待卖家发货';
					break;
				case 'deliver':
					return '等待买家收货';
					break;
				case 'done':
					return '订单已完成';
					break;
				default:
					break;
			}
		},
		showButton(){
			if (this.userIdentify == 'buyer') {
				return this.activeName;
			} else if (this.userIdentify == 'admin'){
				if(this.activeName=="pay")
					return 'send';
			}
		}
	},
	props: {
		list: Object,
		activeName: String
	},
	data() {
		return {
			userIdentify: 'buyer',
		};
	},
	methods: {
    ...mapMutations({
    	setDeliver: 'deliver/setDeliver',
    }),
		async ondel() {
			this.$emit('delList');
		},
		async onpay(whichTime) {
			this.$emit('onpay', whichTime);
		},
		 onshowDeliver(isDone) {
        this.setDeliver({
          isDone,
          list:this.list
        })
        this.$router.push({path:"/showDeliver"})
    },
		notice(isNotice) {
			this.$message({
				message: isNotice ? '已提醒卖家尽快发货' : '评价系统正在开发中',
				type: 'success',
				duration: 3000,
				center: true,
				customClass: 'message-info'
			});
		}
	},
	mounted() {
		this.userIdentify = this.userInfo.identity;
	}
};
</script>

<style scoped lang="less">
.shop {
	color: purple;
	background-color: white;
	margin-top: 1.5rem;
	border-radius: 6px;
	overflow: hidden;
	border: 1px solid purple;
	&-title {
		padding: 0.8rem 1rem;
		background-color: purple;
		color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		a {
			text-decoration: none;
			color: white;
		}
	}
	&-goods-list {
		.goods {
			padding: 0.8rem 1rem;
			border-top: 1px solid purple;
			display: flex;
			align-items: center;
			&-title,
			&-time,
			&-state {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				height: 7rem;
				a {
					text-decoration: none;
					color: purple;
				}
				.title {
					font-size: 1.2rem;
				}
				.item {
					color: gray;
				}
			}
			&-img {
				margin-left: 2rem;
				// 					height: 8rem;
				// 					width: 12rem;
				img {
					border-radius: 4px;
					height: 8rem;
					width: 12rem;
				}
			}
			.goods-state {
				display: flex;
				padding-left: 2rem;
			}
		}
	}
}
</style>
