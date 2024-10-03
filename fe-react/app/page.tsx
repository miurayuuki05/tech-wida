import Invoice from "./component/InvoiceComp";
import FormInvoice from "./component/FormInvoice";
import Graphinvoice from "./component/Graphinvoice";
import './globals.css';

export default function App() {
  return (
    <div className="App">
      <FormInvoice />
      <Invoice />
      <Graphinvoice/>
    </div>
  );
}