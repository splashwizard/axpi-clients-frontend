<template>
  <div>
    <a-tooltip :title="getCategory(item)" overlayClassName="product-category-tooltip" v-if="visibleTooltip">
      <div class="category-chip">{{ getCategory(item) }}</div>
    </a-tooltip>
    <div class="category-chip" v-else>{{ getCategory(item) }}</div>
  </div>
</template>

<script>
export default {
  name: "CategoryShow",
  props: ["item"],
  data() {
    return {
      visibleTooltip: false,
    };
  },
  methods: {
    // get category
    getCategory(product) {
      if (!product.category_breadcrumbs) {
        return;
      }
      const category = product.category_breadcrumbs
        .replace(/[^a-zA-Z0-9,]/g, "")
        .split(`,`)
        .pop();

      if (category.length > 19) {
        this.visibleTooltip = true;
      }

      return category;
    },
  },
};
</script>

<style lang="scss">
.product-category-tooltip {
  font-size: 12px;

  .ant-tooltip-arrow:before {
    background-color: #fff;
  }

  .ant-tooltip-inner {
    background-color: #fff;
    color: #000000a6;
    min-height: max-content;
    min-width: max-content;
  }
}

.category-chip {
  margin-bottom: 1rem;
  padding: 2px 6px;
  max-width: 60%;
  width: min-content;
  background-color: #188fff1d;
  color: #188fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 9999px;
  text-overflow: ellipsis;
  overflow: hidden;
  user-select: none;
}
</style>
