import { Button, FormLayout, Page, TextField } from "@shopify/polaris";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductRemover() {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const handleIdChange = (value) => setId(value);
  const handleSubmit = async () => {
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    navigate("/products");
  };

  return (
    <Page title="Delete products">
      <FormLayout>
        <TextField
          label="ID"
          autoComplete="off"
          onChange={handleIdChange}
          value={id}
        />
        <Button onClick={handleSubmit}>Delete product</Button>
      </FormLayout>
    </Page>
  );
}
