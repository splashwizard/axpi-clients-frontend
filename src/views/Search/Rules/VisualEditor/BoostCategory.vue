<template>
  <div :class="hoverable ? 'cond-wrapper' : ''" @mouseover="onMouseOver" @mouseleave="hovered = false">
    <div class="query-wrapper" v-for="(filter, fi) in category" :key="fi" :style="{ marginTop: '6px' }">
      <div class="label-wrapper">
        <h4 class="label">
          {{ fi === 0 ? "Boost" : "then Boost" }}
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
  name: "BoostCategory",
  props: ["hoverable", "category", "editCategory", "deleteCategory"],
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
      this.editCategory();
    },
    onDelete() {
      this.deleteCategory();
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

.badge {
  padding: 0 8px;
  display: inline-block;
  border-radius: 100px;
  background-color: rgb(245, 245, 250);
  color: rgb(72, 76, 122);
  border: 1px solid rgb(214, 214, 231);
  margin-left: 8px;
}
</style>
