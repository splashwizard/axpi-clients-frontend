<template>
  <a-table :columns="columns" :data-source="data" class="axpi-table review-table" :pagination="false">
    <div slot="expectedPrice" slot-scope="expectedPrice">
      {{ formatCost({cost: expectedPrice, cost_currency: 'USD'}) }}
    </div>
    <div slot="co2e" slot-scope="co2e">
      {{ co2e }} kg
    </div>
    <div slot="actions" class="table-actions">
      <a-button style="margin-right: 5px;">Analyse</a-button>
      <a-button>Review Specification</a-button>
    </div>
  </a-table>
</template>

<script>
import Orders from "../../../mixins/Orders";
const _ = require('lodash');

const columns = [
  {
    dataIndex: 'specName',
    title: 'Spec Name',
    key: 'specName',
  },
  {
    dataIndex: 'quantity',
    title: 'Quantity',
    key: 'quantity',
  },
  {
    dataIndex: 'expectedPrice',
    title: 'Expected Price',
    key: 'expectedPrice',
    scopedSlots: {customRender: 'expectedPrice'}
  },
  {
    dataIndex: 'co2e',
    title: 'CO2e',
    key: 'co2e',
    scopedSlots: {customRender: 'co2e'}
  },
  {
    dataIndex: 'deliveryDate',
    title: 'Delivery Date',
    key: 'deliveryDate',
  },
  {
    dataIndex: 'suppliers',
    title: 'Suppliers',
    key: 'suppliers',
  },
  {
    dataIndex: 'actions',
    title: '',
    key: 'actions',
    scopedSlots: {customRender: 'actions'}
  }
];

export default {
  name: "ScenariosTable",
  data() {
    return {
      columns
    }
  },
  computed: {
    data() {
      const data = [
        {
          key: 1,
          specName: 'Pub Bud Light Leaflet',
          quantity: 2500,
          deliveryDate: '09/05/2021',
          suppliers: 'Southern Impact',
          expectedPrice: 1197,
          co2e: 321
        },
        {
          key: 2,
          specName: 'Alcohol Free Beer Brochure',
          quantity: 2000,
          deliveryDate: '10/05/2021',
          suppliers: 'Gunn + Taylor',
          expectedPrice: 3380,
          co2e: 881
        },
        {
          key: 3,
          specName: 'New Leaflet Spec',
          quantity: 1000,
          deliveryDate: '10/05/2021',
          suppliers: 'Gunn + Taylor',
          expectedPrice: 808,
          co2e: 196
        },
      ];

      let finalRow = {
        key: _.last(data).key + 1,
        specName: 'Total',
        quantity: '',
        expectedPrice: _.sumBy(data, 'expectedPrice'),
        co2e: _.sumBy(data, 'co2e'),
      };

      data.push(finalRow);

      return data;
    }
  },
  mixins: [Orders]
}
</script>

<style lang="scss">
.table-actions {
  text-align: right;
}

.review-table {
  tbody tr:last-child {
    background: #f9f9f9;

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