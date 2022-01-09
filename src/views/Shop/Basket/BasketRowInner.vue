<template>
  <div>
    <a-table :columns="columns" :data-source="innerRows" :pagination="false" :show-header="false"
             class="basketRowInnerTable">
      <div slot="icon" slot-scope="icon">
        <a-icon class="rowIcon" :type="icon" theme="twoTone"/>
      </div>

      <div slot="expandedRowRender" slot-scope="innerRow">
        <suggested-prices v-if="innerRow.title == 'Suggested Prices'"
                          :row="row"></suggested-prices>
        <similar-products v-if="innerRow.title == 'Similar Products'"
                          :row="row"></similar-products>
        <savings-summary v-if="innerRow.title == 'Savings Summary'"
                         :row="row"></savings-summary>
      </div>

    </a-table>
    <!--    {{ row }}-->
  </div>
</template>

<script>
import SuggestedPrices from "./BasketRowInner/SuggestedPrices";
import SimilarProducts from "./BasketRowInner/SimilarProducts";
import SavingsSummary from "./BasketRowInner/SavingsSummary";

export default {
  name: "BasketRowInner",
  components: {SavingsSummary, SimilarProducts, SuggestedPrices},
  props: ['row'],
  data() {
    return {
      columns: [
        {
          dataIndex: 'icon',
          scopedSlots: {customRender: 'icon'},
          width: 50
        },
        {
          dataIndex: 'title'
        }
      ]
    }
  },
  computed: {
    innerRows() {
      let rows = [
        {
          icon: 'thunderbolt',
          title: 'Suggested Prices'
        }
      ];
      if (this.row.itemType === 'order') {
        rows.push({
          icon: 'gold',
          title: 'Similar Products'
        });
      }
      rows.push({
        icon: 'dollar',
        title: 'Savings Summary'
      });
      return rows;
    }
  }
}
</script>

<style lang="scss">
.basketRowInnerTable {
  .rowIcon {
    font-size: 28px;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  tr:hover {
    td {
      background: none !important;
    }
  }

  td {
    border-bottom: none !important;
  }
}
</style>