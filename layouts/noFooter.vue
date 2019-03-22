<template>
	<div>
		<Header />
		<nuxt />
	</div>
</template>
<script>
import Header from '~/components/layout/Header.vue';
export default {
	components: {
		Header,
	}
};
</script>
