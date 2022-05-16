export default {
  methods: {
    isInStock(stock) {
      return (stock && stock !== 0) || stock == null;
    },

    isOutOfStock(stock) {
      return stock !== null && stock === 0;
    },

    getStockText(stock, showReadyToShip = true, leadTime = null) {
      if (stock === 0) {
        if (leadTime) {
          return "Out of stock, " + leadTime + " lead time";
        }
        return "Out of stock";
      }

      if (stock && stock > 0) {
        return stock + " in stock" + (showReadyToShip ? " and ready to ship" : "");
      }

      return "In stock" + (showReadyToShip ? " and ready to ship" : "");
    },
  },
};
