<template>
  <div class="home">
    <div class="page-header">
      <h1 class="page-title">Stores</h1>
    </div>
    <stores-table :reload-key="reloadFactoriesKey" @selected="handleFactorySelected"> </stores-table>
  </div>
</template>

<script>
import StoresTable from "./StoresTable";

export default {
  name: "Stores",
  components: { StoresTable },
  methods: {},
  data() {
    return {};
  },
};
</script>
