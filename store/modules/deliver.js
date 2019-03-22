const state = () => ({
	deliver: {},
})
const mutations = {
	setDeliver(state, deliver) {
		state.deliver = deliver
	}
}

export default {
	namespaced: true,
	state,
	mutations
}
