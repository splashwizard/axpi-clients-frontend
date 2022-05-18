<template>
  <a-layout-sider
    width="448"
    theme="light"
    :style="{ borderRight: '1px solid #e3e8ee', overflowY: 'auto' }"
    :collapsed-width="0"
    :trigger="null"
  >
    <div class="wrapper">
      <div class="navWrapper">
        <a-button class="btn-delete" @click="onBack"
          ><a-icon type="arrow-left" :style="{ fontSize: '12px' }" /> Back</a-button
        >
      </div>
      <div class="trigger-wrapper" v-if="!triggerData.period.length && triggerData.query_conditions.length === 0">
        <h1 class="page-title">It all starts here</h1>
        <div class="rule-buttons">
          <div class="Picker" @click="toggleAddDrawer('condition')">
            <div class="Picker-icon">
              <a-icon type="search" />
            </div>
            <h4>Set Query Conditions</h4>
          </div>
          <!-- <div class="Picker" @click="toggleAddDrawer('category')">
            <div class="Picker-icon">
              <a-icon type="shopping" />
            </div>
            <h4>Choose Category page</h4>
          </div> -->
          <div class="Picker" @click="toggleAddDrawer('daterange')">
            <div class="Picker-icon">
              <a-icon type="calendar" />
            </div>
            <h4>Add a date range</h4>
          </div>
        </div>
      </div>

      <div class="trigger-wrapper" v-else>
        <div class="title-wrapper">
          <h1 class="page-title">Trigger</h1>
          <a-dropdown :trigger="['click']">
            <a-menu slot="overlay" style="padding: 0">
              <a-menu-item key="query" class="dropdown-item" @click="addQueryCondition">
                <a-icon type="search" />
                <span> Add query condition </span>
              </a-menu-item>
              <a-menu-item
                key="daterange"
                class="dropdown-item"
                @click="addPeriod"
                v-if="triggerData.period.length === 0"
              >
                <a-icon type="calendar" />
                <span> Add a date range </span>
              </a-menu-item>
            </a-menu>
            <a-button icon="plus" />
          </a-dropdown>
        </div>
        <div>
          <date-period
            :hoverable="true"
            :period="triggerData.period"
            :editPeriod="editPeriod"
            :deletePeriod="deletePeriod"
            v-if="triggerData.period.length > 0"
          />
          <query-condition
            :hoverable="true"
            v-for="(condition, ci) in triggerData.query_conditions"
            :condition="condition"
            :editCondition="editCondition"
            :deleteCondition="deleteCondition"
            :index="ci"
            :key="ci"
          />
        </div>
      </div>

      <div v-if="strategyEmpty">
        <h1 class="page-title">What do you want to do?</h1>
        <div class="rule-buttons">
          <div class="Picker" @click="addPinItems">
            <div class="Picker-icon">
              <a-icon type="arrow-up" />
            </div>
            <h4>Pin items</h4>
          </div>
          <div class="Picker" @click="addHideItems">
            <div class="Picker-icon">
              <a-icon type="close" />
            </div>
            <h4>Hide items</h4>
          </div>
          <!-- <div class="Picker" @click="addBoostCategory">
            <div class="Picker-icon">
              <a-icon type="arrow-up" />
            </div>
            <h4>Boost categories</h4>
          </div>
          <div class="Picker" @click="addBuryCategory">
            <div class="Picker-icon">
              <a-icon type="arrow-down" />
            </div>
            <h4>Bury categories</h4>
          </div> -->
          <div class="Picker" @click="addFilterResults">
            <div class="Picker-icon">
              <a-icon type="filter" />
            </div>
            <h4>Filter results</h4>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="title-wrapper">
          <h1 class="page-title">Strategy</h1>
          <a-dropdown :trigger="['click']" v-if="strategyAddable">
            <a-menu slot="overlay" style="padding: 0">
              <a-menu-item
                key="pin_items"
                class="dropdown-item"
                @click="addPinItems"
                v-if="strategyData.pinnedItems.length === 0"
              >
                <a-icon type="arrow-up" />
                <span> Pin items </span>
              </a-menu-item>
              <a-menu-item
                key="hide_items"
                class="dropdown-item"
                @click="addHideItems"
                v-if="strategyData.hiddenItems.length === 0"
              >
                <a-icon type="arrow-up" />
                <span> Hide items </span>
              </a-menu-item>
              <!-- <a-menu-item
                key="boost_category"
                class="dropdown-item"
                @click="addBoostCategory"
                v-if="strategyData.boostCategories.length === 0"
              >
                <a-icon type="arrow-up" />
                <span> Boost categories </span>
              </a-menu-item>
              <a-menu-item
                key="bury_category"
                class="dropdown-item"
                @click="addBuryCategory"
                v-if="strategyData.buryCategories.length === 0"
              >
                <a-icon type="arrow-down" />
                <span>
                  Bury categories
                </span>
              </a-menu-item> -->
              <a-menu-item
                key="filter_results"
                class="dropdown-item"
                @click="addFilterResults"
                v-if="strategyData.filterResults.length === 0"
              >
                <a-icon type="filter" />
                <span>
                  Filter Results
                </span>
              </a-menu-item>
            </a-menu>
            <a-button icon="plus" />
          </a-dropdown>
        </div>
        <div>
          <filter-result
            v-if="strategyData.filterResults.length > 0"
            :hoverable="true"
            :filters="strategyData.filterResults"
            :editFilters="editFilters"
            :deleteFilters="deleteFilters"
          />
          <boost-category
            v-if="strategyData.boostCategories.length > 0"
            :hoverable="true"
            :category="strategyData.boostCategories"
            :editCategory="editBoostCategory"
            :deleteCategory="deleteBoostCategory"
          />
          <bury-category
            v-if="strategyData.buryCategories.length > 0"
            :hoverable="true"
            :category="strategyData.buryCategories"
            :editCategory="editBuryCategory"
            :deleteCategory="deleteBuryCategory"
          />
          <pinned-item
            v-for="(pinnedItem, pi) in strategyData.pinnedItems"
            :key="'p' + pi"
            :hoverable="true"
            :item="pinnedItem"
            :editItems="editPinnedItems"
            :deleteItems="() => deletePinnedItems(pi)"
          />
          <hidden-item
            v-for="(hiddenItem, hi) in strategyData.hiddenItems"
            :key="'h' + hi"
            :hoverable="true"
            :item="hiddenItem"
            :editItems="editHiddenItems"
            :deleteItems="() => deleteHiddenItems(hi)"
          />
        </div>
      </div>
    </div>
  </a-layout-sider>
</template>

<script>
import QueryCondition from "./QueryCondition.vue";
import DatePeriod from "./DatePeriod.vue";
import BoostCategory from "./BoostCategory.vue";
import BuryCategory from "./BuryCategory.vue";
import FilterResult from "./FilterResult.vue";
import PinnedItem from "./PinnedItem.vue";
import HiddenItem from "./HiddenItem.vue";

export default {
  name: "LeftSidebar",
  components: { QueryCondition, DatePeriod, BoostCategory, BuryCategory, FilterResult, PinnedItem, HiddenItem },
  props: ["toggleAddDrawer", "toggleEditDrawer", "list", "triggerData", "strategyData", "editPeriod"],
  computed: {
    strategyEmpty() {
      return (
        this.strategyData.boostCategories.length === 0 &&
        this.strategyData.buryCategories.length === 0 &&
        this.strategyData.filterResults.length === 0 &&
        this.strategyData.pinnedItems.length === 0 &&
        this.strategyData.hiddenItems.length === 0
      );
    },
    strategyAddable() {
      return (
        this.strategyData.boostCategories.length === 0 ||
        this.strategyData.buryCategories.length === 0 ||
        this.strategyData.filterResults.length === 0 ||
        this.strategyData.pinnedItems.length === 0 ||
        this.strategyData.hiddenItems.length === 0
      );
    },
    isAnalytics() {
      return this.$route.name === "Search Analytics";
    },

    isRules() {
      return this.$route.name === "Search Rules";
    },
  },
  methods: {
    onBack() {
      this.$router.push("/search/rules");
    },
    addQueryCondition() {
      this.toggleAddDrawer("condition");
    },
    addPeriod() {
      this.toggleAddDrawer("daterange");
    },
    addPinItems() {
      this.toggleAddDrawer("pin_items");
    },
    addHideItems() {
      this.toggleAddDrawer("hide_items");
    },
    addBoostCategory() {
      this.toggleAddDrawer("boost_category");
    },
    addBuryCategory() {
      this.toggleAddDrawer("bury_category");
    },
    addFilterResults() {
      this.toggleAddDrawer("filter_results");
    },
    editCondition(index) {
      this.toggleEditDrawer("condition", index);
    },
    editBoostCategory() {
      this.toggleEditDrawer("boost_category");
    },
    editBuryCategory() {
      this.toggleEditDrawer("bury_category");
    },
    editFilters() {
      this.toggleEditDrawer("filter_results");
    },
    editPinnedItems() {
      this.toggleEditDrawer("pin_items");
    },
    deletePinnedItems(pi) {
      this.strategyData.pinnedItems.splice(pi, 1);
    },
    editHiddenItems() {
      this.toggleEditDrawer("hide_items");
    },
    deleteHiddenItems(pi) {
      this.strategyData.hiddenItems.splice(pi, 1);
    },
    deleteCondition(index) {
      this.triggerData.query_conditions.splice(index, 1);
    },
    deleteBoostCategory() {
      this.strategyData.boostCategories = [];
    },
    deleteBuryCategory() {
      this.strategyData.buryCategories = [];
    },
    deleteFilters() {
      this.strategyData.filterResults = [];
    },
    deletePeriod() {
      this.triggerData.period = [];
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  padding: 24px;
  display: flex;
  height: 100%;
  flex-direction: column;
}

.title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.rule-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.Picker {
  padding: 1rem;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  background: linear-gradient(0deg, #f2f3ff, rgba(245, 245, 250, 0.5));
  box-shadow: 0 1px 0 0 rgb(33 36 61 / 5%);
}

.Picker:not(:disabled):hover {
  background: linear-gradient(0deg, rgba(202, 207, 255, 0.5), rgba(245, 245, 250, 0.5));
  box-shadow: 0 1px 3px 0 rgba(33, 36, 61, 0.15), 0 1px 0 0 rgba(33, 36, 61, 0.05);
  cursor: pointer;
}

.Picker h4 {
  font-weight: normal;
}

.Picker-icon {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(84, 104, 255, var(--tw-text-opacity));
  background-image: linear-gradient(to top, rgb(202, 207, 255), rgb(242, 243, 255));
  border-radius: 99999px;
  margin-bottom: 4px;
}

.trigger-wrapper {
  margin-bottom: 64px;
}

.navWrapper {
  margin-bottom: 16px;
}

.btn-delete {
  border-width: 0;
  box-shadow: none;
}
</style>
