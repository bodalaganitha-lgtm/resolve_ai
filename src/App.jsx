import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import SubmitComplaint from "./pages/SubmitComplaint.jsx";
import AIAnalysis from "./pages/AIAnalysis.jsx";
import ComplaintHistory from "./pages/ComplaintHistory.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import Reports from "./pages/Reports.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/customer-dashboard"
          element={<CustomerDashboard />}
        />

        <Route
          path="/submit-complaint"
          element={<SubmitComplaint />}
        />

        <Route
          path="/ai-analysis"
          element={<AIAnalysis />}
        />
        <Route
          path="/complaint-history"
          element={<ComplaintHistory />}
        />
        <Route
          path="/manager-dashboard"
          element={<ManagerDashboard />}
        />
        <Route
          path="/analytics"
          element={<Analytics />}
        />
        <Route
          path="/reports"
          element={<Reports />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;