// import * as Sentry from '@sentry/nextjs';
import * as Sentry from "@sentry/browser";
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NEXT_PUBLIC_APP_ENV,
  tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE) || 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration(),
    Sentry.replayCanvasIntegration(),
    Sentry.captureConsoleIntegration({
      levels: ['error', 'success', 'warning'], 
    }),
  ],
});
