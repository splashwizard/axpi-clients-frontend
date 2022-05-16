import axios from "axios";

export default {
  validateOrder(orderId) {
    return new Promise((resolve, reject) => {
      axios
        .post(window.API_BASE + "/orders/" + orderId + "/validate")
        .then((r) => {
          resolve(r.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
};
