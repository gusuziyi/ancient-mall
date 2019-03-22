let deliverChartInit = {
  title: {
    text: '',
    subtext: '根据球面路径计算得出',
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
    viewControl:{
      autoRotate:false,
      targetCoord: [110, 30],
      distance:70
    },
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
  series: [{
      type: 'lines3D',
      effect: {
        show: true,
        trailWidth: 2,
        trailLength: 0.2,
        trailOpacity: 1,
        trailColor: 'rgb(240, 30, 180)'
      },
      lineStyle: {
        width: 1,
        color: 'rgb(100,100,100)',
        opacity: 0.1
      }
    },
    {
      type: 'scatter3D',
      coordinateSystem: 'globe',
      symbolSize: 13,
      symbol: 'pin',
      label: {
        show: true,
        distance: 3,
        			formatter: function(params) {
        				return params.data.shopName;
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
      // animationDurationUpdate: 2000,
    }
  ]
};
export default deliverChartInit
