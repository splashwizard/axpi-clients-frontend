<template>
  <a-table :columns="columns" :data-source="data" :bordered="bordered" :pagination="pagination" class="rules-table">
    <template slot="id-column" slot-scope="id">
      <div>{{ id }}</div>
    </template>
    <template slot="impressions-column" slot-scope="impressions">
      <div>{{ formatNumber(impressions) }}</div>
    </template>
    <template slot="ctr-column" slot-scope="CTR">
      <div>{{ formatPercent(CTR) }}</div>
    </template>
    <template slot="cvr-column" slot-scope="CVR">
      <div>{{ formatPercent(CVR) }}</div>
    </template>
  </a-table>
</template>

<script>
import { numberWithCommas } from "../../../helpers/formatter";

const columnsWithoutPercent = [
  {
    title: "",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Result",
    dataIndex: "result",
    key: "result",
  },
  {
    title: "Impressions",
    dataIndex: "impressions",
    key: "impressions",
    scopedSlots: { customRender: "impressions-column" },
    align: "right",
  },
  {
    title: "Clicks",
    dataIndex: "clicks",
    key: "clicks",
    align: "right",
  },
  {
    title: "Conversions",
    dataIndex: "conversions",
    key: "conversions",
    align: "right",
  },
];

const columnsWithPercent = [
  {
    title: "",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Result",
    dataIndex: "result",
    key: "result",
  },
  {
    title: "Impressions",
    dataIndex: "impressions",
    key: "impressions",
    scopedSlots: { customRender: "impressions-column" },
    align: "right",
  },
  {
    title: "CTR",
    dataIndex: "CTR",
    key: "CTR",
    scopedSlots: { customRender: "ctr-column" },
    align: "right",
  },
  {
    title: "CVR",
    dataIndex: "CVR",
    key: "CVR",
    scopedSlots: { customRender: "cvr-column" },
    align: "right",
  },
];
export default {
  name: "QueryTable",
  props: ["data", "showPercent"],
  components: {},
  data() {
    return {
      pagination: false,
      bordered: false,
      badgeStyle: {
        backgroundColor: "rgb(232,250,255)",
        color: "rgb(0,118,155)",
        borderColor: "rgb(185,239,255)",
      },
    };
  },
  methods: {
    formatPercent(value) {
      return `${value.toFixed(2)}%`;
    },
    formatNumber(value) {
      return numberWithCommas(value);
    },
  },
  computed: {
    columns() {
      return this.showPercent ? columnsWithPercent : columnsWithoutPercent;
    },
  },
};
</script>

<style scoped lang="scss">
.rules-table {
  border-top: 1px solid #e8e8e8;
}

.badge {
  padding: 0 8px;
  display: inline-block;
  border-radius: 100px;
  background-color: rgb(245, 245, 250);
  color: rgb(72, 76, 122);
  border: 1px solid rgb(214, 214, 231);
}

.colored-badge {
  padding: 0 8px;
  display: inline-block;
  border-radius: 100px;
  background-color: rgb(232, 250, 255);
  color: rgb(0, 118, 155);
  border: 1px solid rgb(185, 239, 255);
}

.cond-wrapper {
  margin: 8px 8px 0 0;
}

.subtext {
  color: #5a5e9a;
  font-size: 12px;
}

.category-wrapper {
  display: flex;
  flex-direction: row;
  margin-top: 8px;
}

.pin-image {
  width: 14px;
  height: 14px;
  border: 1px solid rgb(182, 183, 213);
  border-radius: 3px;
  margin-top: -1px;
}

.dropdown-item {
  width: 250px;
  padding: 8px 12px;
  align-items: center;
}

.dropdown-item-between {
  width: 250px;
  padding: 8px 12px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.percent {
  display: inline-block;
  width: 40px;
  text-align: center;
}

.query-link {
  font-size: 14px;
  color: rgb(113, 124, 226);
  &:hover {
    cursor: pointer;
    color: rgb(19, 42, 247);
  }
}
</style>
