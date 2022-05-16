<template>
  <div>
    <a-table :columns="columns" :data-source="data"> </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: "Specification Name",
    dataIndex: "specificationName",
    key: "specification-name",
  },
  {
    title: "Orders",
    dataIndex: "orders",
    key: "orders",
  },
  {
    title: "Spend ($)",
    dataIndex: "spend",
    key: "spend",
  },
  {
    title: "Savings ($)",
    dataIndex: "savings",
    key: "savings",
  },
  {
    title: "CO2e Emitted (kg)",
    dataIndex: "co2eEmitted",
    key: "co2e-emitted",
  },
  {
    title: "Water Used (T)",
    dataIndex: "waterUsed",
    key: "water-used",
  },
  {
    title: "# Suppliers",
    dataIndex: "numberOfSuppliers",
    key: "number-of-suppliers",
  },
];

const data = [
  {
    key: 1,
    specificationName: "Spec 1",
    orders: "41",
    spend: "77777",
    savings: "20461",
    co2eEmitted: "28930",
    waterUsed: "28689",
    numberOfSuppliers: "30",
  },
  {
    key: 2,
    specificationName: "Spec 2",
    orders: "40",
    spend: "74520",
    savings: "5992",
    co2eEmitted: "58360",
    waterUsed: "128471",
    numberOfSuppliers: "34",
  },
  {
    key: 3,
    specificationName: "Spec 3",
    orders: "36",
    spend: "46440",
    savings: "5807",
    co2eEmitted: "29222",
    waterUsed: "115766",
    numberOfSuppliers: "18",
  },
  {
    key: 4,
    specificationName: "Spec 4",
    orders: "24",
    spend: "16176",
    savings: "244",
    co2eEmitted: "9123",
    waterUsed: "21105",
    numberOfSuppliers: "6",
  },
  {
    key: 5,
    specificationName: "Spec 5",
    orders: "12",
    spend: "6036",
    savings: "385",
    co2eEmitted: "5235",
    waterUsed: "5858",
    numberOfSuppliers: "9",
  },
  {
    key: 6,
    specificationName: "Spec 6",
    orders: "44",
    spend: "49676",
    savings: "4828",
    co2eEmitted: "28812",
    waterUsed: "74917",
    numberOfSuppliers: "37",
  },
  {
    key: 7,
    specificationName: "Spec 7",
    orders: "16",
    spend: "13184",
    savings: "2940",
    co2eEmitted: "9443",
    waterUsed: "8023",
    numberOfSuppliers: "4",
  },
  {
    key: 8,
    specificationName: "Spec 8",
    orders: "7",
    spend: "4921",
    savings: "669",
    co2eEmitted: "3271",
    waterUsed: "1532",
    numberOfSuppliers: "5",
  },
  {
    key: 9,
    specificationName: "Spec 9",
    orders: "34",
    spend: "47226",
    savings: "2192",
    co2eEmitted: "23732",
    waterUsed: "80749",
    numberOfSuppliers: "30",
  },
  {
    key: 10,
    specificationName: "Spec 10",
    orders: "1",
    spend: "1827",
    savings: "71",
    co2eEmitted: "1653",
    waterUsed: "8156",
    numberOfSuppliers: "1",
  },
];

export default {
  name: "AnalyticsSpecificationsTable",
  data() {
    return {
      columns,
      data,
    };
  },
};
</script>

<style scoped></style>
