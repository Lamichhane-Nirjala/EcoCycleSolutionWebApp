import MainRoute from "./Router/MainRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <MainRoute />
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
