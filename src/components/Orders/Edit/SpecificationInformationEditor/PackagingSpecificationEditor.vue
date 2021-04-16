<template>
  <div>
    <!-- Boxes -->
    <boxes-specification-editor v-if="orderLocal.product_subtype === 'boxes'"></boxes-specification-editor>
    <!-- / Boxes -->
  </div>
</template>

<script>
import BoxesSpecificationEditor from "./PackagingSpecificationEditor/BoxesSpecificationEditor";

export default {
  name: "PackagingSpecificationEditor",
  props: ['orderLocal'],
  components: {BoxesSpecificationEditor}
}
</script>

<style scoped>

</style>
