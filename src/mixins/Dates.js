export default {
  methods: {
    displayTimestamp(dateTime) {
      let dateTimeMoment = window.moment(dateTime);
      return (
        dateTimeMoment.fromNow() +
        " (" +
        dateTimeMoment.format("ddd DD MMM") +
        " at " +
        dateTimeMoment.format("h:mm A") +
        ")"
      );
    },

    displayTimeOpen(dateTime) {
      let dateTimeMoment = window.moment(dateTime);
      return dateTimeMoment.fromNow(true);
    },

    displayTimeAgo(dateTime) {
      let dateTimeMoment = window.moment(dateTime);
      return dateTimeMoment.fromNow();
    },

    formatDate(d) {
      return window.moment(d).format("DD/MM/YYYY");
    },
  },
};
