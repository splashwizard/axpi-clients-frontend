<template>
  <div class="search-card">
    <div class="item-container">
      <a-badge :count="index" :number-style="badgeStyle" />
      <div class="imgWrapper">
        <img :src="item.imgsrc" />
      </div>
      <h4 v-html="item.title"></h4>
      <div class="action-wrapper">
        <div class="badge" v-if="pinnedItems.find((pinnedItem) => pinnedItem.id === item.id)">
          <a-icon type="pushpin" :style="{ fontSize: '12px' }" /> Pinned
        </div>
        <a-button class="btn-non-border" @click="handlePin"
          ><a-icon :type="item.pinned ? 'shopping' : 'pushpin'" :style="{ fontSize: '12px' }"
        /></a-button>
        <a-button class="btn-non-border" @click="handleHide"
          ><a-icon type="eye-invisible" :style="{ fontSize: '12px' }"
        /></a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "QueryCondition",
  props: ["pinnedItems", "item", "index", "handlePin", "handleHide"],
  data() {
    return {
      badgeStyle: {
        backgroundColor: "rgb(242, 243, 255)",
        color: "rgb(43, 60, 187)",
        marginTop: "-3px",
        marginLeft: "4px",
        boxShadow: "0 0 0 1px #d9d9d9 inset",
      },
    };
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.btn-non-border {
  border-width: 0;
  box-shadow: none;
}

.search-card {
  box-shadow: 0 0 0 1px rgb(35 38 59 / 5%), 0 1px 3px 0 rgb(35 38 59 / 15%);
  margin-bottom: 16px;
  padding: 6px 12px;
}

.item-container {
  display: flex;
  align-items: center;
  position: relative;

  .action-wrapper {
    position: absolute;
    top: 5px;
    right: 0;
  }
}

.imgWrapper {
  margin-left: 24px;
  margin-right: 8px;
  width: 48px;
  height: 48px;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
