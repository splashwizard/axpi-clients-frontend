<template>
  <a-dropdown-button :disabled="requested || isSaving" @click.prevent="requestQuote" :trigger="['click']">
    {{ buttonText }}

    <a-icon slot="icon" type="down" />
    <a-menu slot="overlay">
      <a-menu-item key="1">
        <a-icon type="clock-circle" />
        Create order window
      </a-menu-item>
    </a-menu>
  </a-dropdown-button>
</template>

<script>
export default {
  name: "RequestQuoteButton",
  data() {
    return {
      isSaving: false,
      requested: false,
    };
  },
  computed: {
    buttonText() {
      if (this.isSaving) {
        return "Requesting Quote...";
      }

      if (this.requested) {
        return "Quote Requested";
      }
      return "Request Quote";
    },
  },
  methods: {
    requestQuote() {
      let vm = this;
      vm.isSaving = true;
      window.setTimeout(function () {
        vm.isSaving = false;
        vm.requested = true;
      }, 1000);
    },
  },
};
</script>

<style scoped></style>
