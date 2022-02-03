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
      <a-button class="btn-close" @click="drawerClose"><a-icon type="close" /></a-button>
    </div>
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
            <a-select default-value="contains" v-model="editDrawerItem.query.option" style="width: 120px" @change="handleChangeOption">
              <a-select-option value="is">
                is
              </a-select-option>
              <a-select-option value="starts_with">
                starts with
              </a-select-option>
              <a-select-option value="ends_with">
                ends with
              </a-select-option>
              <a-select-option value="contains">
                contains
              </a-select-option>
            </a-select>
            <a-input v-model="editDrawerItem.query.keyword" placeholder="e.g. iPhone"/>
          </div>
        </div>
      </section>
      <section class="drawer-section">
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
                  v-model="filter.name"
                />
              </div>
              <div class="is">
                is
              </div>
              <div class="keyword">
                <a-input v-model="filter.keyword" placeholder="e.g. 42"/>
              </div>
              <div>
                <a-button v-if="fi !== 0" class="btn-delete" @click="removeFilter(fi)"><a-icon type="delete" /></a-button>
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
        <a-range-picker @change="onChangeDate" :value="period"/>
      </section>
      <div class="drawer-close">
        <a-button type="primary" @click="onApply" :disabled="editDrawerItem.length === 0">Apply</a-button>
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
              <div class="is">
                is
              </div>
              <div class="keyword">
                <a-input v-model="category.keyword" placeholder="e.g. 42"/>
              </div>
              <div>
                <a-button v-if="fi !== 0" class="btn-delete" @click="removeBoostCategory(fi)"><a-icon type="delete" /></a-button>
              </div>
            </div>
          </div>

          <a-button class="btn-close" @click="addBoostCategory"><a-icon type="plus" />Boost another category</a-button>
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
              <div class="is">
                is
              </div>
              <div class="keyword">
                <a-input v-model="category.keyword" placeholder="e.g. 42"/>
              </div>
              <div>
                <a-button v-if="fi !== 0" class="btn-delete" @click="removeBuryCategory(fi)"><a-icon type="delete" /></a-button>
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
  </a-drawer>
</template>

<script>
export default {
  name: "Drawer",
  props: ['drawerType', 'drawerVisible', 'drawerClose', 'updateDrawerItem', 'editDrawerItem', 'setItem'],
  data() {
    return {
      queryExpanded: true,
      filtersExpanded: true,
      filterNames: ['Bottom style', 'Capacity', 'Color', 'Model', 'Needle gauge', 'Needle length', 'Needle tip'],
    }
  },
  computed: {
    conditionDisabled() {
      return !this.editDrawerItem.query.keyword || this.editDrawerItem.filters.filter(item => item.name === '' || item.keyword === '').length > 0;
    },
    boostDisabled() {
      return this.editDrawerItem.filter(item => item.name === '' || item.keyword === '').length > 0;
    },
    buryDisabled() {
      return this.editDrawerItem.filter(item => item.name === '' || item.keyword === '').length > 0;
    },
    period: {
      get: function () {
        return this.editDrawerItem
      },
      set: function (newValue) {
        this.setItem('period', newValue);
      }
    },
    filters: {
      get: function () {
        return this.editDrawerItem.filters.slice()
      },
      set: function (newValue) {
        this.setItem('filters', newValue);
      }
    },
    boostCategories: {
      get: function () {
        return this.editDrawerItem.slice()
      },
      set: function (newValue) {
        this.setItem('boost_category', newValue);
      }
    },
    buryCategories: {
      get: function () {
        return this.editDrawerItem.slice()
      },
      set: function (newValue) {
        this.setItem('bury_category', newValue);
      }
    }
  },
  methods: {
    onChangeDate(date) {
      this.period = date;
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
      );
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
      this.filters = [...this.filters, { name: '', keyword: '' }];
    },
    removeFilter(fi) {
      this.filters = this.filters.filter((item, index) => index !== fi);
    },
    addBoostCategory() {
      this.boostCategories = [...this.boostCategories, { name: '', keyword: '' }];
    },
    removeBoostCategory(fi) {
      this.boostCategories = this.boostCategories.filter((item, index) => index !== fi);
    },
    addBuryCategory() {
      this.buryCategories = [...this.buryCategories, { name: '', keyword: '' }];
    },
    removeBuryCategory(fi) {
      this.buryCategories = this.buryCategories.filter((item, index) => index !== fi);
    },
    onApply() {
      this.updateDrawerItem(this.period);
    }
  }
}
</script>

<style scoped lang="scss">
  .condition-wrapper {
    padding: 12px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .condition-wrapper:hover {
    background-color:rgba(245,245,250);
    cursor: pointer;
  }

  .content-container {
    display: flex;
  }

  .condition-wrapper>div>span {
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

  .btn-close {
    border-width: 0;
    box-shadow: none;
  }

  .filter-wrapper {
    
    .labels {
      display: flex;

      .name {
        width: 41.66%;
      }
    }

    .inputs {
      display: flex;
      align-items: center;
      margin-top: 4px;
      margin-bottom: 4px;

      .name {
        width: 33.33%;
      }

      .is {
        width: 8.33%;
        text-align: center;
      }
    }

    .btn-delete {
      border-width: 0;
      box-shadow: none;
    }
  }
</style>