<template>
  <div>
    <div v-if="isLoading" style="text-align: center">
      <a-spin></a-spin>
    </div>
    <!-- Table -->
    <a-table
      v-if="!isLoading"
      class="axpi-table small-th column-dividers"
      :scroll="{ x: 'max-content' }"
      :columns="columns"
      :data-source="tableData"
      :loading="isLoading"
    >
      <div slot="name" slot-scope="name, record">
        <div class="product-name-wrapper">
          <div class="left">
            <a target="_blank" :href="record['URL'] ? record['URL'] : '#'">
              <a-avatar style="margin-right: 20px" size="large" :src="getImageSrc(record)" />
            </a>
          </div>
          <div class="right">
            <a target="_blank" :href="getProductLink(record)">
              {{ name }}
            </a>
          </div>
        </div>
      </div>
      <div v-for="(p, i) in uniqueProperties" :slot="p" :key="i" slot-scope="property">
        <span v-html="property"></span>
      </div>
    </a-table>
    <!-- Table -->
  </div>
</template>

<script>
const _ = require("lodash");
import { mapGetters } from "vuex";
import axios from "axios";
import Units from "../../../../../mixins/Units";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

export default {
  name: "AllProductDetailsTable",
  mixins: [Units],
  data() {
    return {
      enriched: [],
      isLoading: false,
    };
  },
  created() {
    this.enrich();
  },
  computed: {
    ...mapGetters("clusterViewer", {
      ordersWithMatchesFiltered: "ordersWithMatchesFiltered",
      selectedOrders: "selectedOrders",
      startDate: "startDate",
      endDate: "endDate",
    }),

    start_date: {
      get() {
        return this.startDate;
      },
      set(val) {
        this.setStartDate(val);
      },
    },

    end_date: {
      get() {
        return this.endDate;
      },
      set(val) {
        this.setEndDate(val);
      },
    },

    datesFromTableData() {
      return _.map(this.tableData, "order_date_moment");
    },

    earliestDate() {
      return moment.min(this.datesFromTableData);
    },

    latestDate() {
      return moment.max(this.datesFromTableData);
    },

    tableDateRange() {
      let start_date = this.start_date;
      let end_date = this.end_date;

      if (!start_date) {
        start_date = this.earliestDate;
      }
      if (!end_date) {
        end_date = this.latestDate;
      }

      return moment.range(start_date, end_date);
    },

    uniqueProperties() {
      let properties = [];
      _.each(Object.values(this.enriched), (ps) => {
        properties.push(_.map(ps, "propertyName"));
        properties = _.flatten(properties);
      });
      return _.uniq(properties);
    },

    columns() {
      return [
        {
          title: "Name",
          dataIndex: "product_name",
          scopedSlots: { customRender: "name" },
          sorter: true,
          width: 350,
          fixed: "left",
        },
        ..._.map(this.uniqueProperties, (p) => ({
          title: p,
          dataIndex: p,
          sorter: true,
          width: 200,
          scopedSlots: { customRender: p },
        })),
        {
          title: "",
        },
      ];
    },

    dataToShow() {
      let dataToShow = [];

      if (this.selectedOrders.length) {
        let ids = _.map(this.selectedOrders, "_id");
        dataToShow = _.filter(this.ordersWithMatchesFiltered, (d) => {
          return ids.includes(d["_id"]);
        });
      } else {
        dataToShow = this.ordersWithMatchesFiltered;
      }

      return _.filter(dataToShow, (d) => {
        // Order date
        let orderDate = null;
        let orderDateMoment = null;
        if (
          d["PO Initial Create Date"] &&
          d["PO Initial Create Date"]["$date"] &&
          d["PO Initial Create Date"]["$date"]["$numberLong"]
        ) {
          orderDateMoment = moment.unix(Number(d["PO Initial Create Date"]["$date"]["$numberLong"]) / 1000);
          orderDate = orderDateMoment.format("DD/MM/YYYY");
        }
        d.order_date = orderDate;
        d.order_date_moment = orderDateMoment;

        if (d.order_date_moment && moment(d.order_date_moment).isValid() && this.startDate) {
          if (d.order_date_moment.isBefore(this.startDate)) {
            return false;
          }
        }
        if (d.order_date_moment && moment(d.order_date_moment).isValid() && this.endDate) {
          if (d.order_date_moment.isAfter(this.endDate)) {
            return false;
          }
        }
        return true;
      });
    },

    tableData() {
      let td = [];
      _.each(this.dataToShow, (o) => {
        if (o.product_name) {
          let productRow = {
            product_id: o.product_id,
            product_name: o.product_name,
            imageURLs: this.getFirstProduct(o)["imageURLs"],
            URL: this.getFirstProduct(o)["URL"],
          };
          _.each(this.uniqueProperties, (p) => {
            let property = _.find(o.product_all_properties, {
              propertyName: p,
            });
            if (property) {
              if (property.variableType && property.variableType === "categorical") {
                productRow[p] = property.propertyValue;
              } else {
                let magnitudeFormatted = property.propertyValue;
                if (magnitudeFormatted < 1 && magnitudeFormatted !== 0) {
                  let exp = Number.parseFloat(magnitudeFormatted).toExponential(3);
                  let split = exp.split("e");
                  magnitudeFormatted = split[0] + " x 10" + "<sup>" + split[1] + "</sup>";
                }

                let propertyUnitFormatted = this.formatUnit(property.propertyUnit);
                productRow[p] = magnitudeFormatted + " " + propertyUnitFormatted;
              }
            } else {
              productRow[p] = "";
            }
          });
          td.push(productRow);
        }
      });
      return _.uniqBy(td, "product_id");
      // return td;
    },
  },
  methods: {
    getImageSrc(product) {
      if (product["imageURLs"] && product["imageURLs"].length) {
        return product["imageURLs"][0];
      }
    },

    getProductLink(row) {
      return "/products/" + row["product_id"];
    },

    getFirstProduct(record) {
      return record["products"][0];
    },

    enrich() {
      let vm = this;
      vm.isLoading = true;
      axios
        .post(window.API_BASE + "/products/enrich-many", {
          ids: _.map(this.ordersWithMatchesFiltered, "product_id"),
        })
        .then((r) => {
          vm.isLoading = false;
          vm.enriched = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.$message.error("Error getting order properties");
        });
    },
  },
};
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
