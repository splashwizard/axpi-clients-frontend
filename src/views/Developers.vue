<template>
  <div class="reports">
    <div class="page-header">
      <h1 class="page-title">API Keys</h1>
      <div class="actions">
        <create-api-key-modal @api-key-created="handleApiKeyCreated"> </create-api-key-modal>
      </div>
    </div>

    <api-keys-table :key="updateKey"></api-keys-table>
  </div>
</template>

<script>
import ApiKeysTable from "./Developers/ApiKeysTable";
import CreateApiKeyModal from "./Developers/CreateApiKeyModal";

export default {
  name: "Reports",
  computed: {},
  components: { ApiKeysTable, CreateApiKeyModal },
  data() {
    return {
      updateKey: 1,
    };
  },
  methods: {
    handleApiKeyCreated() {
      this.updateKey += 1;
    },
  },
};
</script>
