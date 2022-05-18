<template>
  <a-layout>
    <sidebar
      :toggleAddDrawer="toggleAddDrawer"
      :toggleEditDrawer="toggleEditDrawer"
      :list="list"
      :editPeriod="editPeriod"
      :triggerData="triggerData"
      :strategyData="strategyData"
    ></sidebar>
    <div class="wrapper">
      <div class="content">
        <div class="searchbar" v-if="triggerData.query_conditions.length > 0">
          <a-input v-model="searchTerm" placeholder="Enter search query" v-on:keyup="handleSearchKeyUp">
            <a-icon slot="prefix" type="search" />
          </a-input>
          <p>Your query may not match the text and other conditions defined in your trigger.</p>
          <query-filter
            v-for="(item, fIdx) in searchFilters"
            :key="fIdx"
            :item="item"
            :closeTag="() => deleteTag(fIdx)"
          />
        </div>
        <div class="searchbar" v-else>
          <p>Here are the results as they would appear with no query.</p>
        </div>
        <div class="cards">
          <draggable v-model="availableList" group="people" @start="drag = true" @end="drag = false">
            <search-item
              v-for="(item, index) in availableList"
              :key="index"
              :index="index + 1"
              :pinnedItems="strategyData.pinnedItems"
              :item="item"
              :handlePin="() => handlePin(index)"
              :handleHide="() => handleHide(index)"
            />
          </draggable>
        </div>
        <add-drawer
          :list="list"
          :filterNames="filterNames"
          :drawerVisible="addDrawerVisible"
          :drawerType="addDrawerType"
          :drawerClose="addDrawerClose"
          :addDrawer="addDrawer"
        />
        <edit-drawer
          :list="list"
          :filterNames="filterNames"
          :drawerVisible="editDrawerVisible"
          :drawerType="editDrawerType"
          :drawerClose="editDrawerClose"
          :updateDrawerItem="updateDrawerItem"
          :editDrawerItem="editDrawerItem"
          :setItem="setItem"
        />
        <div class="actionContainer" v-if="ruleValid">
          <a-button type="primary" @click="onPublish" :loading="loading"> Publish </a-button>
        </div>
      </div>
    </div>
  </a-layout>
</template>

<script>
import draggable from "vuedraggable";

import Sidebar from "./VisualEditor/Sidebar";
import AddDrawer from "./VisualEditor/AddDrawer";
import EditDrawer from "./VisualEditor/EditDrawer";
import SearchItem from "./VisualEditor/SearchItem";
import QueryFilter from "./VisualEditor/Filter";

import axios from "axios";

export default {
  name: "Landing",
  components: { Sidebar, AddDrawer, EditDrawer, SearchItem, QueryFilter, draggable },
  data() {
    return {
      loading: false,
      addDrawerType: "condition",
      addDrawerVisible: false,
      editDrawerType: "condition",
      editDrawerVisible: false,
      editDrawerIndex: 0,
      editDrawerItem: {
        query: { option: "starts_with", keyword: "" },
        filters: [],
      },
      searchTerm: "",
      searchFilters: [],
      triggerData: {
        period: [],
        query_conditions: [],
      },
      strategyData: {
        boostCategories: [],
        buryCategories: [],
        filterResults: [],
        pinnedItems: [],
        hiddenItems: [],
      },
      filterNames: [],
      list: [],
      // list: searchItems.map((item, index) => {
      //   return {
      //     ...item,
      //     key: index + 1,
      //     fixed: false,
      //     pinned: false,
      //     pinnedposition: 0,
      //     hidden: false,
      //   };
      // }),
    };
  },
  computed: {
    availableList: {
      get: function() {
        const showedList = this.list.filter(
          (item) => this.strategyData.hiddenItems.findIndex((hiddenItem) => hiddenItem.id === item.id) === -1
        );
        let resultList = [];
        const unpinnedList = showedList.filter(
          (item) => this.strategyData.pinnedItems.findIndex((pinnedItem) => pinnedItem.id === item.id) === -1
        );
        for (let pinnedItem of this.strategyData.pinnedItems) {
          const pinnedIndex = showedList.findIndex((item) => item.id === pinnedItem.id);
          if (pinnedItem.position <= showedList.length) resultList[pinnedItem.position - 1] = showedList[pinnedIndex];
        }
        let insertionIndex = 0;
        for (let unpinnedItem of unpinnedList) {
          while (Object.keys(resultList).indexOf(insertionIndex.toString()) !== -1) {
            insertionIndex++;
          }
          resultList[insertionIndex++] = unpinnedItem;
        }
        const finalList = resultList.filter((item) => !!item);
        return finalList;
      },
      set: function(newValue) {
        // this.list = this.list.map((item) => item.hidden ? item : newValue[this.availableList.indexOf(item)])
        this.list = this.list.map((item) => {
          if (this.strategyData.hiddenItems.findIndex((hiddenItem) => hiddenItem.id === item.id) === -1) {
            // not hidden item
            return newValue[this.availableList.indexOf(item)];
          }
          return item;
        });
      },
    },
    ruleValid() {
      return (
        this.triggerData.query_conditions.length > 0 &&
        (this.strategyData.pinnedItems.length > 0 ||
          this.strategyData.hiddenItems.length > 0 ||
          this.strategyData.boostCategories.length > 0 ||
          this.strategyData.buryCategories.length > 0 ||
          this.strategyData.filterResults.length > 0)
      );
    },
  },
  methods: {
    updateProductList(searchTerm) {
      axios
        .post(`${window.API_BASE}/product/search`, {
          q: searchTerm,
          query_by: "name",
        })
        .then((res) => {
          let filterNames = [];
          this.list = res.data.hits.map((item) => {
            filterNames = [
              ...filterNames,
              ...Object.keys(item.document)
                .filter((document_key) => document_key.startsWith("properties."))
                .map((document_key) => document_key.slice("properties.".length))
                .filter((document_key) => filterNames.indexOf(document_key) === -1),
            ];
            const { id, name } = item.document;
            const image_urls = item.document.image_urls ? item.document.image_urls : [];
            return {
              id: id,
              key: id,
              title: name,
              imgsrc:
                image_urls.length > 0
                  ? image_urls[0]
                  : "https://user-content.algolia.com/QHyD9SpPVAKetU8FXYRXz41a2U0ha4l3fir7COiMnVU/resizing_type:fit/width:224/height:224/gravity:sm/enlarge:true/extend:true/aHR0cHM6Ly91cy52d3IuY29tL3N0aWJvL2JpZ3dlYi9zdGQubGFuZy5hbGwvNTkvNzcvMTAwMDU5NzcuanBn.jpg",
              fixed: false,
              pinned: false,
              pinnedposition: 0,
              hidden: false,
            };
          });
          this.filterNames = filterNames;
        })
        .catch(() => {
          this.$message.error("Error fetching products");
        });
    },
    handleSearchKeyUp() {
      if (this.searchTerm) this.updateProductList(this.searchTerm);
    },
    deleteTag(fIdx) {
      this.searchFilters.splice(fIdx, 1);
    },
    handlePin(index) {
      const pinningItem = this.availableList[index];
      const pinnedIndex = this.strategyData.pinnedItems.findIndex((item) => item.id === pinningItem.id);
      if (pinnedIndex !== -1) {
        this.strategyData.pinnedItems.splice(pinnedIndex, 1);
      } else {
        this.strategyData.pinnedItems = [
          ...this.strategyData.pinnedItems,
          {
            id: pinningItem.id,
            title: pinningItem.title,
            position: index + 1,
          },
        ].sort((a, b) => (a.position > b.position ? 1 : -1));
      }
    },
    handleHide(index) {
      const hidingItem = this.availableList[index];
      const hidingIndex = this.strategyData.hiddenItems.findIndex((item) => item.id === hidingItem.id);
      if (hidingIndex !== -1) {
        this.strategyData.hiddenItems.splice(hidingIndex, 1);
      } else {
        this.strategyData.hiddenItems = [
          ...this.strategyData.hiddenItems,
          {
            id: hidingItem.id,
            title: hidingItem.title,
          },
        ];
        this.strategyData.pinnedItems = this.strategyData.pinnedItems.filter(
          (item) => this.strategyData.hiddenItems.findIndex((hiddenItem) => hiddenItem.id === item.id) === -1
        );
      }
    },
    onPublish() {
      const { query_conditions, period } = this.triggerData;
      let payload = {
        query_name: query_conditions[0].query.keyword,
        query_type: query_conditions[0].query.option,
      };

      if (period.length > 0) {
        payload["start_date"] = period[0].format("YYYY-MM-DD");
        payload["end_date"] = period[1].format("YYYY-MM-DD");
      }

      const { pinnedItems, hiddenItems, filterResults } = this.strategyData;
      if (pinnedItems.length > 0) {
        payload["pin_items"] = pinnedItems.map((item) => ({
          id: item.id,
          position: item.position,
        }));
      }
      if (hiddenItems.length > 0) {
        payload["hidden_items"] = hiddenItems.map((item) => ({
          id: item.id,
          position: item.position,
        }));
      }

      if (filterResults.length > 0) {
        payload["filter_by"] = {};
        filterResults.forEach((item) => {
          payload["filter_by"][item[0].name] = item[0].keyword;
        });
      }

      this.loading = true;
      axios
        .post(`${window.API_BASE}/rules`, payload)
        .then(() => {
          this.loading = false;
          window.location.href = "/search/rules";
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("Error creating rule");
        });
    },
    toggleAddDrawer(type) {
      this.editDrawerVisible = false;
      if (!this.addDrawerVisible) {
        this.addDrawerVisible = true;
        this.addDrawerType = type;
      } else {
        if (this.addDrawerType !== type) {
          this.addDrawerType = type;
        } else {
          this.addDrawerVisible = false;
        }
      }
    },
    toggleEditDrawer(type, index) {
      if (type === "condition") {
        this.editDrawerIndex = index;
        const editingItem = this.triggerData.query_conditions[index];
        this.editDrawerItem = {
          query: { option: editingItem.query.option, keyword: editingItem.query.keyword },
          filters: [...editingItem.filters],
          // filters: []
        };
      } else if (type === "pin_items") {
        this.editDrawerItem = this.strategyData.pinnedItems;
      } else if (type === "hide_items") {
        this.editDrawerItem = this.strategyData.hiddenItems;
      } else if (type === "boost_category") {
        this.editDrawerItem = this.strategyData.boostCategories.map((item) => item);
      } else if (type === "bury_category") {
        this.editDrawerItem = this.strategyData.buryCategories;
      } else if (type === "filter_results") {
        this.editDrawerItem = this.strategyData.filterResults;
      }
      this.addDrawerVisible = false;
      this.editDrawerType = type;
      this.editDrawerVisible = true;
    },

    editPeriod() {
      this.addDrawerVisible = false;
      this.editDrawerType = "daterange";
      this.editDrawerItem = this.triggerData.period;
      this.editDrawerVisible = true;
    },
    addDrawerClose() {
      this.addDrawerVisible = false;
    },
    addDrawer(drawerType, drawerData) {
      if (drawerType === "condition") {
        const new_conditions = [...this.triggerData.query_conditions, drawerData];
        this.searchTerm = new_conditions[0].query.keyword;
        this.updateProductList(this.searchTerm);
        this.searchFilters = [...new_conditions[0].filters];
        this.triggerData.query_conditions = new_conditions;
      } else if (drawerType === "daterange") this.triggerData.period = drawerData;
      else if (drawerType === "boost_category") this.strategyData.boostCategories = drawerData;
      else if (drawerType === "bury_category") this.strategyData.buryCategories = drawerData;
      else if (drawerType === "filter_results") this.strategyData.filterResults = drawerData;
      else if (drawerType === "pin_items") {
        this.strategyData.pinnedItems = drawerData;
      } else if (drawerType === "hide_items") {
        this.strategyData.hiddenItems = drawerData;
        this.strategyData.pinnedItems = this.strategyData.pinnedItems.filter(
          (item) => this.strategyData.hiddenItems.findIndex((hiddenItem) => hiddenItem.id === item.id) === -1
        );
      }
      this.addDrawerVisible = false;
    },

    updateDrawerItem(editItem) {
      if (this.editDrawerType === "condition") {
        const new_conditions = this.triggerData.query_conditions.map((item, index) =>
          index === this.editDrawerIndex
            ? {
                query: { option: this.editDrawerItem.query.option, keyword: this.editDrawerItem.query.keyword },
                filters: this.editDrawerItem.filters,
              }
            : item
        );
        this.searchTerm = new_conditions[0].query.keyword;
        this.updateProductList(this.searchTerm);
        this.searchFilters = [...new_conditions[0].filters];
        this.triggerData.query_conditions = new_conditions;
        this.editDrawerItem = {
          query: { option: "contains", keyword: "" },
          filters: [],
        };
      } else if (this.editDrawerType === "daterange") {
        this.triggerData.period = editItem.slice();
        this.editDrawerItem = [];
      } else if (this.editDrawerType === "pin_items") {
        this.strategyData.pinnedItems = this.editDrawerItem;
        this.editDrawerItem = [];
      } else if (this.editDrawerType === "hide_items") {
        this.strategyData.hiddenItems = this.editDrawerItem;
        this.strategyData.pinnedItems = this.strategyData.pinnedItems.filter(
          (item) => this.strategyData.hiddenItems.findIndex((hiddenItem) => hiddenItem.id === item.id) === -1
        );
        this.editDrawerItem = [];
      } else if (this.editDrawerType === "boost_category") {
        this.strategyData.boostCategories = this.editDrawerItem.slice();
        this.editDrawerItem = [];
      } else if (this.editDrawerType === "bury_category") {
        this.strategyData.buryCategories = this.editDrawerItem.slice();
        this.editDrawerItem = [];
      } else if (this.editDrawerType === "filter_results") {
        this.strategyData.filterResults = this.editDrawerItem.slice();
        this.editDrawerItem = [];
      }
      this.editDrawerVisible = false;
    },
    editDrawerClose() {
      this.editDrawerVisible = false;
    },

    setItem(type, item) {
      if (type === "period") this.editDrawerItem = item;
      else if (type === "filters") {
        this.editDrawerItem.filters = item;
      } else if (type === "pin_items") this.editDrawerItem = item;
      else if (type === "hide_items") this.editDrawerItem = item;
      else if (type === "boost_category") this.editDrawerItem = item;
      else if (type === "bury_category") this.editDrawerItem = item;
      else if (type === "filter_results") this.editDrawerItem = item;
    },
  },
};
</script>

<style scoped>
.wrapper {
  flex: 1 1 0%;
  overflow: hidden;
  position: relative;
}
.content {
  width: 100%;
  height: 100vh;
}

.actionContainer {
  padding: 24px 64px;
  border-top: 1px solid rgb(214, 214, 231);
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  background-color: white;
  z-index: 9999;
}

.searchbar {
  margin: 0 32px;
  padding: 80px 0 24px 0;
}

.cards {
  overflow-y: auto;
  max-height: calc(100% - 120px);
  padding: 0 32px 120px 32px;
}
</style>
