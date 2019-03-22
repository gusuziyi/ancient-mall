<template>
	<el-container class="echarts ">
    <Jas v-if="showJas.visible" :isRealMan="showJas.isRealMan" />
    <div class="show-info" >
    	<div class="item title">{{shopInfo.shopName}}</div>
    	<div class="item content">
    		中国区域 {{shopInfo.locationCity}}{{shopInfo.storeName}}号仓库 
    	</div>
    	<div class="item address">
        距离您的城市 {{shopInfo.userLocation.province}}{{shopInfo.userLocation.city}} 
        <span v-if="distance">{{distance}}千米</span>
    	</div>
    	<div class="item phone" v-if="distance">预计{{deliverTime}}天到达 </div>
      <div class="item phone" v-else>无法定位您的位置,无法估计时间 </div>
    	<el-button class="btn goshop" type="primary" size="small">
    		<nuxt-link :to="'/shop/'+shopInfo.shopCid">进入店铺</nuxt-link>
    	</el-button>
    	<el-button class="btn goback" type="primary" size="small" @click='goback'>
          返回上一页
    	</el-button>
    </div>
    <div class="chart" ref="myEchart"></div>
	</el-container>
</template>

<script>
import echarts from 'echarts';
import 'echarts-gl';
import deliverChartInit from './src/deliverChartInit.js';
import { mapState } from 'vuex';
import Jas from '~/components/index/Jas.vue';
import util from '~/public/util.js';
export default {
  components: {
  	Jas
  },
  data(){
    return {
      shopInfo:Object,
      chartInit:Object,
      distance:Number,
      deliverTime:Number
    }
  },
  computed: {
 	...mapState({
 		showJas: state => state.jas.showJas,
    deliver: state => state.deliver.deliver,
    curLocation: state => state.geo.curLocation
 	})
 },
	methods: {
    iniChart(){
        // deliver is come from /payList ,user's list info
        let {isDone,list:{inventorys,goods:{shopCid,shopName}}}=this.deliver
        let {locationCity,storeName,location}=inventorys[0]
        // get user's current location 
        let userLocation=this.initUserGeo()
        this.shopInfo={
          locationCity,
          storeName,
          shopCid,
          shopName,
          userLocation
        }
        let deliverMsg=isDone?"过往物流信息回顾":"物流到达时间预估"
        let newChartInit=deliverChartInit 
        newChartInit.title.text=deliverMsg
        /*
         * series[0]  means path , fomart: [ [coord1,coord2], [coord3,coord4] ]
         * series[1]  means marker , 
         * series[1] fomart: [ { shopName,shopCid,storeCity,storeName,value:[coord,distance=0] }]
         * */
         let shopNameShow=shopName+" "+locationCity+storeName+"号仓库"
         // can get user's geo ,draw deliver path , and marker both store and user location
         if(userLocation.geo){
           newChartInit.series[0].effect.trailOpacity=1
           newChartInit.series[0].data=[[location, userLocation.geo]]
           newChartInit.series[1].data=[{
             shopName:shopNameShow,
             value:[...location,0]
           },{
             shopName:"您的位置",
             value:[...userLocation.geo,0]
           }]
           let distance=util.getDistance(...location,...userLocation.geo)
           let deliverTime=parseInt(distance/500) 
           this.distance=distance.toFixed(2)
           this.deliverTime=deliverTime
         }else{
           // can not get user's geo , only draw store marker , opacity the path
           newChartInit.series[0].effect.trailOpacity=0
           newChartInit.series[1].data=[{
             shopName:shopNameShow,
             value:[...location,0]
           }]
           this.distance=0
           this.deliverTime=0
         }
        
        return newChartInit
    },
    initUserGeo(){
      let curLocation=this.curLocation
      if(curLocation.city=='未知地区'){
        return {
          province:"未知",
          city:"地区"
        }
      }else{
        return curLocation
      }
    },
    /* judge if comes from paylist or not */
    hasDeliver(){
       if(!this.deliver){
        this.$message({
        	message: '请选择订单' ,
        	type: 'error',
        	duration: 3000,
        	center: true,
        	customClass: 'message-info'
        });
        this.$router.push({path:"/payList/deliver"})
        return false
      }else{
        return true
      }
    },
    goback(){
      this.$router.go(-1)
    }
	},
  created(){
    if(!this.hasDeliver()) return
    this.chartInit=this.iniChart()
  },
	mounted() {
		this.chart = echarts.init(this.$refs.myEchart);
		this.chart.setOption(this.chartInit);
	},
	beforeDestroy() {
		this.chart.dispose();
		this.chart = null;
	},
  async asyncData(ctx){}
}
</script>

<style lang="less" scoped>
@import './src/showDeliver.less';
</style>
<style lang="less">
</style> 
