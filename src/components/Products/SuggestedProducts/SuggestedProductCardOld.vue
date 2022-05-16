<template>
  <div class="suggested-product-card-wrapper">
    <div class="suggested-product-card" @click.prevent="navigateToProduct(product)">
      <div class="left" :style="{ backgroundImage: 'url(' + getImageSrc(product) + ')' }"></div>
      <div class="right">
        <div class="category">
          {{ getCategory(product) }}
        </div>
        <div class="title">
          {{ truncate(product.name, 70) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SuggestedProductCard",
  props: ["product"],
  methods: {
    getImageSrc(product) {
      if (product["imageURLs"] && product["imageURLs"].length) {
        return product["imageURLs"][0];
      }
    },

    truncate(str, maxLength) {
      if (str && str.length > maxLength) {
        return str.slice(0, maxLength) + "...";
      }
      return str;
    },

    getCategory(product) {
      if (product.taxonomyCategory) {
        return product.taxonomyCategory[product.taxonomyCategory.length - 1];
      }
      return "Miscellaneous";
    },

    navigateToProduct(product) {
      let id = product.id;
      if (!id) {
        id = product["_id"];
      }
      this.$router.push("/products/" + id);
    },
  },
};
</script>

<style lang="scss" scoped>
.suggested-product-card-wrapper {
  padding-left: 5px;
  padding-right: 5px;
  cursor: pointer;

  .suggested-product-card {
    //border: 1px solid #f9f9f9;
    border: 1px solid #d9d9d9;
    background: #fff;
    border-radius: 10px;
    padding: 10px 15px;

    display: flex;

    .left {
      width: 100px;
      min-width: 80px;
      max-width: 80px;
      height: 100px;
      flex-shrink: 1;
      display: flex;
      background-size: contain;
      background-position: center left;
      background-repeat: no-repeat;
    }

    .right {
      padding-left: 15px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .category {
        font-style: italic;
      }

      .title {
        font-weight: 500;
        margin-top: 8px;
      }
    }
  }
}
</style>
