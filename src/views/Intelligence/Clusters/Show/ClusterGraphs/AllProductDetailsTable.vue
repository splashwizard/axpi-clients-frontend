<template>
  <div>
    <div v-if="isLoading" style="text-align: center;">
      <a-spin></a-spin>
    </div>
    <!-- Table -->
    <a-table v-if="!isLoading"
             class="axpi-table small-th column-dividers"
             :scroll="{ x: 1300 }"
             :columns="columns"
             :data-source="tableData"
             :loading="isLoading"
    >
      <div slot="name" slot-scope="name, record">
        <div class="product-name-wrapper">
          <div class="left">
            <a-avatar style="margin-right: 20px;"
                      size="large" :src="getImageSrc(record)"/>
          </div>
          <div class="right">
            <a target="_blank" :href="getProductLink(record)">
              {{ name }}
            </a>
          </div>
        </div>
      </div>
      <div v-for="(p,i) in uniqueProperties" :slot="p" :key="i" slot-scope="property">
        <span v-html="property"></span>
      </div>
    </a-table>
    <!-- Table -->
  </div>
</template>

<script>
const _ = require('lodash');
import {mapGetters} from 'vuex';
import axios from 'axios';

export default {
  name: "AllProductDetailsTable",
  data() {
    return {
      enriched: [],
      isLoading: false
    }
  },
  created() {
    this.enrich();
  },
  computed: {
    ...mapGetters('clusterViewer', {
      ordersWithMatchesFiltered: 'ordersWithMatchesFiltered'
    }),

    uniqueProperties() {
      let properties = [];
      _.each(Object.values(this.enriched), ps => {
        properties.push(_.map(ps, 'propertyName'));
        properties = _.flatten(properties);
      });
      return _.uniq(properties);
    },

    columns() {
      return [
        {
          title: 'Name',
          dataIndex: 'product_name',
          scopedSlots: {customRender: 'name'},
          sorter: true,
          width: 300,
          fixed: 'left'
        },
        ..._.map(this.uniqueProperties, (p) => ({
          title: p,
          dataIndex: p,
          sorter: true,
          width: 200,
          scopedSlots: {customRender: p}
        }))
      ]
    },

    tableData() {
      let td = [];
      _.each(this.ordersWithMatchesFiltered, o => {
        if (o.product_name) {
          let productRow = {
            product_id: o.product_id,
            product_name: o.product_name,
            imageURLs: this.getFirstProduct(o)['imageURLs']
          };
          _.each(this.uniqueProperties, p => {
            let property = _.find(o.product_all_properties, {
              propertyName: p
            });
            if (property) {
              let magnitudeFormatted = property.propertyValue;
              if (magnitudeFormatted < 1 && magnitudeFormatted !== 0) {
                let exp = Number.parseFloat(magnitudeFormatted).toExponential(3);
                let split = exp.split('e');
                magnitudeFormatted = split[0] + ' x 10' + '<sup>' + split[1] + '</sup>'
              }

              let propertyUnitFormatted = this.formatUnit(property.propertyUnit);
              productRow[p] = magnitudeFormatted + ' ' + propertyUnitFormatted;
            } else {
              productRow[p] = '';
            }
          });
          td.push(productRow);
        }
      });
      return td;
    }
  },
  methods: {
    getImageSrc(product) {
      if (product["imageURLs"] && product["imageURLs"].length) {
        return product["imageURLs"][0];
      }
    },

    getProductLink(row) {
      return '/products/' + row['product_id'];
    },

    getFirstProduct(record) {
      return record["products"][0];
    },

    formatUnit(unit) {
     if (unit === 'dimensionless') {
       return '';
     }
     return unit;
    },

    enrich() {
      let vm = this;
      vm.isLoading = true;
      axios.post(window.API_BASE + '/products/enrich-many', {
        ids: _.map(this.ordersWithMatchesFiltered, 'product_id')
      }).then((r) => {
        vm.isLoading = false;
        vm.enriched = r.data;
      }).catch(e => {
        console.log(e);
        vm.isLoading = false;
        vm.$message.error('Error getting order properties');
      });
    }
  }
}
</script>

<style scoped lang="scss">
.product-name-wrapper {
  display: flex;
  flex-direction: row;

  .left {
    flex-shrink: 1;
    display: flex;
    align-items: center;
  }

  .right {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
}
</style>