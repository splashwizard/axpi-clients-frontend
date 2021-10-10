<template>
  <tr>
    <td>
      <a-avatar size="large" :src="getImageSrc(getFirstProduct(insight))"/>
    </td>
    <td>
      <b>{{ getFirstProduct(insight)["Name"] }}</b>

      <div v-if="showMoreDetails">
        <div class="comparison-wrapper">
          <p>
            <b>Country: </b><br>
            {{ getProperty('country') }}
            <a-icon v-if="doesPropertyMatch('country')"
                    type="check-circle" theme="twoTone" two-tone-color="#52c41a"></a-icon>
            <a-icon v-else type="close-circle" theme="twoTone" two-tone-color="#FF0000"></a-icon>
          </p>
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
    matchPercentage() {
      let properties = ['country', 'name'];
      let propertiesThatMatch = [];

      _.each(properties, property => {
        if (this.doesPropertyMatch(property)) {
          propertiesThatMatch.push(property);
        }
      });

      return Math.round(100 * (propertiesThatMatch.length / properties.length));
    },

    isInsightSelected() {
      return this.insightsAppliedLocal.includes(this.insight['insight_id']);
    }
  },
  methods: {
    getFirstProduct(insight) {
      return insight["products"]["compared_to"][0];
    },

    getFirstBaseProduct(insight) {
      return insight["products"]["base"][0];
    },

    toggleShowMoreDetails() {
      this.showMoreDetails = !this.showMoreDetails;
    },

    getImageSrc(product) {
      if (product["Images"] && product["Images"].length) {
        return product["Images"][0];
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
.comparison-wrapper {
  margin-top: 10px;

  b {
    font-weight: 500;
  }

  p {
    .anticon {
      margin-left: 5px;
    }
  }
}
</style>