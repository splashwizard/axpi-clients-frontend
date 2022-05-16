export default {
  formatSupplierName(supplierName) {
    if (supplierName === "Courtney Colour") {
      return "ASL Supplier 1";
    }
    if (supplierName === "Razer Graphix") {
      return "ASL Supplier 1";
    }
    if (supplierName === "Eco Design - Eco Print") {
      return "ASL Supplier 3";
    }
    if (supplierName === "FG Print") {
      return "ASL Supplier 4";
    }
    return supplierName;
  },
};
