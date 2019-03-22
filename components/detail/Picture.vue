<template>
	<div class="img-div">
		<canvas class="img-over" ref="canvas" @mousemove="enlargePic" @mouseout="endLarge"></canvas>
		<img class="img-big img" :src="img" ref="pic" v-if="showPic" />
		<section class="img-detail">
			<img
				class="img-small img"
				v-for="(pic, idx) in smallPic"
				:key="idx"
				:src="pic"
				@click="checkPic(pic, idx)"
			/>
		</section>
	</div>
</template>

<script>
export default {
	computed: {
		img(){
			return this.bigImg||this.curImg
		}
	},
	props: {
		curImg: String
	},
	data() {
		return {
			bigImg:'',
			imgScale: 1.1,
			//simulation the small picture thumbnail
			smallPic: [
				'http://ancient-mall.oss-cn-shenzhen.aliyuncs.com/goodsThumb/t1.jpg',
				'http://ancient-mall.oss-cn-shenzhen.aliyuncs.com/goodsThumb/t2.jpg',
				'http://ancient-mall.oss-cn-shenzhen.aliyuncs.com/goodsThumb/t3.jpg',
				'http://ancient-mall.oss-cn-shenzhen.aliyuncs.com/goodsThumb/t4.jpg'
			],
			//-1 means curImg and 0-4 means keys in smallPic
			curSmall: -1,
			showPic: true,
			//canvas 2d ctx handle
			ctx: null
		};
	},
	methods: {
		/* enlarge pic when mousemove on the canvas , and the origin will be hiddened  */
		enlargePic(e) {
			this.showPic = false;
			let pic = new Image();
			pic.src = this.img;
			let canvas = this.$refs.canvas;
			this.ctx = canvas.getContext('2d');
			this.ctx.clearRect(0, 0, canvas.width, canvas.height);
			let coordInCanvas = {
				x: e.clientX - canvas.getBoundingClientRect().left,
				y: e.clientY - canvas.getBoundingClientRect().top
			};
			let newSize = {
				width: canvas.width / this.imgScale,
				height: canvas.height / this.imgScale
			};
			let newX = coordInCanvas.x - newSize.width / 2;
			let newY = coordInCanvas.y - newSize.height / 2;
			this.ctx.drawImage(
				pic,
				newX,
				newY,
				newSize.width,
				newSize.height,
				0,
				0,
				canvas.width,
				canvas.height
			);
		},

		/* end large picture */
		endLarge() {
			let canvas = this.$refs.canvas;
			this.ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.showPic = true;
		},
		/* user check small pictrues in the bottom */
		checkPic(pic, idx) {
			if (this.curSmall == idx) {
				this.bigImg = this.curImg;
				this.curSmall = -1;
			} else {
				this.bigImg = pic;
				this.curSmall = idx;
			}
			this.$emit('changeImg', this.bigImg);
		}
	}
};
</script>

<style lang="less" scoped>
.img-div {
	width: 30rem;
	position: relative;
	.img-big {
		height: 20rem;
		width: 30rem;
		background-repeat: no-repeat;
		background-position: 100% 100%;
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
	}
	.img-over {
		height: 20rem;
		width: 30rem;
		z-index: 4;
		position: absolute;
		top: 0;
		left: 0;
	}
	.img-detail {
		display: flex;
		justify-content: space-between;
		margin-top: 20.6rem;
		margin-bottom: 0.6rem;
		.img-small {
			height: 5rem;
			width: 7rem;
			padding-bottom: 0.1rem;
			box-sizing: border-box;
			opacity: 0.9;
			&:hover {
				border-bottom: 1px solid purple;
				opacity: 1;
			}
		}
	}
	.img {
		background-repeat: no-repeat;
		background-size: cover;
		&.d1 {
			background-position: 0 0;
		}
		&.d2 {
			background-position: 60% 25%;
		}
		&.d3 {
			background-position: 30% 50%;
		}
		&.d4 {
			background-position: 100% 100%;
		}
	}
}
</style>
