const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dummyData = require('../dummydata/data.json');
const itemsData = require('../dummydata/items.json');
const invoiceModel = require('../model/Invoicemodel');
const invoiceItemModel = require('../model/Invoiceitemmodel');
const dotenv = require('dotenv');
dotenv.config({
    path: '../.env'
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.use(cors(
    {
        origin: 'http://localhost:3000',
        methods: 'GET, POST, PUT, DELETE',
    }
));

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.get('/data', (req, res) => {
    res.json(dummyData);
});

router.get('/items', async (req, res) => {
    res.status(201).json(itemsData);
});

router.get('/invoice', async (req, res) => {
    try{
        const invoices = await invoiceModel.findAll();
        const items = await invoiceItemModel.findAll();
        res.status(201).json(
            {
                invoices : invoices,
                items: items
            }
        );
    }
    catch(err){
        res.status(500).json(
            {
                message: 'Internal server error',
                error: err
            }
        );
    }
});

router.get('/invoice/graph', async (req, res) => {

    try{
        const invoices = await invoiceModel.findAll();
        const items = await invoiceItemModel.findAll();

        res.status(201).json(
            {
                invoices : invoices,
                items: items
            }
        );
        
    }
    catch(err){
        res.status(500).json(
            {
                message: 'Internal server error',
                error: err
            }
        );
    }
});

router.post('/invoice', async (req, res) => {
    try{
        const { invoice_number, invoice_date, customer_name, salesperson_name, notes, total_amount } = req.body;
        const items = req.body.items; 

        const generateUniqueId = () => {
            const randomString = Math.random().toString(36).substring(2, 8);
            return `${invoice_number}item${randomString}${Date.now()}`;
        };
        
        const newItems = items.map(item => {
            const new_fields = {
                item_id: generateUniqueId(),
                invoice_id: invoice_number,
                item_image: 'https://via.placeholder.com/150'
            };
        
            return {...item, ...new_fields};
        });

        const uploadProducts = await invoiceItemModel.bulkCreate(newItems, {returning: true});     

        
        const uploadInvoice = await invoiceModel.create({
            invoice_number,
            invoice_date,
            customer_name,
            salesperson_name,
            notes,
            total_amount
        });
      

        
        res.status(201).json(
            {
                message: 'Invoice created successfully',
                invoice: uploadInvoice,
                items: newItems
            }
        );
    }
    catch(err){
        res.status(500).json(
            {
                message: 'Internal server error',
                error: err
            }
        );
    }
});

module.exports = router;