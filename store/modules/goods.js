const state = () => ({
	hotGoodses: [],
})
const mutations = {
	setGoodses(state, hotGoodses) {
		state.hotGoodses = hotGoodses
	},
}

export default {
	namespaced: true,
	state,
	mutations
}