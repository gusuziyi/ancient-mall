<template>
	<section class="container">
		<Banner id='header'/>
		<Carousel-list />
		<Shops id='goodses'/>
		<Film  id='films'/>
		<Jas v-if="showJas.visible" :isRealMan="showJas.isRealMan" />
        <div class="to-up">
        	<a href="#header"><i class="el-icon-arrow-up"></i></a>
        </div>
	</section>
</template>

<script>
import CarouselList from '~/components/index/CarouselList.vue';
import Shops from '~/components/index/Shops.vue';
import Film from '~/components/index/Film.vue';
import Jas from '~/components/index/Jas.vue';
import Banner from '~/components/index/Banner.vue';
import { mapState, mapMutations } from 'vuex';
import axios from '~/public/axios';

export default {
	computed: {
		...mapState({
			showJas: state => state.jas.showJas,
		})
	},
	components: {
		CarouselList,
		Shops,
		Film,
		Jas,
		Banner
	},
	async asyncData(ctx) {
		try{
			let {data: { code: code_user, user }}= await axios.get('/user/curUser')
			if (code_user == 2000) {
				ctx.store.commit('user/setUser', user);
				ctx.store.commit('jas/setMeImgAva', user.img);
			}
		}catch(e){
			
		}
	}
};
</script>

<style scoped lang="less">
.container {
	padding: 1rem 2rem;
	min-height: 90rem;
	width: 75rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
    .to-up{
    	height: 2rem;
    	width: 2rem;
    	line-height: 2rem;
    	text-align:center;
    	background-color: purple;
    	bottom: 1rem;
    	right: 1rem;
    	border-radius: 4px;
    	i{
    		color: white;
    	}
    	position: fixed;
    }
}
</style>
