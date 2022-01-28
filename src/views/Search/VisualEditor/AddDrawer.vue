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
          <a-input v-model="keyword" placeholder="e.g. iPhone"/>
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
        <div v-for="(filter, fi) in filters" :key="fi" class="filter-wrapper">
          <div class="labels">
            <label class="name">Filter Name</label>
            <label>Value</label>
          </div>
          <div class="inputs">
            <div class="name">
              <a-input v-model="filter.name" placeholder="e.g. Size"/>
            </div>
            <div class="is">
              is
            </div>
            <div class="keyword">
              <a-input v-model="filter.keyword" placeholder="e.g. 42"/>
            </div>
            <div>
              <a-button class="btn-delete" @click="removeFilter(fi)"><a-icon type="delete" /></a-button>
            </div>
          </div>
        </div>

        <a-button class="btn-close" @click="addFilter"><a-icon type="plus" />Add another filter value</a-button>
      </div>
    </section>
    <div class="drawer-close">
      <a-button type="primary" @click="onApply" :disabled="!this.keyword">Apply</a-button>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: "Drawer",
  props: ['drawerVisible', 'drawerClose', 'addDrawer'],
  data() {
    return {
      queryExpanded: true,
      filtersExpanded: true,
      option: 'contains',
      keyword: '',
      filters: [
        // { name: 'Bottom Style', keyword: 'abc' },
        // { name: 'Capacity', keyword: 'big' }
      ]
    }
  },
  methods: {
    // isValid(){
    //   return this.filters.filter(item=> item.name === '' || item.keyword === '').length === 0 && this.keyword;
    // },
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
      this.filters.push({ name: '', keyword: '' });
    },
    removeFilter(fi) {
      this.filters.splice(fi, 1);
    },  
    onApply() {
      this.addDrawer({
        query: { option: this.option, keyword: this.keyword },
        filters: [...this.filters]
      });
      this.keyword = "";
      this.option = 'contains';
      this.filters = [];
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