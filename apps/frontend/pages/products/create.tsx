import { Button, FormLayout, Page, TextField } from "@shopify/polaris";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCreator() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [vendor, setVendor] = useState("");
  const navigate = useNavigate();

  const handleTitleChange = (value) => setTitle(value);
  const handleTypeChange = (value) => setType(value);
  const handleVendorChange = (value) => setVendor(value);
  const handleSubmit = async () => {
    const data = { title: title, product_type: type, vendor: vendor };

    await fetch(`/api/products`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    navigate("/products");
  };

  return (
    <Page title="Create products">
      <FormLayout>
        <TextField
          label="Title"
          autoComplete="off"
          onChange={handleTitleChange}
          value={title}
        />
        <TextField
          label="Type"
          autoComplete="off"
          onChange={handleTypeChange}
          value={type}
        />
        <TextField
          label="Vendor"
          autoComplete="off"
          onChange={handleVendorChange}
          value={vendor}
        />
        <Button onClick={handleSubmit}>Add product</Button>
      </FormLayout>
    </Page>
  );
}
