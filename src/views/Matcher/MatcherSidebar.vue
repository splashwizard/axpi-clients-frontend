<template>
  <div class="sidebar-wrapper">
    <!-- Top -->
    <div class="top">
      <!-- Header -->
      <a-page-header :title="selectedErpOrder['product_name']" @back="clear"></a-page-header>
      <!-- / Header -->

      <!-- ERP order details -->
      <a-collapse v-model="showErpOrderDetails" style="margin-bottom: 20px">
        <a-collapse-panel key="more-details" header="View More Details">
          <a-row>
            <a-col :span="12">
              <p>
                <b>Manufacturer: </b><br />{{
                  selectedErpOrder["manufacturer"] ? selectedErpOrder["manufacturer"]["name"] : "-"
                }}
              </p>
              <p>
                <b>Vendor: </b><br />{{ selectedErpOrder["supplier"] ? selectedErpOrder["supplier"]["name"] : "-" }}
              </p>
              <p>
                <!--                <b>Cost: </b><br>${{ selectedErpOrder['Cost'] }}-->
                <b>Cost: </b><br />{{ formatCostInPence({ cost_currency: "USD", cost: selectedErpOrder["cost"] }) }}
              </p>
            </a-col>
            <a-col :span="12">
              <p>
                <b>Manufacturer Part Number: </b><br />{{
                  selectedErpOrder["properties"]["manufacturer_part_number"]
                    ? selectedErpOrder["properties"]["manufacturer_part_number"]
                    : "-"
                }}
              </p>
              <p>
                <b>Vendor Product ID: </b><br />{{
                  selectedErpOrder["properties"]["vendor_product_id"]
                    ? selectedErpOrder["properties"]["vendor_product_id"]
                    : "-"
                }}
              </p>
              <p>
                <b>PO Number: </b><br />{{
                  selectedErpOrder["reference_number"] ? selectedErpOrder["reference_number"] : "-"
                }}
              </p>
            </a-col>
          </a-row>
        </a-collapse-panel>
      </a-collapse>
      <!-- / ERP order details -->

      <!-- Match -->
      <a-tabs v-model="currentTab">
        <a-tab-pane key="suggested" tab="Suggested Matches">
          <suggested-matches></suggested-matches>
        </a-tab-pane>
        <a-tab-pane key="manual" tab="Manual Matches">
          <search-products :key="sidebarReloadKey"></search-products>
        </a-tab-pane>
      </a-tabs>
      <!-- / Match -->
    </div>
    <!-- / Top -->

    <!-- Bottom -->
    <div class="bottom">
      <div>
        <span> {{ selectedMatches.length }} {{ selectedMatches.length === 1 ? "match" : "matches" }} selected </span>
        <a-button @click.prevent="clear" style="margin-right: 10px" type="default">Cancel</a-button>
        <a-button @click.prevent="saveMatches" type="primary">Save</a-button>
      </div>
    </div>
    <!-- / Bottom -->
  </div>
</template>

<script>
import SuggestedMatches from "./MatcherSidebar/SuggestedMatches";
import SearchProducts from "./MatcherSidebar/SearchProducts";
import Orders from "../../mixins/Orders";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "MatcherSidebar",
  mixins: [Orders],
  components: { SuggestedMatches, SearchProducts },
  computed: {
    ...mapGetters("matcher", {
      selectedErpOrder: "selectedErpOrder",
      selectedMatches: "selectedMatches",
      sidebarReloadKey: "sidebarReloadKey",
    }),

    hasMatches() {
      return this.selectedMatches.length > 0;
    },
  },
  methods: {
    clear() {
      this.selectErpOrder(null);
    },

    ...mapActions("matcher", {
      selectErpOrder: "selectErpOrder",
      saveMatches: "saveMatches",
    }),
  },
  data() {
    return {
      currentTab: "suggested",
      showErpOrderDetails: false,
    };
  },
  watch: {
    sidebarReloadKey() {
      this.currentTab = "suggested";
    },
  },
};
</script>

<style scoped lang="scss">
.sidebar-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;

  .top {
    flex: 1;
    padding: 5px 20px;
    overflow-y: scroll;
  }

  .bottom {
    flex-shrink: 1;
    background: #fff;
    padding: 15px 20px;
    border-top: 1px solid #e3e8ee;
    text-align: right;

    div {
      float: right;

      span {
        margin-right: 20px;
      }
    }
  }
}
</style>
