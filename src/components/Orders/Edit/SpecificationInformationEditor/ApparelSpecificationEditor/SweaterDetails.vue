<template>
  <div>
    <a-form layout="vertical">
      <a-row :gutter="70">
        <a-col span="12">
          <a-form-item label="Type">
            <a-select v-model="orderLocal.sweater_type" show-search size="large" @change="forceRefresh">
              <a-select-option v-for="type in sweaterTypeOptions" :value="type.value" :key="type.value">
                {{ type.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
const SWEATER_TYPE_OPTIONS = [
  {
    label: "Cardigan Sweater",
    value: "cardigan-sweater",
  },
  {
    label: "Crew Neck Sweater",
    value: "crew-neck-sweater",
  },
  {
    label: "V Neck Sweater",
    value: "v-neck-sweater",
  },
  {
    label: "Half Zip Sweater",
    value: "half-zip-sweater",
  },
];

export default {
  name: "SweaterDetails",
  props: ["orderLocal"],

  data() {
    return {
      sweaterTypeOptions: SWEATER_TYPE_OPTIONS,
    };
  },

  methods: {
    forceRefresh() {
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped></style>
