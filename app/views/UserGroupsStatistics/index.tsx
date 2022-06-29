import React, { useCallback, useMemo, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Container,
    Pager,
    TextInput,
    TableView,
    createStringColumn,
    createNumberColumn,
    TableHeaderCell,
    TableColumn,
    TableHeaderCellProps,
} from '@the-deep/deep-ui';
import {
    IoSearchSharp,
} from 'react-icons/io5';
import {
    gql,
    useQuery,
} from '@apollo/client';

import {
    UserGroupListQuery,
    UserGroupListQueryVariables,
} from '#generated/types';
import { secondsToDisplayTime } from '#utils/common';

import styles from './styles.css';

const USERGROUP_LIST = gql`
    query UserGroupList {
        userGroups {
            items {
                name
                stats {
                    totalSwipe
                    totalSwipeTime
                }
                userGroupId
                userMemberships {
                    count
                }
            }
            count
        }
    }
`;

type UserGroup = UserGroupListQuery['userGroups']['items'][number];

function userGroupKeySelector(userGroup: UserGroup) {
    return userGroup.userGroupId;
}

interface MemberProps {
    userGroupId: string;
    children: React.ReactNode;
}

function MemberLink({
    userGroupId,
    children,
}: MemberProps) {
    return (
        <a href={`/?page=member-dashboard&userGroupId=${userGroupId}`}>
            {children}
        </a>
    );
}

const titleColumn: TableColumn<UserGroup, string, MemberProps, TableHeaderCellProps> = {
    id: 'name',
    title: 'Group Name',
    headerCellRenderer: TableHeaderCell,
    headerCellRendererParams: {},
    cellRenderer: MemberLink,
    cellRendererParams: (_: string, item: UserGroup) => ({
        children: item.name,
        userGroupId: item.userGroupId,
    }),
};

interface Props {
    className?: string;
}

function UserGroupsStatistics(props: Props) {
    const {
        className,
    } = props;

    const [activePage, setActivePage] = useState<number>(1);
    const [maxItemsPerPage, setMaxItemsPerPage] = useState(10);
    const [search, setSearch] = useState<string | undefined>(undefined);

    const handleMaxItemsPerPageChange = useCallback((maxItems: number) => {
        setMaxItemsPerPage(maxItems);
        setActivePage(1);
    }, []);

    const handleSearchTextChange = useCallback((searchText: string | undefined) => {
        setSearch(searchText);
        setActivePage(1);
    }, []);

    const {
        data: userGroupData,
    } = useQuery<UserGroupListQuery, UserGroupListQueryVariables>(
        USERGROUP_LIST,
    );

    const columns = useMemo(() => ([
        titleColumn,
        createStringColumn<UserGroup, string>(
            'totalTime',
            'Total time spent swipping',
            (item) => secondsToDisplayTime(item.stats.totalSwipeTime),
        ),
        createNumberColumn<UserGroup, string>(
            'totalSwipes',
            'Total number of swipes',
            (item) => item.stats.totalSwipe,
        ),
        createNumberColumn<UserGroup, string>(
            'membersCount',
            'Members',
            (item) => item.userMemberships.count,
        ),
    ]), []);

    return (
        <Container
            className={_cs(styles.userGroupsStatistics, className)}
            footerActions={userGroupData && (
                <Pager
                    className={styles.out}
                    activePage={activePage}
                    itemsCount={userGroupData.userGroups.count}
                    maxItemsPerPage={maxItemsPerPage}
                    onItemsPerPageChange={handleMaxItemsPerPageChange}
                    onActivePageChange={setActivePage}
                />
            )}
            headerDescriptionClassName={styles.filters}
            headerDescription={(
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
            <TableView
                className={styles.table}
                data={userGroupData?.userGroups?.items}
                keySelector={userGroupKeySelector}
                emptyMessage="No user groups available."
                columns={columns}
                filtered={false}
                errored={false}
                pending={false}
                erroredEmptyMessage="Failed to fetch user groups."
                filteredEmptyMessage="No matching user groups found."
                messageShown
            />
        </Container>
    );
}

export default UserGroupsStatistics;
