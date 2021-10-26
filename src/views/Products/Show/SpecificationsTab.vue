<template>
  <div>
    <table class="axpi-basic-table">
      <thead>
      <tr>
        <th>Field Name</th>
        <th width="130">Field Value</th>
        <th></th>
        <th width="130">Normalised Value</th>
        <th></th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <specification-row v-for="(detail, i) in detailsToShow" :detail="detail" :key="i"
      ></specification-row>

      <!-- New row -->
      <tr v-if="isAddingNewProperty">
        <td>
          <a-input placeholder="Property name" v-model="newDetails.propertyName"/>
        </td>
        <td>
          <a-input placeholder="Value" v-model="newDetails.rawMagnitude"/>
        </td>
        <td>
          <a-input placeholder="Unit" v-model="newDetails.unit"/>
        </td>
        <td>
          <a-input placeholder="Value" v-model="newDetails.normalisedUnitMagnitude"/>
        </td>
        <td>
          <a-input placeholder="Unit" v-model="newDetails.normalisedUnitBase"/>
        </td>
        <td class="text-right">
          <a-button @click.prevent="cancel" style="margin-right: 5px;" size="small" type="default">Cancel
          </a-button>
          <a-button @click.prevent="save" size="small" type="primary">Save</a-button>
          <loading-screen :is-loading="isSaving"></loading-screen>
        </td>
      </tr>
      <!-- New row -->
      </tbody>
    </table>

    <div v-if="!isAddingNewProperty" style="margin-top: 30px;">
      <a-button @click.prevent="addNewProperty"
                type="primary" icon="plus">Add Property
      </a-button>
    </div>
  </div>
</template>

<script>
import SpecificationRow from "./SpecificationsTab/SpecificationRow";
import LoadingScreen from "../../../components/LoadingScreen";
import {mapGetters} from "vuex";
import axios from 'axios';
const _ = require('lodash');

export default {
  name: "SpecificationsTabs",
  components: {SpecificationRow, LoadingScreen},
  computed: {
    ...mapGetters('productViewer', {
      details: 'details',
      product: 'product'
    }),
    detailsToShow() {
      let d = this.details;
      d.push(this.detailsToAppend);
      return _.flatten(d);
    }
  },
  data() {
    return {
      isAddingNewProperty: false,
      newDetails: {},
      isSaving: false,
      detailsToAppend: []
    }
  },
  methods: {
    addNewProperty() {
      this.newDetails = {};
      this.isAddingNewProperty = true;
    },

    save() {
      let vm = this;
      vm.isSaving = true;
      axios.post(window.API_BASE + '/products/' + this.product['_id'] + '/details', this.newDetails).then(() => {
        vm.isSaving = false;
        vm.detailsToAppend.push(vm.newDetails);
        vm.isAddingNewProperty = false;
      }).catch(e => {
        vm.isSaving = false;
        console.log(e);
        this.$message.error('Error saving property');
      });
    },

    cancel() {
      this.isAddingNewProperty = false;
    }
  }
}
</script>

<style scoped>
.text-right {
  text-align: right;
}
</style>