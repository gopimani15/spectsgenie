import { AuthProvider } from "../src/context/AuthContext";
import Layout from "../src/components/Layout";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Exclude StoreSelect (index) from global layout
  const noLayoutPages = ["/"];
  const showLayout = !noLayoutPages.includes(router.pathname);

  const content = <Component {...pageProps} />;

  return (
    <AuthProvider>
      {showLayout ? <Layout>{content}</Layout> : content}
    </AuthProvider>
  );
}
