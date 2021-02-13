<template>
    <div class="axpi-form">
        This is the formmmm

        <!-- Form footer -->
        <div class="form-footer">
            <a-button size="large" @click="goToPreviousStage" class="button-space-right">
                <a-icon type="arrow-left"></a-icon>
                Go Back
            </a-button>

            <a-button size="large" type="primary" @click="goToNextStage">
                Continue
                <a-icon type="arrow-right"></a-icon>
            </a-button>
        </div>
        <!-- / Form Footer -->
    </div>
</template>

<script>
    import {mapActions} from "vuex";

    export default {
        name: "SpecificationInformationEditor",
        props: ['orderLocal'],
        methods: {
            ...mapActions('orderEditor', {
                goToNextStage: 'goToNextStage',
                goToPreviousStage: 'goToPreviousStage'
            })
        }
    }
</script>

<style scoped>

</style>
