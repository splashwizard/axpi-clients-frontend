<template>
  <div class="form-section">
    <div class="form-header">
      <h2>Other</h2>
    </div>

    <a-form layout="vertical">
      <a-form-item label="Enable search beyond existing supplier base?">
        <a-radio-group @change="forceRefresh" v-model="scenario.enable_search_beyond_existing_supplier_base"
                       button-style="solid">
          <a-radio-button :value="true">
            Yes
          </a-radio-button>
          <a-radio-button :value="false">
            No
          </a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="Enable bundling">
        <a-radio-group @change="forceRefresh" v-model="scenario.enable_bundling"
                       button-style="solid">
          <a-radio-button :value="true">
            Yes
          </a-radio-button>
          <a-radio-button :value="false">
            No
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "OtherDetails",
  props: ['scenario'],
  methods: {
    forceRefresh() {
      this.$forceUpdate();
    }
  }
}
</script>

<style scoped>

</style>