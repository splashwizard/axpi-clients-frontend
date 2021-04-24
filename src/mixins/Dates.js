export default {
    methods: {
        displayTimestamp(dateTime) {
            let dateTimeMoment = moment(dateTime);
            return dateTimeMoment.fromNow() + ' (' + dateTimeMoment.format('ddd DD MMM') + ' at ' + dateTimeMoment.format('h:mm A') + ')';
        },

        displayTimeOpen(dateTime) {
            let dateTimeMoment = moment(dateTime);
            return dateTimeMoment.fromNow(true);
        },

        formatDate(d) {
            return moment(d).format('DD/MM/YYYY') ;
        }
    }
}
