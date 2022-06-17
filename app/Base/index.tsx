import React, { useMemo } from 'react';
import { init, ErrorBoundary } from '@sentry/react';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { listToMap } from '@togglecorp/fujs';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@the-deep/deep-ui/build/esm/index.css';

import { setMapboxToken } from '@togglecorp/re-map';

import PreloadMessage from '#base/components/PreloadMessage';
import browserHistory from '#base/configs/history';
import sentryConfig from '#base/configs/sentry';
import apolloConfig from '#base/configs/apollo';
import { trackingId, gaConfig } from '#base/configs/googleAnalytics';
import { mapboxToken } from '#base/configs/env';

import styles from './styles.css';

setMapboxToken(mapboxToken);

if (sentryConfig) {
    init(sentryConfig);
}

const apolloClient = new ApolloClient(apolloConfig);

function Base() {
    return (
        <div className={styles.base}>
            <ErrorBoundary
                showDialog
                fallback={(
                    <PreloadMessage
                        heading="Oh no!"
                        content="Some error occurred!"
                    />
                )}
            >
                <ApolloProvider client={apolloClient}>
                    <div>UserGroup Dashboad</div>
                </ApolloProvider>
            </ErrorBoundary>
        </div>
    );
}

export default Base;
