<template>
  <a-table
    class="axpi-table"
    :columns="columns"
    :row-key="(record) => record.id"
    :data-source="data"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <a href="#" slot="name" slot-scope="name, record" @click.prevent="handleRecordSelected(record)">{{ name }}</a>
    <template slot="country" slot-scope="country, record">
      {{ getCountry(record.name) }}
    </template>
    <!--        <template slot="rating">-->
    <!--            <a-rate :default-value="2" disabled/>-->
    <!--        </template>-->
    <template slot="product-type" slot-scope="productType, record">
      <a-badge :count="getProductType(record.name)" :number-style="{ backgroundColor: '#4dc8f2' }"></a-badge>
    </template>
    <template slot="last-order"> 10th February 2020 </template>
  </a-table>
</template>
<script>
import axios from "axios";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Country",
    dataIndex: "country",
    scopedSlots: {
      customRender: "country",
    },
  },
  {
    title: "Product Type",
    dataIndex: "product-type",
    scopedSlots: {
      customRender: "product-type",
    },
  },
  // {
  //     title: 'Rating',
  //     dataIndex: 'rating',
  //     sorter: true,
  //     scopedSlots: {
  //         customRender: 'rating'
  //     }
  // },
  // {
  //   title: 'Last Order',
  //   dataIndex: 'last_order',
  //   sorter: true,
  //   scopedSlots: {
  //     customRender: 'last-order'
  //   }
  // }
];

export default {
  data() {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns,
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        results_per_page: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },

    fetch(params = {}) {
      console.log("params:", params);
      this.loading = true;
      axios
        .post(window.API_BASE + "/suppliers/search", {
          results_per_page: 10,
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
          this.$message.error("Error loading suppliers");
        });
    },

    getCountry(supplierName) {
      switch (supplierName) {
        case "Gunn + Taylor":
          return "United Kingdom";
        case "Courtney Colour":
          return "USA";
        case "Razer Graphix":
          return "Canada";
        case "Eco Design - Eco Print":
          return "Ireland";
        case "Waratah Group":
          return "USA";
        case "Trojan Print":
          return "United Kingdom";
        case "Southern Impact":
          return "USA";
        case "Immij":
          return "Australia";
        case "Dashing":
          return "United Kingdom";
        case "Tdc3":
          return "Australia";
        default:
          return "United Kingdom";
      }
    },

    getProductType(supplierName) {
      switch (supplierName) {
        case "Gunn + Taylor":
          return "POS";
        case "Courtney Colour":
          return "Print";
        case "Razer Graphix":
          return "Packaging";
        case "Eco Design - Eco Print":
          return "Print";
        case "Waratah Group":
          return "Print";
        case "Trojan Print":
          return "Print";
        case "Southern Impact":
          return "Print";
        case "Immij":
          return "Print";
        case "Dashing":
          return "POS";
        case "Tdc3":
          return "Packaging";
        default:
          return "Print";
      }
    },

    handleRecordSelected(supplier) {
      // this.$emit('selected', order);
      this.$router.push("/suppliers/" + supplier.id);
    },
  },
};
</script>
