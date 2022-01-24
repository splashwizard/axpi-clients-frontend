<template>
  <a-layout>
    <left-sidebar></left-sidebar>
    <a-layout style="padding: 7px 30px">
      <h1 class="page-title">Analytics</h1>
    </a-layout>
  </a-layout>
</template>

<script>
import LeftSidebar from "./LeftSidebar";

export default {
  name: "Landing",
  components: {LeftSidebar}
}
</script>

<style scoped>

</style>