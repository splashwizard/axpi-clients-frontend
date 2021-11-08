<template>
  <tr>
    <td>
      <loading-screen :is-loading="isSaving"></loading-screen>
      Measure
    </td>
    <td>
      <span>{{ rawValue }}</span>
    </td>
    <td>
      <span v-html="normalisedValueMagnitudeFormatted" v-if="!isEditing"></span>
      <a-input v-if="isEditing" v-model="normalisedMeasureEditing.normalisedUnitMagnitude"/>
    </td>
    <td>
      <span v-html="normalisedUnitBaseFormatted" v-if="!isEditing"></span>
      <a-select v-if="isEditing" v-model="normalisedMeasureEditing.normalisedUnitBase" style="width: 100%">
        <a-select-option v-for="(option, i) in unitOptions" :value="option.unit" :key="i">
          {{ option.unit == 'dimensionless' ? 'dimensionless' : null }}
          {{ option.unit == 'count' ? 'count' : null }}
          {{ option.display }}
        </a-select-option>
      </a-select>
    </td>
    <td class="text-right">
      <a-button @click.prevent="edit" v-if="!isEditing" size="small" icon="edit" type="default"></a-button>

      <a-button @click.prevent="cancel" style="margin-right: 5px;" v-if="isEditing" size="small" type="default">Cancel
      </a-button>
      <a-button @click.prevent="save" v-if="isEditing" size="small" type="primary">Save</a-button>
    </td>
  </tr>
</template>

<script>
const _ = require('lodash');
import axios from 'axios';
import Units from "../../../../mixins/Units";

export default {
  name: "EditQuantityRow",
  props: ['product'],
  mixins: [Units],
  data() {
    return {
      isSaving: false,
      isEditing: false,
      normalisedMeasure: {},
      normalisedMeasureEditing: {}
    }
  },
  created() {
    if (this.product.normalisedMeasure) {
      this.normalisedMeasure = _.cloneDeep(this.product.normalisedMeasure);
    }
  },
  methods: {
    formatVal(val) {
      if (val < 1) {
        let exp = Number.parseFloat(val).toExponential(3);
        let split = exp.split('e');
        val = split[0] + ' x 10' + '<sup>' + split[1] + '</sup>'
      }
      return val;
    },

    edit() {
      this.isEditing = true;
      this.normalisedMeasureEditing = {
        ...this.normalisedMeasure
      };
    },

    cancel() {
      this.normalisedMeasureEditing = {};
      this.isEditing = false;
    },

    save() {
      let vm = this;
      vm.isSaving = true;
      axios.post(window.API_BASE + '/products/' + this.product['_id'] + '/update-measure', this.normalisedMeasureEditing).then(() => {
        vm.isSaving = false;
        vm.isEditing = false;
        vm.normalisedMeasure = vm.normalisedMeasureEditing;
      }).catch(e => {
        console.log(e);
        vm.isSaving = false;
        vm.$message.error('Error saving measure');
      });
    }
  },
  computed: {
    rawValue() {
      if (this.normalisedMeasure.rawMagnitude) {
        return this.normalisedMeasure.rawMagnitude + ' ' + this.normalisedMeasure.unit
      }
      return '';
    },

    normalisedValueMagnitudeFormatted() {
      if (this.normalisedMeasure.normalisedUnitMagnitude) {
        return this.formatVal(this.normalisedMeasure.normalisedUnitMagnitude);
      }
      return '';
    },

    normalisedUnitBaseFormatted() {
      if (this.normalisedMeasure.normalisedUnitBase) {
        return this.formatUnit(this.normalisedMeasure.normalisedUnitBase);
      }
      return '';
    }
  }
}
</script>

<style scoped>
.text-right {
  text-align: right;
}
</style>