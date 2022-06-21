import {
    BrowserOptions,
} from '@sentry/react';

const appCommitHash = process.env.REACT_APP_COMMITHASH;
const appName = process.env.MY_APP_ID;

const sentryDsn = process.env.REACT_APP_SENTRY_DSN;

const env = process.env.REACT_APP_ENVIRONMENT;

const sentryConfig: BrowserOptions | undefined = sentryDsn ? {
    dsn: sentryDsn,
    release: `${appName}@${appCommitHash}`,
    environment: env,
    normalizeDepth: 5,
} : undefined;

export default sentryConfig;
