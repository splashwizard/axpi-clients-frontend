<template>
  <tr>
    <td>
      <loading-screen :is-loading="isSaving||isLoadingDetails"></loading-screen>
      {{ localDetail['propertyName'] }}
    </td>
    <td>
      <span v-html="getPropertyValue(localDetail)"></span>
    </td>
    <!-- Not editing -->
    <td v-if="!isEditing">
      <span v-if="localDetail['inequality'] && localDetail['inequality'] !== 'range'" style="padding-right: 5px;">{{ getInequalityLabel(localDetail['inequality']) }}</span>
      <span v-html="formatVal(localDetail['normalisedUnitMagnitude'])"></span>
    </td>
    <td v-if="!isEditing">
      <span>{{ formatUnit(localDetail.normalisedUnitBase) }}</span>
    </td>
    <td v-if="!isEditing" class="text-right">
      <a-button @click.prevent="edit" v-if="!isEditing" size="small" icon="edit" type="default"></a-button>
      <delete-product-detail-button style="margin-left: 6px;"
                                    v-if="!isEditing" :product="product"
                                    :details="localDetail"></delete-product-detail-button>
    </td>
    <!-- / Not editing -->

    <!-- Editing -->
    <td colspan="2" v-if="isEditing">
      <div class="editing-fields-wrapper">
        <div class="input-padding-right">
          <a-select v-model="details.inequality" style="width: 80px;">
            <a-select-option v-for="(option, i) in inequalityOptions" :value="option.value" :key="i">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </div>

        <div class="input-padding-right">
          <a-input v-model="details.normalisedUnitMagnitude"/>
        </div>

        <a-select v-model="details.normalisedUnitBase" style="width: 150px;">
          <a-select-option v-for="(option, i) in unitOptions" :value="option.unit" :key="i">
            {{ option.unit == 'dimensionless' ? 'dimensionless' : null }}
            {{ option.unit == 'count' ? 'count' : null }}
            <span v-html="option.display"></span>
          </a-select-option>
        </a-select>
      </div>
    </td>
    <td class="text-right" v-if="isEditing">
      <a-button @click.prevent="cancel" style="margin-right: 5px;" v-if="isEditing" size="small" type="default">Cancel
      </a-button>
      <a-button @click.prevent="save" v-if="isEditing" size="small" type="primary">Save</a-button>
    </td>
    <!-- / Editing -->
  </tr>
</template>

<script>
import axios from 'axios';
import {mapGetters, mapActions} from 'vuex';
import DeleteProductDetailButton from "./DeleteProductDetailButton";
import Units from "../../../../mixins/Units";
import Inequalities from "../../../../mixins/Inequalities";

export default {
  name: "SpecificationRow",
  components: {DeleteProductDetailButton},
  mixins: [Units, Inequalities],
  props: ['detail'],
  data() {
    return {
      isEditing: false,
      localDetail: {},
      details: {},
      isSaving: false
    }
  },
  created() {
    this.localDetail = this.detail;
  },
  computed: {
    ...mapGetters('productViewer', {
      product: 'product',
      isLoadingDetails: 'isLoadingDetails'
    })
  },
  methods: {
    ...mapActions('productViewer', {
      loadDetails: 'loadDetails'
    }),

    getPropertyValue(detail) {
      if (detail['propertyValues'] && detail['propertyValues'].length) {
        return detail['propertyValues'][0];
      }
      return '-';
    },

    edit() {
      this.isEditing = true;
      this.details = {
        ...this.localDetail
      };
    },

    cancel() {
      this.details = {};
      this.isEditing = false;
    },

    formatVal(val) {
      if (val < 1) {
        let exp = Number.parseFloat(val).toExponential(3);
        let split = exp.split('e');
        val = split[0] + ' x 10' + '<sup>' + split[1] + '</sup>'
      }
      return val;
    },

    save() {
      let vm = this;
      vm.isSaving = true;
      axios.post(window.API_BASE + '/products/' + this.product['_id'] + '/details', vm.details).then(() => {
        vm.isSaving = false;
        vm.isEditing = false;
        vm.localDetail = vm.details;
      }).catch(e => {
        vm.isSaving = false;
        console.log(e);
        this.$message.error('Error saving property');
      });
    }
  }
}
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
</style>