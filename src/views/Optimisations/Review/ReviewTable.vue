<template>
  <a-table
    :columns="columns"
    :data-source="data"
    class="axpi-table review-table"
    :pagination="false"
    row-class-name="review-table-row"
  >
    <div slot="expectedPrice" slot-scope="expectedPrice, row">
      {{ formatCost({ cost: row.min_expected_price, cost_currency: "USD" }) }}
      <span v-if="row.min_expected_price !== row.max_expected_price"
        >-
        {{
          formatCost({
            cost: row.max_expected_price,
            cost_currency: "USD",
          })
        }}</span
      >
    </div>
    <div slot="quantity" slot-scope="quantity">
      {{ formatQuantity(quantity) }}
    </div>
    <div slot="co2e" slot-scope="co2e, row">{{ row.min_co2e }} kg</div>
    <div slot="actions" slot-scope="actions, row" class="table-actions">
      <a-button @click="analyseSpecification(row)" style="margin-right: 5px">Analyse</a-button>
      <a-button @click="reviewSpecification(row)">Review Specification</a-button>
    </div>
    <a-table
      slot="expandedRowRender"
      slot-scope="row"
      :columns="innerColumns"
      :data-source="row.mappings"
      :pagination="false"
    >
      <div slot="expectedPrice" slot-scope="expectedPrice">
        {{ formatCost({ cost: expectedPrice / 100, cost_currency: "USD" }) }}
      </div>
      <div slot="co2e" slot-scope="co2e">{{ co2e }} kg</div>
    </a-table>
  </a-table>
</template>

<script>
import Orders from "../../../mixins/Orders";
import { mapActions } from "vuex";

const _ = require("lodash");

const columns = [
  {
    dataIndex: "name",
    title: "Spec Name",
    key: "specName",
    width: 300,
  },
  {
    dataIndex: "quantity",
    title: "Quantity",
    key: "quantity",
    scopedSlots: { customRender: "quantity" },
  },
  {
    dataIndex: "expectedPrice",
    title: "Expected Price",
    key: "expectedPrice",
    scopedSlots: { customRender: "expectedPrice" },
  },
  {
    dataIndex: "co2e",
    title: "CO2e",
    key: "co2e",
    scopedSlots: { customRender: "co2e" },
  },
  // {
  //   dataIndex: 'deliveryDate',
  //   title: 'Delivery Date',
  //   key: 'deliveryDate',
  // },
  // {
  //   dataIndex: 'number_of_suppliers',
  //   title: 'Suppliers',
  //   key: 'number_of_suppliers',
  // },
  {
    dataIndex: "supplier",
    title: "Suppliers",
    key: "supplier",
  },
  {
    dataIndex: "actions",
    title: "",
    key: "actions",
    width: 300,
    scopedSlots: { customRender: "actions" },
  },
];

const innerColumns = [
  {
    dataIndex: "supplier_name",
    title: "Supplier",
    key: "supplier",
  },
  {
    dataIndex: "expected_price",
    title: "Expected Price",
    key: "expectedPrice",
    scopedSlots: { customRender: "expectedPrice" },
  },
  {
    dataIndex: "co2e",
    title: "CO2e",
    key: "co2e",
    scopedSlots: { customRender: "co2e" },
  },
];

export default {
  name: "ReviewTable",
  props: ["tableData", "optimisation"],
  data() {
    return {
      columns,
      innerColumns,
    };
  },
  methods: {
    ...mapActions("optimisationAnalyticsManager", {
      setFilterBySpecification: "setFilterBySpecification",
      setSelectedSpecification: "setSelectedSpecification",
    }),

    analyseSpecification(specification) {
      this.setFilterBySpecification(true);
      this.setSelectedSpecification(specification.mappings[0].optimisation_specification);
      this.$router.push("/optimisations/" + this.optimisation.id + "/analytics");
    },

    reviewSpecification(specification) {
      this.$router.push(
        "/optimisations/" +
          this.optimisation.id +
          "/specifications/" +
          specification.mappings[0].optimisation_specification_id
      );
    },
  },
  computed: {
    data() {
      // const data = [
      //   {
      //     key: 1,
      //     specName: 'Pub Bud Light Leaflet',
      //     quantity: 2500,
      //     deliveryDate: '09/05/2021',
      //     suppliers: 'Southern Impact',
      //     expectedPrice: 1197,
      //     co2e: 321
      //   },
      //   {
      //     key: 2,
      //     specName: 'Alcohol Free Beer Brochure',
      //     quantity: 2000,
      //     deliveryDate: '10/05/2021',
      //     suppliers: 'Gunn + Taylor',
      //     expectedPrice: 3380,
      //     co2e: 881
      //   },
      //   {
      //     key: 3,
      //     specName: 'New Leaflet Spec',
      //     quantity: 1000,
      //     deliveryDate: '10/05/2021',
      //     suppliers: 'Gunn + Taylor',
      //     expectedPrice: 808,
      //     co2e: 196
      //   },
      // ];

      let data = this.tableData;

      let finalRow = {
        key: _.last(data).key + 1,
        name: "Total",
        quantity: "",
        min_expected_price: _.sumBy(data, "min_expected_price"),
        max_expected_price: _.sumBy(data, "max_expected_price"),
        min_co2e: _.sumBy(data, "min_co2e"),
        max_co2e: _.sumBy(data, "max_co2e"),
      };

      data.push(finalRow);

      return data;
    },
  },
  mixins: [Orders],
};
</script>

<style lang="scss">
.table-actions {
  text-align: right;
}

.review-table {
  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: -5px 0 10px 0 !important;
  }

  tbody tr.review-table-row:last-child {
    background: #f9f9f9;

    .ant-table-row-expand-icon {
      display: none;
    }

    td {
      border-top: 2px solid #e8e8e8;
      padding-top: 13px !important;
      padding-bottom: 13px !important;
      font-weight: bold;
    }

    .table-actions {
      display: none;
    }
  }
}
</style>
