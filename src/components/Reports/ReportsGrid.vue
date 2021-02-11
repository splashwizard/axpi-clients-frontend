<template>
    <a-row>
        <a-col :span="6">
            <router-link to="/reports/1">
                <a-card hoverable>
                    <img
                            slot="cover"
                            alt="report"
                            src="https://cdn.flipsnack.com/blog/wp-content/uploads/2017/12/09163946/20report.png"
                    />
                    <a-card-meta title="Report name">
                        <template slot="description">
                            Report description
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
