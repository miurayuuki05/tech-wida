'use client';

import { useEffect, useState} from "react";
import axios from "axios";
import styles from '../style/style.module.css';

export default function Invoice() {
  const [data, setData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [suggest, setSuggest] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(4);

  useEffect(() => {
    try {
      axios.get("http://localhost:3005/api/invoice")
        .then((res) => {
          setData(res.data.invoices);
          setItemData(res.data.items);
        });
    }
    catch (err) {
      console.log(err);
    }
  }, []);

  function paginate(invoices : any, dataPerPage : number, currentPage : number, invoiceItems : any) {
    const startIndex = (currentPage - 1) * dataPerPage;
    const paginatedInvoices = invoices.slice(startIndex, startIndex + dataPerPage);
    console.log('Invoice:', invoices);
    console.log('Invoice Items:', invoiceItems);
    
    // Add the associated items to each invoice
    const paginatedInvoicesWithItems = paginatedInvoices.map((invoice : any) => {
      return {
        ...invoice,
        items: invoiceItems.filter((item : any) => item.invoice_id === invoice.invoice_number)
      };
    });

    console.log(paginatedInvoicesWithItems);
  
    return paginatedInvoicesWithItems;
  }

  const handlePagination = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  }

  

  // const handleSuggestions = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   setSearch(value);

  //   if (value.trim() !== "") {
  //       const filteredData = data.filter((item: any) => {
  //           return item.invoiceNumber.toLowerCase().includes(value.toLowerCase());
  //       });

  //       setSuggest(filteredData);
  //       console.log(filteredData);
  //   } else {
  //       setSuggest([]);
  //   }
  // };

  // const handleBlur = () => {
  //     setSuggest([]);
  // }

  // const handleFocus = () => {
  //   if (search.trim() !== "") {
  //     const filteredData = data.filter((item: any) => {
  //         return item.invoiceNumber.toLowerCase().includes(search.toLowerCase());
  //     });

  //     setSuggest(filteredData);
  //   }
  // }



  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Invoice List</h1>
      <div className="relative w-[300px]">
        {/* <form>
          <input className={styles.searchForm} type="text" placeholder="Search Invoice" onChange={handleSuggestions} value={search} onBlur={handleBlur} onFocus={handleFocus}/>
        </form>        
        <div className={suggest.length === 0 ? "" : "absolute top-[45px] w-full bg-white shadow-2xl rounded-md p-3"}>
        {suggest.map((item: any) => {
          return (
            <div key={item.invoice_number} className={styles.suggestCard}>
              <h2>{item.invoice_number}</h2>
              <p>{item.createdAt}</p>
            </div>
          );
        })}
        </div> */}
      </div>
      <div className={styles.invoiceContainer}>
        {paginate(data, dataPerPage, currentPage, itemData).map((invoice: any) => {
          return (
            <div key={invoice.invoice_number} className={styles.invoiceCard}>
              <h2>{invoice.invoice_number}</h2>
              <p>{invoice.createdAt}</p>
              <div className={styles.itemContainer}>
                {invoice.items.map((item: any) => {
                  return (
                    <div key={item.item_id} className={styles.itemCard}>
                      <h3>{item.item_name}</h3>
                      <p>Stock: {item.item_stock}</p>
                      <p>Price: {item.item_price}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.paginationContainer}>
        {Array.from({length: Math.ceil(data.length / dataPerPage)}, (_, i) => i + 1).map((number) => {
          return (
            <button key={number} className={currentPage === number ? styles.active : ""} onClick={() => handlePagination(number)}>{number}</button>
          );
        })}
      </div>
    </div>
  );
}
