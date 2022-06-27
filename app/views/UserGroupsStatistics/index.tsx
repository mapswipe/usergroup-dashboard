import React, { useCallback, useMemo, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Container,
    Pager,
    TextInput,
    TableView,
    createStringColumn,
    createNumberColumn,
} from '@the-deep/deep-ui';
import {
    IoSearchSharp,
} from 'react-icons/io5';

import styles from './styles.css';

interface UserGroup {
    id: string;
    name: string;
    totalTime: number;
    totalSwipes: number;
    membersCount: number;
}

function userGroupKeySelector(userGroup: UserGroup) {
    return userGroup.id;
}
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

    const columns = useMemo(() => ([
        createStringColumn<UserGroup, string>(
            'name',
            'Group Name',
            (item) => item.name,
        ),
        createStringColumn<UserGroup, string>(
            'totalTime',
            'Total time spent swipping',
            (item) => `${item.totalTime} hours`,
        ),
        createNumberColumn<UserGroup, string>(
            'totalSwipes',
            'Total number of swipes',
            (item) => item.totalSwipes,
        ),
        createNumberColumn<UserGroup, string>(
            'totalSwipes',
            'Members',
            (item) => item.membersCount,
        ),
    ]), []);

    return (
        <Container
            className={_cs(styles.userGroupsStatistics, className)}
            footerActions={(
                <Pager
                    className={styles.out}
                    activePage={activePage}
                    itemsCount={100}
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
                data={[]}
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
