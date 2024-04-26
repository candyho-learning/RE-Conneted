import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <div className="App">
        <Header />
        <main style={{ minHeight: "calc(100vh - 120px)" }}>
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
