import React, { useMemo } from 'react';
import { listToMap } from '@togglecorp/fujs';
import { init, ErrorBoundary } from '@sentry/react';
import { ApolloClient, ApolloProvider } from '@apollo/client';

import '@the-deep/deep-ui/build/esm/index.css';

import PreloadMessage from '#base/components/PreloadMessage';
import sentryConfig from '#base/configs/sentry';
import apolloConfig from '#base/configs/apollo';
import UserGroupsStatistics from '#views/UserGroupsStatistics';
import MemberStatistics from '#views/MemberStatitics';

import styles from './styles.css';

if (sentryConfig) {
    init(sentryConfig);
}
export function parseQueryString(value: string) {
    const val = value.substring(1);
    return listToMap(
        val.split('&').map((token) => token.split('=')),
        (item) => item[0],
        (item) => item[1],
    );
}

interface Win {
    standaloneMode?: boolean;

    page?: string;

    // For member dashboard
    userGroupId?: string;
}

const query: Win = parseQueryString(window.location.search);

const currentPage = (window as Win).page || query.page;
const userGroupId = (window as Win).userGroupId || query.userGroupId;

const apolloClient = new ApolloClient(apolloConfig);

function Base() {
    const page = useMemo(
        () => {
            if (currentPage === 'usergroup-dashboard') {
                return (
                    <UserGroupsStatistics className={styles.view} />
                );
            }
            if (currentPage === 'member-dashboard') {
                return (
                    <MemberStatistics userGroupId={userGroupId} />
                );
            }

            return (
                <div>
                    <a href="/?page=usergroup-dashboard">
                        Usergroup Dashboard
                    </a>
                </div>
            );
        },
        [],
    );

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
                    {page}
                </ApolloProvider>
            </ErrorBoundary>
        </div>
    );
}

export default Base;
