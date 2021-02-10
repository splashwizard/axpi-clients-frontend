<template>
    <div class="home">

        <div class="page-header">
            <h1 class="page-title">Suppliers</h1>
            <div class="actions">
                <router-link to="/suppliers/invite">
                    <a-button type="primary" icon="plus">Invite Supplier</a-button>
                </router-link>
            </div>
        </div>

        <suppliers-table></suppliers-table>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import SuppliersTable from "../components/Suppliers/SuppliersTable";

    export default {
        name: 'Suppliers',
        computed: {
            ...mapGetters('auth', {
                user: 'user'
            })
        },
        components: {SuppliersTable},
        data() {
            return {
                activeSetupStep: 1
            }
        }
    }
</script>
