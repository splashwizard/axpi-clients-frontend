<template>
  <div class="filter-wrapper">
    <span class="filter">
      <span class="stl-truncate stl-flex-1">{{ item.name }}: {{ item.keyword }}</span>
      <button class="tag-close-button" @click="closeTag">
        <a-icon type="close" />
      </button>
    </span>
  </div>
</template>

<script>
export default {
  name: "Filter",
  props: ["item", "closeTag"],
};
</script>

<style scoped lang="scss">
.filter-wrapper {
  padding-right: 8px;
  padding-bottom: 8px;
  display: inline-block;
}

.filter {
  align-items: center;
  color: rgb(43, 60, 187);
  background-color: rgb(242, 243, 255);
  border: 1px solid rgb(202, 207, 255);
  border-radius: 3px;
  display: inline-flex;
  font-size: 0.875rem;
  height: 1.5rem;
  line-height: 1rem;
  overflow: hidden;
  padding: 0 0.5rem;
}

.stl-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stl-flex-1 {
  flex: 1 1 0%;
}

.tag-close-button {
  border-width: 0;
  border-left: 1px solid transparent;
  border-color: rgb(202, 207, 255);
  height: 100%;
  margin-left: 0.5rem;
  margin-right: -0.5rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  outline-width: 0;
  background: transparent;
  font-size: 14px;
}

.tag-close-button:focus {
  outline-width: 0;
}

.tag-close-button:hover {
  background-color: rgb(202, 207, 255);
  cursor: pointer;
}
</style>
