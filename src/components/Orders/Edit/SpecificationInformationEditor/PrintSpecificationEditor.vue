<template>
    <div>
        <div>
            <!-- Paper -->
            <div class="form-section">
                <div class="form-header">
                    <h2>Paper</h2>
                </div>
                <paper-details :order-local="orderLocal"></paper-details>
            </div>
            <!-- / Paper -->
        </div>
    </div>
</template>

<script>
    import PaperDetails from "./PrintSpecificationEditor/PaperDetails";
    export default {
        name: "PrintSpecificationEditor",
        components: {PaperDetails},
        props: ['orderLocal']
    }
</script>

<style scoped>

</style>
