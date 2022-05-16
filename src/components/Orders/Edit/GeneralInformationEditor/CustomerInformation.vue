<template>
  <a-form layout="vertical">
    <!--        <a-form-item label="Name">-->
    <!--            <a-input size="large" :value="client.name" disabled placeholder="Name"/>-->
    <!--        </a-form-item>-->
    <!--        <a-form-item label="Country">-->
    <!--            <a-input size="large" :value="client.country" disabled placeholder="Country"/>-->
    <!--        </a-form-item>-->
    <!--        <a-form-item label="Organisational Unit">-->
    <!--            <a-input size="large" :value="organisationalUnit.name" disabled placeholder="Organisation Unit"/>-->
    <!--        </a-form-item>-->
    <validated-form-item label="Name" id="customer-information-name">
      <a-input size="large" :value="clientName" disabled placeholder="Name" />
    </validated-form-item>
    <!--      <a-form-item label="Country">-->
    <!--        <a-input size="large" :value="orderLocal.country" disabled placeholder="Country"/>-->
    <!--      </a-form-item>-->
    <!--      <a-form-item label="Organisational Unit">-->
    <!--        <a-input size="large" :value="orderLocal.organisation_unit" disabled placeholder="Organisation Unit"/>-->
    <!--      </a-form-item>-->
  </a-form>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CustomerInformation",
  props: ["client", "organisationalUnit", "orderLocal"],
  computed: {
    ...mapGetters("auth", {
      user: "user",
    }),
    clientName() {
      if (this.orderLocal.client) {
        return this.orderLocal.client.name;
      }
      return null;
    },
  },
};
</script>

<style scoped lang="scss">
.logo-wrapper {
  text-align: center;

  img {
    width: 70%;
  }
}
</style>
