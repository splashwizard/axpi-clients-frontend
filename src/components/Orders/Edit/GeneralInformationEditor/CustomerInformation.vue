<template>
    <a-form layout="vertical">
        <a-form-item label="Name">
            <a-input size="large" :value="client.name" disabled placeholder="Name"/>
        </a-form-item>
        <a-form-item label="Country">
            <a-input size="large" :value="client.country" disabled placeholder="Country"/>
        </a-form-item>
        <a-form-item label="Organisational Unit">
            <a-input size="large" :value="organisationalUnit.name" disabled placeholder="Organisation Unit"/>
        </a-form-item>
    </a-form>
</template>

<script>
    export default {
        name: "CustomerInformation",
        props: ['client', 'organisationalUnit']
    }
</script>

<style scoped lang="scss">
    .logo-wrapper {
        text-align: center;

        img {
            width: 70%;
        }
    }
</style>
