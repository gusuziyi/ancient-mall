const state = () => ({
	curLocation: ''
})
const mutations = {
	setCity(state, curLocation) {
		state.curLocation = curLocation
	}
}

export default {
	namespaced: true,
	state,
	mutations
}