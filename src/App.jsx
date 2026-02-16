import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

// Components
import BookmarkForm from "./components/Bookmarks/BookmarkForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route
          path="/"
          element={
            <AuthRedirect>
              <Home />
            </AuthRedirect>
          }
        />

        {/* ===== DASHBOARD (PROTECTED) ===== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Default dashboard content */}
          <Route index element={null} />

          {/* Add Bookmark page */}
          <Route path="add" element={<BookmarkForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}