<template>
    <div class="reports-grid">
        <a-row :gutter="20">
          <a-col :span="6">
            <router-link to="/reports/roche">
              <a-card hoverable>
                <img
                    slot="cover"
                    alt="report"
                    src="/img/reports/overview.png"
                />
                <a-card-meta title="Roche POC Report">
                  <template slot="description">
                    05/07/2021
                  </template>
                </a-card-meta>
              </a-card>
            </router-link>
          </a-col>
            <a-col :span="6">
                <router-link to="/reports/overview">
                    <a-card hoverable>
                        <img
                                slot="cover"
                                alt="report"
                                src="/img/reports/overview.png"
                        />
                        <a-card-meta title="Overview">
                            <template slot="description">
                                15/02/2021
                            </template>
                        </a-card-meta>
                    </a-card>
                </router-link>
            </a-col>
            <a-col :span="6">
                <router-link to="/reports/australia">
                    <a-card hoverable>
                        <img
                                slot="cover"
                                alt="report"
                                src="/img/reports/australia.png"
                        />
                        <a-card-meta title="Australia">
                            <template slot="description">
                                15/02/2021
                            </template>
                        </a-card-meta>
                    </a-card>
                </router-link>
            </a-col>
            <a-col :span="6">
                <router-link to="/reports/europe">
                    <a-card hoverable>
                        <img
                                slot="cover"
                                alt="report"
                                src="/img/reports/europe.png"
                        />
                        <a-card-meta title="Europe">
                            <template slot="description">
                                15/02/2021
                            </template>
                        </a-card-meta>
                    </a-card>
                </router-link>
            </a-col>
            <a-col :span="6">
                <router-link to="/reports/usa">
                    <a-card hoverable>
                        <img
                                slot="cover"
                                alt="report"
                                src="/img/reports/usa.png"
                        />
                        <a-card-meta title="USA">
                            <template slot="description">
                                15/02/2021
                            </template>
                        </a-card-meta>
                    </a-card>
                </router-link>
            </a-col>
        </a-row>
        <a-row :gutter="20">
            <a-col :span="6">
                <router-link to="/reports/summary">
                    <a-card hoverable>
                        <img
                                slot="cover"
                                alt="report"
                                src="/img/reports/summary.png"
                        />
                        <a-card-meta title="Summary">
                            <template slot="description">
                                15/02/2021
                            </template>
                        </a-card-meta>
                    </a-card>
                </router-link>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    export default {
        name: "ReportsGrid"
    }
</script>

<style lang="scss">
    .reports-grid {
       .ant-row {
           margin-bottom: 20px;
       }

        .ant-card-cover {
            background-color: #DDEAFB;
        }
    }
</style>
