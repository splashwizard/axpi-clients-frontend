const _ = require('lodash');
export default {
    methods: {
        generateCheckboxId(type, val) {
            return this._uid + '-' + type + '-checkbox-' + val;
        },

        createErrorList(arr)
        {
            var list = document.createElement('div');
            for (var i = 0; i < arr.length; i++) {
                var item = document.createElement('div');
                item.appendChild(document.createTextNode(arr[i]));
                item.appendChild(document.createElement('br'));
                list.appendChild(item);
            }
            return list;
        },

        getErrorsAsArray(e) {
            var errors;
            if (typeof e.response.data === 'object') {
                errors = _.flatten(_.toArray(e.response.data.errors));
            } else {
                errors = ['Something went wrong. Please try again.'];
            }
            return errors;
        },

        setErrors(e) {
            this.serverErrors = this.getErrorsAsArray(e);
        }
    }
}