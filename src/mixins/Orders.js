export default {
  methods: {
    getHumanReadableStatus(status) {
      switch (status) {
        case 0:
          return "Incomplete";
        case 1:
          return "Ready To Send";
        case 2:
          return "Sent";
        case 3:
          return "Rejected";
        case 4:
          return "Completed";
      }
    },

    getStatusColor(status) {
      switch (status) {
        case 0:
          return "#4dc8f2";
        // return 'Incomplete';
        case 1:
          return "#fcb743";
        // return 'Ready To Send';
        case 2:
          return "#ebdf00";
        // return 'Sent';
        case 3:
          return "#ec2c74";
        // return 'Rejected';
        case 4:
          return "#46b98e";
        // return 'Completed';
      }
    },

    formatType(type) {
      if (type) {
        if (type === "pos") {
          return "POS";
        } else {
          return type.charAt(0).toUpperCase() + type.slice(1);
        }
      }
      return type;
    },

    formatSubtype(subtype) {
      if (subtype) {
        return subtype.charAt(0).toUpperCase() + subtype.slice(1);
      }
      return subtype;
    },

    formatCost(order) {
      if (order.cost) {
        let currency = order.cost_currency ? order.cost_currency : "GBP";
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(order.cost);
      }
      return order.cost;
    },

    formatCostInPence(order) {
      if (order.cost) {
        let currency = order.cost_currency ? order.cost_currency : "GBP";
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(order.cost / 100);
      }
      return order.cost;
    },

    formatCostInPence2dp(order) {
      if (order.cost) {
        let currency = order.cost_currency ? order.cost_currency : "GBP";
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(order.cost / 100);
      }
      return order.cost;
    },

    formatQuantity(quantity) {
      if (quantity) {
        return new Intl.NumberFormat("en-US", {}).format(quantity);
      }
      return quantity;
    },
  },
};
