<template>
    <a-row :gutter="50">
        <a-col :span="12">
            <a-form layout="vertical">
                <a-form-item label="Product Name">
                    <a-input size="large" :value="order.product_name" placeholder="Product Name"/>
                </a-form-item>
                <a-form-item label="Product Description">
                    <a-input size="large" :value="order.product_description" placeholder="Product Name"/>
                </a-form-item>
                <a-form-item label="Reference Number">
                    <a-input size="large" :value="order.reference_number" placeholder="Reference Number"/>
                </a-form-item>
            </a-form>
        </a-col>
        <a-col :span="12">
            <product-images-uploader></product-images-uploader>
        </a-col>
    </a-row>
</template>

<script>
    import ProductImagesUploader from "./ProductInformation/ProductImagesUploader";

    export default {
        name: "ProductInformation",
        props: ['order'],
        components: {ProductImagesUploader}
    }
</script>

<style scoped lang="scss">
</style>
