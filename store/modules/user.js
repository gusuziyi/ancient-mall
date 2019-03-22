const state = () => ({
	userInfo: '',
	lastCart:[]
})
const mutations = {
	setUser(state, userInfo) {
		state.userInfo = userInfo
	},
	setLastCart(state, lastCart) {
		state.lastCart = lastCart
	}
}

export default {
	namespaced: true,
	state,
	mutations
}
