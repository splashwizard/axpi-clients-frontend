<template>
  <a-table
    :row-selection="rowSelection"
    row-key="id"
    :row-class-name="rowClassName"
    :columns="columns"
    :data-source="tableData"
    :bordered="bordered"
    :pagination="pagination"
  >
    <template slot="visible-column" slot-scope="checked, record">
      <a-checkbox :default-checked="checked" :value="checked" @change="() => updateVisible(record.id)" />
    </template>
    <template slot="items-column" slot-scope="id, record">
      {{ record.items.length }}
    </template>
    <template slot="action-column" slot-scope="id">
      <a-button class="mr-2" type="primary" @click="viewList(id)">View</a-button>
      <a-dropdown :trigger="['click']">
        <a-menu slot="overlay" style="padding: 0">
          <a-menu-item key="edit" class="dropdown-item" @click="handleEditList(id)">
            <a-icon type="edit" />
            <span> Edit List </span>
          </a-menu-item>
          <a-menu-item key="delete" class="dropdown-item" @click="handleDeleteList(id)">
            <a-icon type="delete" />
            <span> Delete List </span>
          </a-menu-item>
        </a-menu>
        <a-button icon="more" />
      </a-dropdown>
    </template>
  </a-table>
</template>

<script>
const moment = require("moment");

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Last Edited",
    dataIndex: "lastEdited",
  },
  {
    title: "Number of items",
    dataIndex: "id",
    scopedSlots: { customRender: "items-column" },
  },
  {
    title: "Visible to Organization",
    dataIndex: "visible",
    scopedSlots: { customRender: "visible-column" },
  },
  {
    title: "",
    align: "right",
    dataIndex: "id",
    scopedSlots: { customRender: "action-column" },
  },
];
export default {
  name: "ListTable",
  props: ["lists", "searchTerm", "viewList", "handleEditList", "handleDeleteList", "updateVisible"],
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
      return this.lists;
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
