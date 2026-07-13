import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Skin from "./pages/Skin";
import Dental from "./pages/Dental";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/skin"
        element={
          <PublicLayout>
            <Skin />
          </PublicLayout>
        }
      />
      <Route
        path="/dental"
        element={
          <PublicLayout>
            <Dental />
          </PublicLayout>
        }
      />
      <Route
        path="/booking"
        element={
          <PublicLayout>
            <Booking />
          </PublicLayout>
        }
      />
      {/* Hidden admin route — intentionally not linked from Navbar/Footer or any public page. */}
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
