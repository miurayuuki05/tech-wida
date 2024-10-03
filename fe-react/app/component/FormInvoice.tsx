'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import styles from '../style/style.module.css';
import Modalpopup from "./Modalpopup";

interface Item {
    item_name: string;
    item_stock: number;
    item_price: number;
    item_image: File | null;
}

export default function FormInvoice() {
    const [submitStatus, setStatus] = useState(false);
    const [allSuggestions, setAllSuggestions] = useState<any[]>([]);
    const [itemSuggestions, setItemSuggestions] = useState<any[]>([]);
    // const [selectedSuggestions, setSelectedSuggestions] = useState<Item | null>(null);
    // const [inputSuggestions, setInputSuggestions] = useState<any>(null);
    // const [priceSuggestions, setPriceSuggestions] = useState<any>(null);
    // const [stockSuggestions, setStockSuggestions] = useState<any>(null);
    const [items, setItems] = useState<Item[]>([{ item_name: '', item_stock: 0, item_price: 0, item_image: null }]);

    useEffect(() => {
        axios.get("http://localhost:3005/api/items")
        .then((res) => {
            setAllSuggestions(res.data);
        })
        .catch((err) => {
            console.error("Error response:", err.response?.data);
        });
    }, []);

    const handleSuggestSelect = (suggestion: any, index : number) => {
        const newItems = [...items];
        newItems[index].item_name = suggestion.item_name; 
        newItems[index].item_stock = suggestion.item_stock; 
        newItems[index].item_price = suggestion.item_price; 
        newItems[index].item_image = suggestion.item_image; 
        setItems(newItems);
        setItemSuggestions([]);
    };

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = document.getElementById("invoiceForm") as HTMLFormElement;
        const formData = new FormData(form);

        const invoiceData = {
            invoice_number: formData.get("invoice_number"),
            invoice_date: formData.get("invoice_date"),
            customer_name: formData.get("customer_name"),
            salesperson_name: formData.get("salesperson_name"),
            notes: formData.get("notes"),
            total_amount: parseFloat(formData.get("total_amount") as string),
            items: items.map(item => ({
                item_name: item.item_name,
                item_stock: item.item_stock,
                item_price: item.item_price
            }))
        };

        axios.post("http://localhost:3005/api/invoice", invoiceData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            setStatus(true);
            form.reset();
        })
        .catch((err) => {
            console.error("Error response:", err.response?.data);
        });
    };

    const addItem = () => {
        setItems([...items, { item_name: '', item_stock: 0, item_price: 0, item_image: null }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleChangeItemName = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
    
        const newItems = [...items];
        newItems[index].item_name = value;
        setItems(newItems);
    
        if (value.trim() !== "") {
            const filteredData = allSuggestions.filter((item: any) => {
                return item.item_name.toLowerCase().includes(value.toLowerCase());
            });
    
            setItemSuggestions(filteredData);
        } else {
            setItemSuggestions([]);
        }
    };

    const handleChangeItemStock = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newItems = [...items];
        newItems[index].item_stock = parseInt(event.target.value);
        setItems(newItems);
    };

    const handleChangeItemPrice = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newItems = [...items];
        newItems[index].item_price = parseInt(event.target.value);
        setItems(newItems);
    };

    const handleChangeItemImage = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newItems = [...items];
        newItems[index].item_image = event.target.files?.[0] || null;
        setItems(newItems);
    };

    const closeModal = () => {
        setStatus(false);
    };

    return (
        <div>
            <h1 className="text-center font-bold mt-20 text-5xl">Invoice</h1>
            <div className={styles.formContainer}>
                <form id="invoiceForm" className={styles.invoiceForm} onSubmit={submitForm} encType="multipart/form-data">
                    <label htmlFor="invoice_number">Invoice Number:</label>
                    <input type="text" id="invoice_number" name="invoice_number" required />

                    <label htmlFor="invoice_date">Invoice Date:</label>
                    <input type="date" id="invoice_date" name="invoice_date" required />

                    <label htmlFor="customer_name">Customer Name:</label>
                    <input type="text" id="customer_name" name="customer_name" required />

                    <label htmlFor="salesperson_name">Salesperson Name:</label>
                    <input type="text" id="salesperson_name" name="salesperson_name" required />

                    <label htmlFor="items">Items:</label>
                    {items.map((item, index) => (
                        <div key={index} className={styles.itemContainer}>
                            <input
                                type="text"
                                value={item.item_name}
                                onChange={(e) => handleChangeItemName(index, e)}
                                placeholder="Item Name"
                                id="item_name"
                                required
                            />
                            {itemSuggestions.length > 0 && (
                                <div className={styles.suggestions}>
                                    {itemSuggestions.map((suggestion, i) => (
                                        <div
                                            key={i}
                                            className={styles.suggestion}
                                            onClick={() => handleSuggestSelect(suggestion, index)}
                                        >
                                            {suggestion.item_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <input
                                type="number"
                                value={item.item_stock || ""}
                                onChange={(e) => handleChangeItemStock(index, e)}
                                placeholder="Stock"
                                required
                            />
                            <input
                                type="number"
                                value={item.item_price || ""}
                                onChange={(e) => handleChangeItemPrice(index, e)}
                                placeholder="Price"
                                required
                            />
                            <input
                                type="file"
                                onChange={(e) => handleChangeItemImage(index, e)}
                                accept="image/*"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                disabled={items.length === 1}
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={addItem}>New Item</button>

                    <label htmlFor="notes">Notes:</label>
                    <textarea id="notes" name="notes" rows={4}></textarea>

                    <label htmlFor="total_amount">Total Amount:</label>
                    <input type="number" id="total_amount" name="total_amount" step="0.01" required />

                    <button type="submit">Submit Invoice</button>
                    <div className="error" id="error_message" style={{ display: "none" }}></div>
                </form>

                <Modalpopup show={submitStatus} closeModal={closeModal} />
            </div>
        </div>
    );
}
