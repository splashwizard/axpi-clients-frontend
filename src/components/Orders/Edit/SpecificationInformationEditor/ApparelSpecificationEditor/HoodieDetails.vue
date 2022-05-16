<template>
  <div>
    <a-form layout="vertical">
      <a-row :gutter="70">
        <a-col span="12">
          <a-form-item label="Type">
            <a-select v-model="orderLocal.hoodie_type" show-search size="large" @change="forceRefresh">
              <a-select-option v-for="type in hoodieTypeOptions" :value="type.value" :key="type.value">
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
const HOODIE_TYPE_OPTIONS = [
  {
    label: "Zip Up Hoodie",
    value: "zip-up-hoodie",
  },
  {
    label: "Pullover Hoodie",
    value: "pullover-hoodie",
  },
  {
    label: "Athletic Hoodie",
    value: "athletic-hoodie",
  },
];

export default {
  name: "HoodieDetails",
  props: ["orderLocal"],

  data() {
    return {
      hoodieTypeOptions: HOODIE_TYPE_OPTIONS,
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
