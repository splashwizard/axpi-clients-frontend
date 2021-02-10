<template>
    <a-collapse v-model="activeSetupStep" accordion>
        <a-collapse-panel key="1" header="Invite Suppliers">
            <p>{{ text }}</p>
            <router-link to="/suppliers">
                <a-button type="primary">
                    Invite Suppliers
                    <a-icon type="arrow-right"/>
                </a-button>
            </router-link>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="Add Business Details" :disabled="false">
            <p>{{ text }}</p>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="Setup API Keys">
            <p>{{ text }}</p>
        </a-collapse-panel>
        <a-collapse-panel key="4" header="View API Docs">
            <p>{{ text }}</p>
        </a-collapse-panel>
    </a-collapse>
</template>

<script>
    export default {
        name: "SetupProgressAccordion",
        data() {
            return {
                activeSetupStep: 1,
                text: 'Lorem ipsum dolor sit amet'
            }
        }
    }
</script>

<style scoped>

</style>
