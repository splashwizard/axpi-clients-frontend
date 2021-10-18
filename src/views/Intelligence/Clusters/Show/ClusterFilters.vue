<template>
  <div style="display: inline;" class="cluster-filters">
    <a-popover placement="bottomRight" trigger="click">
      <template slot="title">
        <div class="filter-title-wrapper">
          <div class="left">
            <a-button size="small" @click.prevent="clear">Clear</a-button>
          </div>
          <div class="center">
            Filters
          </div>
          <div class="right">
            <a-button :disabled="!hasUnsavedChanges" @click="save"
                      type="primary" size="small">Save
            </a-button>
          </div>
        </div>
      </template>
      <template slot="content">
        <div class="filters-inner">

          <!-- Orders graph -->
          <div v-if="activeGraph === 'orders'">
            <!-- Measure -->
            <div class="filter">
              <div class="form-label">Measure</div>
              <a-select v-model="selectedXOptionLocal" style="width: 200px;">
                <a-select-option v-for="(option, i) in xOptions" :value="option" :key="i">
                  {{ formatGraphLabel(option) }}
                </a-select-option>
              </a-select>
            </div>
            <!-- / Measure -->

            <!-- Colour by -->
            <div class="filter filter-last">
              <div class="form-label">Colour By</div>
              <a-select :allow-clear="true" v-model="selectedColourByOptionLocal" style="width: 200px;">
                <a-select-option v-for="(option, i) in colourByOptions" :value="option" :key="i">
                  {{ option['label'] }}
                </a-select-option>
              </a-select>
            </div>
            <!-- / Colour by -->
          </div>
          <!-- / Orders graph -->

          <!-- Demand graph -->
          <div v-if="activeGraph === 'demand'">
            <!-- Bin by -->
            <div class="filter filter-last">
              <div class="form-label">Bin By</div>
              <a-select v-model="selectedBinByOptionLocal" style="width: 200px;">
                <a-select-option v-for="(option, i) in binByOptions" :value="option" :key="i">
                  {{ formatGraphLabel(option) }}
                </a-select-option>
              </a-select>
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
import {mapGetters, mapActions} from "vuex";

export default {
  name: "ClusterFilters",
  data() {
    return {
      binByOptions: ['day', 'month', 'year'],

      selectedXOptionLocal: null,
      selectedColourByOptionLocal: null,

      selectedBinByOptionLocal: null
    }
  },
  created() {
    this.selectedXOptionLocal = this.selectedXOption;
    this.selectedColourByOptionLocal = this.selectedColourByOption;
    this.selectedBinByOptionLocal = this.selectedBinByOption;
  },
  watch: {
    selectedXOption(newVal) {
      this.selectedXOptionLocal = newVal;
    },

    selectedColourByOption(newVal) {
      this.selectedColourByOptionLocal = newVal;
    },

    selectedBinByOption(newVal) {
      this.selectedBinByOptionLocal = newVal;
    }
  },
  computed: {
    ...mapGetters('clusterViewer', {
      activeGraph: 'activeGraph',

      xOptions: 'xOptions',
      selectedXOption: 'selectedXOption',

      colourByOptions: 'colourByOptions',
      selectedColourByOption: 'selectedColourByOption',

      selectedBinByOption: 'selectedBinByOption'
    }),

    xType: {
      get() {
        return this.selectedXOption;
      },
      set(val) {
        this.selectXOption(val);
      }
    },

    colourBy: {
      get() {
        return this.selectedColourByOption;
      },
      set(val) {
        this.selectColourByOption(val);
      }
    },

    binBy: {
      get() {
        return this.selectedBinByOption;
      },
      set(val) {
        this.selectBinByOption(val);
      }
    },

    hasUnsavedChanges() {
      let hasUnsaved = false;
      if (this.selectedXOptionLocal !== this.selectedXOption) {
        hasUnsaved = true;
      }
      if (this.selectedColourByOptionLocal !== this.selectedColourByOption) {
        hasUnsaved = true;
      }
      if (this.selectedBinByOptionLocal !== this.selectedBinByOption) {
        hasUnsaved = true;
      }
      return hasUnsaved;
    }
  },
  methods: {
    ...mapActions('clusterViewer', {
      selectXOption: 'selectXOption',
      selectColourByOption: 'selectColourByOption',
      selectBinByOption: 'selectBinByOption',
      incrementClusterViewerReloadKey: 'incrementClusterViewerReloadKey'
    }),

    clear() {
      this.selectedColourByOptionLocal = null;
      this.selectColourByOption(null);
      this.incrementClusterViewerReloadKey();
    },

    save() {
      this.selectXOption(this.selectedXOptionLocal);
      this.selectColourByOption(this.selectedColourByOptionLocal);
      this.selectBinByOption(this.selectedBinByOptionLocal);
      this.incrementClusterViewerReloadKey();
    },

    formatGraphLabel(label) {
      return label.charAt(0).toUpperCase() + label.substring(1);
    }
  }
}
</script>

<style scoped lang="scss">
.filter-title-wrapper {
  display: flex;
  padding: 4px;

  .left {
    flex-shrink: 1;
    width: 48px;
    text-align: left;
  }

  .right {
    flex-shrink: 1;
    width: 48px;
    text-align: right;
  }

  .center {
    flex-grow: 1;
    text-align: center;
  }
}

.filters-inner {
  min-width: 200px;

  .form-label {
    margin-bottom: 5px;
  }

  .filter {
    margin-bottom: 20px;
  }

  .filter-last {
    margin-bottom: 5px !important;
  }
}
</style>