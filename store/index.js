import Vue from 'vue'
import Vuex from 'vuex'
// vuex will be empty when page refresh ,it donot suit for store user 
// but suit for index user state manage
import geo from './modules/geo'
import user from './modules/user'
import jas from './modules/jas'
import film from './modules/film'
import goods from './modules/goods'
import deliver from './modules/deliver'


import Goodses from '~/db/Goodses.json'
import util from '~/public/util.js'

Vue.use(Vuex)

const formatFilm = (commit, filmRes) => {
    let {
        data: {
            total,
            subjects: films,
            title
        }
    } = filmRes
    if (total) {
        films = films.map(item => {
            return {
                id: item.id,
                alt: item.alt,
                rating: item.rating.average,
                count: item.collect_count,
                title: item.title,
                genres: item.genres.slice(0, 2).toString().replace(',', ' '),
                image: item.images.large || item.images.medium || item.images.small
            }
        })
        if (title.indexOf("正在上映的电影") == 0)
            commit('film/setHotFilms', films)
        if (title == "即将上映的电影")
            commit('film/setComingFilms', films)
    }
}

let store = () => new Vuex.Store({
    modules: {
        geo,
        user,
        jas,
        goods,
        film,
        deliver
    },
    actions: {
        async nuxtServerInit({
            commit
        }, {
            app,
            req
        }) {
            /* init curCity ,though the koa server is not work 
            it also can init city in vuex's function setCity*/
            let curLocation = ''
            try {
                let {
                    status: status_c,
                    data: {
                        code: code_c,
                        location
                    }
                } = await app.$axios.get('/geo/getCurCity')
                curLocation = (code_c == 2000) ? {
                    province: location.province.replace(/(省|市)/, ''),
                    city: location.city.replace(/(自治州|市|盟|地区|林区)/, ''),
                    geo: location.geo
                } : {
                    city: "未知地区"
                }
            } catch (e) {
                curLocation = {
                    city: "未知地区"
                }
            }
            commit('geo/setCity', curLocation)


            /* init hotfilms and comingfilms */
            try {
                let [hotFilmRes, comingFilmRes] = await Promise.all([
                    app.$axios.get('https://api.douban.com/v2/movie/in_theaters?count=10'),
                    app.$axios.get('https://api.douban.com/v2/movie/coming_soon?count=10')
                ])
                formatFilm(commit, hotFilmRes)
                formatFilm(commit, comingFilmRes)
            } catch (e) {

            }
            /* firstData is in mongo ,and backData in the /assets/data , 
            if db do not work, backData will in use */
            const showDataFromAssets = (Goodses) => {
                let GoodsesForIndex = Goodses.sort((a, b) => (b.sellNum - a.sellNum))
                return new Promise((resolve, reject) => {
                    if (GoodsesForIndex) {
                        resolve({
                            data: {
                                hotGoodses: GoodsesForIndex
                            }
                        })
                    } else {
                        reject(new Error('Goodses数据构造失败'))
                    }
                })
            }
            let {
                data: {
                    hotGoodses
                }
            } = await Promise.race([
                app.$axios.post('/goods/getHotGoods'),
                showDataFromAssets(Goodses)
            ])
            hotGoodses = util.removeRepeat_Goods(hotGoodses).splice(0, 6)
            commit('goods/setGoodses', hotGoodses)

        }
    }
})

export default store
