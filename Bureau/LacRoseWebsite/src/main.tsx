import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app/App";
import { PacksPage } from "./app/pages/PacksPage";
import { PrivacyPage } from "./app/pages/PrivacyPage";
import { ContactPage } from "./app/pages/ContactPage";
import { LanguageProvider } from "./app/context/LanguageContext";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/reservation" element={<PacksPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </LanguageProvider>
  </BrowserRouter>
);
