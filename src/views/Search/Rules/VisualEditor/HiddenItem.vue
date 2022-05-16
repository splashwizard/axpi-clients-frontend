<template>
  <div :class="hoverable ? 'cond-wrapper' : ''" @mouseover="onMouseOver" @mouseleave="hovered = false">
    <div class="query-wrapper" :style="{ marginTop: '6px' }">
      <div class="label-wrapper">
        <h4 class="label">Hide</h4>
        <div class="badge max-w-64 pinned-wrapper">
          <div class="previewImage">
            <img :src="item.imgsrc" />
          </div>
          <h4 class="pin-title stl-truncate">
            {{ item.title }}
          </h4>
        </div>
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
  name: "HiddenItem",
  props: ["hoverable", "item", "editItems", "deleteItems"],
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
      this.editItems();
    },
    onDelete() {
      this.deleteItems();
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
  max-width: 100%;
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

.stl-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pinned-wrapper {
  display: flex;
  flex-direction: row;
  position: relative;

  .previewImage {
    width: 16px;
    height: 16px;
    border: 1px solid rgb(182, 183, 213);
    border-radius: 9999px;
    position: absolute;
    left: 6px;
    top: 2px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .pin-title {
    margin-left: 16px;
  }
}

.max-w-64 {
  max-width: 280px;
}
</style>
