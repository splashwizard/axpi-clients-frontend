<template>
  <div style="margin-bottom: 35px">
    <a-descriptions :column="1" :title="title" bordered>
      <a-descriptions-item label="Location">
        <div v-for="(address, i) in factory.addresses" :key="i">
          {{ formatAddress(address) }}
        </div>
        <div v-if="factory.addresses.length === 0">No address provided</div>
      </a-descriptions-item>
      <a-descriptions-item label="Accreditations">
        <div class="mb-2" v-for="(accreditation, ii) in factory.accreditations" :key="ii">
          {{ accreditation.name }} ({{ accreditation.type }})
        </div>
        <div v-if="factory.accreditations.length === 0">No accreditations</div>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import Addresses from "../../mixins/Addresses";

export default {
  name: "SupplierFactoryDetails",
  props: ["factory"],
  mixins: [Addresses],
  computed: {
    title() {
      return "Factory: " + this.factory.name;
    },
  },
};
</script>

<style scoped></style>
