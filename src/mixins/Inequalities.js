const _ = require("lodash");

export default {
  data() {
    return {
      inequalityOptions: [
        {
          label: "=",
          value: null,
        },
        {
          label: ">",
          value: ">",
        },
        {
          label: ">=",
          value: ">=",
        },
        {
          label: "<",
          value: "<",
        },
        {
          label: "<=",
          value: "<=",
        },
        {
          label: "Between",
          value: "between",
        },
      ],
    };
  },
  methods: {
    getInequalityLabel(inequality) {
      if (inequality === "between") {
        return null;
      }
      let option = _.find(this.inequalityOptions, {
        value: inequality,
      });
      return option ? option.value : "-";
    },
  },
};
