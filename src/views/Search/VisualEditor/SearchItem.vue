<template>
  <div class="search-card">
    <div class="item-container">
      <a-badge
        :count="item.id"
        :number-style="badgeStyle"
      />
      <div class="imgWrapper">
        <img :src="item.imgsrc">
      </div>
      <h4>{{item.title}}</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: "QueryCondition",
  props: ['item'],
  data() {
    return {
      badgeStyle: {
        backgroundColor: 'rgb(242, 243, 255)',
        color: 'rgb(43, 60, 187)',
        marginTop: '-3px',
        marginLeft: '4px',
        boxShadow: '0 0 0 1px #d9d9d9 inset',
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  .search-card {
    box-shadow: 0 0 0 1px rgb(35 38 59 / 5%), 0 1px 3px 0 rgb(35 38 59 / 15%);
    margin-bottom: 16px;
    padding: 6px 12px;
  }

  .item-container {
    display: flex;
    align-items: center;
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