<template>
  <a-popover slot="actions"
             placement="topRight"
             trigger="click">
    <template slot="title">
      <div class="filter-title-wrapper">
        <div class="center">
          Are you sure you want to delete?
        </div>
      </div>
    </template>
    <template slot="content">
      <div class="popover-inner popconfirm">
        <a-button type="" size="small" style="margin-right: 10px;">Cancel</a-button>
        <a-button type="danger" size="small">Delete</a-button>
      </div>
    </template>
    <a href="#" class="text-danger">Delete</a>
  </a-popover>
</template>

<script>
export default {
name: "DocumentListItem"
}
</script>

<style scoped>

</style>