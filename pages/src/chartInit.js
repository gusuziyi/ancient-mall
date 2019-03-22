// import worldData from '../../assets/earthMap/world.js';
import worldDatas from '~/db/Shops.json';
let world = worldDatas.map(function(item) {
			return Object.assign(item, { value: [item.location[0], item.location[1], 0] });
		});
let chartInit = {
	title: {
		text: '美妆小铺全球门店分布',
		subtext: '请点击坐标查看详细信息',
		left: '15px',
		top: '15px',
		textStyle: {
			color: '#fff'
		},
	},
	backgroundColor: '#000',
	globe: {
		baseTexture: require('~/assets/earthMap/world.jpg'),
		heightTexture: require('~/assets/earthMap/world.jpg'),
		displacementScale: 0.04,
		shading: 'lambert',
		environment: require('~/assets/earthMap/sky.jpg'),
		realisticMaterial: {
			roughness: 0.9
		},
		postEffect: {
			enable: true
		},
		light: {
			main: {
				intensity: 1.5
			},
			ambient: {
				intensity: 1.2
			}
		}
	},
	series: {
		type: 'scatter3D',
		coordinateSystem: 'globe',
		symbolSize: 13,
		symbol: 'pin',
		label: {
			show: true,
			distance: 3,
			formatter: function(params) {
				return params.data.address.city;
			},
			position: 'top',
			textStyle: {
				fontSize: 8,
				color: 'black'
			}
		},
		itemStyle: {
			color: 'rgb(250, 50, 150)',
			opacity: 1
		},
		zIndex: 27,
		animationDurationUpdate: 2000,
		data: world
	}
};
export default chartInit
