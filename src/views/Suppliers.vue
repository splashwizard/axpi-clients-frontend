<template>
    <div class="home">

        <div class="page-header">
            <h1 class="page-title">Suppliers</h1>
            <div class="actions">
              <invite-suppliers-button-and-modal></invite-suppliers-button-and-modal>
            </div>
        </div>

        <suppliers-table></suppliers-table>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import SuppliersTable from "../components/Suppliers/SuppliersTable";
    import InviteSuppliersButtonAndModal from "../components/Suppliers/InviteSuppliersButtonAndModal";

    export default {
        name: 'Suppliers',
        computed: {
            ...mapGetters('auth', {
                user: 'user'
            })
        },
        components: {InviteSuppliersButtonAndModal, SuppliersTable},
        data() {
            return {
                activeSetupStep: 1
            }
        }
    }
</script>
