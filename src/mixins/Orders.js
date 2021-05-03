export default {
    methods: {
        getHumanReadableStatus(status) {
            switch(status) {
                case 0:
                    return 'Incomplete';
                case 1:
                    return 'Ready To Send';
                case 2:
                    return 'Sent';
                case 3:
                    return 'Rejected';
                case 4:
                    return 'Completed';
            }
        },

        getStatusColor(status) {
            switch(status) {
                case 0:
                    return '#4dc8f2';
                    // return 'Incomplete';
                case 1:
                    return '#fcb743'
                    // return 'Ready To Send';
                case 2:
                    return '#ebdf00';
                    // return 'Sent';
                case 3:
                    return '#ec2c74';
                    // return 'Rejected';
                case 4:
                    return '#46b98e';
                    // return 'Completed';
            }
        },

        formatType(type) {
            if (type) {
                if (type === 'pos') {
                    return 'POS';
                } else {
                    return type.charAt(0).toUpperCase() + type.slice(1)
                }
            }
            return type;
        },

        formatCost(order) {
            if (order.cost) {
                let currency = order.cost_currency ? order.cost_currency : 'GBP';
                return new Intl.NumberFormat('ja-JP', {style: 'currency', currency: currency}).format(order.cost);
            }
            return order.cost;
        }
    }
}