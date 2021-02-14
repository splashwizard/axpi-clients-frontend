<template>
    <div>
        <!-- Cardboard Used -->
        <div class="form-section">
            <div class="form-header">
                <h2>Cardboard Used</h2>
            </div>
            <cardboard-used-editor :order-local="orderLocal"></cardboard-used-editor>
        </div>
        <!-- / Cardboard Used -->

        <!-- Product Details -->
        <div class="form-section">
            <div class="form-header">
                <h2>Product Details</h2>
            </div>
            <product-details :order-local="orderLocal"></product-details>
        </div>
        <!-- / Product Details -->
    </div>
</template>

<script>
    import CardboardUsedEditor from "./PosSpecificationEditor/CardboardUsedEditor";
    import ProductDetails from "./PosSpecificationEditor/ProductDetails";
    export default {
        name: "PosSpecificationEditor",
        components: {CardboardUsedEditor, ProductDetails},
        props: ['orderLocal']
    }
</script>

<style scoped>

</style>
