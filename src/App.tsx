import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import "@stream-io/video-react-sdk/dist/css/styles.css";

function App() {
  return (
    <>
      <div className="App">
        <Header />
        <Outlet />
      </div>
    </>
  );
}

export default App;
