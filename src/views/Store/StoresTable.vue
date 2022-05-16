<template>
  <a-table class="axpi-table" :columns="columns" :row-key="(store) => store.id" :data-source="data" :loading="loading">
    <div slot="updated_at" slot-scope="updated_at">
      {{ displayTimeAgo(updated_at) }}
    </div>
    <div slot="actions" class="table-actions" slot-scope="status, store">
      <div v-if="status === 'requested'" class="d-flex">
        <a-button
          type="primary"
          :icon="approveLoading ? 'loading' : ''"
          @click="approveAccess(store)"
          class="mr-2"
          :disabled="approveLoading || approveLoading"
          >Approve Access</a-button
        >
        <a-button
          type="danger"
          :icon="denyLoading ? 'loading' : ''"
          @click="denyAccess(store)"
          :disabled="approveLoading || approveLoading"
          >Deny Access</a-button
        >
      </div>
      <a-button v-if="status === 'approved'" type="primary" @click="viewStore(store)">View Products</a-button>
    </div>
  </a-table>
</template>
<script>
import axios from "axios";
import Dates from "../../mixins/Dates";

const columns = [
  {
    title: "Organisation",
    dataIndex: "name",
    sorter: true,
  },
  {
    title: "",
    dataIndex: "status",
    scopedSlots: { customRender: "actions" },
    align: "center",
    width: 10,
  },
];

export default {
  props: ["reloadKey"],
  data() {
    return {
      data: [],
      pagination: {},
      loading: false,
      approveLoading: false,
      denyLoading: false,
      columns,
    };
  },
  mixins: [Dates],
  watch: {
    reloadKey() {
      this.fetch();
    },
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch() {
      this.loading = true;
      axios
        .get(window.API_BASE + "/stores")
        .then(async (r) => {
          const stores = r.data;
          let stores_data = stores.map((store) => ({
            ...store,
            status: "initial",
          }));
          const suppliers = (await axios.get(window.API_BASE + "/supplier-store-links")).data;
          const supplier_requests = (await axios.get(window.API_BASE + "/supplier-store-links/requests")).data;
          suppliers.map((supplier) => {
            const idx = stores_data.findIndex((store) => store.id === supplier.store_id);
            stores_data[idx].status = "approved";
          });
          supplier_requests.map((supplier_request) => {
            const idx = stores_data.findIndex((store) => store.id === supplier_request.store_id);
            stores_data[idx].status = "requested";
            stores_data[idx].request_id = supplier_request.id;
          });
          this.data = stores_data;
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
          this.$message.error("Error loading stores");
        });
    },

    approveAccess(store) {
      this.approveLoading = true;
      const storeId = store.id;
      const storeRequestId = store.request_id;
      axios
        .put(`${window.API_BASE}/supplier-store-links/${storeRequestId}`)
        .then(() => {
          const storeIdx = this.data.findIndex((store) => store.id === storeId);
          this.data[storeIdx].status = "approved";
          this.approveLoading = false;
        })
        .catch((e) => {
          this.approveLoading = false;
          console.log(e);
          this.$message.error("Error Requesting access to store");
        });
    },

    denyAccess(store) {
      this.denyLoading = true;
      const storeId = store.id;
      const storeRequestId = store.request_id;
      axios
        .delete(`${window.API_BASE}/supplier-store-links/${storeRequestId}`)
        .then(() => {
          const storeIdx = this.data.findIndex((store) => store.id === storeId);
          this.data[storeIdx].status = "initial";
          this.denyLoading = false;
        })
        .catch((e) => {
          this.denyLoading = false;
          console.log(e);
          this.$message.error("Error Requesting access to store");
        });
    },

    viewStore() {},
  },
};
</script>
