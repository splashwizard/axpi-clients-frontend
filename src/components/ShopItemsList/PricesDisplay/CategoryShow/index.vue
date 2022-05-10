<template>
  <div>
    <a-tooltip :title="categoryDisplay" overlayClassName="product-category-tooltip" v-if="visibleTooltip">
      <div class="category-chip">{{ categoryDisplay }}</div>
    </a-tooltip>
    <div class="category-chip" v-else>{{ categoryDisplay }}</div>
  </div>
</template>

<script>
export default {
  name: "CategoryShow",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      visibleTooltip: false,
    };
  },
  computed: {
    categoryDisplay: function () {
      return this.getCategory(this.item);
    },
  },
  methods: {
    getCategory(product) {
      if (!product.category_breadcrumbs || !product.category_breadcrumbs.length) {
        return;
      }

      const category = product.category_breadcrumbs[product.category_breadcrumbs.length - 1];

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
  max-width: 150px;
  width: min-content;
  background-color: #188fff1d;
  color: #188fff;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  border-radius: 4px;
  text-overflow: ellipsis;
  overflow: hidden;
  user-select: none;
}
</style>
