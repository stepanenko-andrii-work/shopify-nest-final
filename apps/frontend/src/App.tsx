import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import createApp from "@shopify/app-bridge";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "../components/providers";

function App() {
  const pages = import.meta.glob("../pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  const links = [
    { label: "Home", destination: "/" },
    { label: "Products", destination: "/products" },
    { label: "Create product", destination: "/products/create" },
    { label: "Delete product", destination: "/products/delete" },
  ];

  const config = {
    apiKey: process.env.API_KEY || "",
    host: new URLSearchParams(location.search).get("host") || "",
    forceRedirect: true,
  };

  createApp(config);

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu navigationLinks={links} />
            <Routes pages={pages} />
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}

export default App;
