<template functional>
  <a-sub-menu :key="props.menuInfo.key" :title="props.menuInfo.name" class="sub-item">
    <template v-for="(item, index) in props.menuInfo.children">
      <a-menu-item v-if="!item.children" class="dropdown-item" :key="index">
        {{ item.name }}
      </a-menu-item>
      <sub-menu v-else :key="index" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  name: "subMenu",
  props: ["menuInfo"],
};
</script>

<style>
.dropdown-item {
  font-size: 16px;
  min-width: 200px;
  padding-right: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.sub-item {
  min-width: 200px;
  padding-right: 8px;
}

.ant-dropdown-menu-submenu-popup ul {
  box-shadow: none;
  margin: 0 !important;
}
</style>
