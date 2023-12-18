import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "../styles/Editor.css";
import { ThemeUIProvider } from 'theme-ui';
import theme from '../theme'


export default function App({ Component, pageProps }: AppProps) {
  return(
    <ThemeUIProvider theme={theme}>
<Component {...pageProps} />
</ThemeUIProvider>
  ) 
}
