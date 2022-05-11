<template>
  <ais-hits
    :class-names="{
      'ais-Hits-item': 'custom-ais-hits-item',
    }"
  >
    <template slot="item" slot-scope="{ item }">
      <article class="shop-item-result">
        <a-row :gutter="32">
          <a-col :span="5">
            <category-show :item="item" />
            <div class="product-image-wrapper">
              <router-link :to="getProductPageUrl(item)">
                <img class="product-image" :src="getImageSrc(item)" :alt="item.name" @error="onImgErr" />
              </router-link>
            </div>
          </a-col>
          <a-col :span="19">
            <div class="product-top">
              <div class="left">
                <router-link :to="getProductPageUrl(item)">
                  <h1 class="product-name" v-html="item.name">
                    <!-- @TODO: need to find out how to render raw html in ais-highlight -->
                    <ais-highlight
                      :hit="item"
                      attribute="name"
                      :class-names="{
                        'ais-Highlight-highlighted': 'custom-ais-highlighted',
                      }"
                    />
                  </h1>
                </router-link>
              </div>
            </div>

            <description-show :item="item" />
          </a-col>
        </a-row>
        <manufacturer-show :item="item" :ctaLink="getProductPageUrl(item)" />
      </article>
    </template>
  </ais-hits>
</template>

<script>
import CategoryShow from "./CategoryShow";
import DescriptionShow from "./DescriptionShow";
import ManufacturerShow from "./ManufacturerShow";

export default {
  name: "PricesDisplay",
  props: {
    // @TODO: check if quantities is needed
    quantities: {
      type: Object,
    },
  },
  components: {
    DescriptionShow,
    CategoryShow,
    ManufacturerShow,
  },
  methods: {
    getProductPageUrl(product) {
      return "/products/" + product.id + "?fromShop=1";
    },

    getImageSrc(product) {
      if (product.image_urls && product.image_urls.length) {
        return product.image_urls[0];
      }
      return "/img/product_placeholder.png";
    },

    onImgErr(e) {
      e.target.src = "/img/product_placeholder.png";
    },
  },
};
</script>

<style lang="scss">
.shop-item-result {
  width: 100%;

  .product-name {
    font-size: 20px;
    line-height: 1.5;
    font-weight: 700;
    margin-bottom: 20px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .product-image-wrapper {
    width: 150px;
    height: 150px;
    border-radius: 4px;
    overflow: hidden;
  }

  .product-image {
    width: 100%;
    height: auto;
  }

  .product-top {
    display: flex;

    .left {
      flex-grow: 1;
      display: flex;
    }

    .right {
      flex-shrink: 1;
      min-width: 100px;
      text-align: right;
      font-weight: 500;
    }
  }

  .product-group {
    margin-top: 25px;
  }

  .custom-ais-highlighted {
    color: inherit;
    background-color: #188fff61;
  }
}

.custom-ais-hits-item {
  margin-bottom: 2rem;
  border-radius: 4px !important;
}
</style>
