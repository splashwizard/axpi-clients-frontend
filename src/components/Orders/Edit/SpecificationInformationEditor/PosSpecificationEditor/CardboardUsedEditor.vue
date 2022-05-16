<template>
  <div>
    <el-collapse accordion v-model="activePanel" :key="updateKey">
      <!-- EACH CARDBOARD USED REPEATER -->
      <el-collapse-item
        :title="getCardboardCardTitle(i)"
        :name="i"
        v-for="(cardboard, i) in orderLocal.pos_cardboard_used"
        :key="i"
      >
        <div class="collapse-inner-section">
          <a-row :gutter="70">
            <a-col :span="12">
              <!-- Type of cardboard -->
              <a-form layout="vertical">
                <a-form-item label="Type of Cardboard">
                  <a-select
                    v-model="orderLocal.pos_cardboard_used[i].cardboard_type"
                    size="large"
                    :disabled="isDropdownLoading('pos-cardboard-type')"
                    @change="incrementUpdateKey"
                  >
                    <a-select-option v-for="type in cardboardTypeOptions" :key="type.name" :value="type.name">
                      {{ type.name }}
                    </a-select-option>
                    <!--                    <a-select-option value="corrugated-cardboard">-->
                    <!--                      Corrugated Cardboard-->
                    <!--                    </a-select-option>-->
                    <!--                    <a-select-option value="paper-board">-->
                    <!--                      Paper Board-->
                    <!--                    </a-select-option>-->
                    <!--                    <a-select-option value="matt-board">-->
                    <!--                      Matt Board-->
                    <!--                    </a-select-option>-->
                  </a-select>
                </a-form-item>
              </a-form>
              <!-- / Type of cardboard -->
            </a-col>
          </a-row>

          <a-row :gutter="70">
            <a-col :span="12">
              <!-- Area Used -->
              <a-form layout="vertical">
                <a-form-item label="Area Used">
                  <a-input-group compact>
                    <a-input
                      @blur="incrementUpdateKey"
                      size="large"
                      style="width: 75%"
                      v-model="orderLocal.pos_cardboard_used[i].area_used"
                    />
                    <a-select
                      default-value="g"
                      style="width: 25%"
                      size="large"
                      @change="incrementUpdateKey"
                      v-model="orderLocal.pos_cardboard_used[i].area_used_unit"
                    >
                      <a-select-option value="m2"> m&sup2; </a-select-option>
                      <a-select-option value="ft2"> ft&sup2; </a-select-option>
                    </a-select>
                  </a-input-group>
                </a-form-item>
              </a-form>
              <!-- / Area Used -->
            </a-col>
          </a-row>

          <corrugated-cardboard-properties
            v-if="orderLocal.pos_cardboard_used[i].cardboard_type === 'corrugated-cardboard'"
            :cardboard="orderLocal.pos_cardboard_used[i]"
            @property-changed="incrementUpdateKey"
          >
          </corrugated-cardboard-properties>
        </div>
      </el-collapse-item>
      <!-- / EACH CARDBOARD USED REPEATER -->
    </el-collapse>

    <!-- Add new cardboard button -->
    <a-button icon="plus" @click="addCardboard">Add cardboard</a-button>
    <!-- / Add new cardboard button -->
  </div>
</template>

<script>
import CorrugatedCardboardProperties from "./CardboardUsedEditor/CorrugatedCardboardProperties";

let _ = require("lodash");

const CARDBOARD_USED_DATA_TEMPLATE = {
  cardboard_type: null,
  area_used: null,
  area_used_unit: "m2",

  lining_one_details: {},
  fluting_one_details: {},

  lining_two_details: {},
  fluting_two_details: {},

  lining_three_details: {},
  fluting_three_details: {},

  lining_four_details: {},
};

import Forms from "../../../../../mixins/Forms";

export default {
  name: "CardboardUsedEditor",
  components: { CorrugatedCardboardProperties },
  props: ["orderLocal"],
  mixins: [Forms],
  data() {
    return {
      updateKey: 1,
      activePanel: undefined,
      cardboardTypeOptions: [],
    };
  },
  mounted() {
    if (!this.orderLocal.pos_cardboard_used) {
      this.orderLocal.pos_cardboard_used = [
        {
          ...CARDBOARD_USED_DATA_TEMPLATE,
        },
      ];
      this.incrementUpdateKey();
    }
    this.getDropdownOptions("pos-cardboard-type", "cardboardTypeOptions");
  },
  methods: {
    incrementUpdateKey() {
      this.updateKey += 1;
    },

    getCardboardCardTitle(i) {
      return "Cardboard " + (i + 1);
    },

    addCardboard() {
      this.orderLocal.pos_cardboard_used.push({
        ...CARDBOARD_USED_DATA_TEMPLATE,
      });
      this.$forceUpdate();
      this.activePanel = Number(this.orderLocal.pos_cardboard_used.length - 1);
    },

    deleteCardboard(i) {
      this.orderLocal.pos_cardboard_used = _.filter(this.orderLocal.pos_cardboard_used, function (cardboard, ii) {
        return String(ii) !== String(i);
      });
      this.incrementUpdateKey();
    },
  },
};
</script>

<style scoped>
.el-collapse {
  margin-bottom: 20px;
}
</style>
