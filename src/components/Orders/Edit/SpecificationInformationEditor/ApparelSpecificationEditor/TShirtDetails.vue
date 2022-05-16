<template>
  <div>
    <a-form layout="vertical">
      <a-row :gutter="70">
        <a-col span="12">
          <a-form-item label="Type">
            <a-select v-model="orderLocal.t_shirt_type" show-search size="large" @change="forceRefresh">
              <a-select-option v-for="type in tShirtTypeOptions" :value="type.value" :key="type.value">
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
const T_SHIRT_TYPE_OPTIONS = [
  {
    label: "Basic Half Sleeve T-Shirt",
    value: "basic-half-sleeve-t-shirt",
  },
  {
    label: "Long Sleeve Crew Neck T-Shirt",
    value: "long-sleeve-crew-neck-t-shirt",
  },
  {
    label: "Polo Collar T-Shirt",
    value: "polo-collar-t-shirt",
  },
  {
    label: "Wide Neck T-Shirt (Women)",
    value: "wide-neck-t-shirt-women",
  },
  {
    label: "Yoke Neck T-Shirt (Women)",
    value: "yoke-neck-t-shirt-women",
  },
  {
    label: "Boyfriend T-Shirt (Women)",
    value: "boyfriend-t-shirt-women",
  },
  {
    label: "Scoop Neck T-Shirt",
    value: "scoop-neck-t-shirt",
  },
  {
    label: "Henley Collar T-Shirt",
    value: "henley-collar-t-shirt",
  },
  {
    label: "Baseball T-Shirt",
    value: "baseball-t-shirt",
  },
  {
    label: "Raglan Sleeve T-Shirt",
    value: "raglan-sleeve-t-shirt",
  },
  {
    label: "Ringer T-Shirt",
    value: "ringer-t-shirt",
  },
  {
    label: "Cap Sleeve T-Shirt",
    value: "cap-sleeve-t-shirt",
  },
  {
    label: "Half T-Shirt (Singlet)",
    value: "half-t-shirt-singlet",
  },
  {
    label: "Pocket T-Shirt",
    value: "pocket-t-shirt",
  },
];

export default {
  name: "TShirtDetails",
  props: ["orderLocal"],

  data() {
    return {
      tShirtTypeOptions: T_SHIRT_TYPE_OPTIONS,
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
