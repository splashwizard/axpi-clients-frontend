<template>
  <div class="reports-grid">
    <a-row :gutter="20">
      <a-col :span="6">
        <router-link to="/reports/roche">
          <a-card hoverable>
            <img slot="cover" alt="report" src="/img/reports/overview.png" />
            <a-card-meta title="Roche POC Report">
              <template slot="description"> 05/07/2021 </template>
            </a-card-meta>
          </a-card>
        </router-link>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "ReportsGrid",
};
</script>

<style lang="scss">
.reports-grid {
  .ant-row {
    margin-bottom: 20px;
  }

  .ant-card-cover {
    background-color: #ddeafb;
  }
}
</style>
