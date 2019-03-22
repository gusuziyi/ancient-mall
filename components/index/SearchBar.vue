<template>
	<div class="warpper">
		<el-input
			class="seachbar"
			size="small"
			placeholder="请输入内容"
			v-model="searchKeyword"
			@focus="isFocus = true"
			@blur="onblur"
			@keyup.native.enter="goSearch"
		>
			<i slot="suffix" class="el-input__icon el-icon-search" @click="goSearch"></i>
		</el-input>
		
		<div class="search-div "  v-if="isFocus">
			<dl class="hot" v-if="!searchKeyword">
				<dt>热门搜索</dt>
				<dd v-for="(hotWord, idx) in hotWords" :key="idx" @click='pickHot(hotWord)'>{{ hotWord }}</dd>
			</dl>
			<dl class="history" v-if="!searchKeyword">
				<dt>历史搜索</dt>
				<dd v-for="(item, idx) in history" :key="idx">
					<span  @click='onsearch(item)'>{{ item}}</span>
					<i class="el-icon-close" @click="delHistory(idx)"></i>
				</dd>
			</dl>
			<dl class="complete" v-if="searchKeyword" >
				<dd v-for="(item, idx) in complete" :key="idx" @click="onsearch(item)">
					{{ item }}
				</dd>
			</dl>
		</div>
	</div>
</template>

<script>
import SearchBarInfo from './SearchBarInfo.json';
import Goodses from '~/db/Goodses.json';
export default {
	watch:{
		/* 
		* watch if user has input word , sync computed the autoCompelete array
		*/
		searchKeyword(val){
			let tips=this.tips
			let complete=[]
			for(let tip of tips){
				if(tip.indexOf(val)!=-1)
					complete.push(tip)
			}
			if(complete.length>8){
				complete=complete.slice(0,8)
			}
			this.complete=complete
		}
	},
	data() {
		return {
			isFocus: false,
			searchKeyword: '',
			hotWords: SearchBarInfo.hotWord,
			tips:[],
			history: [],
			complete:[]
		};
	},
	methods: {
		/* 
		 * pick the  word in the  autoCompelete array
		 * */
		onsearch(item){
			this.searchKeyword=item
			this._timer=setTimeout(()=>{
				this.isFocus=false
			},150)
			this.goSearch()
		}, 
		/* 
		 * pick the hot word in the  hot search pannel
		 * */
		pickHot(hotWord){
			this.searchKeyword=hotWord
			this.goSearch()
		},
		/* 
		 * get the user search in the localStorage
		 * */
		getSearchHistory(){
			let searchHistory=localStorage.getItem("searchHistory")
			if(searchHistory){
				 searchHistory = JSON.parse(searchHistory) 
			}else{
				searchHistory=[]
			}
			return searchHistory
		},
		/* 
		 * store the user search in the localStorage ,and then routering the route /list/:searchKeyword
		 * */
		goSearch() {
			if (!this.searchKeyword) {
				this.$router.push({path:'/list'})
				return
			}
			let searchHistory=this.getSearchHistory()
			searchHistory.forEach((oneHistory,idx)=>{
				if(oneHistory==this.searchKeyword)
					searchHistory.splice(idx,1)
			})
			searchHistory.unshift(this.searchKeyword)
			while(searchHistory.length>4){
				searchHistory.pop()
			}
			this.history=searchHistory
			localStorage.setItem("searchHistory",JSON.stringify(searchHistory))
			this.$router.push({path:'/list/'+this.searchKeyword})
		},
		/* 
		 * del the user search in the localStorage 
		 * because the action will trigger onblur , we must clear this._timer first
		 * or the history pannel will disappear
		 * */
		delHistory(idx){
			clearTimeout(this._timer)
			let searchHistory=this.getSearchHistory()
			searchHistory.splice(idx,1)
			this.history=searchHistory
			localStorage.setItem("searchHistory",JSON.stringify(searchHistory))
		},
		onblur(){
			this._timer=setTimeout(()=>{
				this.isFocus=false
			},150)
		},
	},
	/* 
	 *	init tips by computed all goodses's keyword 
	 *  init user searchHistory
	 * */
	mounted() {
		let tips =[]
		Goodses.forEach(goods => {
			let skus=[]
			goods.vars.forEach(sku=>{
				skus.push(...Object.values(sku.attrs))
			})
			tips.push(goods.name,goods.department,...Object.values(goods.attrs),goods.shopName,...skus)
		});
		this.tips=[...new Set(tips) ]
		this.history=this.getSearchHistory()
	}
};
</script>
<style scoped lang="less">
@import '~assets/layout.less';
.warpper {
	.search-div {
		position: absolute;
		right: 0;
		top: 2rem;
		width: 15rem;
		height: 13rem;
		margin-top: 1rem;
		margin-left: 1rem;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border: 1px solid #e5e9ef;
		box-sizing: border-box;
		font-size: 0.8rem;
		color: grey;
		dt {
			font-size: 0.9rem;
			margin-bottom: 0.7rem;
		}
		.hot {
			padding: 0.5rem 1rem 0.7rem 1rem;
			border-bottom: 1px solid grey;
			margin-top: 0;
			max-height: 3rem;
			dd {
				display: inline;
				margin-left: 0;
				margin-right: 0.2rem;
				cursor: pointer;
				&:hover{
					color: purple;
				}
			}
		}
		.history,
		.complete {
			dt {
				padding: 0.2rem 1rem;
				margin-bottom: 0.3rem;
				margin-top: 0.7rem;
			}
			dd {
				padding: 0.2rem 1rem;
				display: flex;
				justify-content: space-between;
				padding-top: 0.2rem;
				padding-bottom: 0.2rem;
				margin-left: 0;
				&:hover {
					background-color: @header-div-dd-hover-bgc;
					cursor: pointer;
				}
				.el-icon-close {
					&:hover {
						color: purple;
						font-weight: bold;
					}
				}
			}
		}
		.complete dd {
			&:nth-child(1) {
				margin-top: 0.4rem;
			}
			margin-bottom: 0.1rem;
		}
	}
}
</style>

<style lang="less">
.seachbar {
	.el-input__inner {
		width: 15rem;
	}
	.el-icon-search{
		z-index: 140000;
	}
}
</style>
