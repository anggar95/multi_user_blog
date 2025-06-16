import { ClerkProvider } from '@clerk/nextjs'
import { Navbar } from '../components/shared/Navbar'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body suppressHydrationWarning={true} className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container py-8">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
} 