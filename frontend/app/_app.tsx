// pages/_app.tsx
import type { AppProps } from 'next/app';
import 'antd/dist/reset.css';          // Styles de base Ant Design
import '../styles/globals.css';        // Tes styles globaux (optionnel)

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
