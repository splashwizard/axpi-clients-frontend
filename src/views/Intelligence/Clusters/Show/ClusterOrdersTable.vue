<template>
  <a-table
    class="axpi-table"
    :columns="columns"
    :row-key="(record) => record.id"
    :data-source="data"
    :loading="loading"
  >
    <a href="#" slot="name" slot-scope="name, record" @click.prevent="handleRecordSelected(record)">{{
        name
      }}</a>
    <div slot="actions" class="table-actions" slot-scope="actions, record">
      <a-dropdown :trigger="['click']">
        <a-button
          type="link"
          icon="ellipsis"
          @click.prevent="(e) => e.preventDefault()"
        ></a-button>
        <a-menu slot="overlay">
          <a-menu-item>
            <a
              href="#"
              class="text-danger"
              @click.prevent="deleteRecord(record)"
              >Remove</a
            >
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </a-table>
</template>
<script>
import axios from "axios";

const columns = [
  {
    title: "Name",
    dataIndex: "PO Li Description",
    sorter: true,
    scopedSlots: {customRender: 'name'}
  },
  {
    title: "PO Number",
    dataIndex: "PO Number",
    sorter: true,
  },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
    width: 10,
  },
];

export default {
  props: ["clusterId"],
  data() {
    return {
      data: [],
      loading: false,
      columns,
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch(params = {}) {
      console.log("params:", params);
      this.loading = true;
      axios
        .get(
          window.API_BASE +
            "/intelligence/clusters/" +
            this.clusterId +
            "/orders"
        )
        .then((r) => {
          this.loading = false;
          this.data = r.data;
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("Error loading orders");
        });
    },

    deleteRecord(order) {
      this.$emit("remove-order", order);
    },

    handleRecordSelected(record) {
      this.$emit('record-selected', record);
    }
  },
};
</script>
