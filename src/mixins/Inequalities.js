const _ = require('lodash');

export default {
    data() {
        return {
            inequalityOptions: [
                {
                    label: '=',
                    value: null
                },
                {
                    label: '>',
                    value: '>'
                },
                {
                    label: '>=',
                    value: '>='
                },
                {
                    label: '<',
                    value: '<'
                },
                {
                    label: '<=',
                    value: '<='
                },
                {
                    label: 'range',
                    value: 'range'
                }
            ]
        }
    },
    methods: {
        getInequalityLabel(inequality) {
            if (inequality === 'range') {
                return null;
            }
            let option = _.find(this.inequalityOptions, {
                value: inequality
            });
            return option ? option.value : '-';
        }
    }
}