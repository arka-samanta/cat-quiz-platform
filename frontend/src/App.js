import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExamPage from "./pages/ExamPage";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ExamPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
