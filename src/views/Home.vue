<template>
    <div class="home">
        <!--    <img src="/img/placeholder.png" alt="Placeholder" style="width: 100%;">-->
        <h1 class="page-title">Get started with Axiom, {{ user.name }}</h1>
        <template>
            <a-page-header
                    title="Title"
                    sub-title="This is a subtitle"
                    @back="() => null"
            />
        </template>

    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'Home',
        computed: {
            ...mapGetters('auth', {
                user: 'user'
            })
        }
    }
</script>
