const _ = require('lodash');

export default {
    decodeOrder(orderFromServer) {
        let order = {
            id: orderFromServer.id,
            product_name: orderFromServer.product_name,
            product_description: orderFromServer.product_description,
            product_type: orderFromServer.product_type,
            product_subtype: orderFromServer.product_subtype,
            additional_information: orderFromServer.additional_information,
            cost: orderFromServer.cost,
            cost_currency: orderFromServer.cost_currency,
            reference_number: orderFromServer.reference_number,
            client_id: orderFromServer.client_id,
            apparel_detail_id: orderFromServer.apparel_detail_id,
            permanent_pos_detail_id: orderFromServer.permanent_pos_detail_id,
            semi_permanent_pos_detail_id: orderFromServer.semi_permanent_pos_detail_id,
            print_detail_id: orderFromServer.print_detail_id,
        };

        // Print
        if (orderFromServer.print_detail) {
            // Paper Sections
            if (orderFromServer.print_detail.paper_sections && orderFromServer.print_detail.paper_sections.length) {
                order.paper = _.cloneDeep(orderFromServer.print_detail.paper_sections);
            }

            // Additional Information
            order.print_binding_type = orderFromServer.print_detail.binding;
            order.print_printing_method = orderFromServer.print_detail.printing_method.split('/');
            order.print_artwork_supplied = orderFromServer.print_detail.artwork_supplied;
            order.print_proof_made = orderFromServer.print_detail.proof_made;
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
            additional_information: localOrder.additional_information,
            cost: localOrder.cost,
            cost_currency: localOrder.cost_currency,
            reference_number: localOrder.reference_number,
        };

        // PRINT
        order.print_detail = {};

        // Print - Paper
        if (localOrder.paper) {
            order.print_detail.paper_sections = _.cloneDeep(localOrder.paper);
        }

        // Print - Additional Sections
        order.print_detail.binding = localOrder.print_binding_type;
        order.print_detail.printing_method = localOrder.print_printing_method ? localOrder.print_printing_method.join('/') : null;
        order.print_detail.artwork_supplied = localOrder.print_artwork_supplied;
        order.print_detail.proof_made = localOrder.print_proof_made;

        return order;
    }
}