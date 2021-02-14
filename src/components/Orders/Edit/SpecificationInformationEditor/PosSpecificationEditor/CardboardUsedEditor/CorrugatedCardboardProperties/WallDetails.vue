<template>
    <a-descriptions bordered>
        <a-descriptions-item :label="liningLabel" :span="3">
            Cloud Database
        </a-descriptions-item>
        <a-descriptions-item :label="flutingLabel" v-if="!isLastWall">
            Cloud Database
        </a-descriptions-item>
    </a-descriptions>
</template>

<script>
    export default {
        name: "WallDetails",
        props: ['wall', 'cardboard', 'isLastWall'],
        computed: {
            liningLabel() {
                return 'Lining ' + this.wall;
            },

            flutingLabel() {
               return 'Fluting '  + this.wall;
            }
        }
    }
</script>

<style scoped>

</style>
