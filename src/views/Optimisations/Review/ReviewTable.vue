<template>
  <a-table :columns="columns" :data-source="data" class="axpi-table review-table" :pagination="false">
    <div slot="actions" class="table-actions">
      <a-button style="margin-right: 5px;">Analyse</a-button>
      <a-button>Review Specification</a-button>
    </div>
  </a-table>
</template>

<script>
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
    dataIndex: 'truePrice',
    title: 'TruePrice',
    key: 'truePrice',
  },
  {
    dataIndex: 'actions',
    title: '',
    key: 'actions',
    scopedSlots: {customRender: 'actions'}
  }
];

const data = [
  {
    key: 1,
    specName: 'Test spec',
    quantity: 123,
    deliveryDate: '12/12/2021',
    suppliers: 'Kearney',
    truePrice: '£1,500',
    co2e: '3000'
  },
  {
    key: 2,
    specName: '',
    quantity: 10000,
    deliveryDate: '',
    suppliers: '',
    truPrice: '£1MM',
    co2e: '45667'
  }
];

export default {
  name: "ScenariosTable",
  data() {
    return {
      columns,
      data
    }
  }
}
</script>

<style lang="scss">
.table-actions {
  text-align: right;
}

.review-table {
  tbody tr:last-child{
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