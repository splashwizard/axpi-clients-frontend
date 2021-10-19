<template>
  <tr>
    <td>
      <a-avatar size="large" :src="getImageSrc(getFirstProduct(insight))"/>
    </td>
    <td>
      <b>{{ getFirstProduct(insight)["name"] }}</b>

      <div v-if="showMoreDetails">
        <div class="comparison-wrapper">

          <!-- Country comparison -->
          <p>
            <b>Country: </b>
            {{ getProperty('country') }}
            <a-icon v-if="doesPropertyMatch('country')"
                    type="check-circle" theme="twoTone" two-tone-color="#52c41a"></a-icon>
            <a-icon v-else type="close-circle" theme="twoTone" two-tone-color="#FF0000"></a-icon>
          </p>
          <!-- / Country comparison -->

          <!-- Country comparison -->
          <p>
            <b>Vendor: </b>
            {{ getProperty('vendor') }}
            <a-icon v-if="doesPropertyMatch('vendor')"
                    type="check-circle" theme="twoTone" two-tone-color="#52c41a"></a-icon>
            <a-icon v-else type="close-circle" theme="twoTone" two-tone-color="#FF0000"></a-icon>
          </p>
          <!-- / Country comparison -->

          <!-- Volume difference -->
          <p v-if="volumePercentageDifference !== null">
            <b>Volume difference: </b>
            {{ volumePercentageDifference }}%
          </p>
          <!-- / Volume difference -->

          <!-- Unit price difference -->
          <p>
            <b>Unit price difference: </b>
            {{ pricePerUnitPercentageDifference }}%
          </p>
          <!-- / Unit price difference -->

        </div>

        <a href="#" style="margin-top: 5px;" @click.prevent="toggleShowMoreDetails">View less
          <a-icon :style="{fontSize: '10px'}" type="up"/>
        </a>
      </div>
      <div v-else>
        <a href="#" @click.prevent="toggleShowMoreDetails">Compare
          <a-icon type="down" :style="{fontSize: '10px'}"/>
        </a>
      </div>

    </td>
    <td>{{ matchPercentage }}%</td>
    <td>
      {{ formatCost({cost: insight['potential_savings'], cost_currency: 'USD'}) }}
    </td>
    <td class="action">
      <a-button v-if="!isInsightSelected" @click.prevent="toggleInsightApplied">Select</a-button>
      <a-button type="danger" v-else @click.prevent="toggleInsightApplied">Deselect</a-button>
    </td>
  </tr>
</template>

<script>
import Orders from "../../../../../../mixins/Orders";
import {mapGetters} from "vuex";
const _ = require('lodash');

export default {
  props: ["insight", "insightsAppliedLocal"],
  mixins: [Orders],
  data() {
    return {
      showMoreDetails: false
    }
  },
  computed: {
    ...mapGetters('clusterViewer', {
      ordersWithMatches: 'ordersWithMatches'
    }),

    matchPercentage() {
      let properties = ['country', 'name', 'vendor'];
      let propertiesThatMatch = [];

      _.each(properties, property => {
        if (this.doesPropertyMatch(property)) {
          propertiesThatMatch.push(property);
        }
      });

      return Math.round(100 * (propertiesThatMatch.length / properties.length));
    },

    baseVolume() {
      return this.getProperty('volume');
    },

    comparedToVolume() {
      return this.getProperty('volume', 'compared_to');
    },

    volumePercentageDifference() {
      let volumeOfComparedTo = this.getProperty('volume', 'compared_to');
      let volumeOfBase = this.getProperty('volume');

      if (volumeOfComparedTo && volumeOfBase) {
        let increase = volumeOfComparedTo - volumeOfBase;
        let percentageDifference = (increase / volumeOfBase) * 100;
        return Math.round(percentageDifference * 100) / 100;
      }

      return null;
    },

    pricePerUnitPercentageDifference() {
      let basePrice = this.insight['price_per_unit']['base'];
      let comparedToPrice = this.insight['price_per_unit']['compared_to'];

      let increase = comparedToPrice - basePrice;
      let percentageDifference = (increase / basePrice) * 100;
      return Math.round(percentageDifference * 100) / 100;
    },

    isInsightSelected() {
      return this.insightsAppliedLocal.includes(this.insight['insight_id']);
    }
  },
  methods: {
    getFirstProduct(insight) {
      let order = _.find(this.ordersWithMatches, {
        '_id': insight['compared_to_erp_order_id']
      });
      return order["products"][0];
    },

    getFirstBaseProduct(insight) {
      // return insight["products"]["base"][0];
      let order = _.find(this.ordersWithMatches, {
        '_id': insight['erp_order_id']
      });
      return order["products"][0];
    },

    toggleShowMoreDetails() {
      this.showMoreDetails = !this.showMoreDetails;
    },

    getImageSrc(product) {
      if (product["imageURLs"] && product["imageURLs"].length) {
        return product["imageURLs"][0];
      }
    },

    getProperty(property, type = 'compared_to') {
      switch (property) {
        case 'country':
          if (type === 'compared_to') {
            return this.getFirstProduct(this.insight)['Country'];
          } else {
            return this.getFirstBaseProduct(this.insight)['Country'];
          }
        case 'name':
          if (type === 'compared_to') {
            return this.getFirstProduct(this.insight)['Name'];
          } else {
            return this.getFirstBaseProduct(this.insight)['Name'];
          }
        case 'vendor':
          if (type === 'compared_to') {
            return this.getFirstProduct(this.insight)['Vendor'];
          } else {
            return this.getFirstBaseProduct(this.insight)['Vendor'];
          }
        case 'volume': {
          let product = null;
          if (type === 'compared_to') {
            product = this.getFirstProduct(this.insight);
          } else {
            product = this.getFirstBaseProduct(this.insight);
          }
          let volume = null;
          if (product['normalisedQuantity'] && product['normalisedQuantity']['totalMeasure'] && product['normalisedQuantity']['totalMeasure']['entity'] === 'volume') {
            volume = product['normalisedQuantity']['totalMeasure']['normalisedUnitMagnitude'];
          }
          // volume = 5;
          return volume;
        }
        default:
          return null;
      }
    },

    doesPropertyMatch(property) {
      return this.getProperty(property) === this.getProperty(property, 'base')
    },

    toggleInsightApplied() {
      this.$emit('toggle-insight-applied', this.insight);
    }
  },
};
</script>

<style scoped lang="scss">
td {
  vertical-align: top;
}

.comparison-wrapper {
  margin-top: 10px;

  b {
    font-weight: 500;
    margin-right: 5px;
  }

  p {
    .anticon {
      margin-left: 5px;
    }
  }
}
</style>