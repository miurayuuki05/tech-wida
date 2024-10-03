# Invoice Management Application

## Overview

This application allows users to manage invoices efficiently. It includes features such as adding invoices with product autocomplete, displaying invoices in card format with pagination, and visualizing revenue projections using a time-series graph.

## Features

### Section 1 - Add Invoice with Autocomplete for Product Input

- Users can create invoices by filling out mandatory fields: 
  - **Date**
  - **Customer Name**
  - **Salesperson Name**
  - **Notes** (optional)
  - **Multiple Products Sold**
- **Autocomplete Product Suggestions**: As users type in the product input, suggestions will appear, displaying:
  - Product Name
  - Product Picture
  - Stock Availability
  - Price
- **Form Validation**: The form cannot be submitted if any mandatory input fields are empty.
- **Warning Messages**: Tooltip or label warnings will notify users of invalid inputs.
- **Submission Notification**: A proper notification pop-up will confirm the successful submission of the invoice.

### Section 2 - Invoice Card

- An invoice card layout displays published invoices with pagination.
- Each invoice card summarizes the following information:
  - Customer Name
  - Salesperson Name
  - Total Amount Paid
  - Notes
- **Lazy Loading**: Invoice data is fetched from the backend using a GET API, ensuring smooth performance even with a large number of invoices.

### Section 3 - Time-Series Graph

- A time-series graph visualizes projected revenue from invoices on daily, weekly, and monthly bases.
- **Interactive Features**: Users can pan and zoom in on specific time periods for better analysis.
- **Auto Scroll**: The graph automatically updates to show new data as it is pushed.

## Technologies Used

- Frontend: [React](https://reactjs.org/) for building the user interface.
- State Management: [Redux](https://redux.js.org/) (if applicable).
- Backend: Node.js with Express.js for handling API requests.
- Database: [MySQL](https://www.mysql.com/) for storing invoice data.
- Visualization: [D3.js](https://d3js.org/) for rendering time-series graphs.
- CSS Framework: [Bootstrap](https://getbootstrap.com/) for responsive design (if used).

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MySQL database setup.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-link>
   cd <repository-folder>
