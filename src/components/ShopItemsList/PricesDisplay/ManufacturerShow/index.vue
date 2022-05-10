<template>
  <div class="manufacturer-wrapper">
    <div class="manufacturer-head-line">
      <span>Manufacturer</span>
      <div />
    </div>
    <div class="info-wrapper">
      <div class="manufacturer-info-show">
        <div class="name" v-html="item.manufacturer" />
        <div class="id" v-html="manufacturerId" />
      </div>
      <router-link :to="ctaLink">
        <a-button type="primary">View & Buy</a-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "ManufacturerShow",
  props: {
    item: {
      type: Object,
      required: true,
    },
    ctaLink: {
      type: String,
      required: true,
    },
  },
  computed: {
    manufacturerId: function () {
      return this.getManufacturId(this.item);
    },
  },
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

  .info-wrapper {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

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
        border-radius: 4px;
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
}
</style>
