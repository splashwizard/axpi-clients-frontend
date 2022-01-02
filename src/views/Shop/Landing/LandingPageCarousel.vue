<template>
  <div :class="{'carousel-margin-bottom': carouselImages.length < 2}">
    <div v-if="isLoading">
      <a-spin></a-spin>
    </div>
    <carousel
        v-if="!isLoading" :autoplay="true" :autoplay-timeout="5000" :per-page="1">
      <slide v-for="(image, i) in carouselImages" :key="i">
        <img class="carousel-image" :src="getImageSrc(image.image)" :alt="image.alt">
      </slide>
    </carousel>
  </div>
</template>

<script>
import axios from 'axios';
import Images from "../../../mixins/Images";

export default {
  name: "LandingPageCarousel",
  mixins: [Images],
  data() {
    return {
      isLoading: false,
      carouselImages: []
    }
  },
  created() {
    this.loadCarouselImages();
  },
  methods: {
    loadCarouselImages() {
      let vm = this;
      vm.isLoading = true;
      axios.get(window.API_BASE + '/shop-landing-page/carousel-images').then(r => {
        vm.isLoading = false;
        vm.carouselImages = r.data;
      }).catch(e => {
        console.log(e);
        vm.isLoading = false;
        vm.$message.error('Error loading carousel images');
      });
    }
  }
}
</script>

<style scoped>
.carousel-image {
  width: 100%;
  max-height: 600px;
  object-position: center;
  text-align: center;
  object-fit: cover;
  margin-left: auto;
  margin-right: auto;
}

.carousel-margin-bottom {
  margin-bottom: 30px;
}
</style>