const state = () => ({
	showJas:{
		visible:false,
		isRealMan:false
	} ,
	meImgAva:''
})
const mutations = {
	setShowJas(state, showJas) {
		state.showJas =showJas
	},
	setMeImgAva(state, meImgAva) {
		state.meImgAva = meImgAva
	}
}

export default {
	namespaced: true,
	state,
	mutations
}
