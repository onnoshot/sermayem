"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { useState } from "react"
import { ThemeProvider } from "@/components/providers/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      })
  )

  return (
    <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(16,16,24,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.9)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          },
        }}
      />
    </QueryClientProvider>
    </ThemeProvider>
  )
}
