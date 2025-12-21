import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
  useLoaderData,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Header from '../components/Header'
import { ThemeProvider } from '../components/theme-provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { getLoggedInUser } from '@/api/auth/server'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  loader: async () => {
    const user = await getLoggedInUser()
    return { user }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'My Market',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: NotFoundComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData({ from: '__root__' })
  const { user } = loaderData

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Header initialUser={user} />
          {children}
          <Toaster />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-background flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-4">Stranica nije pronađena</p>
        <Link to="/" className="text-primary hover:underline inline-block">
          Vrati se na početnu stranicu
        </Link>
      </div>
    </div>
  )
}
