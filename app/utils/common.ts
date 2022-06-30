import { memo } from 'react';
import {
    isFalsy,
    isFalsyString,
    caseInsensitiveSubmatch,
    compareStringSearch,
} from '@togglecorp/fujs';

export function rankedSearchOnList<T>(
    list: T[],
    searchString: string | undefined,
    labelSelector: (item: T) => string,
) {
    if (isFalsyString(searchString)) {
        return list;
    }

    return list
        .filter((option) => caseInsensitiveSubmatch(labelSelector(option), searchString))
        .sort((a, b) => compareStringSearch(
            labelSelector(a),
            labelSelector(b),
            searchString,
        ));
}

export const genericMemo: (<T>(c: T) => T) = memo;

export const getHashFromBrowser = () => window.location.hash.substr(2);
export const setHashToBrowser = (hash: string | undefined) => {
    if (hash) {
        window.location.replace(`#/${hash}`);
    } else {
        window.location.hash = '';
    }
};

export function isValidNumber(value: unknown): value is number {
    if (isFalsy(value)) {
        return false;
    }

    if (Number.isNaN(+(value as number))) {
        return false;
    }

    if (value === null) {
        return false;
    }

    return true;
}

export function secondsToDisplayTime(sec: number) {
    if (sec < 3600) {
        return 'Less than an hour';
    }

    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);

    if (mins === 0) {
        return `${hours} hours`;
    }

    return `${hours} hours, ${mins} mins`;
}

export const standaloneMode = (window as { standaloneMode?: boolean }).standaloneMode ?? false;

export function getUsergroupDashboardPageLink() {
    // NOTE: we need to also add countryName on standaloneMode url
    return standaloneMode
        ? '/?page=usergroup-dashboard'
        : '/en/user-groups.html';
}

export function getMemberDashboardPageLink(id: string) {
    // NOTE: we need to also add countryName on standaloneMode url
    return standaloneMode
        ? `/?page=member-dashboard&userGroupId=${id}`
        : `/en/user-group.html?userGroupId=${id}`;
}
