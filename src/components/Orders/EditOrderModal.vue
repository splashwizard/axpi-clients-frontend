<template>
    <a-modal v-model="visible"
             class="fullscreen-modal"
             :centered="true"
             title="Update Order"
             :after-close="handleModalClosed"
             :footer="null">

        <!-- Loading  -->
        <a-skeleton v-if="isLoading" active/>
        <!-- / Loading  -->

        <!-- Loaded -->
        <div v-if="!isLoading && order">
            <div class="progress-bar">
                <progress-bar></progress-bar>
            </div>

            <!-- Small form -->
            <div class="axpi-form width-medium">
                <general-information-editor v-if="wizardStage === 0"></general-information-editor>
            </div>
            <!-- / Small form -->
        </div>
        <!-- / Loaded -->

    </a-modal>
</template>

<script>
    import {mapGetters, mapActions} from "vuex";
    import ProgressBar from "./Edit/ProgressBar";
    import GeneralInformationEditor from "./Edit/GeneralInformationEditor";

    export default {
        name: "EditOrderModal",
        data() {
            return {
                visible: true
            }
        },
        components: {ProgressBar, GeneralInformationEditor},
        computed: {
            ...mapGetters('orderEditor', {
                order: 'order',
                isLoading: 'isLoading',
                wizardStage: 'wizardStage'
            })
        },
        methods: {
            ...mapActions('orderEditor', {
                cancelOrderEdit: 'cancelOrderEdit'
            }),

            handleModalClosed() {
                this.cancelOrderEdit();
            }
        }
    }
</script>

<style scoped lang="scss">
    .progress-bar {
        margin-bottom: 40px;
    }
</style>
