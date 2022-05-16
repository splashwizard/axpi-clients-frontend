<template>
  <div>
    <table class="axpi-basic-table">
      <thead v-if="view === 'edit'">
        <tr>
          <th v-if="view !== 'edit'" width="300">Field Name</th>
          <th v-else>Field Name</th>
          <th width="200">Value</th>
          <th width="130" v-if="view == 'edit'">Normalised Value</th>
          <th v-if="view == 'edit'"></th>
          <th v-if="view == 'edit'"></th>
        </tr>
      </thead>
      <tbody>
        <edit-quantity-row :product="product"></edit-quantity-row>
        <edit-measure-row :product="product"></edit-measure-row>

        <specification-row v-for="(detail, i) in numericDetailsToShow" :detail="detail" :key="i"></specification-row>

        <categorical-specification-row
          v-for="(detail, i) in categoricalDetailsToShow"
          :detail="detail"
          :key="i"
        ></categorical-specification-row>

        <!-- New row -->
        <tr v-if="isAddingNewProperty">
          <td>
            <div class="lhs-wrapper">
              <div>
                <a-select v-model="newDetails.variableType" style="width: 150px">
                  <a-select-option value="numerical">Numerical</a-select-option>
                  <a-select-option value="categorical">Categorical</a-select-option>
                </a-select>
              </div>
              <div>
                <a-input placeholder="Property name" v-model="newDetails.propertyName" />
              </div>
            </div>
          </td>
          <!--        <td>-->
          <!--          <a-input placeholder="Value" v-model="newDetails.rawMagnitude"/>-->
          <!--        </td>-->
          <!--        <td>-->
          <!--          <a-input placeholder="Unit" v-model="newDetails.unit"/>-->
          <!--        </td>-->
          <td>
            <a-input
              v-if="newDetails.variableType == 'categorical'"
              placeholder="Value"
              v-model="newDetails.propertyValue"
            />
          </td>
          <td>
            <a-input
              v-if="newDetails.variableType == 'numerical'"
              placeholder="Value"
              v-model="newDetails.normalisedUnitMagnitude"
            />
          </td>
          <td>
            <a-select
              v-if="newDetails.variableType == 'numerical'"
              v-model="newDetails.normalisedUnitBase"
              style="width: 100%"
            >
              <a-select-option v-for="(option, i) in unitOptions" :value="option.unit" :key="i">
                {{ option.unit == "dimensionless" ? "dimensionless" : null }}
                {{ option.unit == "count" ? "count" : null }}
                <span v-html="option.display"></span>
              </a-select-option>
            </a-select>
          </td>
          <td class="text-right">
            <a-button @click.prevent="cancel" style="margin-right: 5px" size="small" type="default">Cancel </a-button>
            <a-button @click.prevent="save" size="small" type="primary">Save</a-button>
            <loading-screen :is-loading="isSaving"></loading-screen>
          </td>
        </tr>
        <!-- New row -->
      </tbody>
    </table>

    <div v-if="!isAddingNewProperty && view === 'edit'" style="margin-top: 30px">
      <a-button @click.prevent="addNewProperty" type="primary" icon="plus">Add Property </a-button>
    </div>
  </div>
</template>

<script>
import SpecificationRow from "./SpecificationsTab/SpecificationRow";
import LoadingScreen from "../../../components/LoadingScreen";
import CategoricalSpecificationRow from "./SpecificationsTab/CategoricalSpecificationRow";
import EditQuantityRow from "./SpecificationsTab/EditQuantityRow";
import EditMeasureRow from "./SpecificationsTab/EditMeasureRow";
import Units from "../../../mixins/Units";
import { mapGetters } from "vuex";
import axios from "axios";

const _ = require("lodash");

export default {
  name: "SpecificationsTabs",
  components: { SpecificationRow, CategoricalSpecificationRow, LoadingScreen, EditQuantityRow, EditMeasureRow },
  mixins: [Units],
  computed: {
    ...mapGetters("productViewer", {
      details: "details",
      product: "product",
      view: "view",
    }),
    numericDetailsToShow() {
      let d = _.cloneDeep(this.details);
      d.push(this.detailsToAppend);
      let flattened = _.flatten(d);
      let filtered = _.filter(flattened, (f) => {
        return !(f.variableType && f.variableType === "categorical");
      });
      return _.uniqBy(filtered, "propertyName");
    },
    categoricalDetailsToShow() {
      let d = _.cloneDeep(this.details);
      d.push(this.detailsToAppend);
      let flattened = _.flatten(d);
      let filtered = _.filter(flattened, (f) => {
        return f.variableType && f.variableType === "categorical";
      });
      return _.uniqBy(filtered, "propertyName");
    },
  },
  data() {
    return {
      isAddingNewProperty: false,
      newDetails: {},
      isSaving: false,
      detailsToAppend: [],
    };
  },
  methods: {
    addNewProperty() {
      this.newDetails = {
        variableType: "numerical",
      };
      this.isAddingNewProperty = true;
    },

    save() {
      let vm = this;
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/products/" + this.product["_id"] + "/details", this.newDetails)
        .then(() => {
          vm.isSaving = false;
          vm.detailsToAppend.push(vm.newDetails);
          vm.isAddingNewProperty = false;
        })
        .catch((e) => {
          vm.isSaving = false;
          console.log(e);
          this.$message.error("Error saving property");
        });
    },

    cancel() {
      this.isAddingNewProperty = false;
    },
  },
};
</script>

<style scoped lang="scss">
.text-right {
  text-align: right;
}

.lhs-wrapper {
  display: flex;

  div:first-child {
    padding-right: 7px;
  }
}
</style>
