<template>
  <div class="root">
    <div class="manufacturer-wrapper">
      <div class="manufacturer-head-line">
        <span>Manufacturer</span>
        <div />
      </div>
      <div class="manufacturer-info-show">
        <div class="name">{{ item.manufacturer }}</div>
        <div class="id">{{ getManufacturId(item) }}</div>
      </div>
    </div>
    <router-link :to="ctaLink">
      <a-button type="primary">View & Buy</a-button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "ManufacturerShow",
  props: ["item", "ctaLink"],
  methods: {
    getManufacturId(product) {
      if (product.variant_identifier === "NA") {
        return product.product_identifier;
      }
      return product.variant_identifier;
    },
  },
};
</script>

<style lang="scss" scoped>
.root {
  display: flex;
  align-items: center;

  .manufacturer-wrapper {
    flex: 1;
    margin-top: 20px;
    user-select: none;

    .manufacturer-head-line {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: 600;

      div {
        margin-left: 1rem;
        border-top: 1px solid #eaeaea;
        width: 100%;
      }
    }

    .manufacturer-info-show {
      margin-top: 1rem;
      display: flex;
      align-items: center;

      .name {
        color: #000;
      }

      .id {
        margin-left: 1rem;
        color: #188fff;
        background-color: #188fff1d;
        padding: 4px 8px;
        font-size: 12px;
        border-radius: 9999px;
      }
    }
  }

  button {
    margin-left: 2rem;
    background-color: #1890ff;
    border-color: #1890ff;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style>
