<template>
    <div class="axpi-form width-large">

        <!-- Basic Details -->
        <div class="form-section">
            <div class="form-header">
                <h2>Basic Details</h2>
            </div>
            <t-shirt-details v-if="orderLocal.product_subtype === 't-shirt'"
                             :order-local="orderLocal"></t-shirt-details>

            <hoodie-details v-if="orderLocal.product_subtype === 'hoodie'"
                            :order-local="orderLocal"></hoodie-details>

            <sweater-details v-if="orderLocal.product_subtype === 'sweater'"
                             :order-local="orderLocal"></sweater-details>
        </div>
        <!-- / Basic Details -->
    </div>
</template>

<script>
    import HoodieDetails from "./ApparelSpecificationEditor/HoodieDetails";
    import SweaterDetails from "./ApparelSpecificationEditor/SweaterDetails";
    import TShirtDetails from "./ApparelSpecificationEditor/TShirtDetails";

    export default {
        name: "ApparelSpecificationEditor",
        components: {HoodieDetails, SweaterDetails, TShirtDetails},
        props: ['orderLocal']
    }
</script>

<style scoped>

</style>
