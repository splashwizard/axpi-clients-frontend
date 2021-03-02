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

            <!-- Binding -->
            <div class="form-section">
                <div class="form-header">
                    <h2>Binding</h2>
                </div>
                <binding-details :order-local="orderLocal"></binding-details>
            </div>
            <!-- / Binding -->

            <!-- Additional Info -->
            <div class="form-section">
                <div class="form-header">
                    <h2>Additional Info</h2>
                </div>
                <additional-info :order-local="orderLocal"></additional-info>
            </div>
        </div>
    </div>
</template>

<script>
    import PaperDetails from "./PrintSpecificationEditor/PaperDetails";
    import BindingDetails from "./PrintSpecificationEditor/BindingDetails";
    import AdditionalInfo from "./PrintSpecificationEditor/AdditionalInfo";
    export default {
        name: "PrintSpecificationEditor",
        components: {PaperDetails, BindingDetails, AdditionalInfo},
        props: ['orderLocal']
    }
</script>

<style scoped>

</style>
