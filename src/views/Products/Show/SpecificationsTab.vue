<template>
  <div>
    <table class="axpi-basic-table">
      <thead>
      <tr>
        <th>Field Name</th>
        <th>Field Value</th>
        <th width="150">Normalised Value</th>
        <th></th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <specification-row v-for="(detail, i) in details" :detail="detail" :key="i"
      ></specification-row>
      </tbody>
    </table>
  </div>
</template>

<script>
import SpecificationRow from "./SpecificationsTab/SpecificationRow";
import {mapGetters} from "vuex";

export default {
  name: "SpecificationsTabs",
  components: {SpecificationRow},
  computed: {
    ...mapGetters('productViewer', {
      details: 'details'
    })
  }
}
</script>

<style scoped>

</style>