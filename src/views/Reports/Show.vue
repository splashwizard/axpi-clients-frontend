<template>
  <div class="reports">
    <!-- Page Header -->
    <div class="page-header">
      <a-page-header :title="pageTitle" @back="() => $router.push('/reports')" />
    </div>
    <!-- / Page Header -->

    <!-- Roche -->
    <div v-if="reportId === 'roche'">
      <iframe
        src="https://flo.uri.sh/story/898435/embed"
        title="Interactive or visual content"
        frameborder="0"
        scrolling="no"
        style="width: 100%; height: 600px"
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      ></iframe>
      <div style="width: 100%!; margin-top: 4px !important; text-align: right !important"></div>
    </div>
    <!-- / Roche -->

    <!-- Overview -->
    <div v-if="reportId === 'overview'">
      <iframe
        src="https://flo.uri.sh/story/758359/embed"
        title="Interactive or visual content"
        frameborder="0"
        scrolling="no"
        style="width: 100%; height: 600px"
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      ></iframe>
      <div style="width: 100%!; margin-top: 4px !important; text-align: right !important"></div>
    </div>
    <!-- / Overview -->

    <!-- Australia -->
    <div v-if="reportId === 'australia'">
      <iframe
        src="https://flo.uri.sh/story/760522/embed"
        title="Interactive or visual content"
        frameborder="0"
        scrolling="no"
        style="width: 100%; height: 600px"
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      ></iframe>
      <div style="width: 100%!; margin-top: 4px !important; text-align: right !important">
        <a
          class="flourish-credit"
          href="https://public.flourish.studio/story/760522/?utm_source=embed&utm_campaign=story/760522"
          target="_top"
          style="text-decoration: none !important"
        >
        </a>
      </div>
    </div>
    <!-- / Australia -->

    <!-- Europe -->
    <div v-if="reportId === 'europe'">
      <iframe
        src="https://flo.uri.sh/story/760525/embed"
        title="Interactive or visual content"
        frameborder="0"
        scrolling="no"
        style="width: 100%; height: 600px"
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      ></iframe>
      <div style="width: 100%!; margin-top: 4px !important; text-align: right !important"></div>
    </div>
    <!-- / Europe -->

    <!-- USA -->
    <div v-if="reportId === 'usa'">
      <iframe
        src="https://flo.uri.sh/story/760518/embed"
        title="Interactive or visual content"
        frameborder="0"
        scrolling="no"
        style="width: 100%; height: 600px"
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      ></iframe>
      <div style="width: 100%!; margin-top: 4px !important; text-align: right !important"></div>
    </div>
    <!-- / USA -->

    <!-- Summary -->
    <div v-if="reportId === 'summary'">
      <iframe
        src="https://flo.uri.sh/story/765783/embed"
        title="Interactive or visual content"
        frameborder="0"
        scrolling="no"
        style="width: 100%; height: 600px"
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      ></iframe>
      <div style="width: 100%!; margin-top: 4px !important; text-align: right !important"></div>
    </div>
    <!-- / Summary -->
  </div>
</template>

<script>
export default {
  name: "Show",
  computed: {
    reportId() {
      return this.$route.params.id;
    },
    pageTitle() {
      if (this.reportId === "overview") {
        return "Overview";
      } else if (this.reportId === "roche") {
        return "Roche POC Report";
      } else if (this.reportId === "australia") {
        return "Australia";
      } else if (this.reportId === "europe") {
        return "Europe";
      } else if (this.reportId === "usa") {
        return "USA";
      } else if (this.reportId === "summary") {
        return "Summary";
      } else {
        return this.reportId;
      }
    },
  },
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>
