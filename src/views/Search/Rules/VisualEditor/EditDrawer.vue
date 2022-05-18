<template>
  <a-drawer
    title=""
    placement="left"
    :closable="false"
    :visible="drawerVisible"
    :get-container="false"
    :wrap-style="{ position: 'absolute' }"
    :width="496"
    :mask-style="{ backgroundColor: 'hsla(0,0%,100%,.5)' }"
    @close="drawerClose"
  >
    <div class="drawer-close">
      <a-button class="btn-non-border" @click="drawerClose"><a-icon type="close"/></a-button>
    </div>
    <div class="drawer-scroll">
      <div v-if="drawerType === 'condition'">
        <h3 class="drawer-title">Define the condition that triggers the rule</h3>
        <section class="drawer-section">
          <div class="condition-wrapper" @click="triggerQuery">
            <div>
              <a-switch default-checked :checked="queryExpanded">
                <a-icon slot="checkedChildren" type="check" />
                <a-icon slot="unCheckedChildren" type="close" />
              </a-switch>
              <span>Query</span>
            </div>
            <a-icon :type="queryExpanded ? 'up' : 'down'" />
          </div>
          <div class="condition-content" v-if="queryExpanded">
            <label>Your search</label>
            <div class="content-container">
              <a-select
                default-value="contains"
                v-model="editDrawerItem.query.option"
                style="width: 120px"
                @change="handleChangeOption"
              >
                <a-select-option value="is"> is </a-select-option>
                <a-select-option value="contains"> contains </a-select-option>
              </a-select>
              <a-input v-model="editDrawerItem.query.keyword" placeholder="e.g. iPhone" />
            </div>
          </div>
        </section>
        <section class="drawer-section" style="display: none">
          <div class="condition-wrapper" @click="triggerFilters">
            <div>
              <a-switch default-checked :checked="filtersExpanded">
                <a-icon slot="checkedChildren" type="check" />
                <a-icon slot="unCheckedChildren" type="close" />
              </a-switch>
              <span>Filters</span>
            </div>
            <a-icon :type="filtersExpanded ? 'up' : 'down'" />
          </div>
          <div class="condition-content" v-if="filtersExpanded">
            <div v-for="(filter, fi) in editDrawerItem.filters" :key="fi" class="filter-wrapper">
              <div class="labels">
                <label class="name">Filter Name</label>
                <label>Value</label>
              </div>
              <div class="inputs">
                <div class="name">
                  <a-auto-complete
                    :data-source="filterNames"
                    placeholder="e.g. Size"
                    :filter-option="filterOption"
                    :value="filter.name"
                    @change="(value) => changeFilterName(fi, value)"
                  />
                </div>
                <div class="is">is</div>
                <div class="keyword">
                  <a-input
                    :value="filter.keyword"
                    @change="(e) => changeFilterKeyword(fi, e.target.value)"
                    placeholder="e.g. 42"
                  />
                </div>
                <div>
                  <a-button v-if="editDrawerItem.filters.length > 1" class="btn-delete" @click="removeFilter(fi)"
                    ><a-icon type="delete"
                  /></a-button>
                </div>
              </div>
            </div>

            <a-button class="btn-close" @click="addFilter"><a-icon type="plus" />Add another filter value</a-button>
          </div>
        </section>
        <div class="drawer-close">
          <a-button type="primary" @click="onApply" :disabled="conditionDisabled">Apply</a-button>
        </div>
      </div>

      <div v-else-if="drawerType === 'daterange'">
        <h3 class="drawer-title">Choose a date range</h3>
        <section class="drawer-section">
          <a-range-picker @change="onChangeDate" :value="period" />
          <div class="mt-2 text-danger" v-if="start_date_error">
            Start date should be before or same with current date
          </div>
          <div class="mt-2 text-danger" v-if="end_date_error">End date should be after with current date</div>
        </section>
        <div class="drawer-close">
          <a-button
            type="primary"
            @click="onApply"
            :disabled="editDrawerItem.length === 0 || this.start_date_error || this.end_date_error"
            >Apply</a-button
          >
        </div>
      </div>

      <div v-else-if="drawerType === 'pin_items'">
        <h3 class="drawer-title">Choose items to pin</h3>
        <section class="drawer-section">
          <div class="condition-content">
            <div v-for="(item, pi) in pinnedItems" :key="pi" class="filter-wrapper">
              <div class="labels">
                <label class="pin-name">Pinned items</label>
                <label>Position</label>
              </div>
              <div class="inputs">
                <div class="pin-input">
                  <a-auto-complete
                    :data-source="availablePinItems"
                    placeholder="Search items to pin"
                    :filter-option="filterOption"
                    :value="item.title"
                    @select="(value) => selectPinItem(pi, value)"
                    @blur="blurPinItem(pi)"
                  />
                </div>
                <div class="keyword">
                  <a-input :value="item.position" @change="(e) => changePinnedPosition(pi, e.target.value)" />
                </div>
                <div>
                  <a-button v-if="pinnedItems.length > 1" class="btn-delete" @click="removePinnedItem(pi)"
                    ><a-icon type="delete"
                  /></a-button>
                </div>
              </div>
            </div>

            <a-button class="btn-non-border" @click="addPinnedItem"><a-icon type="plus" />Pin another item</a-button>
          </div>
        </section>
        <div class="drawer-close">
          <a-button type="primary" @click="onApply" :disabled="pinDisabled">Apply</a-button>
        </div>
      </div>

      <div v-else-if="drawerType === 'hide_items'">
        <h3 class="drawer-title">Choose items to hide</h3>
        <section class="drawer-section">
          <div class="condition-content">
            <div>
              <label>Hidden items</label>
            </div>
            <div v-for="(item, hi) in hiddenItems" :key="hi" class="filter-wrapper">
              <div class="inputs">
                <div class="hide-input">
                  <a-auto-complete
                    :data-source="availablePinItems"
                    placeholder="Search items to hide"
                    :filter-option="filterOption"
                    :value="item.title"
                    @select="(value) => selectHiddenItem(hi, value)"
                    @blur="blurHiddenItem(hi)"
                  />
                </div>
                <div>
                  <a-button v-if="hiddenItems.length > 1" class="btn-delete" @click="removeHiddenItem(hi)"
                    ><a-icon type="delete"
                  /></a-button>
                </div>
              </div>
            </div>

            <a-button class="btn-non-border" @click="addHiddenItem"><a-icon type="plus" />Hide another item</a-button>
          </div>
        </section>
        <div class="drawer-close">
          <a-button type="primary" @click="onApply" :disabled="hideDisabled">Apply</a-button>
        </div>
      </div>

      <div v-else-if="drawerType === 'boost_category'">
        <h3 class="drawer-title">Choose categories to boost</h3>
        <section class="drawer-section">
          <div class="condition-content">
            <div v-for="(category, fi) in boostCategories" :key="fi" class="filter-wrapper">
              <div class="labels">
                <label class="name">Category</label>
              </div>
              <div class="inputs">
                <div class="name">
                  <a-auto-complete
                    :data-source="filterNames"
                    placeholder="e.g. Size"
                    :filter-option="filterOption"
                    :value="category.name"
                    @change="(value) => changeBoostName(fi, value)"
                  />
                </div>
                <div class="is">is</div>
                <div class="keyword">
                  <a-input
                    :value="category.keyword"
                    @change="(e) => changeBoostKeyword(fi, e.target.value)"
                    placeholder="e.g. 42"
                  />
                </div>
                <div>
                  <a-button v-if="boostCategories.length > 1" class="btn-delete" @click="removeBoostCategory(fi)"
                    ><a-icon type="delete"
                  /></a-button>
                </div>
              </div>
            </div>

            <a-button class="btn-close" @click="addBoostCategory"
              ><a-icon type="plus" />Boost another category</a-button
            >
          </div>
        </section>
        <div class="drawer-close">
          <a-button type="primary" @click="onApply" :disabled="boostDisabled">Apply</a-button>
        </div>
      </div>

      <div v-else-if="drawerType === 'bury_category'">
        <h3 class="drawer-title">Choose categories to bury</h3>
        <section class="drawer-section">
          <div class="condition-content">
            <div v-for="(category, fi) in buryCategories" :key="fi" class="filter-wrapper">
              <div class="labels">
                <label class="name">Category</label>
              </div>
              <div class="inputs">
                <div class="name">
                  <a-auto-complete
                    :data-source="filterNames"
                    placeholder="e.g. Size"
                    :filter-option="filterOption"
                    :value="category.name"
                    @change="(value) => changeBuryName(fi, value)"
                  />
                </div>
                <div class="is">is</div>
                <div class="keyword">
                  <a-input
                    :value="category.keyword"
                    @change="(e) => changeBuryKeyword(fi, e.target.value)"
                    placeholder="e.g. 42"
                  />
                </div>
                <div>
                  <a-button v-if="buryCategories.length > 1" class="btn-delete" @click="removeBuryCategory(fi)"
                    ><a-icon type="delete"
                  /></a-button>
                </div>
              </div>
            </div>

            <a-button class="btn-close" @click="addBuryCategory"><a-icon type="plus" />Bury another category</a-button>
          </div>
        </section>
        <div class="drawer-close">
          <a-button type="primary" @click="onApply" :disabled="buryDisabled">Apply</a-button>
        </div>
      </div>

      <div v-else-if="drawerType === 'filter_results'">
        <h3 class="drawer-title">Choose categories to filter on</h3>
        <section class="drawer-section">
          <div class="condition-content filter-result-wrapper" v-for="(subFilter, si) in filterResults" :key="si">
            <div class="filter-labels">
              <label class="name">Only display items that match this group</label>
              <a-button v-if="filterResults.length > 1" class="btn-delete" @click="removeSubFilter(si)"
                ><a-icon type="minus-circle"
              /></a-button>
            </div>
            <div v-for="(category, fi) in subFilter" :key="fi" class="filter-wrapper">
              <div class="inputs">
                <div class="name">
                  <a-auto-complete
                    :data-source="filterNames"
                    placeholder="e.g. Size"
                    :filter-option="filterOption"
                    :value="category.name"
                    @change="(value) => changeResultName(si, fi, value)"
                  />
                </div>
                <div class="is">is</div>
                <div class="keyword">
                  <a-input
                    :value="category.keyword"
                    @change="(e) => changeResultKeyword(si, fi, e.target.value)"
                    placeholder="e.g. 42"
                  />
                </div>
                <div>
                  <a-button v-if="subFilter.length > 1" class="btn-delete" @click="removeResultFilter(si, fi)"
                    ><a-icon type="delete"
                  /></a-button>
                </div>
              </div>
            </div>
            <!-- <a-button class="btn-non-border btn-filter-margin" @click="addResultFilter(si)"><a-icon type="plus" />Or</a-button> -->
          </div>
          <a-button class="btn-non-border btn-filter-margin" @click="addSubFilter"><a-icon type="plus" />And</a-button>
        </section>
        <div class="drawer-close">
          <a-button type="primary" @click="onApply" :disabled="resultFilterDisabled">Apply</a-button>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import moment from "moment";

export default {
  name: "Drawer",
  props: ['drawerType', 'drawerVisible', 'drawerClose', 'updateDrawerItem', 'list', 'filterNames', 'editDrawerItem', 'setItem'],
  data() {
    return {
      queryExpanded: true,
      filtersExpanded: true,
    }
  },
  computed: {
    start_date_error() {
      return (
        this.drawerType === "daterange" &&
        this.editDrawerItem.length > 0 &&
        !moment(this.editDrawerItem[0].format("YYYY-MM-DD")).isSameOrBefore(moment().format("YYYY-MM-DD"))
      );
    },
    end_date_error() {
      return (
        this.drawerType === "daterange" &&
        this.editDrawerItem.length > 0 &&
        !moment(this.editDrawerItem[1].format("YYYY-MM-DD")).isAfter(moment().format("YYYY-MM-DD"))
      );
    },
    availablePinItems() {
      return this.list.map((item) => item.title);
    },
    conditionDisabled() {
      return (
        !this.editDrawerItem.query.keyword ||
        this.editDrawerItem.filters.filter((item) => item.name === "" || item.keyword === "").length > 0
      );
    },
    pinDisabled() {
      return (
        this.editDrawerItem.length === 0 ||
        this.editDrawerItem.filter((item) => item.title === "" || item.position === 0).length > 0
      );
    },
    hideDisabled() {
      return this.hiddenItems.filter((item) => item.id === 0).length > 0;
    },
    boostDisabled() {
      return this.editDrawerItem.filter((item) => item.name === "" || item.keyword === "").length > 0;
    },
    buryDisabled() {
      return this.editDrawerItem.filter((item) => item.name === "" || item.keyword === "").length > 0;
    },
    resultFilterDisabled() {
      return !!this.editDrawerItem.reduce((prev, cur) => {
        return prev + cur.filter((item) => item.name === "" || item.keyword === "").length > 0;
      }, 0);
    },
    period: {
      get: function() {
        return this.editDrawerItem;
      },
      set: function(newValue) {
        this.setItem("period", newValue);
      },
    },
    filters: {
      get: function() {
        return this.editDrawerItem.filters.slice();
      },
      set: function(newValue) {
        this.setItem("filters", newValue);
      },
    },
    pinnedItems: {
      get: function() {
        return this.editDrawerItem.slice();
      },
      set: function(newValue) {
        this.setItem("pin_items", newValue);
      },
    },
    hiddenItems: {
      get: function() {
        return this.editDrawerItem.slice();
      },
      set: function(newValue) {
        this.setItem("hide_items", newValue);
      },
    },
    boostCategories: {
      get: function() {
        return this.editDrawerItem.slice();
      },
      set: function(newValue) {
        this.setItem("boost_category", newValue);
      },
    },
    buryCategories: {
      get: function() {
        return this.editDrawerItem.slice();
      },
      set: function(newValue) {
        this.setItem("bury_category", newValue);
      },
    },
    filterResults: {
      get: function() {
        return this.editDrawerItem.slice();
      },
      set: function(newValue) {
        this.setItem("filter_results", newValue);
      },
    },
  },
  methods: {
    selectPinItem(pi, value) {
      this.pinnedItems[pi].id = this.list.find((item) => item.title === value)?.id;
      this.pinnedItems[pi].title = value;
    },
    blurPinItem(pi) {
      const pIndex = this.list.findIndex((item) => item.id === this.pinnedItems[pi].id);
      this.pinnedItems = this.pinnedItems.map((item, index) =>
        index === pi
          ? {
              ...item,
              title: this.list[pIndex].title,
            }
          : item
      );
    },
    changePinnedPosition(pi, value) {
      const pinnedItems = this.pinnedItems.map((item, index) =>
        index === pi ? { ...item, position: isNaN(value) ? value : parseInt(value) } : item
      );
      this.setItem("pin_items", pinnedItems);
    },
    selectHiddenItem(pi, value) {
      this.hiddenItems[pi].id = this.list.find((item) => item.title === value)?.id;
      this.hiddenItems[pi].title = value;
    },
    blurHiddenItem(pi) {
      const pIndex = this.list.findIndex((item) => item.id === this.hiddenItems[pi].id);
      this.hiddenItems = this.hiddenItems.map((item, index) =>
        index === pi
          ? {
              ...item,
              title: this.list[pIndex].title,
            }
          : item
      );
    },
    changeFilterName(fi, value) {
      const filters = this.filters.map((item, index) => (index === fi ? { name: value, keyword: item.keyword } : item));
      this.setItem("filters", filters);
    },
    changeFilterKeyword(fi, value) {
      const filters = this.filters.map((item, index) => (index === fi ? { name: item.name, keyword: value } : item));
      this.setItem("filters", filters);
    },
    changeBoostName(fi, value) {
      const boostCategories = this.boostCategories.map((item, index) =>
        index === fi ? { name: value, keyword: item.keyword } : item
      );
      this.setItem("boost_category", boostCategories);
    },
    changeBoostKeyword(fi, value) {
      const boostCategories = this.boostCategories.map((item, index) =>
        index === fi ? { name: item.name, keyword: value } : item
      );
      this.setItem("boost_category", boostCategories);
    },
    changeBuryName(fi, value) {
      const buryCategories = this.boostCategories.map((item, index) =>
        index === fi ? { name: value, keyword: item.keyword } : item
      );
      this.setItem("bury_category", buryCategories);
    },
    changeBuryKeyword(fi, value) {
      const buryCategories = this.boostCategories.map((item, index) =>
        index === fi ? { name: item.name, keyword: value } : item
      );
      this.setItem("bury_category", buryCategories);
    },
    changeResultName(si, fi, value) {
      const filterResults = this.filterResults.map((subFilter, index) =>
        index === si
          ? subFilter.map((item, index) => (index === fi ? { name: value, keyword: item.keyword } : item))
          : subFilter
      );
      this.setItem("filter_results", filterResults);
    },
    changeResultKeyword(si, fi, value) {
      const filterResults = this.filterResults.map((subFilter, index) =>
        index === si
          ? subFilter.map((item, index) => (index === fi ? { name: item.name, keyword: value } : item))
          : subFilter
      );
      this.setItem("filter_results", filterResults);
    },
    onChangeDate(date) {
      this.period = date;
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0;
    },
    handleChangeOption(option) {
      this.editDrawerItem.query.option = option;
    },
    triggerQuery() {
      this.queryExpanded = !this.queryExpanded;
    },
    triggerFilters() {
      this.filtersExpanded = !this.filtersExpanded;
    },
    addFilter() {
      this.filters = [...this.filters, { name: "", keyword: "" }];
    },
    removeFilter(fi) {
      this.filters = this.filters.filter((item, index) => index !== fi);
    },
    addPinnedItem() {
      this.pinnedItems = [...this.pinnedItems, { id: 0, title: "", position: 0 }];
    },
    removePinnedItem(pi) {
      this.pinnedItems = this.pinnedItems.filter((item, index) => index !== pi);
    },
    addHiddenItem() {
      this.hiddenItems = [...this.hiddenItems, { id: 0 }];
    },
    removeHiddenItem(hi) {
      this.hiddenItems = this.hiddenItems.filter((item, index) => index !== hi);
    },
    addBoostCategory() {
      this.boostCategories = [...this.boostCategories, { name: "", keyword: "" }];
    },
    removeBoostCategory(fi) {
      this.boostCategories = this.boostCategories.filter((item, index) => index !== fi);
    },
    addBuryCategory() {
      this.buryCategories = [...this.buryCategories, { name: "", keyword: "" }];
    },
    removeBuryCategory(fi) {
      this.buryCategories = this.buryCategories.filter((item, index) => index !== fi);
    },
    addSubFilter() {
      this.filterResults = [...this.filterResults, [{ name: "", op: "", keyword: "" }]];
    },
    removeSubFilter(si) {
      this.filterResults = this.filterResults.filter((item, index) => index !== si);
    },
    addResultFilter(si) {
      this.filterResults = this.filterResults.map((item, index) =>
        index === si ? [...item, { name: "", op: "", keyword: "" }] : item
      );
    },
    removeResultFilter(si, fi) {
      this.filterResults = this.filterResults.map((item, index) =>
        index === si ? item.filter((i, index) => index !== fi) : item
      );
    },
    onApply() {
      this.updateDrawerItem(this.period);
    },
  },
};
</script>

<style scoped lang="scss">
.condition-wrapper {
  padding: 12px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.condition-wrapper:hover {
  background-color: rgba(245, 245, 250);
  cursor: pointer;
}

.content-container {
  display: flex;
}

.condition-wrapper > div > span {
  margin-left: 12px;
  font-weight: bold;
}
.drawer-close {
  display: flex;
  justify-content: flex-end;
}

.drawer-title {
  margin-top: 28px;
  margin-bottom: 46px;
}

.drawer-section {
  margin-top: 16px;
  margin-bottom: 16px;
}

.btn-non-border {
  border-width: 0;
  box-shadow: none;
}

.btn-filter-margin {
  margin-top: 16px;
  margin-bottom: 16px;
}

.filter-wrapper {
  margin-bottom: 8px;

  .labels {
    display: flex;

    .name {
      width: 41.66%;
    }

    .pin-name {
      width: calc(100% - 100px);
    }
  }

  .inputs {
    display: flex;
    align-items: center;
    margin-top: 4px;
    margin-bottom: 4px;
    position: relative;

    .name {
      width: 33.33%;
    }

    .is {
      width: 8.33%;
      text-align: center;
    }

    .pin-input {
      width: calc(100% - 100px);
      > div {
        width: calc(100% - 5px);
        margin-right: 3px;
      }
    }

    .hide-input {
      width: 100%;
      margin-right: 44px;
      > div {
        width: calc(100% - 5px);
        margin-right: 3px;
      }
    }

    .keyword {
      flex: 1;
      margin-right: 44px;
    }

    .btn-delete {
      border-width: 0;
      box-shadow: none;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}

.filter-labels {
  display: flex;
  justify-content: space-between;
}

.filter-result-wrapper {
  border-bottom: 1px solid rgb(214, 214, 231);
  margin-bottom: 16px;
}

.btn-delete {
  border-width: 0;
  box-shadow: none;
}

.drawer-scroll {
  padding-bottom: 120px;
}
</style>
