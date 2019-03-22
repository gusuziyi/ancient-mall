<template>
	<div>
		<Jas v-if="showJas.visible" :isRealMan="showJas.isRealMan" />
		<Banner />
		<el-container class="container city">
			<div class="city-choose">
				<div class="city-choose-province">
					按省份选择
					<el-input
						class="city-input"
						placeholder="省份"
						suffix-icon="el-icon-arrow-down"
						v-model="provinceSelect"
						size="small"
						@focus="showProvinceDiv = true"
						@blur="onProvinceBlur"
					></el-input>
					<div
						class="province-div hiddenDiv"
						v-if="showProvinceDiv"
						@click="onProvinceDivClk"
					>
						<dl>
							<dt>省份</dt>
							<dd
								v-for="(item, idx) in onlyProvinces"
								:key="idx"
								:class="{ active: item == provinceSelect }"
								@click="onCheckProvince(item)"
							>
								{{ item }}
							</dd>
						</dl>
					</div>
					<el-input
						class="city-input"
						placeholder="城市"
						suffix-icon="el-icon-arrow-down"
						v-model="citySelect"
						size="small"
						@focus="showCityDiv = true"
						@blur="onCityBlur"
						:disabled="!provinceSelect"
					></el-input>
					<div
						:class="['city-div', 'hiddenDiv', xinjiang ? 'xinjiang' : '']"
						v-if="showCityDiv"
						@click="onCityDivClk"
					>
						<dl>
							<dt>城市</dt>
							<dd
								v-for="(item, idx) in citysInProvince"
								:key="idx"
								@click="onCheckCity(item)"
							>
								{{ item }}
							</dd>
						</dl>
					</div>
				</div>
				<div class="city-choose-search">
					直接搜索
					<el-autocomplete
						class="city-search"
						v-model="cityInput"
						:fetch-suggestions="querySearch"
						placeholder="请输入城市中文或拼音"
						:trigger-on-focus="false"
						@select="onCheckCity"
						size="small"
					>
						<template slot-scope="{ item }">
							<div class="name">{{ item }}</div>
						</template>
					</el-autocomplete>
				</div>
			</div>
			<div class="city-hot">
				热门城市
				<dl>
					<dd v-for="(item, idx) in hotcity" :key="idx" @click="onCheckCity(item)">
						{{ item }}
					</dd>
				</dl>
			</div>
			<div class="city-nearly">
				最近访问
				<dl>
					<dd v-for="(item, idx) in nearlyVisit" :key="idx">{{ item }}</dd>
				</dl>
			</div>
			<div class="city-byword">
				按拼音首字母选择
				<dl>
					<dd v-for="(item, idx) in onlyCitys" :key="idx">
						<a :href="'#' + item.letter">{{ item.letter }}</a>
					</dd>
				</dl>
			</div>
			<template v-for="(citys, idx) in onlyCitys">
				<dl class="city-citys" :key="idx" :id="citys.letter">
					<dt class="city-citys-word">{{ citys.letter }}</dt>
					<dd
						class="city-citys-city"
						v-for="(item, idx) in citys.citys"
						:key="idx"
						@click="onCheckCity(item)"
					>
						{{ item }}
					</dd>
				</dl>
			</template>
			<div class="to-up">
				<a href="#header"><i class="el-icon-arrow-up"></i></a>
			</div>
		</el-container>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Banner from '~/components/index/Banner.vue';
import CityCoord from "~/db/CityCoord.json"
import Jas from '~/components/index/Jas.vue';
export default {
	computed: {
		...mapState({
			showJas: state => state.jas.showJas
		})
	},
	components: {
		Banner,Jas
	},
	data() {
		return {
			provinceSelect: '',
			showProvinceDiv: false,
			citySelect: '',
			showCityDiv: false,
			cityInput: '',
			citysInProvince: [],
			xinjiang: false,
			nearlyVisit: [],
			letters: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
		};
	},
	async asyncData(ctx) {
		let [result, result2] = await Promise.all([
			ctx.$axios.get('/geo/hotcity'),
			ctx.$axios.get('/geo/province')
		]);
		let {
			status,
			data: { code, hotcity }
		} = result;
		let {
			status: status2,
			data: { code: code2, province, onlyProvinces, onlyCitys }
		} = result2;
		return {
			hotcity: code == 2000 ? hotcity : ['数据库异常,异常代码:', code],
			province: code2 == 2000 ? province : ['数据库异常,异常代码:', code2],
			onlyProvinces: code2 == 2000 ? onlyProvinces : ['数据库异常,异常代码:', code2],
			onlyCitys: code2 == 2000 ? onlyCitys : ['数据库异常,异常代码:', code2]
		};
	},
	mounted() {
		this.initUserFromLocalStorage()
		let nearlyVisit = localStorage.getItem('nearlyVisit');
		nearlyVisit ? (this.nearlyVisit = JSON.parse(nearlyVisit)) : (this.nearlyVisit = []);
	},
	methods: {
		...mapMutations({
			setUser: 'user/setUser',
			setMeImgAva: 'jas/setMeImgAva',
			setCity: 'geo/setCity'
		}),
		initUserFromLocalStorage(){
			let userInfo = localStorage.getItem('userInfo') || localStorage.getItem('tempUserInfo');
			if (userInfo) {
				userInfo = JSON.parse(userInfo);
				this.setUser(userInfo);
				this.setMeImgAva(userInfo.img);
			}
		},
		querySearch(queryString, cb) {
			let citys = this.onlyCitys;
			queryString = queryString.toUpperCase();
			let RegE = /^[A-Z]/;
			let results = [];
			if (RegE.test(queryString)) {
				let resultsObj = citys.filter(city => {
					return city.letter.indexOf(queryString) === 0;
				})[0];
				results = resultsObj.citys;
			} else {
				let allCitys = [];
				citys.forEach(item => {
					allCitys = allCitys.concat(item.citys);
				});
				results = allCitys.filter(city => {
					return city.indexOf(queryString) === 0;
				});
			}
			if (results.length == 0) {
				results.push('未匹配到结果');
			}
			cb(results);
		},
		onCheckProvince(provinceName) {
			this.provinceSelect = provinceName;
			// css style  control
			this.showProvinceDiv = false;
			if (provinceName == '内蒙古' || provinceName == '新疆') {
				this.xinjiang = true;
			} else {
				this.xinjiang = false;
			}
			this.citysInProvince = this.province.filter(item => item.name == provinceName)[0].citys;
		},
		onCheckCity(cityName) {
			this.showCityDiv = false;
            let geo=CityCoord.cityMap[cityName]
            let province=''
            this.province.forEach(p=>{
                if(p.citys.includes(cityName))
                    province=p.name
            })
			this.setCity({
                province,
                city:cityName,
                geo
            });
			this.$router.push('/');
			this.nearlyVisitStore(cityName);
		},
		nearlyVisitStore(cityName) {
			let nearlyVisit = localStorage.getItem('nearlyVisit');
			if (!nearlyVisit) {
				nearlyVisit = [];
			} else {
				nearlyVisit = JSON.parse(nearlyVisit);
				for (let i = 0; i < nearlyVisit.length; i++) {
					if (nearlyVisit[i] == cityName) {
						nearlyVisit.splice(i, 1);
					}
				}
			}
			nearlyVisit.unshift(cityName);
			if (nearlyVisit.length > 11) {
				nearlyVisit = nearlyVisit.slice(0, 10);
			}

			localStorage.setItem('nearlyVisit', JSON.stringify(nearlyVisit));
		},
		onProvinceBlur() {
			this._protimer = setTimeout(() => {
				this.showProvinceDiv = false;
			}, 150);
		},
		onProvinceDivClk() {
			if (this._protimer) {
				clearTimeout(this._protimer);
			}
		},
		onCityBlur() {
			this._citytimer = setTimeout(() => {
				this.showCityDiv = false;
			}, 150);
		},
		onCityDivClk() {
			if (this._citytimer) {
				clearTimeout(this._citytimer);
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import './src/changeCity.less';
</style>
<style lang="less">
.city-input {
	width: 8rem;
	.el-input__inner {
		width: 8rem;
		height: 2.2rem;
	}
}
.city-search {
	width: 15rem;
	.el-input__inner {
		width: 15rem;
		height: 2.2rem;
	}
}
</style>
