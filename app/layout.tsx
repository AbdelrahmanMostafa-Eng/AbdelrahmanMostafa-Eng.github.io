import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import { Providers } from "@/components/providers"
import { site } from "@/lib/site"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.positioning,
  keywords: [
    "Abdelrahman Mostafa",
    "Computer Engineering",
    "FSAE",
    "Vehicle dynamics",
    "Telemetry",
    "Python",
    "TypeScript",
    "Aalto University",
    "Saudi Arabia",
  ],
  authors: [{ name: site.fullName, url: site.url }],
  creator: site.fullName,
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} — ${site.role}`,
    description: site.headline,
    siteName: site.name,
    images: [{ url: "/images/profile.png", width: 460, height: 460, alt: site.name }],
  },
  twitter: {
    card: "summary",
    site: "@AbdElRahmanm988",
    creator: "@AbdElRahmanm988",
    title: `${site.name} — ${site.role}`,
    description: site.headline,
  },
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} bg-background`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
