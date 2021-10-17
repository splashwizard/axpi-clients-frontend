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
                type="primary" size="small">Save</a-button>
          </div>
        </div>
      </template>
      <template slot="content">
        <div class="filters-inner">

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
      selectedXOptionLocal: null,
      selectedColourByOptionLocal: null
    }
  },
  created() {
    this.selectedXOptionLocal = this.selectedXOption;
    this.selectedColourByOptionLocal = this.selectedColourByOption;
  },
  watch: {
    selectedXOption(newVal) {
      this.selectedXOptionLocal = newVal;
    }
  },
  computed: {
    ...mapGetters('clusterViewer', {
      xOptions: 'xOptions',
      selectedXOption: 'selectedXOption',

      colourByOptions: 'colourByOptions',
      selectedColourByOption: 'selectedColourByOption'
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

    hasUnsavedChanges() {
      let hasUnsaved = false;
      if (this.selectedXOptionLocal !== this.selectedXOption) {
        hasUnsaved = true;
      }
      if (this.selectedColourByOptionLocal !== this.selectedColourByOption) {
        hasUnsaved = true;
      }
      return hasUnsaved;
    }
  },
  methods: {
    ...mapActions('clusterViewer', {
      selectXOption: 'selectXOption',
      selectColourByOption: 'selectColourByOption',
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