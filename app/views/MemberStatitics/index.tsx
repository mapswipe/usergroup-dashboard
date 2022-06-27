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
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    ProjectsQuery,
    ProjectsQueryVariables,
} from '#generated/types';

import styles from './styles.css';

interface Member {
    id: string;
    name: string;
    totalTime: number;
    totalSwipes: number;
    membersCount: number;
}

function memberKeySelector(member: Member) {
    return member.id;
}

const PROJECTS = gql`
    query Projects {
        projects {
            count
            items {
                name
                projectId
                status
            }
        }
    }
`;

interface Props {
    className?: string;
}

function MemberStatistics(props: Props) {
    const {
        className,
    } = props;

    const [activePage, setActivePage] = useState<number>(1);
    const [maxItemsPerPage, setMaxItemsPerPage] = useState(10);
    const [search, setSearch] = useState<string | undefined>(undefined);

    const {
        data: projectsData,
    } = useQuery<ProjectsQuery, ProjectsQueryVariables>(
        PROJECTS,
    );

    console.warn('data', projectsData);

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
            (item) => item.name,
        ),
        createStringColumn<Member, string>(
            'totalTime',
            'Total time spent swipping',
            (item) => `${item.totalTime} hours`,
        ),
        createNumberColumn<Member, string>(
            'totalSwipes',
            'Total number of swipes',
            (item) => item.totalSwipes,
        ),
        createNumberColumn<Member, string>(
            'totalSwipes',
            'Members',
            (item) => item.membersCount,
        ),
    ]), []);

    return (
        <Container
            className={_cs(styles.membersStatistics, className)}
            footerActions={(
                <Pager
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
