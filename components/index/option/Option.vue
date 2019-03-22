<template>
	<div class="option-warpper">
		<div class="option-title">
			全部栏目
		</div>
	<dl class="q-panel">
		<dd v-for='(item,idx) in optionDataOne' :key='idx'>
		<a :href="item.url" class='q-nav' v-if="idx!=2">
			<div :class="[item.style,'q-img']">
				{{item.name.substr(0,1)}}
			</div>
			<div :class="[item.style,'q-title']" >{{item.name}}</div>
		</a>
        <nuxt-link :to="item.url" class='q-nav' v-else>
        	<div :class="[item.style,'q-img']">
        		{{item.name.substr(0,1)}}
        	</div>
        	<div :class="[item.style,'q-title']" >{{item.name}}</div>
        </nuxt-link>
		</dd>
	</dl>
		<dl class="q-panel">
		<dd v-for='(item,idx) in optionDataTwo' :key='idx'>
		<nuxt-link :to="item.url" class='q-nav'>
			<div :class="[item.style,'q-img']">
				{{item.name.substr(0,1)}}
			</div>
			<div :class="[item.style,'q-title']" >{{item.name}}</div>
		</nuxt-link>
		</dd>
	</dl>
	</div>
</template>

<script>
	import optionData from './optionData.js'
export default {
	data() {
		return {
			optionDataOne:optionData.optionDataOne,
			optionDataTwo:optionData.optionDataTwo
		};
	},
	methods: {}
};
</script>

<style lang="less" scoped>
@import './option.less';
</style>
