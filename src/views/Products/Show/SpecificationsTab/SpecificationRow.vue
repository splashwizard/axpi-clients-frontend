<template>
  <tr>
    <td>
      <loading-screen :is-loading="isSaving||isLoadingDetails"></loading-screen>
      {{ localDetail['propertyName'] }}
    </td>
    <td>
      <span v-if="!isEditing" v-html="formatVal(localDetail['rawMagnitude'])"></span>
      <a-input v-if="isEditing" v-model="details.rawMagnitude"/>
    </td>
    <td>
      <span v-if="!isEditing">{{ localDetail['unit'] !== 'dimensionless' ? localDetail['unit'] : '' }}</span>
      <a-input v-if="isEditing" v-model="details.unit"/>
    </td>
    <td>
      <span v-if="!isEditing" v-html="formatVal(localDetail['normalisedUnitMagnitude'])"></span>
      <a-input v-if="isEditing" v-model="details.normalisedUnitMagnitude"/>
    </td>
    <td>
      <span v-if="!isEditing">{{
          localDetail['normalisedUnitBase'] !== 'dimensionless' ? localDetail['normalisedUnitBase'] : ''
        }}</span>
      <a-input v-if="isEditing" v-model="details.normalisedUnitBase"/>
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
import axios from 'axios';
import {mapGetters, mapActions} from 'vuex';

export default {
  name: "SpecificationRow",
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

    edit() {
      this.isEditing = true;
      this.details = {
        ...this.detail
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
</style>