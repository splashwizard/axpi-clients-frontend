<template>
  <div class="form-section constraints-form" :key="updateKey">
    <div class="form-header">
      <h2>Constraints</h2>
    </div>

    <!-- Constraints -->
    <div class="constraint" v-for="(constraint, i) in scenario.constraints" :key="i">
      <!-- Choose what to constrain -->
      <a-form layout="vertical">
        <a-form-item label="Constrain">
          <a-select v-model="constraint.constraint" @change="incrementUpdateKey">
            <a-select-option :value="constraintOption.id"
                             v-for="(constraintOption, ii) in availableConstraints" :key="ii">
              {{ constraintOption.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <!-- / Choose what to constrain -->

      <!-- Dimensions -->
      <div v-if="constraint.constraint" class="dimensions-wrapper">
        <div class="dimension" v-for="(dimension, dimensionIndex) in constraint.dimensions" :key="dimensionIndex">

          <!-- Include/Exclude -->
          <a-select @change="forceRefresh" :dropdownMatchSelectWidth="false"
                    class="include-or-exclude-select" v-model="dimension.includeOrExclude">
            <a-select-option value="include">
              Include
            </a-select-option>
            <a-select-option value="exclude">
              Exclude
            </a-select-option>
          </a-select>
          <!-- / Include/Exclude -->

          <!-- Dimension -->
          <a-form layout="vertical">
            <a-form-item>
              <a-select label="Please select dimension"
                        @change="incrementUpdateKey" class="dimension-select" v-model="dimension.dimensionToConstrain">
                <a-select-option
                    v-for="(dimensionOption, dimensionOptionKey) in getDimensionOptionsForConstraint(constraint.constraint)"
                    :value="dimensionOption.id" :key="dimensionOptionKey">
                  {{ dimensionOption.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-if="dimension.dimensionToConstrain" label="With values">
              <a-select mode="multiple" label="Please select dimension values" @change="incrementUpdateKey"
                        v-model="dimension.dimensionValues">
                <a-select-option
                    v-for="(dimensionValue, dimensionValueKey) in getValueOptionsForDimension(constraint.constraint, dimension.dimensionToConstrain)"
                    :value="dimensionValue.value" :key="dimensionValueKey">
                  {{ dimensionValue.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
          <!-- / Dimension -->
        </div>
      </div>
      <!-- / Constraint -->
    </div>
    <!-- / Constraints -->

    <a-button icon="plus" @click.prevent="addConstraint">Add constraint</a-button>
  </div>
</template>

<script>
const _ = require('lodash');
const CONSTRAINT_DATA_TEMPLATE = {
  constraint: null,
  dimensions: [{
    includeOrExclude: 'include',
    logicalConnector: null,
    dimensionToConstrain: null,
    dimensionValues: []
  }]
};

export default {
  name: "Constraints",
  data() {
    return {
      updateKey: 1000,
      constraintDataTemplate: CONSTRAINT_DATA_TEMPLATE,
      availableConstraints: [
        {
          id: 'suppliers',
          label: 'Suppliers',
          type: 'categorical', // categorical or numerical,
        },
        {
          id: 'items',
          label: 'Items',
          type: 'categorical', // categorical or numerical,
        }
      ],
      dimensionsAvailable: {
        'suppliers': [
          {
            id: 'dim-1',
            label: 'Dim 1',
            valueOptions: [
              {
                label: 'Val 1',
                value: 'val-1'
              },
              {
                label: 'Val 2',
                value: 'val-2'
              }
            ]
          },
          {
            id: 'dim-2',
            label: 'Dim 2',
            valueOptions: [
              {
                label: 'Val 2',
                value: 'val-2'
              },
              {
                label: 'Val 3',
                value: 'val-3'
              }
            ]
          }
        ],
        'items': [
          {
            id: 'dim-3',
            label: 'Dim 3',
            valueOptions: [
              {
                label: 'Val 1',
                value: 'val-1'
              },
              {
                label: 'Val 2',
                value: 'val-2'
              }
            ]
          },
          {
            id: 'dim-4',
            label: 'Dim 4',
            valueOptions: [
              {
                label: 'Val 1',
                value: 'val-1'
              },
              {
                label: 'Val 2',
                value: 'val-2'
              },
              {
                label: 'Val 3',
                value: 'val-3'
              }
            ]
          }
        ]
      }
    }
  },
  props: ['scenario'],
  methods: {
    getDimensionOptionsForConstraint(constraintId) {
      let options = this.dimensionsAvailable[constraintId] ? this.dimensionsAvailable[constraintId] : [];
      console.log(options);
      return options;
    },

    forceRefresh() {
      let vm = this;
      this.$nextTick(() => {
        vm.$forceUpdate();
      })
    },

    incrementUpdateKey() {
      let vm = this;
      this.$nextTick(() => {
        vm.updateKey += 1;
      })
      // this.forceRefresh();
    },

    addConstraint() {
      this.scenario.constraints.push(
          {...this.constraintDataTemplate}
      );
    },

    getValueOptionsForDimension(constraintId, dimensionId) {
      let dimensionsForConstraint = this.getDimensionOptionsForConstraint(constraintId);
      let dimension = _.find(dimensionsForConstraint, {id: dimensionId});
      return dimension ? dimension.valueOptions : [];
    }
  }
}
</script>

<style lang="scss">
.constraints-form {
  .constraint {
    border: 1px solid #e8e8e8;
    margin-bottom: 20px;
    border-radius: 4px;
    padding: 20px;
  }

  //.include-or-exclude-select {
  //  margin-bottom: 20px;
  //}

  .include-or-exclude-select .ant-select-selection {
    box-shadow: none !important;
  }

  .include-or-exclude-select .ant-select-selection__rendered {
    margin-left: 0;
  }
}
</style>