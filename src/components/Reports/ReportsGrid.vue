<template>
    <a-row :gutter="20">
        <a-col :span="6">
            <router-link to="/reports/overview">
                <a-card hoverable>
                    <img
                            slot="cover"
                            alt="report"
                            src="https://cdn.flipsnack.com/blog/wp-content/uploads/2017/12/09163946/20report.png"
                    />
                    <a-card-meta title="Overview">
                        <template slot="description">
                            18/02/2021
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
                            src="https://cdn.flipsnack.com/blog/wp-content/uploads/2017/12/09163946/20report.png"
                    />
                    <a-card-meta title="Australia">
                        <template slot="description">
                            18/02/2021
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
                            src="https://cdn.flipsnack.com/blog/wp-content/uploads/2017/12/09163946/20report.png"
                    />
                    <a-card-meta title="Europe">
                        <template slot="description">
                            18/02/2021
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
                            src="https://cdn.flipsnack.com/blog/wp-content/uploads/2017/12/09163946/20report.png"
                    />
                    <a-card-meta title="USA">
                        <template slot="description">
                            18/02/2021
                        </template>
                    </a-card-meta>
                </a-card>
            </router-link>
        </a-col>
    </a-row>
</template>

<script>
    export default {
        name: "ReportsGrid"
    }
</script>

<style scoped>

</style>
