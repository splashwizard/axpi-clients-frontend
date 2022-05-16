<template>
  <a-table :columns="columns" :data-source="data" :bordered="bordered" :pagination="pagination" class="rules-table">
    <template slot="id-column" slot-scope="id">
      <div>{{ id }}</div>
    </template>
    <template slot="result-column" slot-scope="title, record">
      <div class="d-flex">
        <div class="result-imgWrapper">
          <img :src="record.imgsrc" />
        </div>
        <h4>{{ title }}</h4>
      </div>
    </template>
    <template slot="count-column" slot-scope="count, record">
      <div class="d-flex">
        <div style="min-width: 20px">{{ count }}</div>
        <div :class="record.countpercent >= 0 ? 'status-success bordered' : 'status-warning bordered'" v-if="compared">
          <a-icon :type="record.countpercent > 0 ? 'arrow-up' : 'arrow-down'" />
          <div class="percent">{{ record.countpercent }}%</div>
        </div>
      </div>
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
// const moment = require('moment');

const columns = [
  {
    title: "",
    dataIndex: "id",
    key: "id",
    scopedSlots: { customRender: "id-column" },
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "result",
    scopedSlots: { customRender: "result-column" },
  },
  {
    title: "Count",
    dataIndex: "count",
    key: "count",
    scopedSlots: { customRender: "count-column" },
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
  name: "SearchesWithoutResultTable",
  props: ["data", "compared"],
  components: {},
  data() {
    return {
      columns,
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
  },
  computed: {},
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

.result-imgWrapper {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
