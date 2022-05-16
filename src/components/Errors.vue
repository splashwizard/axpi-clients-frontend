<template>
  <!-- Form Errors -->
  <div class="form-errors-list" v-if="errorList.length > 0">
    <p class="mb-0"><strong>Something went wrong!</strong> Correct the following and try again.</p>
    <ul class="mb-0">
      <li v-for="(error, i) in errorList" :key="i">
        {{ error }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ["errorList"],
};
</script>
<style lang="scss">
.form-errors-list {
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 20px;

  ul {
    margin-bottom: 0 !important;
    padding-bottom: 5px;
  }
}
</style>
