import Vue from 'vue';
import VueAMap from 'vue-amap';
const cfg = require('../server/router/cfg.js');
Vue.use(VueAMap);

if (!Vue.prototype.$isServer) {
	VueAMap.initAMapApiLoader({
		key: cfg.MAP_KEY,
		plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType',
			'AMap.PolyEditor', 'AMap.CircleEditor'
		],
		v: '1.4.13'
	});
}

