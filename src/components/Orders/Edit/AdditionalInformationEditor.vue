<template>
    <div class="axpi-form">
        <!-- Consumables -->
        <div class="form-section">
            <div class="form-header">
                <h2>Consumables</h2>
            </div>
        </div>
        <!-- / Consumables -->

        <!-- Additional Information -->
        <div class="form-section">
            <div class="form-header">
                <h2>Additional Information</h2>
                <a-textarea v-model="orderLocal.additional_information"
                        placeholder="Enter additional information here..." :rows="4"/>
            </div>
        </div>
        <!-- / Additional Information -->

        <!-- Form footer -->
        <div class="form-footer">
            <a-button size="large" @click="goToPreviousStage" class="button-space-right">
                <a-icon type="arrow-left"></a-icon>
                Go Back
            </a-button>

            <a-button size="large" type="primary">
                Save And Quit
            </a-button>
        </div>
        <!-- / Form Footer -->
    </div>
</template>

<script>
    import {mapActions} from "vuex";

    export default {
        name: "AdditionalInformationEditor",
        props: ['orderLocal'],
        data() {
            return {
                updateKey: 1
            }
        },
        methods: {
            ...mapActions('orderEditor', {
                goToPreviousStage: 'goToPreviousStage'
            }),

            incrementUpdateKey() {
                this.updateKey = this.updateKey + 1;
            }
        }
    }
</script>

<style scoped>

</style>
