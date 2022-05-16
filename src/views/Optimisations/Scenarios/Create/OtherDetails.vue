<template>
  <div class="form-section">
    <div class="form-header">
      <h2>Other</h2>
    </div>

    <a-form layout="vertical">
      <a-row :gutter="50">
        <a-col :span="12">
          <a-form-item label="Maximum number of suppliers">
            <a-input type="number" :min="1" size="large" v-model="scenario.maximum_number_of_suppliers"></a-input>
          </a-form-item>

          <!--          <a-form-item label="Search beyond existing supplier base">-->
          <!--            <a-radio-group @change="forceRefresh" v-model="scenario.enable_search_beyond_existing_supplier_base"-->
          <!--                           button-style="solid">-->
          <!--              <a-radio-button :value="true">-->
          <!--                Yes-->
          <!--              </a-radio-button>-->
          <!--              <a-radio-button :value="false">-->
          <!--                No-->
          <!--              </a-radio-button>-->
          <!--            </a-radio-group>-->
          <!--          </a-form-item>-->

          <!--          <a-form-item label="Bundle items">-->
          <!--            <a-radio-group @change="forceRefresh" v-model="scenario.enable_bundling"-->
          <!--                           button-style="solid">-->
          <!--              <a-radio-button :value="true">-->
          <!--                Yes-->
          <!--              </a-radio-button>-->
          <!--              <a-radio-button :value="false">-->
          <!--                No-->
          <!--              </a-radio-button>-->
          <!--            </a-radio-group>-->
          <!--          </a-form-item>-->
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "OtherDetails",
  props: ["scenario"],
  methods: {
    forceRefresh() {
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped></style>
