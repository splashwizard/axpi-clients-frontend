<template>
  <a-collapse v-model="activeSetupStep" accordion>
    <a-collapse-panel key="1" header="Build Your Data Integrations">
      <p>Browse our developer documentation to integrate Axiom into your datasources.</p>
      <a href="https://enhanceable.stoplight.io/docs/axiom/YXBpOjE3NDg1NjY1-axiom-core" target="_blank">
        <a-button type="primary">
          View Documentation
          <a-icon type="arrow-right" />
        </a-button>
      </a>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="Get Your API Keys" :disabled="false">
      <p>Get your API keys so you can start uploading data to Axiom.</p>
      <router-link to="/developers">
        <a-button type="primary">
          Get API Key
          <a-icon type="arrow-right" />
        </a-button>
      </router-link>
    </a-collapse-panel>
    <a-collapse-panel key="3" header="Invite Your Suppliers">
      <p>Send invitations to your suppliers to join Axiom.</p>
      <router-link to="/suppliers">
        <a-button type="primary">
          Invite Suppliers
          <a-icon type="arrow-right" />
        </a-button>
      </router-link>
    </a-collapse-panel>
    <a-collapse-panel key="4" header="Add Business Details">
      <p>Tell us a few details about your business to start using Axiom.</p>
      <router-link to="/business-details">
        <a-button type="primary">
          Add Business Details
          <a-icon type="arrow-right" />
        </a-button>
      </router-link>
    </a-collapse-panel>
    <a-collapse-panel key="5" header="Add Personal Details">
      <p>Tell us a few details about yourself.</p>
      <router-link to="/account">
        <a-button type="primary">
          Add Personal Details
          <a-icon type="arrow-right" />
        </a-button>
      </router-link>
    </a-collapse-panel>
    <a-collapse-panel key="6" header="Verify Your Email">
      <p>Please verify your email by clicking on the link sent to you.</p>
      <router-link to="/account">
        <a-button type="primary">
          Resend Verification Email
          <a-icon type="arrow-right" />
        </a-button>
      </router-link>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
export default {
  name: "SetupProgressAccordion",
  data() {
    return {
      activeSetupStep: 1,
      text: "Lorem ipsum dolor sit amet",
    };
  },
};
</script>

<style scoped></style>
