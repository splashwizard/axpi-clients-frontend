<template>
  <tr>
    <td width="300">
      <loading-screen :is-loading="isSaving || isLoadingDetails"></loading-screen>
      {{ localDetail["propertyName"] }}
    </td>
    <td>
      <span v-html="getPropertyValue(localDetail)"></span>
    </td>
    <!-- Not editing -->
    <td v-if="!isEditing && view == 'edit'">
      <span v-if="localDetail['inequality'] && localDetail['inequality'] !== 'between'" style="padding-right: 5px">{{
        getInequalityLabel(localDetail["inequality"])
      }}</span>
      <span
        v-if="!(localDetail['inequality'] && localDetail['inequality'] === 'between')"
        v-html="formatVal(localDetail['normalisedUnitMagnitude'])"
      ></span>
      <span
        v-if="localDetail['inequality'] && localDetail['inequality'] === 'between'"
        v-html="formatRange(localDetail)"
      ></span>
    </td>
    <td v-if="!isEditing && view == 'edit'">
      <span :span="formatUnit(localDetail.normalisedUnitBase)"></span>
    </td>
    <td v-if="!isEditing && view == 'edit'" class="text-right">
      <a-button @click.prevent="edit" v-if="!isEditing" size="small" icon="edit" type="default"></a-button>
      <delete-product-detail-button
        style="margin-left: 6px"
        v-if="!isEditing"
        :product="product"
        :details="localDetail"
      ></delete-product-detail-button>
    </td>
    <!-- / Not editing -->

    <!-- Editing -->
    <td colspan="2" v-if="isEditing && view == 'edit'">
      <div class="editing-fields-wrapper">
        <div class="input-padding-right">
          <a-select v-model="details.inequality" style="width: 110px">
            <a-select-option v-for="(option, i) in inequalityOptions" :value="option.value" :key="i">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </div>

        <!-- Normal value input -->
        <div v-if="details.inequality !== 'between'" class="input-padding-right">
          <a-input v-model="details.normalisedUnitMagnitude" />
        </div>
        <!-- / Normal value input -->

        <!-- Normal range input -->
        <div v-if="details.inequality === 'between'" class="input-padding-right inequality-input-wrapper">
          <a-input v-model="details.rangeMin" />
          <span class="inequality-input-to">to</span>
          <a-input v-model="details.rangeMax" />
        </div>
        <!-- / Normal range input -->

        <a-select v-model="details.normalisedUnitBase" style="width: 150px">
          <a-select-option v-for="(option, i) in unitOptions" :value="option.unit" :key="i">
            {{ option.unit == "dimensionless" ? "dimensionless" : null }}
            {{ option.unit == "count" ? "count" : null }}
            <span v-html="option.display"></span>
          </a-select-option>
        </a-select>
      </div>
    </td>
    <td class="text-right" v-if="isEditing && view == 'edit'">
      <a-button @click.prevent="cancel" style="margin-right: 5px" v-if="isEditing" size="small" type="default"
        >Cancel
      </a-button>
      <a-button @click.prevent="save" v-if="isEditing" size="small" type="primary">Save</a-button>
    </td>
    <!-- / Editing -->
  </tr>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import DeleteProductDetailButton from "./DeleteProductDetailButton";
import Units from "../../../../mixins/Units";
import Inequalities from "../../../../mixins/Inequalities";

export default {
  name: "SpecificationRow",
  components: { DeleteProductDetailButton },
  mixins: [Units, Inequalities],
  props: ["detail"],
  data() {
    return {
      isEditing: false,
      localDetail: {},
      details: {},
      isSaving: false,
    };
  },
  created() {
    this.localDetail = this.detail;
  },
  computed: {
    ...mapGetters("productViewer", {
      product: "product",
      isLoadingDetails: "isLoadingDetails",
      view: "view",
    }),
  },
  methods: {
    ...mapActions("productViewer", {
      loadDetails: "loadDetails",
    }),

    getPropertyValue(detail) {
      if (detail["propertyValues"] && detail["propertyValues"].length) {
        return detail["propertyValues"][0];
      }
      if (detail["normalisedUnitMagnitude"] && detail["normalisedUnitBase"]) {
        return detail["normalisedUnitMagnitude"] + " " + this.formatUnit(detail["normalisedUnitBase"]);
      }
      return "-";
    },

    edit() {
      this.isEditing = true;
      if (this.localDetail.uncertainty) {
        this.localDetail.rangeMin = this.localDetail.normalisedUnitMagnitude - this.localDetail.uncertainty;
        this.localDetail.rangeMax = this.localDetail.normalisedUnitMagnitude + this.localDetail.uncertainty;
      } else {
        this.localDetail.rangeMin = this.localDetail.normalisedUnitMagnitude;
        this.localDetail.rangeMax = this.localDetail.normalisedUnitMagnitude;
      }
      this.details = {
        ...this.localDetail,
      };
    },

    cancel() {
      this.details = {};
      this.isEditing = false;
    },

    formatVal(val) {
      if (val < 1) {
        let exp = Number.parseFloat(val).toExponential(3);
        let split = exp.split("e");
        val = split[0] + " x 10" + "<sup>" + split[1] + "</sup>";
      }
      return val;
    },

    formatRange(details) {
      let lower = details.normalisedUnitMagnitude - details.uncertainty;
      let upper = details.normalisedUnitMagnitude + details.uncertainty;

      return this.formatVal(lower) + " - " + this.formatVal(upper);
    },

    save() {
      let vm = this;
      vm.isSaving = true;

      if (this.details.inequality && this.details.inequality === "between") {
        // Get endpoints
        let min = this.details.rangeMin;
        let max = this.details.rangeMax;

        // Let's calculate the midpoint (value) and uncertainty from this
        let normalisedUnitMagnitude = (Number(max) + Number(min)) / 2;
        let uncertainty = Number(max) - Number(normalisedUnitMagnitude);

        this.details.normalisedUnitMagnitude = normalisedUnitMagnitude;
        this.details.uncertainty = uncertainty;
      }

      axios
        .post(window.API_BASE + "/products/" + this.product["_id"] + "/details", vm.details)
        .then(() => {
          vm.isSaving = false;
          vm.isEditing = false;
          vm.localDetail = vm.details;
        })
        .catch((e) => {
          vm.isSaving = false;
          console.log(e);
          this.$message.error("Error saving property");
        });
    },
  },
};
</script>

<style scoped>
.text-right {
  text-align: right;
}

.editing-fields-wrapper {
  display: flex;
}

.input-padding-right {
  padding-right: 10px;
}

.inequality-input-wrapper {
  display: flex;
  align-items: center;
}

.inequality-input-to {
  padding-left: 6px;
  padding-right: 6px;
}
</style>
