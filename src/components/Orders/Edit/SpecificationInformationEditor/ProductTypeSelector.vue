<template>
  <div class="icon-selector">
    <a href="#" @click.prevent="select('print')" :class="{ selected: isSelected('print') }">
      <div class="icon">
        <img src="/img/icons/product-type-selector/print-v2.png" alt="Print" />
      </div>
      <div class="caption">Print</div>
    </a>
    <a href="#" @click.prevent="select('pos')" :class="{ selected: isSelected('pos') }">
      <div class="icon">
        <img src="/img/icons/product-type-selector/pos.png" alt="POS" />
      </div>
      <div class="caption">POS</div>
    </a>
    <a href="#" @click.prevent="select('apparel')" :class="{ selected: isSelected('apparel') }">
      <div class="icon">
        <img src="/img/icons/product-type-selector/apparel.png" alt="Apparel" />
      </div>
      <div class="caption">Apparel</div>
    </a>
    <a href="#" @click.prevent="select('merchandise')" :class="{ selected: isSelected('merchandise') }">
      <div class="icon">
        <img src="/img/icons/product-type-selector/merchandise.png" alt="Merchandise" />
      </div>
      <div class="caption">Merchandise</div>
    </a>
    <a href="#" @click.prevent="select('packaging')" :class="{ selected: isSelected('packaging') }">
      <div class="icon">
        <img src="/img/icons/product-type-selector/package.png" alt="Packaging" />
      </div>
      <div class="caption">Packaging</div>
    </a>
  </div>
</template>

<script>
export default {
  name: "ProductTypeSelector",
  props: ["orderLocal"],
  data() {
    return {
      selected: null,
    };
  },
  mounted() {
    this.selected = this.orderLocal.product_type;
  },
  watch: {
    selected(newSelection) {
      this.orderLocal.product_type = newSelection;
      this.$emit("property-updated");
    },
  },
  methods: {
    select(key) {
      this.selected = key;
    },

    isSelected(key) {
      return this.selected === key;
    },
  },
};
</script>

<style scoped></style>
