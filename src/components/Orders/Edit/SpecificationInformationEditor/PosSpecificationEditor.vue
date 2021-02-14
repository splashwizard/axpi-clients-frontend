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
    </div>
</template>

<script>
    import CardboardUsedEditor from "./PosSpecificationEditor/CardboardUsedEditor";
    export default {
        name: "PosSpecificationEditor",
        components: {CardboardUsedEditor},
        props: ['orderLocal']
    }
</script>

<style scoped>

</style>
