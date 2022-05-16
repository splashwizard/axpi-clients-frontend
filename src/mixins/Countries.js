import country from "country-list-js";

export default {
  data() {
    return {
      countries: country.names(),
    };
  },
};
