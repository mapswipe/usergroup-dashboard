import React, { useCallback, useMemo, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Container,
    Pager,
    TextInput,
    TableView,
    TextOutput,
    createStringColumn,
    createNumberColumn,
} from '@the-deep/deep-ui';
import {
    IoSearchSharp,
} from 'react-icons/io5';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    UserGroupMemberQuery,
    UserGroupMemberQueryVariables
} from '#generated/types';

import { secondsToDisplayTime } from '#utils/common';

import styles from './styles.css';

type Member = UserGroupMemberQuery['userGroups']['items'][number]['userMemberships']['items'][number];

function memberKeySelector(member: Member) {
    return member.user.userId;
}

const USERGROUP_MEMBER = gql`
    query UserGroupMember($userGroupId: String!) {
        userGroups(filters: {userGroupId: {exact: $userGroupId}}) {
            count
            items {
                description
                name
                stats {
                    totalSwipe
                    totalSwipeTime
                }
                userMemberships {
                    count
                    items {
                        stats {
                            totalSwipe
                            totalSwipeTime
                        }
                        user {
                            userId
                            username
                        }
                    }
                }
            }
        }
    }
`;

interface Props {
    className?: string;
    userGroupId?: string;
}

function MemberStatistics(props: Props) {
    const {
        className,
        userGroupId,
    } = props;

    const [activePage, setActivePage] = useState<number>(1);
    const [maxItemsPerPage, setMaxItemsPerPage] = useState(10);
    const [search, setSearch] = useState<string | undefined>(undefined);

    const {
        data: memberData,
    } = useQuery<UserGroupMemberQuery, UserGroupMemberQueryVariables>(
        USERGROUP_MEMBER,
        {
            skip: !userGroupId,
            variables: {
                userGroupId: userGroupId as string,
            },
        },
    );

    console.info('data', memberData);

    const handleMaxItemsPerPageChange = useCallback((maxItems: number) => {
        setMaxItemsPerPage(maxItems);
        setActivePage(1);
    }, []);

    const handleSearchTextChange = useCallback((searchText: string | undefined) => {
        setSearch(searchText);
        setActivePage(1);
    }, []);

    const columns = useMemo(() => ([
        createStringColumn<Member, string>(
            'name',
            'Member Name',
            (item) => item.user.username,
        ),
        createStringColumn<Member, string>(
            'totalTime',
            'Total time spent swipping',
            (item) => secondsToDisplayTime(item.stats.totalSwipeTime),
        ),
        createNumberColumn<Member, string>(
            'totalSwipes',
            'Total number of swipes',
            (item) => item.stats.totalSwipe,
        ),
    ]), []);

    const userGroup = memberData?.userGroups?.items?.[0];

    return (
        <Container
            className={_cs(styles.membersStatistics, className)}
            footerActions={userGroup && (
                <Pager
                    activePage={activePage}
                    itemsCount={userGroup.userMemberships.count}
                    maxItemsPerPage={maxItemsPerPage}
                    onItemsPerPageChange={handleMaxItemsPerPageChange}
                    onActivePageChange={setActivePage}
                />
            )}
            heading={userGroup?.name}
            headerDescription={userGroup?.description}
            headerActions={(
                <TextInput
                    variant="general"
                    className={styles.searchInput}
                    icons={<IoSearchSharp />}
                    placeholder="Search"
                    name={undefined}
                    value={search}
                    type="search"
                    onChange={handleSearchTextChange}
                />
            )}
        >
            <div className={styles.groupStats}>
                <TextOutput
                    label="Number of Swipes"
                    value={userGroup?.stats.totalSwipe}
                />
                <TextOutput
                    label="Total Swipe Duration"
                    value={secondsToDisplayTime(userGroup?.stats.totalSwipeTime ?? 0)}
                />
            </div>
            <TableView
                className={styles.table}
                data={userGroup?.userMemberships?.items}
                keySelector={memberKeySelector}
                emptyMessage="No members available."
                columns={columns}
                filtered={false}
                errored={false}
                pending={false}
                erroredEmptyMessage="Failed to fetch user group members."
                filteredEmptyMessage="No matching user group members found."
                messageShown
            />
        </Container>
    );
}

export default MemberStatistics;
