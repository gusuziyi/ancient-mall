<template>
	<div>
		<el-amap :vid="id" zoom="2" :center="mapData.location" v-if="id == 'map'">
			<el-amap-marker :position="mapData.location" />
			<el-amap-text
				:text="mapData.shopName"
				:position="mapData.location"
				:offset="mapData.offset"
			/>
		</el-amap>
		<el-amap
			:vid="id"
			zoom="1"
			:center="mapData.storeArr[0].storeLocation"
			v-if="id == 'inventoryMap'"
		>
			<el-amap-marker
				:position="store.storeLocation"
				v-for="(store, index) in mapData.storeArr"
				:key="index"
			/>
			<el-amap-text
				:text="store.storeName"
				:position="store.storeLocation"
				:offset="mapData.offset"
				v-for="(store, index) in mapData.storeArr"
				:key="index + 'text'"
			/>
		</el-amap>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	props: {
		id: String,
		mapData: Object
	}
};
</script>

<style lang="less">
.amap-logo,
.amap-copyright {
	visibility: hidden !important;
	display: none;
	z-index: 0;
}
</style>
