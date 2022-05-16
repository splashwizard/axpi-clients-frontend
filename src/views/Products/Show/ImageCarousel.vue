<template>
  <a-carousel arrows dots-class="slick-dots slick-thumb">
    <a slot="customPaging" slot-scope="props">
      <img :src="getImgUrl(props.i)" />
    </a>
    <div v-for="(url, urlI) in urls" :key="urlI">
      <img :src="url" />
    </div>
  </a-carousel>
</template>
<script>
export default {
  props: ["urls"],
  data() {
    return {};
  },
  methods: {
    getImgUrl(i) {
      return this.urls[i];
    },
  },
};
</script>
<style scoped>
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
.slick-dots li {
  margin-right: 20px;
}
.slick-dots li:last-child {
  margin-right: 0 !important;
}
.slick-dots img {
  border: 1px solid #e8e8e8;
}
.slick-slide img {
  max-height: 400px;
}
</style>
