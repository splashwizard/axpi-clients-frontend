<template>
  <div>
    <ais-panel>
      <prices-display v-if="displayMode === 'prices'" :quantities="quantities" />

      <specs-display
        v-else-if="displayMode === 'specs'"
        :prices="prices"
        :is-loading-prices="isLoadingPrices"
        :quantities="quantities"
      />
    </ais-panel>

    <ais-panel>
      <ais-pagination />
    </ais-panel>
  </div>
</template>

<script>
import PricesDisplay from "./PricesDisplay";
import SpecsDisplay from "./SpecsDisplay";

export default {
  name: "ShopItemsList",
  props: ["displayMode", "prices", "isLoadingPrices", "quantities"],
  components: {
    PricesDisplay,
    SpecsDisplay,
  },
};
</script>
