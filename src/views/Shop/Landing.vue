<template>
  <div>
    <landing-page-carousel></landing-page-carousel>
    <landing-page-carousels></landing-page-carousels>
  </div>
</template>

<script>
import LandingPageCarousel from "./Landing/LandingPageCarousel";
import LandingPageCarousels from "./Landing/LandingPageCarousels";

export default {
  name: "Landing",
  components: { LandingPageCarousels, LandingPageCarousel },
};
</script>

<style scoped></style>
