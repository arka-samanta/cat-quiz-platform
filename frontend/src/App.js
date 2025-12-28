import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuestionSetup from "./pages/QuestionSetup";
import ExamPage from "./pages/ExamPage";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<QuestionSetup />} />
          <Route path="/exam" element={<ExamPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
