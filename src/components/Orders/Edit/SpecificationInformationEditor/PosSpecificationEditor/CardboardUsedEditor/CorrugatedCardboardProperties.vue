<template>
    <div>
        <number-of-walls-selector :cardboard="cardboard" @property-updated="handlePropertyUpdated"></number-of-walls-selector>
    </div>
</template>

<script>
    import NumberOfWallsSelector from "./CorrugatedCardboardProperties/NumberOfWallsSelector";
    export default {
        name: "CorrugatedCardboardProperties",
        props: ['cardboard'],
        components: {NumberOfWallsSelector},
        methods: {
            handlePropertyUpdated() {
                this.$emit('property-updated');
            }
        }
    }
</script>

<style scoped>

</style>
