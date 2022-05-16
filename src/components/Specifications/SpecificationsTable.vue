<template>
  <div>
    <a-table
      class="axpi-table"
      :row-selection="rowSelection"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <a href="#" slot="name" slot-scope="name, record" @click.prevent="handleRecordSelected(record)">{{ name }}</a>
      <div slot="type" slot-scope="type">
        {{ formatType(type) }}
      </div>
      <div slot="updated_at" slot-scope="updated_at">
        {{ displayTimeAgo(updated_at) }}
      </div>
      <div slot="actions" class="table-actions" slot-scope="actions, record">
        <a-dropdown :trigger="['click']">
          <a-button type="link" icon="ellipsis" @click.prevent="(e) => e.preventDefault()"></a-button>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="#" @click="handleRecordSelected(record)">Edit</a>
            </a-menu-item>
            <a-menu-item>
              <a href="#" class="text-danger" @click.prevent="deleteRecord(record)">Delete</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </a-table>
  </div>
</template>
<script>
import axios from "axios";
import Orders from "../../mixins/Orders";
import Dates from "../../mixins/Dates";

const columns = [
  {
    title: "Name",
    dataIndex: "product_name",
    sorter: true,
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Type",
    dataIndex: "product_type",
    sorter: true,
    scopedSlots: { customRender: "type" },
  },
  {
    title: "Last Updated",
    dataIndex: "updated_at",
    sorter: true,
    scopedSlots: { customRender: "updated_at" },
  },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
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
      columns,
      selectedSpecificationIds: [],
    };
  },
  mixins: [Orders, Dates],
  mounted() {
    this.fetch();
  },
  watch: {
    reloadKey() {
      this.fetch();
    },
    selectedSpecificationIds(newSelection) {
      this.$emit("set-selected-specification-ids", newSelection);
    },
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys) => {
          this.selectedSpecificationIds = selectedRowKeys;
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
          },
        }),
      };
    },
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        results_per_page: pagination.pageSize,
        page: pagination.current,
        sort_field: sorter.field,
        sort_order: sorter.order,
        ...filters,
      });
    },

    fetch(params = {}) {
      this.loading = true;
      axios
        .post(window.API_BASE + "/specifications/search", {
          results_per_page: 10,
          status: this.statusToShow,
          ...params,
        })
        .then((r) => {
          const pagination = { ...this.pagination };
          // Read total count from server
          pagination.total = r.data.total;
          this.loading = false;
          this.data = r.data.data;
          this.pagination = pagination;
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("Error loading specifications");
        });
    },

    handleRecordSelected(order) {
      this.$emit("selected", order);
    },

    deleteRecord(order) {
      this.$emit("delete-specification", order);
    },

    // getInformationRequestUrl(informationRequest) {
    //    return '/information-requests/' + informationRequest.id + '/edit';
    // }
  },
};
</script>
