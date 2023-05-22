import { AlphaCard, Button, DataTable, Layout, Page } from "@shopify/polaris";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useState, useEffect } from "react";
import { Product } from "backend/src/products/entities/product.entity";
import { useNavigate } from "react-router-dom";
export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();

  console.log("here");

  useEffect(() => {
    if (isLoading) {
      (async () => {
        const productsData = await fetch(`/api/products`);
        const products = (await productsData.json()).data;

        console.log(products);

        setProducts(products);
        setIsLoading(false);
      })();
    }
  }, [products]);

  const rows = products.map((product: Product) => [
    product.id,
    product.title,
    product.product_type,
    product.vendor,
  ]);

  return (
    <Page title="All products" fullWidth>
      <Layout>
        <AlphaCard>
          <DataTable
            columnContentTypes={["numeric", "text", "text", "text"]}
            headings={["ID", "Title", "Type", "Vendor"]}
            rows={rows}
          />
          <Button onClick={() => navigate("/products/create")}>
            Add product
          </Button>
        </AlphaCard>
      </Layout>
    </Page>
  );
}
