<template>
  <div style="display: inline" class="cluster-filters">
    <a-popover placement="bottomRight" trigger="click">
      <template slot="title">
        <div class="filter-title-wrapper">
          <div class="left">
            <a-button size="small" @click.prevent="clear">Clear</a-button>
          </div>
          <div class="center">Filters</div>
          <div class="right">
            <a-button :disabled="!hasUnsavedChanges" @click="save" type="primary" size="small">Save </a-button>
          </div>
        </div>
      </template>
      <template slot="content">
        <div class="filters-inner">
          <!-- Common filters -->
          <div>
            <!-- Measure -->
            <div class="filter-wrapper">
              <div class="filter-header">
                <a-checkbox v-model="showSelectedXOptionFilter"> Measure </a-checkbox>
              </div>
              <div class="filter" v-if="showSelectedXOptionFilter">
                <!--                <div class="form-label">Measure</div>-->
                <a-select v-model="selectedXOptionLocal" style="width: 200px">
                  <a-select-option v-for="(option, i) in xOptions" :value="option" :key="i">
                    {{ formatGraphLabel(option) }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <!-- / Measure -->

            <!-- Start date -->
            <div class="filter-wrapper">
              <div class="filter-header">
                <a-checkbox v-model="showStartDateFilter"> Start Date </a-checkbox>
              </div>
              <div class="filter" v-if="showStartDateFilter">
                <a-date-picker style="width: 100%" v-model="startDateLocal" placeholder="Start" />
              </div>
            </div>
            <!-- / Start date -->

            <!-- End date -->
            <div class="filter-wrapper filter-last">
              <div class="filter-header">
                <a-checkbox v-model="showEndDateFilter"> End Date </a-checkbox>
              </div>
              <div class="filter" v-if="showEndDateFilter">
                <a-date-picker style="width: 100%" v-model="endDateLocal" placeholder="End" />
              </div>
            </div>
            <!-- / End date -->
          </div>
          <!-- / Common filters -->

          <!-- Orders graph -->
          <div v-if="activeGraph === 'orders'">
            <!-- Colour by -->
            <div class="filter-wrapper filter-last">
              <div class="filter-header">
                <a-checkbox v-model="showSelectedColourByOptionFilter"> Colour </a-checkbox>
              </div>
              <div class="filter" v-if="showSelectedColourByOptionFilter">
                <a-select v-model="selectedColourByOptionLocal" style="width: 200px">
                  <a-select-option v-for="option in colourByOptions" :value="option.key" :key="option.key">
                    {{ option["label"] }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <!-- / Colour by -->

            <!-- Size by -->
            <div class="filter-wrapper filter-last">
              <div class="filter-header">
                <a-checkbox v-model="showSelectedSizeByOptionFilter"> Size </a-checkbox>
              </div>
              <div class="filter" v-if="showSelectedSizeByOptionFilter">
                <a-select v-model="selectedSizeByOptionLocal" style="width: 200px">
                  <a-select-option v-for="(option, i) in sizeByOptions" :value="option" :key="i">
                    {{ option }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <!-- / Size by -->
          </div>
          <!-- / Orders graph -->

          <!-- Demand graph -->
          <div v-if="activeGraph === 'demand'">
            <!-- Bin by -->
            <div class="filter-wrapper">
              <div class="filter-header">
                <a-checkbox v-model="showSelectedBinByOptionFilter"> Bin </a-checkbox>
              </div>
              <div class="filter" v-if="showSelectedBinByOptionFilter">
                <a-select v-model="selectedBinByOptionLocal" style="width: 200px">
                  <a-select-option v-for="(option, i) in binByOptions" :value="option" :key="i">
                    {{ formatGraphLabel(option) }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <!-- / Bin by -->
          </div>
          <!-- / Demand graph -->
        </div>
      </template>
      <a-button icon="line-chart">Graph</a-button>
    </a-popover>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
const _ = require("lodash");

export default {
  name: "ClusterFilters",
  data() {
    return {
      binByOptions: ["day", "month", "year"],

      showSelectedXOptionFilter: true,
      selectedXOptionLocal: null,

      showSelectedColourByOptionFilter: false,
      selectedColourByOptionLocal: null,

      showSelectedSizeByOptionFilter: false,
      selectedSizeByOptionLocal: null,

      showSelectedBinByOptionFilter: false,
      selectedBinByOptionLocal: null,

      showStartDateFilter: false,
      startDateLocal: null,

      showEndDateFilter: false,
      endDateLocal: null,
    };
  },
  created() {
    this.selectedXOptionLocal = this.selectedXOption;

    this.selectedColourByOptionLocal = this.selectedColourByOption;
    if (this.selectedColourByOptionLocal) {
      this.showSelectedColourByOptionFilter = true;
    }

    this.selectedSizeByOptionLocal = this.selectedSizeByOption;
    if (this.selectedSizeByOptionLocal) {
      this.showSelectedSizeByOptionFilter = true;
    }

    this.selectedBinByOptionLocal = this.selectedBinByOption;
    if (this.selectedBinByOptionLocal) {
      this.showSelectedBinByOptionFilter = true;
    }

    this.startDateLocal = this.startDate;
    if (this.startDateLocal) {
      this.showStartDateFilter = true;
    }

    this.endDateLocal = this.endDate;
    if (this.endDateLocal) {
      this.showEndDateFilter = true;
    }
  },
  watch: {
    selectedXOption(newVal) {
      this.selectedXOptionLocal = newVal;
      if (newVal) {
        this.showSelectedXOptionFilter = true;
      }
    },

    selectedColourByOption(newVal) {
      if (newVal) {
        this.showSelectedColourByOptionFilter = true;
        this.selectedColourByOptionLocal = newVal["key"];
      } else {
        this.selectedColourByOptionLocal = null;
      }
    },

    selectedBinByOption(newVal) {
      this.selectedBinByOptionLocal = newVal;
      if (newVal) {
        this.showSelectedBinByOptionFilter = true;
      }
    },

    startDate(newVal) {
      this.startDateLocal = newVal;
      // if (newVal) {
      //   this.showStartDateFilter = true;
      // }
    },

    endDate(newVal) {
      this.endDateLocal = newVal;
      // if (newVal) {
      //   this.showEndDateFilter = true;
      // }
    },
  },
  computed: {
    ...mapGetters("clusterViewer", {
      activeGraph: "activeGraph",

      xOptions: "xOptions",
      selectedXOption: "selectedXOption",

      colourByOptions: "colourByOptions",
      selectedColourByOption: "selectedColourByOption",

      sizeByOptions: "sizeByOptions",
      selectedSizeByOption: "selectedSizeByOption",

      selectedBinByOption: "selectedBinByOption",

      startDate: "startDate",
      endDate: "endDate",
    }),

    xType: {
      get() {
        return this.selectedXOption;
      },
      set(val) {
        this.selectXOption(val);
      },
    },

    colourBy: {
      get() {
        return this.selectedColourByOption;
      },
      set(val) {
        this.selectColourByOption(val);
      },
    },

    sizeBy: {
      get() {
        return this.selectedSizeByOption;
      },
      set(val) {
        this.selectSizeByOption(val);
      },
    },

    binBy: {
      get() {
        return this.selectedBinByOption;
      },
      set(val) {
        this.selectBinByOption(val);
      },
    },

    hasUnsavedChanges() {
      let hasUnsaved = false;

      if (this.selectedXOptionLocal !== this.selectedXOption) {
        hasUnsaved = true;
      }

      if (!this.showSelectedColourByOptionFilter && this.selectedColourByOption) {
        hasUnsaved = true;
      }
      if (this.selectedColourByOptionLocal !== this.selectedColourByOption) {
        hasUnsaved = true;
      }

      if (!this.showSelectedSizeByOptionFilter && this.selectedSizeByOption) {
        hasUnsaved = true;
      }
      if (this.selectedSizeByOptionLocal !== this.selectedSizeByOption) {
        hasUnsaved = true;
      }

      if (this.showSelectedBinByOptionFilter && this.selectedBinByOption) {
        hasUnsaved = true;
      }
      if (this.selectedBinByOptionLocal !== this.selectedBinByOption) {
        hasUnsaved = true;
      }

      if (this.showStartDateFilter && this.startDate) {
        hasUnsaved = true;
      }
      if (this.startDateLocal !== this.startDate) {
        hasUnsaved = true;
      }

      if (this.showEndDateFilter && this.endDate) {
        hasUnsaved = true;
      }
      if (this.endDateLocal !== this.endDate) {
        hasUnsaved = true;
      }

      return hasUnsaved;
    },
  },
  methods: {
    ...mapActions("clusterViewer", {
      selectXOption: "selectXOption",
      selectColourByOption: "selectColourByOption",
      selectSizeByOption: "selectSizeByOption",
      selectBinByOption: "selectBinByOption",
      setStartDate: "setStartDate",
      setEndDate: "setEndDate",
      incrementClusterViewerReloadKey: "incrementClusterViewerReloadKey",
    }),

    clear() {
      this.showSelectedXOptionFilter = false;
      this.showSelectedColourByOptionFilter = false;
      this.showSelectedSizeByOptionFilter = false;
      this.save();
      this.incrementClusterViewerReloadKey();
    },

    save() {
      if (this.showSelectedXOptionFilter) {
        this.selectXOption(this.selectedXOptionLocal);
      } else {
        this.selectXOption("Quantity");
      }

      if (this.showSelectedColourByOptionFilter) {
        this.selectColourByOption(_.find(this.colourByOptions, { key: this.selectedColourByOptionLocal }));
      } else {
        this.selectColourByOption(null);
      }

      if (this.showSelectedSizeByOptionFilter) {
        this.selectSizeByOption(this.selectedSizeByOptionLocal);
      } else {
        this.selectSizeByOption(null);
      }

      if (this.showSelectedBinByOptionFilter) {
        this.selectBinByOption(this.selectedBinByOptionLocal);
      } else {
        this.selectBinByOption("day");
      }

      if (this.showStartDateFilter) {
        this.setStartDate(this.startDateLocal);
      } else {
        this.setStartDate(null);
      }

      if (this.showEndDateFilter) {
        this.setEndDate(this.endDateLocal);
      } else {
        this.setEndDate(null);
      }

      this.incrementClusterViewerReloadKey();
    },

    formatGraphLabel(label) {
      return label.charAt(0).toUpperCase() + label.substring(1);
    },
  },
};
</script>

<style scoped lang="scss"></style>
