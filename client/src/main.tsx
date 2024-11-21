import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SidebarProvider>
      <SidebarTrigger />
      <Toaster />
      <App />
    </SidebarProvider>
  </StrictMode>,
);
