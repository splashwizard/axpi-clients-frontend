<template>
  <div>
    <a-radio-group v-model="viewToUse" v-if="canEditProducts">
      <a-radio-button value="view">
        <a-icon style="margin-right: 5px" type="eye"></a-icon>
        View
      </a-radio-button>
      <a-radio-button value="edit">
        <a-icon style="margin-right: 5px" type="edit"></a-icon>
        Edit
      </a-radio-button>
    </a-radio-group>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ViewToggler",
  computed: {
    ...mapGetters("auth", {
      canEditProducts: "canEditProducts",
    }),

    ...mapGetters("productViewer", {
      view: "view",
    }),

    viewToUse: {
      get() {
        return this.view;
      },
      set(val) {
        this.setView(val);
      },
    },
  },
  methods: {
    ...mapActions("productViewer", {
      setView: "setView",
    }),
  },
};
</script>

<style scoped></style>
