<template>
  <div class="approved-badge">
    <img src="/img/leaf.jpg" class="leaf" width="15" alt="Leaf" />
    <span><a-tag color="green">Approved</a-tag></span>
  </div>
</template>

<script>
export default {
  name: "ApprovedBadge",
};
</script>

<style scoped lang="scss">
.approved-badge {
  align-items: center;
  display: inline;

  .leaf {
    margin-right: 10px;
  }

  span {
    font-weight: normal;
    //font-size: 16px;
  }
}
</style>
