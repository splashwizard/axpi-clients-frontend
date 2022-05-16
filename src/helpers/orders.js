const _ = require("lodash");
import moment from "moment";

export default {
  decodeOrder(orderFromServer) {
    let order = {
      id: orderFromServer.id,
      product_name: orderFromServer.product_name,
      product_description: orderFromServer.product_description,
      product_type: orderFromServer.product_type,
      product_subtype: orderFromServer.product_subtype,
      quantity: orderFromServer.quantity,
      additional_information: orderFromServer.additional_information,
      cost: orderFromServer.cost ? orderFromServer.cost / 100 : null,
      cost_currency: orderFromServer.cost_currency,
      reference_number: orderFromServer.reference_number,
      reference_type: orderFromServer.reference_type,
      order_date: orderFromServer.order_date,
      delivery_date: orderFromServer.delivery_date,
      client_id: orderFromServer.client_id,
      supplier_id: orderFromServer.supplier_id,
      apparel_detail_id: orderFromServer.apparel_detail_id,
      permanent_pos_detail_id: orderFromServer.permanent_pos_detail_id,
      semi_permanent_pos_detail_id: orderFromServer.semi_permanent_pos_detail_id,
      print_detail_id: orderFromServer.print_detail_id,
      status: orderFromServer.status,
      supplier: orderFromServer.supplier,
    };

    if (orderFromServer.optimisation_id) {
      order.optimisation_id = orderFromServer.optimisation_id;
    }

    // Print
    if (orderFromServer.print_detail && typeof orderFromServer.print_detail === "object") {
      // Paper Sections
      if (orderFromServer.print_detail.paper_sections && orderFromServer.print_detail.paper_sections.length) {
        order.paper = _.cloneDeep(orderFromServer.print_detail.paper_sections);
      }

      // Additional Information
      order.print_binding_type = orderFromServer.print_detail.binding;
      order.print_printing_method = orderFromServer.print_detail.printing_method
        ? orderFromServer.print_detail.printing_method.split("/")
        : null;
      order.print_artwork_supplied = orderFromServer.print_detail.artwork_supplied;
      order.print_proof_made = orderFromServer.print_detail.proof_made;
    }

    // POS
    if (orderFromServer.pos_detail && typeof orderFromServer.pos_detail === "object") {
      // Materials Used
      if (orderFromServer.pos_detail.pos_materials_used && orderFromServer.pos_detail.pos_materials_used.length) {
        order.pos_material = _.cloneDeep(orderFromServer.pos_detail.pos_materials_used);
      }

      // Additional Information
      order.pos_product_type = orderFromServer.pos_detail.product_type;
      order.pos_product_width = orderFromServer.pos_detail.width;
      order.pos_product_width_unit = orderFromServer.pos_detail.width_unit;
      order.pos_product_depth = orderFromServer.pos_detail.depth;
      order.pos_product_depth_unit = orderFromServer.pos_detail.depth_unit;
      order.pos_product_height = orderFromServer.pos_detail.height;
      order.pos_product_height_unit = orderFromServer.pos_detail.height_unit;
      order.pos_weight_supported = orderFromServer.pos_detail.weight_supported;
      order.pos_weight_supported_unit = orderFromServer.pos_detail.weight_supported_unit;
      order.pos_usable_area_of_shelves = orderFromServer.pos_detail.usable_area_of_shelves;
      order.pos_usable_area_of_shelves_unit = orderFromServer.pos_detail.usable_area_of_shelves_unit;
      order.pos_product_type_supported = orderFromServer.pos_detail.product_type_supported;
      order.pos_product_supported_width = orderFromServer.pos_detail.product_supported_width;
      order.pos_product_supported_width_unit = orderFromServer.pos_detail.product_supported_width_unit;
      order.pos_product_supported_depth = orderFromServer.pos_detail.product_supported_depth;
      order.pos_product_supported_depth_unit = orderFromServer.pos_detail.product_supported_depth_unit;
      order.pos_product_supported_height = orderFromServer.pos_detail.product_supported_height;
      order.pos_product_supported_height_unit = orderFromServer.pos_detail.product_supported_height_unit;

      order.pos_printing_method = orderFromServer.pos_detail.printing_method
        ? orderFromServer.pos_detail.printing_method.split("/")
        : null;
      order.pos_artwork_supplied = orderFromServer.pos_detail.artwork_supplied;
      order.pos_proof_made = orderFromServer.pos_detail.proof_made;
    }

    // Delivery locations
    if (orderFromServer.delivery_locations) {
      order.delivery_locations = _.map(orderFromServer.delivery_locations, (location) => {
        if (location["date_shipped"]) {
          location["date_shipped"] = moment(location.date_shipped, "YYYY-MM-DD");
        }

        return location;
      });
    }

    // Chemicals
    if (orderFromServer.order_chemicals) {
      order.chemicals = _.cloneDeep(orderFromServer.order_chemicals);
    }

    // Packaging components
    if (orderFromServer.packaging_components) {
      order.packaging_components = _.cloneDeep(orderFromServer.packaging_components);
    }

    return order;
  },

  encodeOrder(localOrder) {
    let order = {
      id: localOrder.id,
      product_name: localOrder.product_name,
      product_description: localOrder.product_description,
      product_type: localOrder.product_type,
      product_subtype: localOrder.product_subtype,
      quantity: localOrder.quantity,
      additional_information: localOrder.additional_information,
      cost: localOrder.cost ? Math.round(localOrder.cost * 100) : null,
      cost_currency: localOrder.cost_currency,
      reference_number: localOrder.reference_number,
      reference_type: localOrder.reference_type,
      order_date: localOrder.order_date,
      delivery_date: localOrder.delivery_date,
      supplier_id: localOrder.supplier_id,
      status: localOrder.status,
    };

    // PRINT
    order.print_detail = {};

    // Print - Paper
    if (localOrder.paper) {
      order.print_detail.paper_sections = _.cloneDeep(localOrder.paper);
    }

    // Print - Additional Sections
    order.print_detail.binding = localOrder.print_binding_type;
    order.print_detail.printing_method = localOrder.print_printing_method
      ? localOrder.print_printing_method.join("/")
      : null;
    order.print_detail.artwork_supplied = localOrder.print_artwork_supplied;
    order.print_detail.proof_made = localOrder.print_proof_made;

    // POS
    order.pos_detail = {};

    // POS - Materials Used
    if (localOrder.pos_material) {
      order.pos_detail.pos_materials_used = _.cloneDeep(localOrder.pos_material);
    }

    // POS - Additional Sections
    order.pos_detail.product_type = localOrder.pos_product_type;
    order.pos_detail.width = localOrder.pos_product_width;
    order.pos_detail.width_unit = localOrder.pos_product_width_unit;
    order.pos_detail.depth = localOrder.pos_product_depth;
    order.pos_detail.depth_unit = localOrder.pos_product_depth_unit;
    order.pos_detail.height = localOrder.pos_product_height;
    order.pos_detail.height_unit = localOrder.pos_product_height_unit;
    order.pos_detail.weight_supported = localOrder.pos_weight_supported;
    order.pos_detail.weight_supported_unit = localOrder.pos_weight_supported_unit;
    order.pos_detail.usable_area_of_shelves = localOrder.pos_usable_area_of_shelves;
    order.pos_detail.usable_area_of_shelves_unit = localOrder.pos_usable_area_of_shelves_unit;
    order.pos_detail.product_type_supported = localOrder.pos_product_type_supported;
    order.pos_detail.product_supported_width = localOrder.pos_product_supported_width;
    order.pos_detail.product_supported_width_unit = localOrder.pos_product_supported_width_unit;
    order.pos_detail.product_supported_depth = localOrder.pos_product_supported_depth;
    order.pos_detail.product_supported_depth_unit = localOrder.pos_product_supported_depth_unit;
    order.pos_detail.product_supported_height = localOrder.pos_product_supported_height;
    order.pos_detail.product_supported_height_unit = localOrder.pos_product_supported_height_unit;

    order.pos_detail.printing_method = localOrder.pos_printing_method ? localOrder.pos_printing_method.join("/") : null;
    order.pos_detail.artwork_supplied = localOrder.pos_artwork_supplied;
    order.pos_detail.proof_made = localOrder.pos_proof_made;

    // Delivery locations
    if (localOrder.delivery_locations) {
      order.delivery_locations = _.map(localOrder.delivery_locations, (deliveryLocation) => {
        if (deliveryLocation.date_shipped && moment(deliveryLocation.date_shipped).isValid()) {
          deliveryLocation.date_shipped = moment(deliveryLocation.date_shipped).format("YYYY-MM-DD");
        }
        return deliveryLocation;
      });
    }

    // Chemicals
    order.chemicals_used = _.cloneDeep(localOrder.chemicals);

    // Packaging components
    order.packaging_components = _.cloneDeep(localOrder.packaging_components);

    return order;
  },
};
