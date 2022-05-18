<template>
  <a-table
    :row-selection="rowSelection"
    :row-class-name="rowClassName"
    :columns="columns"
    :data-source="tableData"
    :bordered="bordered"
    :pagination="pagination"
    class="rules-table"
  >
    <template slot="conditions-column" slot-scope="conditions">
      <date-period :period="conditions.period" v-if="conditions.period.length > 0" />
      <query-condition
        v-for="(condition, ci) in conditions.query_conditions"
        :condition="condition"
        :index="ci"
        :key="ci"
      />
    </template>

    <template slot="consequences-column" slot-scope="consequences">
      <div>
        <filter-result v-if="consequences.filterResults.length > 0" :filters="consequences.filterResults" />
        <boost-category v-if="consequences.boostCategories.length > 0" :category="consequences.boostCategories" />
        <bury-category v-if="consequences.buryCategories.length > 0" :category="consequences.buryCategories" />
        <pinned-item v-for="(pinnedItem, pi) in consequences.pinnedItems" :key="'p' + pi" :item="pinnedItem" />
        <hidden-item v-for="(hiddenItem, hi) in consequences.hiddenItems" :key="'h' + hi" :item="hiddenItem" />
      </div>
    </template>

    <template slot="timestamp-column" slot-scope="timestamp">
      <div>{{ getTime(timestamp) }}</div>
    </template>

    <template slot="action-column" slot-scope="key, record">
      <a-dropdown :trigger="['click']" v-model="record.visibleDropdown">
        <a-menu slot="overlay" style="padding: 0">
          <a-menu-item key="edit" class="dropdown-item-between" @click="editRule(key)">
            <span> Edit Rule </span>
            <a-icon type="edit" />
          </a-menu-item>
          <a-menu-item key="disable" class="dropdown-item-between">
            <span style="margin-right: 80px"> Rule disabled </span>
            <a-switch
              :default-checked="record.disabled"
              :checked="record.disabled"
              @click="(checked) => disableRule(key, checked)"
            >
              <a-icon type="check" />
              <a-icon type="close" />
            </a-switch>
          </a-menu-item>
          <a-menu-item key="delete" class="dropdown-item-between" @click="deleteRule(key)">
            <span> Delete Rule </span>
            <a-icon type="delete" />
          </a-menu-item>
        </a-menu>
        <a-button icon="more" />
      </a-dropdown>
    </template>
  </a-table>
</template>

<script>
import QueryCondition from "./VisualEditor/QueryCondition.vue";
import DatePeriod from "./VisualEditor/DatePeriod.vue";
import PinnedItem from "./VisualEditor/PinnedItem.vue";
import HiddenItem from "./VisualEditor/HiddenItem.vue";
import BoostCategory from "./VisualEditor/BoostCategory.vue";
import BuryCategory from "./VisualEditor/BuryCategory.vue";
import FilterResult from "./VisualEditor/FilterResult.vue";
const moment = require("moment");

function strContains(str, keyword) {
  return str.toUpperCase().indexOf(keyword.toUpperCase()) !== -1;
}
const columns = [
  // {
  //   title: 'Editor',
  //   dataIndex: 'editor',
  //   key: 'editor',
  //   scopedSlots: { customRender: "editor-column" },
  // },
  {
    title: "Conditions",
    dataIndex: "conditions",
    key: "conditions",
    scopedSlots: { customRender: "conditions-column" },
  },
  {
    title: "Consequences",
    dataIndex: "consequences",
    key: "consequences",
    scopedSlots: { customRender: "consequences-column" },
  },
  {
    title: "Last Update",
    dataIndex: "timestamp",
    key: "timestamp",
    scopedSlots: { customRender: "timestamp-column" },
  },
  {
    title: "",
    align: "right",
    dataIndex: "key",
    scopedSlots: { customRender: "action-column" },
  },
];
export default {
  name: "RulesTable",
  props: ["rules", "searchTerm", "editRule", "disableRule", "deleteRule"],
  components: { QueryCondition, DatePeriod, BoostCategory, BuryCategory, FilterResult, PinnedItem, HiddenItem },
  data() {
    return {
      columns,
      pagination: { defaultPageSize: 5 },
      bordered: false,
      badgeStyle: {
        backgroundColor: "rgb(232,250,255)",
        color: "rgb(0,118,155)",
        borderColor: "rgb(185,239,255)",
      },
    };
  },
  methods: {
    getTime(timestamp) {
      return moment(timestamp).format("MMM Do, hh:mm a");
    },
    getFilterLabel(item) {
      let operator = "";
      switch (item.operator) {
        case "equal":
          operator = "=";
          break;
        case "not_equal":
          operator = "!=";
          break;
        case "greater":
          operator = ">";
          break;
        case "greater_or_equal":
          operator = ">=";
          break;
        case "smaller":
          operator = "<";
          break;
        case "smaller_or_equal":
          operator = "<=";
          break;
        default:
          operator = item.operator;
          break;
      }
      return `${item.category} ${operator} ${item.value}`;
    },
    rowClassName(record) {
      return record.disabled ? "row-disabled" : "";
    },
  },
  computed: {
    tableData() {
      if (this.searchTerm === "") return this.rules;
      return this.rules.filter((rule) => {
        return (
          rule.conditions.query_conditions.filter((item) => strContains(item.query.keyword, this.searchTerm)).length >
            0 ||
          rule.consequences.hiddenItems.filter((item) => strContains(item.title, this.searchTerm)).length > 0 ||
          rule.consequences.pinnedItems.filter((item) => strContains(item.title, this.searchTerm)).length > 0 ||
          rule.consequences.boostCategories.filter(
            (item) => strContains(item.name, this.searchTerm) || strContains(item.keyword, this.searchTerm)
          ).length > 0 ||
          rule.consequences.buryCategories.filter(
            (item) => strContains(item.name, this.searchTerm) || strContains(item.keyword, this.searchTerm)
          ).length > 0 ||
          rule.consequences.filterResults.filter((filters) => {
            return filters.filter(
              (item) => strContains(item.name, this.searchTerm) || strContains(item.keyword, this.searchTerm)
            );
          }).length > 0
        );
      });
    },
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
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
};
</script>

<style scoped>
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
</style>
