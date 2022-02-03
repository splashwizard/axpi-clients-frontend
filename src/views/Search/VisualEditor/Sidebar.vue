  <template>
  <a-layout-sider width="448" theme="light" :style="{borderRight: '1px solid #e3e8ee', overflowY: 'scroll' }"
                  :collapsed-width="0" :trigger="null">
    <div class="wrapper">
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
                <a-icon type="search"  />
                <span>
                  Add query condition
                </span>
              </a-menu-item>
              <a-menu-item key="daterange" class="dropdown-item" @click="addPeriod" v-if="triggerData.period.length === 0">
                <a-icon type="calendar"  />
                <span>
                  Add a date range
                </span>
              </a-menu-item>
            </a-menu>
            <a-button icon="plus"/>
          </a-dropdown>
        </div>
        <div>
          <date-period :period="triggerData.period" :editPeriod="editPeriod" :deletePeriod="deletePeriod" v-if="triggerData.period.length > 0"/>
          <query-condition v-for="(condition, ci) in triggerData.query_conditions" :condition="condition" :editCondition="editCondition" :deleteCondition="deleteCondition" :index="ci" :key="ci" />
        </div>
      </div>

      <div v-if="strategyData.boostCategories.length === 0 && strategyData.buryCategories.length === 0 && strategyData.filterResults.length === 0">
        <h1 class="page-title">What do you want to do?</h1>
        <div class="rule-buttons">
          <div class="Picker" @click="toggleAddDrawer('boost_category')">
            <div class="Picker-icon">
              <a-icon type="arrow-up" />
            </div>
            <h4>Boost categories</h4>
          </div>
          <div class="Picker" @click="toggleAddDrawer('bury_category')">
            <div class="Picker-icon">
              <a-icon type="arrow-down" />
            </div>
            <h4>Bury categories</h4>
          </div>
          <div class="Picker" @click="toggleAddDrawer('filter_results')">
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
          <a-dropdown :trigger="['click']" v-if="strategyData.boostCategories.length === 0 || strategyData.buryCategories.length === 0">
            <a-menu slot="overlay" style="padding: 0">
              <a-menu-item key="boost_category" class="dropdown-item" @click="addBoostCategory" v-if="strategyData.boostCategories.length === 0">
                <a-icon type="arrow-up"  />
                <span>
                  Boost categories
                </span>
              </a-menu-item>
              <a-menu-item key="bury_category" class="dropdown-item" @click="addBuryCategory" v-if="strategyData.buryCategories.length === 0">
                <a-icon type="arrow-down"  />
                <span>
                  Bury categories
                </span>
              </a-menu-item>
            </a-menu>
            <a-button icon="plus"/>
          </a-dropdown>
        </div>
        <div>
          <boost-category :category="strategyData.boostCategories" :editCategory="editBoostCategory" :deleteCategory="deleteBoostCategory" />
          <bury-category :category="strategyData.buryCategories" :editCategory="editBuryCategory" :deleteCategory="deleteBuryCategory" />
        </div>
      </div>

    </div>
  </a-layout-sider>
</template>

<script>
import QueryCondition from "./QueryCondition.vue"
import DatePeriod from "./DatePeriod.vue"
import BoostCategory from "./BoostCategory.vue"
import BuryCategory from "./BuryCategory.vue"

export default {
  name: "LeftSidebar",
  components: { QueryCondition, DatePeriod, BoostCategory, BuryCategory },
  props: ['toggleAddDrawer', 'toggleEditDrawer', 'triggerData', 'strategyData', 'editPeriod'],
  methods: {
    addQueryCondition() {
      this.toggleAddDrawer('condition');
    },
    addPeriod() {
      this.toggleAddDrawer('daterange');
    },
    addBoostCategory() {
      this.toggleAddDrawer('boost_category');
    },
    addBuryCategory() {
      this.toggleAddDrawer('bury_category');
    },
    editCondition(index) {
      this.toggleEditDrawer('condition', index);
    },
    editBoostCategory() {
      this.toggleEditDrawer('boost_category');
    },
    editBuryCategory() {
      this.toggleEditDrawer('bury_category');
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
    deletePeriod() {
      this.triggerData.period = [];
    },
  },
  computed: {
    isAnalytics() {
      return this.$route.name === 'Search Analytics';
    },

    isRules() {
      return this.$route.name === 'Search Rules';
    },
  }
}
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
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 1rem;
}

.Picker {
  padding: 1rem;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  background: linear-gradient(0deg,#f2f3ff,rgba(245,245,250,.5));
  box-shadow: 0 1px 0 0 rgb(33 36 61 / 5%);
}

.Picker:not(:disabled):hover{
  background:linear-gradient(0deg,rgba(202,207,255,.5),rgba(245,245,250,.5));
  box-shadow:0 1px 3px 0 rgba(33,36,61,.15),0 1px 0 0 rgba(33,36,61,.05);
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
  color: rgba(84,104,255,var(--tw-text-opacity));
  background-image: linear-gradient(to top, rgb(202, 207, 255), rgb(242, 243, 255));
  border-radius: 99999px;
  margin-bottom: 4px;
}

.trigger-wrapper {
  margin-bottom: 64px;
}

</style>