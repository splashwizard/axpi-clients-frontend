<template>
  <div :class="hoverable ? 'cond-wrapper' : ''" @mouseover="onMouseOver" @mouseleave="hovered = false">
    <div class="query-wrapper">
      <div class="label-wrapper">
        <h4 class="label">{{ index === 0 ? "Query" : "or query" }} {{ condition.query.option }}</h4>
        <div class="badge">
          {{ condition.query.keyword }}
        </div>
      </div>
    </div>
    <div class="query-wrapper" v-for="(filter, fi) in condition.filters" :key="fi" :style="{ marginTop: '6px' }">
      <div class="label-wrapper">
        <h4 class="label">
          {{ fi === 0 ? "with filter" : "and filter" }}
        </h4>
        <div class="badge">{{ filter.name }} is {{ filter.keyword }}</div>
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
export default {
  name: "QueryCondition",
  props: ["hoverable", "condition", "editCondition", "deleteCondition", "index"],
  data() {
    return {
      hovered: false,
    };
  },
  methods: {
    onMouseOver() {
      if (this.hoverable) this.hovered = true;
    },
    onEdit() {
      this.editCondition(this.index);
    },
    onDelete() {
      this.deleteCondition(this.index);
    },
  },
};
</script>

<style scoped lang="scss">
.cond-wrapper {
  padding: 8px 16px;
  position: relative;
}

.cond-wrapper:hover {
  background-color: rgba(245, 245, 250);
}

.query-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label-wrapper {
  display: flex;
  flex-wrap: wrap;

  .badge {
    margin-bottom: 6px;
  }
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
  background-color: rgba(245, 245, 250);
}

.query-wrapper h4 {
  font-weight: normal;
  margin: 0;
}
</style>
