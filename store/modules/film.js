const state = () => ({
	hotFilms: [],
	comingFilms:[]
})
const mutations = {
	setHotFilms(state, hotFilms) {
		state.hotFilms = hotFilms
	},
	setComingFilms(state,comingFilms){
		state.comingFilms=comingFilms
	}
}

export default {
	namespaced: true,
	state,
	mutations
}