<template>
  <div class="form-section constraints-form" :key="updateKey">
    <div class="form-header">
      <h2>Constraints</h2>
    </div>

    <!-- Loading Constraints -->
    <a-spin v-if="isLoadingConstraints" />
    <!-- / Loading Constraints -->

    <!-- Constraints -->
    <a-row v-if="!isLoadingConstraints" :gutter="20">
      <a-col :span="8" v-for="(constraint, i) in scenario.constraints" :key="i">
        <!-- Constraint -->
        <div class="constraint" :key="i">
          <!-- Is Editing -->
          <div v-if="constraint.isEditing" class="editing-constraint">
            <!-- Padding -->
            <div class="constraint-inner-padding">
              <!-- Choose what to constrain -->
              <a-form layout="vertical">
                <a-form-item label="Constrain">
                  <a-select v-model="constraint.constraint" @change="incrementUpdateKey">
                    <a-select-option
                      :value="constraintOption.id"
                      v-for="(constraintOption, ii) in availableConstraints"
                      :key="ii"
                    >
                      {{ constraintOption.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
              <!-- / Choose what to constrain -->
            </div>
            <!-- / Padding -->

            <!-- Dimensions Wrapper -->
            <div v-if="constraint.constraint" class="dimensions-wrapper">
              <!-- Dimension -->
              <div class="dimension" v-for="(dimension, dimensionIndex) in constraint.dimensions" :key="dimensionIndex">
                <!-- Logical connector -->
                <div class="logical-connector" v-if="dimension.logicalConnector">
                  <!--                  {{ dimension.logicalConnector }}-->
                  <a-select
                    @change="forceRefresh"
                    :dropdownMatchSelectWidth="false"
                    class="logical-connector-select"
                    v-model="dimension.logicalConnector"
                  >
                    <a-select-option value="AND"> AND </a-select-option>
                    <a-select-option value="OR"> OR </a-select-option>
                  </a-select>
                </div>
                <!-- / Logical connector -->

                <!-- Include/Exclude -->
                <div class="include-exclude-wrapper">
                  <div class="left">
                    <a-select
                      @change="forceRefresh"
                      :dropdownMatchSelectWidth="false"
                      class="include-or-exclude-select"
                      v-model="dimension.includeOrExclude"
                    >
                      <a-select-option value="include"> Include </a-select-option>
                      <a-select-option value="exclude"> Exclude </a-select-option>
                    </a-select>
                    Dimension
                  </div>
                  <div class="right">
                    <a-button
                      @click.prevent="deleteDimension(constraint, dimension)"
                      type="link"
                      icon="delete"
                    ></a-button>
                  </div>
                </div>
                <!-- / Include/Exclude -->

                <!-- Dimension -->
                <a-form layout="vertical">
                  <a-form-item>
                    <a-select
                      label="Please select dimension"
                      @change="incrementUpdateKey"
                      class="dimension-select"
                      v-model="dimension.dimensionToConstrain"
                    >
                      <a-select-option
                        v-for="(dimensionOption, dimensionOptionKey) in getDimensionOptionsForConstraint(
                          constraint.constraint
                        )"
                        :value="dimensionOption.id"
                        :key="dimensionOptionKey"
                      >
                        {{ dimensionOption.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item v-if="dimension.dimensionToConstrain" label="Dimension values">
                    <a-select
                      mode="multiple"
                      label="Please select dimension values"
                      @change="incrementUpdateKey"
                      v-model="dimension.dimensionValues"
                    >
                      <a-select-option
                        v-for="(dimensionValue, dimensionValueKey) in getValueOptionsForDimension(
                          constraint.constraint,
                          dimension.dimensionToConstrain
                        )"
                        :value="dimensionValue.value"
                        :key="dimensionValueKey"
                      >
                        {{ dimensionValue.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-form>
                <!-- / Dimension -->
              </div>
              <!-- / Dimension -->
            </div>
            <!-- / Dimensions Wrapper -->

            <!-- Button Toolbar -->
            <div class="button-toolbar">
              <a-button
                @click.prevent="addDimensionToConstraint(constraint)"
                block
                class="add-dimension-button"
                icon="plus"
                :disabled="!constraint.constraint || !isConstraintValid(constraint)"
                >Add Dimension
              </a-button>
              <a-button
                type="primary"
                @click.prevent="stopEditingConstraint(constraint)"
                block
                :disabled="!constraint.constraint || !isConstraintValid(constraint)"
                >Apply
              </a-button>
            </div>
            <!-- / Button Toolbar -->
          </div>
          <!-- / Is Editing -->

          <!-- NOT Editing -->
          <div v-if="!constraint.isEditing" class="view-constraint">
            <div class="view-constraint-actions">
              <a-button @click.prevent="editConstraint(constraint)" type="link" icon="edit"></a-button>

              <a-button @click.prevent="deleteConstraint(constraint)" type="link" icon="delete"></a-button>
            </div>

            <b>{{ getConstraintById(constraint.constraint).label }}</b>
            <div v-for="(dim, dimKey) in constraint.dimensions" :key="dimKey">
              <b>{{ dim.logicalConnector }} </b>
              <b>{{ capitalise(dim.includeOrExclude) }}</b>
              {{ getDimensionById(constraint.constraint, dim.dimensionToConstrain).label }}
              =
              {{ dim.dimensionValues.join(", ") }}
            </div>
          </div>
          <!-- / NOT Editing -->
        </div>
        <!-- / Constraint -->
      </a-col>
      <a-col :span="8">
        <div>
          <a-button
            block
            class="add-constraint-button"
            :disabled="!canAddNewConstraint"
            icon="plus"
            @click.prevent="addConstraint"
            >Add constraint
          </a-button>
        </div>
      </a-col>
    </a-row>
    <!-- / Constraints -->
  </div>
</template>

<script>
const _ = require("lodash");
import axios from "axios";

const CONSTRAINT_DATA_TEMPLATE = {
  constraint: null,
  isEditing: true,
  dimensions: [
    {
      includeOrExclude: "include",
      logicalConnector: null,
      dimensionToConstrain: null,
      dimensionValues: [],
    },
  ],
};

const DIMENSION_DATA_TEMPLATE = {
  includeOrExclude: "include",
  logicalConnector: "AND",
  dimensionToConstrain: null,
  dimensionValues: [],
};

export default {
  name: "Constraints",
  data() {
    return {
      updateKey: 1000,
      constraintDataTemplate: CONSTRAINT_DATA_TEMPLATE,

      isLoadingConstraints: false,
      constraintsFromServer: [],

      // availableConstraints: [
      //   {
      //     id: 'suppliers',
      //     label: 'All Suppliers',
      //     type: 'categorical', // categorical or numerical,
      //   },
      //   {
      //     id: 'items',
      //     label: 'All Items',
      //     type: 'categorical', // categorical or numerical,
      //   }
      // ],
      // dimensionsAvailable: {
      //   'suppliers': [
      //     {
      //       id: 'social-accreditation',
      //       label: 'Social Accreditation',
      //       valueOptions: [
      //         {
      //           label: 'Val 1',
      //           value: 'val-1'
      //         },
      //         {
      //           label: 'Val 2',
      //           value: 'val-2'
      //         }
      //       ]
      //     },
      //     {
      //       id: 'environmental-accreditation',
      //       label: 'Environmental Accreditation',
      //       valueOptions: [
      //         {
      //           label: 'Val 2',
      //           value: 'val-2'
      //         },
      //         {
      //           label: 'Val 3',
      //           value: 'val-3'
      //         }
      //       ]
      //     },
      //     {
      //       id: 'country',
      //       label: 'Country',
      //       valueOptions: [
      //         {
      //           label: 'Val 2',
      //           value: 'val-2'
      //         },
      //         {
      //           label: 'Val 3',
      //           value: 'val-3'
      //         }
      //       ]
      //     },
      //     {
      //       id: 'distance-from-delivery-location',
      //       label: 'Distance from delivery location',
      //       valueOptions: [
      //         {
      //           label: 'Val 2',
      //           value: 'val-2'
      //         },
      //         {
      //           label: 'Val 3',
      //           value: 'val-3'
      //         }
      //       ]
      //     },
      //     {
      //       id: 'spend-with-supplier-this-year',
      //       label: 'Spend with supplier this year',
      //       valueOptions: [
      //         {
      //           label: 'Val 2',
      //           value: 'val-2'
      //         },
      //         {
      //           label: 'Val 3',
      //           value: 'val-3'
      //         }
      //       ]
      //     },
      //     {
      //       id: 'orders-with-supplier-this-year',
      //       label: 'Orders with supplier this year',
      //       valueOptions: [
      //         {
      //           label: 'Val 2',
      //           value: 'val-2'
      //         },
      //         {
      //           label: 'Val 3',
      //           value: 'val-3'
      //         }
      //       ]
      //     }
      //   ],
      //   'items': [
      //     {
      //       id: 'environmental-accreditation',
      //       label: 'Environmental Accreditation',
      //       valueOptions: [
      //         {
      //           label: 'ISO 14001:2015',
      //           value: 'ISO 14001:2015'
      //         },
      //         {
      //           label: 'ISO 14053:2021',
      //           value: 'ISO 14053:2021'
      //         },
      //         {
      //           label: 'Carbon Trust Standard',
      //           value: 'Carbon Trust Standard'
      //         },
      //         {
      //           label: 'EMAS',
      //           value: 'EMAS'
      //         },
      //         {
      //           label: 'FSC',
      //           value: 'FSC'
      //         },
      //         {
      //           label: 'Blue Planet',
      //           value: 'Blue Planet'
      //         },
      //         {
      //           label: 'MCERTS',
      //           value: 'MCERTS'
      //         },
      //         {
      //           label: 'Paper Profile',
      //           value: 'Paper Profile'
      //         }
      //       ]
      //     },
      //     {
      //       id: 'material-sourcing-locations',
      //       label: 'Material Sourcing Locations',
      //       valueOptions: [
      //         {
      //           label: 'Val 1',
      //           value: 'val-1'
      //         },
      //         {
      //           label: 'Val 2',
      //           value: 'val-2'
      //         },
      //         {
      //           label: 'Val 3',
      //           value: 'val-3'
      //         }
      //       ]
      //     }
      //   ]
      // }
    };
  },
  props: ["scenario", "optimisationId"],
  computed: {
    canAddNewConstraint() {
      let canAdd = true;

      _.each(this.scenario.constraints, function (constraint) {
        if (constraint.isEditing) {
          canAdd = false;
        }
      });

      return canAdd;
    },

    availableConstraints() {
      return this.constraintsFromServer;
    },

    dimensionsAvailable() {
      let dims = [];
      _.each(this.constraintsFromServer, (constraint) => {
        dims[constraint.id] = constraint.dimensions_available;
      });
      return dims;
    },
  },
  created() {
    this.fetchConstraints();
  },
  methods: {
    fetchConstraints() {
      let vm = this;
      vm.isLoadingConstraints = true;
      axios
        .get(window.API_BASE + "/optimisations/" + vm.optimisationId + "/get-constraints")
        .then((r) => {
          vm.isLoadingConstraints = false;
          vm.constraintsFromServer = r.data;
        })
        .catch((e) => {
          vm.isLoadingConstraints = false;
          console.log(e);
          vm.$message.error("Error loading constraints");
        });
    },

    isConstraintValid(constraint) {
      if (!constraint.constraint) {
        return false;
      }

      let valid = true;
      _.each(constraint.dimensions, function (dimension) {
        if (dimension.dimensionToConstrain == null) {
          valid = false;
        }
        if (dimension.dimensionValues.length == 0) {
          valid = false;
        }
      });
      return valid;
    },

    getConstraintById(constraintId) {
      return _.find(this.availableConstraints, { id: constraintId });
    },

    getDimensionById(constraintId, dimensionId) {
      return _.find(this.dimensionsAvailable[constraintId], { id: dimensionId });
    },

    getDimensionOptionsForConstraint(constraintId) {
      let options = this.dimensionsAvailable[constraintId] ? this.dimensionsAvailable[constraintId] : [];
      console.log(options);
      return options;
    },

    forceRefresh() {
      let vm = this;
      this.$nextTick(() => {
        vm.$forceUpdate();
      });
    },

    incrementUpdateKey() {
      let vm = this;
      this.$nextTick(() => {
        vm.updateKey += 1;
      });
      // this.forceRefresh();
    },

    addConstraint() {
      this.scenario.constraints.push(_.cloneDeep({ ...this.constraintDataTemplate }));
    },

    addDimensionToConstraint(constraint) {
      constraint.dimensions.push(
        _.cloneDeep({
          ...DIMENSION_DATA_TEMPLATE,
        })
      );
    },

    getValueOptionsForDimension(constraintId, dimensionId) {
      let dimensionsForConstraint = this.getDimensionOptionsForConstraint(constraintId);
      let dimension = _.find(dimensionsForConstraint, { id: dimensionId });
      return dimension ? dimension.valueOptions : [];
    },

    stopEditingConstraint(constraint) {
      constraint.isEditing = false;
    },

    deleteDimension(constraint, dimension) {
      constraint.dimensions = _.without(constraint.dimensions, dimension);
    },

    capitalise(string) {
      if (string && string.length) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      return string;
    },

    deleteConstraint(constraint) {
      this.scenario.constraints = _.without(this.scenario.constraints, constraint);
    },

    editConstraint(constraint) {
      constraint.isEditing = true;
    },
  },
};
</script>

<style lang="scss">
.constraints-form {
  .constraint {
    border: 1px solid #e8e8e8;
    margin-bottom: 20px;
    border-radius: 7px;

    .dimension {
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 20px;
      padding-bottom: 20px;
      border-top: 1px solid #e8e8e8;
      position: relative;
    }

    .constraint-inner-padding {
      padding: 15px 20px;
    }

    .button-toolbar {
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 20px;
      padding-top: 15px;
      border-top: 1px solid #e8e8e8;
    }

    .ant-form-item {
      padding-bottom: 0 !important;
      margin-bottom: 14px;
    }
  }

  .view-constraint {
    padding: 20px;
    position: relative;

    .view-constraint-actions {
      position: absolute;
      top: 1px;
      right: 1px;
    }
  }

  //.include-or-exclude-select {
  //  margin-bottom: 20px;
  //}

  .include-or-exclude-select .ant-select-selection {
    box-shadow: none !important;
    color: #000;
    font-weight: 600;

    .ant-select-arrow-icon {
      color: #000;
    }
  }

  .logical-connector-select .ant-select-selection {
    box-shadow: none !important;
    color: #000;
    font-weight: 600;

    .ant-select-arrow-icon {
      color: #000;
    }
  }

  .include-or-exclude-select .ant-select-selection__rendered {
    margin-left: 0;
  }

  .add-dimension-button {
    margin-top: 5px;
    margin-bottom: 10px;
  }

  .logical-connector {
    position: absolute;
    left: 0;
    right: 0;
    top: -15px;
    text-align: center;
    width: 80px;
    margin: 0 auto;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 10px;
    padding-top: 2px;
    padding-bottom: 2px;

    .ant-select-selection--single {
      height: 10px !important;
      line-height: 10px !important;
    }

    .ant-select-selection__rendered {
      line-height: 10px;
    }
  }

  .include-exclude-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 3px;

    .left {
      flex: 1;
    }

    .right {
      flex-shrink: 1;

      .ant-btn {
        text-align: right;
        width: auto;
      }
    }
  }

  .add-constraint-button {
    height: 80px;
  }
}
</style>
