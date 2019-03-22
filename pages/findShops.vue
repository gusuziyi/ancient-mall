<template>
	<div class="echarts">
		<Jas v-if="showJas.visible" :isRealMan="showJas.isRealMan" />
		<div class="show-info" v-if="showInfo">
			<div class="item title">美妆小铺 {{ shopInfo.area }}区</div>
			<div class="item content">
				{{ shopInfo.address.country }}{{ shopInfo.address.city }} 分店欢迎您
			</div>
			<div class="item address">
				地址 : {{ shopInfo.address.city }}市{{ shopInfo.address.addr }}
			</div>
			<div class="item phone">电话 : {{ shopInfo.address.phone }}</div>
			<el-button class="btn goshop" type="primary" size="small">
				<nuxt-link :to="'/shop/'+shopInfo.cid">进入店铺</nuxt-link>
			</el-button>
				<el-button class="btn goback" type="primary" size="small">
				<nuxt-link to="/">返回首页</nuxt-link>
			</el-button>
		</div>
	
		<div class="chart" ref="myEchart"></div>
	</div>
</template>
<script>
import echarts from 'echarts';
import 'echarts-gl';
import chartInit from './src/chartInit.js';
import { mapState } from 'vuex';
import Jas from '~/components/index/Jas.vue';
export default {
	components: {
		Jas
	},
	computed: {
		...mapState({
			showJas: state => state.jas.showJas
		})
	},
	data() {
		return {
			shopInfo: {
				address: {
					area: '',
					country: '',
					city: '',
					addr: '',
					phone: ''
				},
				shopName: '',
				cid: ''
			},
			showInfo: false,
      chart:null
		};
	},
	mounted() {
		this.chart = echarts.init(this.$refs.myEchart);
		this.chart.setOption(chartInit);
		// click the chart event
		this.chart.on('click', params => {
			this.shopInfo = params.data;
			/* not use ,only set a fiexed phone to seems actively*/
			let phoneTest =Math.abs(this.shopInfo.location[1] * 1000).toString().substr(0, 4) +'-' +this.shopInfo.location[0].toString().replace(/[-.]/g, '');
			this.shopInfo.address.phone = phoneTest;
			this.showInfo = true;
		});
	},
	beforeDestroy() {
		this.chart.dispose();
		this.chart = null;
	},
	
	
};
</script>
<style lang="less">
.echarts {
	position: relative;
	height: 28rem;
	margin-top: 0.2rem;
	.show-info {
		position: absolute;
		z-index: 1;
		bottom: 15px;
		left: 10px;
		color: white;
		padding: 5px 10px;
		font-size: 0.9rem;
		font-family: 'microsoft yahei';
		padding-bottom: 2rem;
		.item {
			margin-bottom: 0.2rem;
		}
		.close {
			position: absolute;
			top: 0.3rem;
			left: 11rem;
		}
		.btn {
			position: absolute;
			bottom: 0rem;
			left: 0rem;
			z-index: 31;
			margin-right: 1rem;
			a {
				text-decoration: none;
				color: white;
			}
		}
		.goshop{
			left: 6rem;
		}
	}
	.chart {
		height: 28rem;
	}
}
</style>
