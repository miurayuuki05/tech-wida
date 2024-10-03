const dbconn = require('../db/conn');
const {DataTypes} = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({
    path: '../.env'
});

const Invoice = dbconn.define('invoice', {
    invoice_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    invoice_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    invoice_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    customer_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salesperson_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false 
    }
}, {
    tableName: 'invoice',
    timestamps: true
});


dbconn.sync()
    .then(() => console.log('Invoice table created successfully'))
    .catch(err => console.error('Unable to create Invoice table:', err));

module.exports = Invoice;