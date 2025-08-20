import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Apply Neo Aura theme to body
document.body.className = "bg-gray-900 text-gray-100 font-inter antialiased";

createRoot(document.getElementById("root")!).render(<App />);
