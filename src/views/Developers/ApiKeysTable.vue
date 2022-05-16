<template>
  <div>
    <loading-screen :is-loading="isDeleting"></loading-screen>
    <a-table :columns="columns" :data-source="apiKeys" class="axpi-table">
      <div slot="issued_at" slot-scope="issued_at">
        {{ displayTimestamp(issued_at) }}
      </div>
      <div slot="last_used" slot-scope="last_used">
        {{ last_used ? displayTimestamp(last_used) : "-" }}
      </div>
      <template slot="actions" class="table-actions" slot-scope="actions, record">
        <a-dropdown :trigger="['click']">
          <a-button type="link" icon="ellipsis" @click.prevent="(e) => e.preventDefault()"></a-button>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="#" @click.prevent="revokeKey(record)" class="text-danger">Revoke</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
    </a-table>
  </div>
</template>

<script>
import axios from "axios";
import Dates from "../../mixins/Dates";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Issued At",
    dataIndex: "created_at",
    scopedSlots: { customRender: "issued_at" },
  },
  {
    title: "Last Used",
    dataIndex: "last_used_at",
    scopedSlots: { customRender: "last_used" },
  },
  {
    title: "Abilities",
    dataIndex: "abilities",
  },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
    width: 10,
  },
];

export default {
  name: "ApiKeysTable",
  props: [],
  mixins: [Dates],
  data() {
    return {
      isLoading: false,
      columns,
      apiKeys: [],
      isDeleting: false,
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      let vm = this;
      vm.isLoading = true;
      axios
        .get(window.API_COMMON_BASE + "/developers/tokens")
        .then((r) => {
          vm.isLoading = false;
          vm.apiKeys = r.data;
        })
        .catch((e) => {
          vm.isLoading = false;
          vm.$message.error("Error loading API keys");
          console.log(e);
        });
    },

    revokeKey(token) {
      let vm = this;
      vm.isDeleting = true;
      axios
        .delete(window.API_COMMON_BASE + "/developers/tokens/" + token.id)
        .then(() => {
          vm.isDeleting = false;
          vm.$message.success("API key revoked successfully");
          vm.fetch();
        })
        .catch((e) => {
          vm.isDeleting = false;
          vm.$message.error("Error revoking API keys");
          console.log(e);
        });
    },
  },
};
</script>

<style scoped></style>
