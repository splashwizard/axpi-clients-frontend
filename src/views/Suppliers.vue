<template>
  <div class="home">
    <div class="page-header">
      <h1 class="page-title">Suppliers</h1>
      <div class="actions">
        <invite-suppliers-button-and-modal></invite-suppliers-button-and-modal>
      </div>
    </div>

    <a-tabs v-model="tabPane">
      <a-tab-pane key="active" tab="Active">
        <suppliers-table></suppliers-table>
      </a-tab-pane>
      <a-tab-pane key="invited" tab="Invited">
        <invited-suppliers-table></invited-suppliers-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SuppliersTable from "../components/Suppliers/SuppliersTable";
import InviteSuppliersButtonAndModal from "../components/Suppliers/InviteSuppliersButtonAndModal";
import InvitedSuppliersTable from "../components/Suppliers/InvitedSuppliersTable";

export default {
  name: "Suppliers",
  computed: {
    ...mapGetters("auth", {
      user: "user",
    }),
  },
  components: { InviteSuppliersButtonAndModal, SuppliersTable, InvitedSuppliersTable },
  data() {
    return {
      tabPane: "active",
    };
  },
};
</script>
