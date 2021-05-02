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
        }
    }
}