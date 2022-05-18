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
              <a-select default-value="contains" style="width: 120px" @change="handleChangeOption">
                <a-select-option value="is"> is </a-select-option>
                <a-select-option value="contains"> contains </a-select-option>
              </a-select>
              <a-input v-model="keyword" placeholder="e.g. iPhone" />
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
            <div v-for="(filter, fi) in filters" :key="fi" class="filter-wrapper">
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
                    v-model="filter.name"
                  />
                </div>
                <div class="is">is</div>
                <div class="keyword">
                  <a-input v-model="filter.keyword" placeholder="e.g. 42" />
                </div>
                <div>
                  <a-button v-if="filters.length > 1" class="btn-delete" @click="removeFilter(fi)"
                    ><a-icon type="delete"
                  /></a-button>
                </div>
              </div>
            </div>

            <a-button class="btn-non-border" @click="addFilter"
              ><a-icon type="plus" />Add another filter value</a-button
            >
          </div>
        </section>
        <div class="drawer-close">
          <a-button type="primary" @click="onApply" :disabled="conditionDisabled">Apply</a-button>
        </div>
      </div>

      <div v-else-if="drawerType === 'daterange'">
        <h3 class="drawer-title">Choose a date range</h3>
        <section class="drawer-section">
          <a-range-picker @change="onChangeDate" :value="dateperiod" />
          <div class="mt-2 text-danger" v-if="start_date_error">
            Start date should be before or same with current date
          </div>
          <div class="mt-2 text-danger" v-if="end_date_error">End date should be after with current date</div>
        </section>
        <div class="drawer-close">
          <a-button
            type="primary"
            @click="onApply"
            :disabled="this.dateperiod.length === 0 || this.start_date_error || this.end_date_error"
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
                    v-model="category.name"
                  />
                </div>
                <div class="is">is</div>
                <div class="keyword">
                  <a-input v-model="category.keyword" placeholder="e.g. 42" />
                </div>
                <div>
                  <a-button v-if="boostCategories.length > 1" class="btn-delete" @click="removeBoostCategory(fi)"
                    ><a-icon type="delete"
                  /></a-button>
                </div>
              </div>
            </div>

            <a-button class="btn-non-border" @click="addBoostCategory"
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
                    v-model="category.name"
                  />
                </div>
                <div class="is">is</div>
                <div class="keyword">
                  <a-input v-model="category.keyword" placeholder="e.g. 42" />
                </div>
                <div>
                  <a-button v-if="buryCategories.length > 1" class="btn-delete" @click="removeBuryCategory(fi)"
                    ><a-icon type="delete"
                  /></a-button>
                </div>
              </div>
            </div>

            <a-button class="btn-non-border" @click="addBuryCategory"
              ><a-icon type="plus" />Bury another category</a-button
            >
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
                    v-model="category.name"
                  />
                </div>
                <div class="is">is</div>
                <div class="keyword">
                  <a-input v-model="category.keyword" placeholder="e.g. 42" />
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
  props: ['drawerVisible', 'drawerType', 'drawerClose', 'addDrawer', 'list', 'filterNames'],
  data() {
    return {
      queryExpanded: true,
      filtersExpanded: true,
      option: "contains",
      keyword: "",
      filters: [],
      pinnedItems: [{ id: 0, title: '', position: 0 }],
      hiddenItems: [{ id: 0, title: '' }],
      boostCategories: [{ name: '', keyword: '' }],
      buryCategories: [{ name: '', keyword: '' }],
      filterResults: [
        [{ name: '', operator: 'is', keyword: '' }]
      ],
      // filterNames: ['Bottom style', 'Capacity', 'Color', 'Model', 'Needle gauge', 'Needle length', 'Needle tip'],
      dateperiod: []
    }
  },
  computed: {
    start_date_error() {
      return (
        this.dateperiod.length > 0 &&
        !moment(this.dateperiod[0].format("YYYY-MM-DD")).isSameOrBefore(moment().format("YYYY-MM-DD"))
      );
    },
    end_date_error() {
      return (
        this.dateperiod.length > 0 &&
        !moment(this.dateperiod[1].format("YYYY-MM-DD")).isAfter(moment().format("YYYY-MM-DD"))
      );
    },
    availablePinItems() {
      return this.list.map((item) => item.title);
    },
    conditionDisabled() {
      return !this.keyword || this.filters.filter((item) => item.name === "" || item.keyword === "").length > 0;
    },
    pinDisabled() {
      return this.pinnedItems.filter((item) => item.title === "" || item.position === 0).length > 0;
    },
    hideDisabled() {
      return this.hiddenItems.filter((item) => item.id === 0).length > 0;
    },
    boostDisabled() {
      return this.boostCategories.filter((item) => item.name === "" || item.keyword === "").length > 0;
    },
    buryDisabled() {
      return this.buryCategories.filter((item) => item.name === "" || item.keyword === "").length > 0;
    },
    resultFilterDisabled() {
      return !!this.filterResults.reduce((prev, cur) => {
        return prev + cur.filter((item) => item.name === "" || item.keyword === "").length > 0;
      }, 0);
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
      this.pinnedItems[pi].position = isNaN(value) ? value : parseInt(value);
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
    onChangeDate(date) {
      this.dateperiod = date;
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0;
    },
    handleChangeOption(option) {
      this.option = option;
    },
    triggerQuery() {
      this.queryExpanded = !this.queryExpanded;
    },
    triggerFilters() {
      this.filtersExpanded = !this.filtersExpanded;
    },
    addFilter() {
      this.filters.push({ name: "", keyword: "" });
    },
    removeFilter(fi) {
      this.filters.splice(fi, 1);
    },
    addPinnedItem() {
      this.pinnedItems.push({ id: 0, title: "", position: 0 });
    },
    removePinnedItem(pi) {
      this.pinnedItems.splice(pi, 1);
    },
    addHiddenItem() {
      this.hiddenItems.push({ id: 0 });
    },
    removeHiddenItem(hi) {
      this.hiddenItems.splice(hi, 1);
    },
    addBoostCategory() {
      this.boostCategories.push({ name: "", keyword: "" });
    },
    removeBoostCategory(fi) {
      this.boostCategories.splice(fi, 1);
    },
    addBuryCategory() {
      this.buryCategories.push({ name: "", keyword: "" });
    },
    removeBuryCategory(fi) {
      this.buryCategories.splice(fi, 1);
    },
    addSubFilter() {
      this.filterResults.push([{ name: "", operator: "", keyword: "" }]);
    },
    removeSubFilter(si) {
      this.filterResults.splice(si, 1);
    },
    addResultFilter(si) {
      this.filterResults[si].push({ name: "", operator: "", keyword: "" });
    },
    removeResultFilter(si, fi) {
      this.filterResults[si].splice(fi, 1);
    },
    onApply() {
      if (this.drawerType === "condition") {
        this.addDrawer("condition", {
          query: { option: this.option, keyword: this.keyword },
          filters: [...this.filters],
        });
        this.keyword = "";
        this.option = "contains";
        this.filters = [];
      } else if (this.drawerType === "daterange") {
        this.addDrawer("daterange", this.dateperiod);
        this.dateperiod = [];
      } else if (this.drawerType === "pin_items") {
        const payload = this.pinnedItems
          .filter((item) => item.id !== 0)
          .map((item) => ({
            id: item.id,
            title: item.title,
            position: isNaN(item.position) || item.position < 1 ? 1 : item.position,
          }));
        this.addDrawer("pin_items", payload);
        this.pinnedItems = [];
      } else if (this.drawerType === "hide_items") {
        this.addDrawer("hide_items", this.hiddenItems);
        this.hiddenItems = [];
      } else if (this.drawerType === "boost_category") {
        this.addDrawer("boost_category", this.boostCategories);
        this.boostCategories = [];
      } else if (this.drawerType === "bury_category") {
        this.addDrawer("bury_category", this.buryCategories);
        this.buryCategories = [];
      } else if (this.drawerType === "filter_results") {
        this.addDrawer("filter_results", this.filterResults);
        this.filterResults = [];
      }
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
