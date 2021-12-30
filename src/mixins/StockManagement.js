export default {
    methods: {
        isInStock(stock) {
            return (stock && stock !== 0) || stock == null
        },

        isOutOfStock(stock) {
            return stock !== null && stock === 0
        },

        getStockText(stock, showReadyToShip=true) {
            if (stock === 0) {
                return 'Out of stock';
            }

            if (stock && stock > 0) {
                return stock + ' in stock' + (showReadyToShip ? ' and ready to ship' : '');
            }

            return 'In stock' + (showReadyToShip ? ' and ready to ship' : '');
        }
    }
}