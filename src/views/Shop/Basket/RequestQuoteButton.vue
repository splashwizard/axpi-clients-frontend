<template>
  <a-button :disabled="requested"
            @click.prevent="requestQuote"
            :loading="isSaving">
    {{ buttonText }}
  </a-button>
</template>

<script>
export default {
  name: "RequestQuoteButton",
  data() {
    return {
      isSaving: false,
      requested: false
    }
  },
  computed: {
    buttonText() {
      if (this.requested) {
        return 'Quote Requested';
      }
      return 'Request Quote';
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
    }
  }
}
</script>

<style scoped>

</style>