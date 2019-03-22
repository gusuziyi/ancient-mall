<template>
	<div class="wraper">
		<dl class="q-header" @mouseover="mover">
			<dt class="q-title">影视资讯</dt>
			<dd :class="{ active: activeTag == 'hot' }" tag="hot">正在热映</dd>
			<dd :class="{ active: activeTag == 'coming' }" tag="coming">即将上映</dd>
		</dl>
		<div class="show" @mouseenter="moverShow" @mouseleave="mleaveShow">
			<div class="btn btn-pre" v-if="isInFilmShow" @click="goLeft">
				<i class="el-icon-arrow-left"></i>
			</div>
			<div class="btn btn-next" v-if="isInFilmShow" @click="goRight">
				<i class="el-icon-arrow-right"></i>
			</div>
			<dl :class="['q-list', isFirstPage ? 'q-list-one' : 'q-list-two']">
				<dd class="film" v-for="(film, idx) in films" :key="idx">
					<a :href="film.alt">
						<img class="film-pic" :src="film.image" :alt="film.title" />
						<span class="film-imax">{{ film.genres }}</span>
						<div class="film-info">
							<div>
								<div class="film-info-mark" v-if="activeTag=='hot'">
									观众评分
									<span class="mark">{{ film.rating }}</span>
								</div>
								<div class="film-info-mark" v-else="">
									想看人数
									<span class="mark">{{ film.count }}</span>
								</div>
								<div class="film-info-title">{{ film.title }}</div>
							</div>
							<span class="film-info-buy">购票</span>
						</div>
					</a>
				</dd>
			</dl>
			<div class="pages">
				<i :class="['el-icon-minus', isFirstPage ? 'active' : '']" @click="goLeft"></i>
				<i :class="['el-icon-minus', isFirstPage ? '' : 'active']" @click="goRight"></i>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState({
			hotFilms: state => state.film.hotFilms,
			comingFilms: state => state.film.comingFilms
		})
	},
	created(){
		this.films=this.hotFilms
	},
	data() {
		return {
			films: [],
			activeTag: 'hot',
			isInFilmShow: false,
			isFirstPage: true
		};
	},
	methods: {
		mover(e) {
			let dom = e.target;
			if (dom.tagName.toLowerCase() == 'dd') {
				let tag = dom.getAttribute('tag');
				this.activeTag = tag;
				this.films = tag == 'hot' ? this.hotFilms : this.comingFilms;
			}
		},
		moverShow() {
			this.isInFilmShow = true;
		},
		mleaveShow() {
			this.isInFilmShow = false;
		},
		goLeft() {
			this.isFirstPage = true;
		},
		goRight() {
			this.isFirstPage = false;
		}
	}
};
</script>

<style lang="less" scoped>
@import './Film.less';
</style>
