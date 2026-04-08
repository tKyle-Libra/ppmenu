<template>
  <view class="banner-container" :style="{ transform: `translateY(${show ? 0 : '-100%'})` }">
    <swiper
      class="banner-swiper"
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="500"
      :circular="true"
      indicator-color="rgba(255, 255, 255, 0.5)"
      indicator-active-color="#ffffff"
    >
      <swiper-item v-for="(image, index) in bannerImages" :key="index">
        <image
          class="banner-image"
          :src="image"
          mode="aspectFill"
          :lazy-load="true"
        />
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { BANNER_IMAGES } from '@/utils/config.js'

export default {
  name: 'BannerSwiper',
  props: {
    // 是否显示Banner
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      bannerImages: BANNER_IMAGES
    }
  }
}
</script>

<style scoped>
.banner-container {
  width: 100%;
  height: 300rpx;
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
  background-color: #f0f0f0;
}

.banner-swiper {
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
