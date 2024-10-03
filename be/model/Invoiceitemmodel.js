const dbconn = require('../db/conn');
const {DataTypes} = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({
    path: '../.env'
});

const ItemsInvoice = dbconn.define('invoice_product', {
    item_id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    item_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    item_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    item_stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    item_image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    invoice_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'invoice_product',
    timestamps: true
});

dbconn.sync()
    .then(() => console.log('Invoice table created successfully'))
    .catch(err => console.error('Unable to create Invoice table:', err));

module.exports = ItemsInvoice;