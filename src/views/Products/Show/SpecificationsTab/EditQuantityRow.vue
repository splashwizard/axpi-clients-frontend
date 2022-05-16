<template>
  <tr>
    <td>
      <loading-screen :is-loading="isSaving"></loading-screen>
      Quantity
    </td>
    <td>
      <span>{{ rawValue }}</span>
    </td>
    <td v-if="view == 'edit'">
      <span v-html="normalisedValueMagnitudeFormatted" v-if="!isEditing"></span>
      <a-input v-if="isEditing" v-model="normalisedQuantityEditing.normalisedUnitMagnitude" />
    </td>
    <td v-if="view == 'edit'">
      <span v-html="normalisedUnitBaseFormatted" v-if="!isEditing"></span>
      <!--      <a-select v-if="isEditing" v-model="normalisedQuantityEditing.normalisedUnitBase" style="width: 100%">-->
      <!--        <a-select-option v-for="(option, i) in unitOptions" :value="option.unit" :key="i">-->
      <!--          {{ option.unit == 'dimensionless' ? 'dimensionless' : null }}-->
      <!--          {{ option.unit == 'count' ? 'count' : null }}-->
      <!--          {{ option.display }}-->
      <!--        </a-select-option>-->
      <!--      </a-select>-->
    </td>
    <td class="text-right" v-if="view == 'edit'">
      <a-button @click.prevent="edit" v-if="!isEditing" size="small" icon="edit" type="default"></a-button>

      <a-button @click.prevent="cancel" style="margin-right: 5px" v-if="isEditing" size="small" type="default"
        >Cancel
      </a-button>
      <a-button @click.prevent="save" v-if="isEditing" size="small" type="primary">Save</a-button>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from "vuex";

const _ = require("lodash");
import axios from "axios";
import Units from "../../../../mixins/Units";

export default {
  name: "EditQuantityRow",
  props: ["product"],
  mixins: [Units],
  data() {
    return {
      isSaving: false,
      isEditing: false,
      normalisedQuantity: {},
      normalisedQuantityEditing: {},
    };
  },
  created() {
    if (this.product.normalisedQuantity) {
      this.normalisedQuantity = _.cloneDeep(this.product.normalisedQuantity);
    }
  },
  methods: {
    formatVal(val) {
      if (val < 1) {
        let exp = Number.parseFloat(val).toExponential(3);
        let split = exp.split("e");
        val = split[0] + " x 10" + "<sup>" + split[1] + "</sup>";
      }
      return val;
    },

    edit() {
      this.isEditing = true;
      this.normalisedQuantityEditing = {
        ...this.normalisedQuantity,
      };
    },

    cancel() {
      this.normalisedQuantityEditing = {};
      this.isEditing = false;
    },

    save() {
      let vm = this;
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/products/" + this.product["_id"] + "/update-quantity", this.normalisedQuantityEditing)
        .then(() => {
          vm.isSaving = false;
          vm.isEditing = false;
          vm.normalisedQuantity = vm.normalisedQuantityEditing;
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.$message.error("Error saving quantity");
        });
    },
  },
  computed: {
    ...mapGetters("productViewer", {
      view: "view",
    }),

    rawValue() {
      if (this.normalisedQuantity.rawMagnitude) {
        return this.normalisedQuantity.rawMagnitude + " " + this.normalisedQuantity.unit;
      }
      return "";
    },

    normalisedValueMagnitudeFormatted() {
      if (this.normalisedQuantity.normalisedUnitMagnitude) {
        return this.formatVal(this.normalisedQuantity.normalisedUnitMagnitude);
      }
      return "";
    },

    normalisedUnitBaseFormatted() {
      if (this.normalisedQuantity.normalisedUnitBase) {
        return this.formatUnit(this.normalisedQuantity.normalisedUnitBase);
      }
      return "";
    },
  },
};
</script>

<style scoped>
.text-right {
  text-align: right;
}
</style>
