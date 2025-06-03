import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
} from 'react-router';
import type { Route } from './+types/root';

import { Toaster } from '@web-app-template/ui/sonner';
import '@web-app-template/ui/style.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next/react';
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from 'remix-themes';
import './app.css';
import { PWAManifest } from './components/PWAManifest';
import { remixI18next } from './i18n/i18n.server';
import { loadClientEnv } from './lib/env/env.server';
import { getQueryClient } from './lib/react-query/query-client';
import { themeSessionResolver } from './lib/theme/theme-session.server';

export async function loader({ request }: Route.LoaderArgs) {
  console.log(import.meta.env);
  const { getTheme } = await themeSessionResolver(request);
  const locale = await remixI18next.getLocale(request);
  const clientEnv = loadClientEnv();

  return {
    theme: getTheme(),
    locale,
    clientEnv,
  };
}

export default function AppWithProviders() {
  const { theme } = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={theme} themeAction='/preferences/set-theme'>
      <QueryClientProvider client={getQueryClient()}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function App() {
  const { theme: ssrTheme, locale, clientEnv } = useLoaderData<typeof loader>();

  const [theme] = useTheme();

  const { i18n } = useTranslation();
  useChangeLanguage(locale);

  // useEffect(() => {
  //   if (toast) {
  //     showToast[toast.type](
  //       i18n.t(normalizeKey(toast.message)),
  //       i18n.t(normalizeKey(toast.description)),
  //     );
  //   }
  // }, [toast, i18n]);

  return (
    <html lang={locale} dir={i18n.dir()} className={theme ?? ''}>
      <head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, viewport-fit=cover'
        />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(ssrTheme)} />
        <PWAManifest />
        <Links />
      </head>
      <body>
        <Outlet />
        <Toaster theme={theme as 'dark' | 'light'} />
        <ScrollRestoration />
        <script
          // /!\ Be aware to only inject env variables that are safe to be used in the client
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(clientEnv)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

// export const unstable_middleware = [sessionMiddleware];
// export const unstable_clientMiddleware = [clientSessionMiddleware];
