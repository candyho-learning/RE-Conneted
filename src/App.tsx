import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <div className="App">
        <Header />
        <Outlet />
        <Toaster />
      </div>
    </>
  );
}

export default App;
