import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Lora } from "next/font/google"
const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
})


export default function App({ Component, pageProps }: AppProps) {
  return <main className={lora.className}>
    <style jsx global>{`
        html {
          font-family: ${lora.style.fontFamily};
        }
      `}</style>
    <Component {...pageProps} />
  </main>
}
