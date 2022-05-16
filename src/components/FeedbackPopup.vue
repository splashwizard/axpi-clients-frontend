<template>
  <a-popover trigger="click" placement="bottomRight">
    <div slot="content">
      <div class="popover-inner">
        <div v-if="!submitted">
          <a-textarea v-model="feedback" placeholder="Leave feedback here..." :auto-size="{ minRows: 4, maxRows: 6 }" />
          <div class="actions">
            <a-button @click.prevent="submitFeedback" type="primary" size="small" :loading="isSubmitting"
              >Submit
            </a-button>
          </div>
        </div>
        <div v-else>Thank you for your feedback!</div>
      </div>
    </div>

    <a-button class="feedback-icon">
      <div>
        <feedback-icon></feedback-icon>
        <span>Feedback?</span>
      </div>
    </a-button>
  </a-popover>
</template>

<script>
import FeedbackIcon from "./Icons/FeedbackIcon";
import axios from "axios";

export default {
  name: "FeedbackPopup",
  components: { FeedbackIcon },
  data() {
    return {
      feedback: "",
      submitted: false,
      isSubmitting: false,
    };
  },
  methods: {
    submitFeedback() {
      let vm = this;
      vm.isSubmitting = true;
      axios
        .post(window.API_COMMON_BASE + "/feedback", {
          feedback: vm.feedback,
        })
        .then(() => {
          vm.isSubmitting = false;
          vm.submitted = true;
        })
        .catch((e) => {
          vm.isSubmitting = false;
          vm.submitted = false;
          this.$message.error("Error submitting feedback. Please try again.");
          console.log(e);
        });
    },
  },
};
</script>

<style scoped>
.actions {
  padding-top: 10px;
  text-align: right;
  width: 250px;
}
</style>
