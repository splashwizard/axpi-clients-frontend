export default {
  methods: {
    formatAddress(address) {
      let addressComponents = [];
      if (address.address_line_one) {
        addressComponents.push(address.address_line_one);
      }
      if (address.address_line_two) {
        addressComponents.push(address.address_line_two);
      }
      if (address.city) {
        addressComponents.push(address.city);
      }
      if (address.province) {
        addressComponents.push(address.province);
      }
      if (address.country) {
        addressComponents.push(address.country);
      }
      if (address.postal_code) {
        addressComponents.push(address.postal_code);
      }
      return addressComponents.join(", ");
    },

    formatAddressShort(address, prefix = null) {
      let addressComponents = [];
      if (address.city) {
        addressComponents.push(address.city);
      }
      if (address.country) {
        addressComponents.push(address.country);
      }
      if (address.postal_code) {
        addressComponents.push(address.postal_code.toUpperCase());
      }
      return (prefix ? prefix : "") + addressComponents.join(", ");
    },
  },
};
