import React from 'react';
import { init, ErrorBoundary } from '@sentry/react';
import { ApolloClient, ApolloProvider } from '@apollo/client';

import '@the-deep/deep-ui/build/esm/index.css';

import PreloadMessage from '#base/components/PreloadMessage';
import sentryConfig from '#base/configs/sentry';
import apolloConfig from '#base/configs/apollo';
import styles from './styles.css';

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
                    <div className={styles.view}>UserGroup Dashboad</div>
                </ApolloProvider>
            </ErrorBoundary>
        </div>
    );
}

export default Base;
