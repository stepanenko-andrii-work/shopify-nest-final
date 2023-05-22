import { AlphaCard, Layout, Page } from "@shopify/polaris";

export default function PageNotFound() {
  return (
    <Page title="Not Found" fullWidth>
      <Layout>
        <AlphaCard>
          <h1>Page is not found</h1>
        </AlphaCard>
      </Layout>
    </Page>
  );
}
