<template>
  <div class="cond-wrapper" @mouseover="hovered = true" @mouseleave="hovered = false">
    <div class="query-wrapper" v-for="(subFilter, si) in filters" :key="si" :style="{marginTop: '8px'}">
      <div class="label-wrapper">
        <fragment v-for="(filter, fi) in subFilter" :key="fi">
          <h4 class="label" v-if="fi === 0">
            {{si === 0 ? 'Filter' : 'and Filter'}}
          </h4>
          <h4 class="label" v-else :style="{paddingLeft: '8px'}">
            or
          </h4>
          <div class="badge">
            {{filter.name}} is {{filter.keyword}}
          </div>
        </fragment>
      </div>
    </div>
    <div class="tooltip-wrapper" v-if="hovered">
      <div class="tooltip">
        <a-button class="btn-tooltip" icon="edit" @click="onEdit"></a-button>
        <a-button class="btn-tooltip" icon="delete" @click="onDelete"></a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Fragment } from 'vue-fragment'
export default {
  name: "FilterResult",
  components: { Fragment },
  props: ['filters', 'editFilters', 'deleteFilters'],
  data() {
    return {
      hovered: false
    }
  },
  methods: {
    onEdit() {
      this.editFilters();
    },
    onDelete() {
      this.deleteFilters();
    }
  }
}
</script>

<style scoped lang="scss">
  .cond-wrapper {
    padding: 8px 16px;
    position: relative;
  }

  .cond-wrapper:hover {
    background-color: rgba(245,245,250);
  }

  .query-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .label-wrapper {
    display: flex;
  }

  .tooltip-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .tooltip {
    display: flex;
  }

  .btn-tooltip {
    border-width: 0;
    box-shadow: none;
    background-color: rgba(245,245,250);
  }

  .query-wrapper h4 {
    font-weight: normal;
    margin: 0;
  }

  .badge {
    padding: 0 8px;
    display: inline-block;
    border-radius: 100px;
    background-color: rgb(245,245,250);
    color: rgb(72,76,122);
    border: 1px solid rgb(214,214,231);
    margin-left: 8px;
  }
</style>