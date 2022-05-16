<template>
  <div class="rules-wrapper">
    <a-row type="flex" justify="space-between" class="rule-row">
      <h4>Rules</h4>
      <a-dropdown>
        <a-menu slot="overlay" @click="onMenuClick">
          <a-menu-item key="visual">
            <b>Visual Editor</b> <br />
            Promote and hide items, boost and filter categories
          </a-menu-item>
        </a-menu>
        <a-button type="primary"> New rule <a-icon type="down" /> </a-button>
      </a-dropdown>
    </a-row>
    <a-row type="flex" justify="space-between" class="filter-row">
      <a-dropdown v-model="visible" :trigger="['click']">
        <a-menu slot="overlay" style="padding: 0">
          <a-menu-item key="status" class="dropdown-item" @click="toggleStatus">
            <span>
              Status
              <a-badge :count="filters.statusCount" :number-style="badgeStyle" />
            </span>
            <a-icon :type="statusExpanded ? 'up' : 'down'" />
          </a-menu-item>
          <a-menu-item key="status-enabled" class="dropdown-item sub-item" @click="clickEnabled" v-if="statusExpanded">
            Enabled
            <a-radio :checked="filters.status === 'enabled'" />
          </a-menu-item>
          <a-menu-item
            key="status-disabled"
            class="dropdown-item sub-item"
            @click="clickDisabled"
            v-if="statusExpanded"
          >
            Disabled
            <a-radio :checked="filters.status === 'disabled'" />
          </a-menu-item>

          <a-menu-item key="editor" class="dropdown-item" @click="toggleEditor">
            <span>
              Editor
              <a-badge :count="filters.editorCount" :number-style="badgeStyle" />
            </span>
            <a-icon :type="editorExpanded ? 'up' : 'down'" />
          </a-menu-item>
          <a-menu-item key="editor-manual" class="dropdown-item sub-item" @click="clickManual" v-if="editorExpanded">
            Manual
            <a-radio :checked="filters.editor === 'manual'" />
          </a-menu-item>
          <a-menu-item key="editor-visual" class="dropdown-item sub-item" @click="clickVisual" v-if="editorExpanded">
            Visual
            <a-radio :checked="filters.editor === 'visual'" />
          </a-menu-item>

          <a-menu-item key="date" class="dropdown-item" @click="toggleDate">
            <span>
              Last Update
              <a-badge :count="filters.dateCount" :number-style="badgeStyle" />
            </span>
            <a-icon :type="dateExpanded ? 'up' : 'down'" />
          </a-menu-item>
          <a-menu-item key="date-item" class="dropdown sub-item" v-if="dateExpanded">
            <a-select default-value="between" style="width: 120px" @change="handleChangeDateMode">
              <a-select-option value="between"> Between </a-select-option>
              <a-select-option value="from"> From </a-select-option>
              <a-select-option value="until"> Until </a-select-option>
            </a-select>
            <div class="pickerWrapper">
              <a-date-picker
                @change="onChangeStartDate"
                v-if="dateMode === 'from'"
                placeholder="Start date"
                :value="filters.date.from"
              />
              <a-date-picker
                @change="onChangeEndDate"
                v-if="dateMode === 'until'"
                placeholder="End date"
                :value="filters.date.to"
              />
              <a-range-picker
                @change="onChangeBetweenDate"
                v-if="dateMode === 'between'"
                :value="filters.date.between"
              />
            </div>
            <small>Default timezone is UTC</small>
          </a-menu-item>

          <a-menu-divider style="margin: 0" />
          <a-menu-item key="bottom" class="dropdown-item footer">
            <a-button type="link" @click="clearFilters" class="link" ghost>Clear All</a-button>
            <a-button @click="applyFilters">Done</a-button>
          </a-menu-item>
        </a-menu>
        <a-button @click="(e) => e.preventDefault()"><a-icon type="filter" /> Filters</a-button>
      </a-dropdown>
      <a-col flex="1" class="search-wrapper">
        <a-input
          :value="searchTerm"
          @change="(e) => changeSearchTerm(e.target.value)"
          placeholder="Search rules by query, context, ID ..."
          :suffix="` ${rulesCount} rules`"
        >
          <a-icon slot="prefix" type="search" />
        </a-input>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "RulesHeader",
  props: ["rulesCount", "searchTerm", "changeSearchTerm"],
  data() {
    return {
      visible: false,
      filters: {
        status: null,
        editor: null,
        date: {
          from: null,
          to: null,
          between: [],
        },
        statusCount: 0,
        editorCount: 0,
        dateCount: 0,
      },
      dateMode: "between",
      statusExpanded: false,
      editorExpanded: false,
      dateExpanded: false,
      badgeStyle: {
        backgroundColor: "rgb(242, 243, 255)",
        color: "rgb(43, 60, 187)",
        marginTop: "-3px",
        marginLeft: "4px",
        boxShadow: "0 0 0 1px #d9d9d9 inset",
      },
    };
  },
  methods: {
    onMenuClick({ key }) {
      if (key === "visual") this.$router.push("/search/rules/visual-editor/new");
    },
    onChangeStartDate(date) {
      this.filters.date.from = date;
      this.filters.dateCount = 1;
    },

    onChangeEndDate(date) {
      this.filters.date.to = date;
      this.filters.dateCount = 1;
    },

    onChangeBetweenDate(date) {
      this.filters.date.between = date;
    },

    handleChangeDateMode(mode) {
      this.dateMode = mode;
    },

    toggleStatus() {
      this.statusExpanded = !this.statusExpanded;
    },

    toggleEditor() {
      this.editorExpanded = !this.editorExpanded;
    },

    toggleDate() {
      this.dateExpanded = !this.dateExpanded;
    },

    clickEnabled() {
      this.filters.status = "enabled";
      this.filters.statusCount = 1;
    },

    clickDisabled() {
      this.filters.status = "disabled";
      this.filters.statusCount = 1;
    },

    clickManual() {
      this.filters.editor = "manual";
      this.filters.editorCount = 1;
    },

    clickVisual() {
      this.filters.editor = "visual";
      this.filters.editorCount = 1;
    },

    clearFilters() {
      this.filters = {
        status: null,
        editor: null,
        date: {
          from: null,
          to: null,
          between: [],
        },
        statusCount: 0,
        editorCount: 0,
        dateCount: 0,
      };
      this.visible = false;
    },

    applyFilters() {
      this.visible = false;
    },
  },
};
</script>

<style scoped>
.dropdown {
  width: 250px;
}

.dropdown-item {
  width: 250px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.sub-item {
  border-left: 2px solid rgba(142, 143, 154, 0.5);
  background-color: rgba(245, 245, 250, 0.5);
}

.sub-item label {
  margin: 0;
}

.footer {
  background-color: rgb(245, 245, 250);
}

.pickerWrapper {
  margin-top: 6px;
  margin-bottom: 6px;
}

.link {
  color: rgb(90, 94, 154);
}

.search-wrapper {
  margin-left: 12px;
}

.rule-row {
  align-items: center;
}

.rule-row h4 {
  margin: 0;
}

.filter-row {
  margin-top: 12px;
}

.rules-wrapper {
  padding: 24px;
}
</style>
