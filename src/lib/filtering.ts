"use client";

import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FilterValue = string | number;
type FilterMap = Record<string, FilterValue[]>;

interface UseSyncedFiltersOptions<T extends FilterMap> {
    searchParam?: string;
    filterParams: { [K in keyof T]: string };
    parseFilter: { [K in keyof T]: (value: string | null) => T[K] };
}

interface UseSyncedFiltersResult<T extends FilterMap> {
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    filters: T;
    setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
    toggleFilterValue: <K extends keyof T>(key: K, value: T[K][number]) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
}

export function parseCsvStringList(value: string | null): string[] {
    return value?.split(",").filter(Boolean) ?? [];
}

export function parseCsvNumberList(value: string | null): number[] {
    return value?.split(",").map(Number).filter((n) => !Number.isNaN(n)) ?? [];
}

export function useSyncedFilters<T extends FilterMap>({
    searchParam = "search",
    filterParams,
    parseFilter,
}: UseSyncedFiltersOptions<T>): UseSyncedFiltersResult<T> {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const filterParamsRef = useRef(filterParams);
    const parseFilterRef = useRef(parseFilter);

    useEffect(() => {
        filterParamsRef.current = filterParams;
        parseFilterRef.current = parseFilter;
    }, [filterParams, parseFilter]);

    // Filter config is expected to be static for a page; keeping these keys stable
    // prevents URL/state sync effects from re-running due to object identity changes.
    const filterKeys = useMemo(
        () => Object.keys(filterParamsRef.current) as Array<keyof T>,
        []
    );

    const [searchQuery, setSearchQuery] = useState(searchParams.get(searchParam) || "");
    const [filters, setFilters] = useState<T>(() => {
        const next = {} as T;

        filterKeys.forEach((key) => {
            const paramName = filterParamsRef.current[key];
            next[key] = parseFilterRef.current[key](searchParams.get(paramName));
        });

        return next;
    });

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        let needsUpdate = false;

        if (searchQuery !== (searchParams.get(searchParam) || "")) {
            searchQuery ? params.set(searchParam, searchQuery) : params.delete(searchParam);
            needsUpdate = true;
        }

        filterKeys.forEach((key) => {
            const paramName = filterParamsRef.current[key];
            const currentValue = filters[key].join(",");
            if (currentValue !== (searchParams.get(paramName) || "")) {
                currentValue ? params.set(paramName, currentValue) : params.delete(paramName);
                needsUpdate = true;
            }
        });

        if (needsUpdate) {
            const newQuery = params.toString();
            const url = newQuery ? `${pathname}?${newQuery}` : pathname;
            router.replace(url, { scroll: false });
        }
    }, [searchQuery, filters, filterKeys, pathname, router, searchParam, searchParams]);

    useEffect(() => {
        setSearchQuery(searchParams.get(searchParam) || "");
        setFilters((prev) => {
            let changed = false;
            const next = { ...prev };

            filterKeys.forEach((key) => {
                const paramName = filterParamsRef.current[key];
                const parsed = parseFilterRef.current[key](searchParams.get(paramName));
                if (prev[key].join(",") !== parsed.join(",")) {
                    next[key] = parsed;
                    changed = true;
                }
            });

            return changed ? next : prev;
        });
    }, [searchParams, searchParam, filterKeys]);

    const setFilter = <K extends keyof T>(key: K, value: T[K]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const toggleFilterValue = <K extends keyof T>(key: K, value: T[K][number]) => {
        setFilters((prev) => {
            const currentValues = prev[key];
            const hasValue = currentValues.some((v) => v === value);
            const nextValues = hasValue
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];

            return { ...prev, [key]: nextValues as T[K] };
        });
    };

    const clearFilters = () => {
        setSearchQuery("");
        setFilters((prev) => {
            const next = {} as T;
            filterKeys.forEach((key) => {
                next[key] = [] as unknown as T[typeof key];
            });
            return next;
        });
    };

    const hasActiveFilters = useMemo(() => {
        if (searchQuery !== "") {
            return true;
        }

        return filterKeys.some((key) => filters[key].length > 0);
    }, [searchQuery, filters, filterKeys]);

    return {
        searchQuery,
        setSearchQuery,
        filters,
        setFilter,
        toggleFilterValue,
        clearFilters,
        hasActiveFilters,
    };
}

interface FacetCountOptions<TItem, TValue extends FilterValue> {
    items: TItem[];
    values: TValue[];
    selectedValues: TValue[];
    isMatch: (item: TItem, selectedValues: TValue[]) => boolean;
}

export function computeFacetCounts<TItem, TValue extends FilterValue>({
    items,
    values,
    selectedValues,
    isMatch,
}: FacetCountOptions<TItem, TValue>): Record<string, number> {
    const counts: Record<string, number> = {};

    values.forEach((value) => {
        const alreadySelected = selectedValues.some((selected) => selected === value);
        const nextValues = alreadySelected ? selectedValues : [...selectedValues, value];

        counts[String(value)] = items.filter((item) => isMatch(item, nextValues)).length;
    });

    return counts;
}