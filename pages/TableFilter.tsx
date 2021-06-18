import React from 'react';
import styles from '../styles/Home.module.scss';
import Select from "react-select";
import dayjs from "dayjs";

export function DefaultColumnFilter({
    column: { filterValue, setFilter },
}: any) {
    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            className={styles.searchBox}
            placeholder={`Search...`}
        />
    )
}


const selectStyles = {
    control: (base: any) => ({
        ...base,
        minHeight: "34px",
        maxHeight: "60px",
        overflow: "auto"
    }),
    option: (base: any) => ({
        ...base,
        color: "#333",
    }),
};

export function SelectFilter({ column }: any) {
    const { setFilter, preFilteredRows, id, filter } = column;
    const isMulti = filter === "includesSome"

    const selectOptions = React.useMemo(() => {
        const options: any = new Set()
        preFilteredRows.forEach((row: any) => {
            options.add(row.values[id])
        })

        return [...options.values()].map(value => ({ label: value, value }))
    }, [id, preFilteredRows]);

    return (
        <Select
            instanceId={id}
            className="react-select-container"
            classNamePrefix='filter'
            options={selectOptions}
            onChange={(e: any) => {
                const allValues = (isMulti ? e?.map((value: any) => value.value) : e?.value) ?? undefined;
                setFilter(allValues);
            }}
            isMulti={isMulti}
            isClearable
            styles={selectStyles}
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary25: "#00b25a",
                    primary: "#00b25a",
                },
            })}
        />
    )
}

export function SelectDateFilter({ column }: any) {
    const { setFilter, preFilteredRows, id, filter } = column;
    const isMulti = filter === "includesSome"

    const selectOptions = React.useMemo(() => {
        const options: any = new Set()
        preFilteredRows.forEach((row: any) => {
            const year = dayjs(row.values[id], 'YYYY-MM-DD').format('YYYY')
            options.add(year)
        })

        return [...options.values()].sort().map(value => ({ label: value, value }))
    }, [id, preFilteredRows]);


    return (
        <Select
            instanceId={id}
            className="react-select-container"
            classNamePrefix='filter'
            options={selectOptions}
            onChange={(e: any) => {
                const allValues = (isMulti ? e?.map((value: any) => value.value) : e?.value) ?? undefined;
                setFilter(allValues);
            }}
            isMulti={isMulti}
            isClearable
            styles={selectStyles}
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary25: "#00b25a",
                    primary: "#00b25a",
                },
            })}
        />
    )
}


export function NumberRangeColumnFilter({
    column: { filterValue = [], preFilteredRows, setFilter, id },
}: any) {
    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        preFilteredRows.forEach((row: any) => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
        })
        return [min, max]
    }, [id, preFilteredRows])

    return (
        <div
            style={{
                display: 'flex',
            }}
        >
            <input
                value={filterValue[0] || ''}
                type="number"
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
                }}
                placeholder={`Min (${min})`}
                style={{
                    width: '100%',
                    marginRight: '0.5rem',
                }}
            />
            to
            <input
                value={filterValue[1] || ''}
                type="number"
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
                }}
                placeholder={`Max (${max})`}
                style={{
                    width: '100%',
                    marginLeft: '0.5rem',
                }}
            />
        </div>
    )
}

export function SliderColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
}: any) {
    // Calculate the min and max
    // using the preFilteredRows

    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        preFilteredRows.forEach((row: any) => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
        })
        return [min, max]
    }, [id, preFilteredRows])

    return (
        <>
            <div className={styles.rangeWrap}>
                <input
                    className={styles.range}
                    type="range"
                    min={min}
                    max={max}
                    value={filterValue || min}
                    onChange={e => {
                        setFilter(parseInt(e.target.value, 10))
                    }}
                />
                <output
                    style={{ left: `calc(${(((filterValue || min) - min) * 100) / (max - min)}%)` }}
                    className={styles.bubble}>{filterValue || min}</output>
            </div>
            <button onClick={() => setFilter(undefined)}>Reset</button>
        </>
    )
}

SliderColumnFilter.displayName = 'SliderColumnFilter';
NumberRangeColumnFilter.displayName = 'NumberRangeColumnFilter';
SelectFilter.displayName = 'SelectFilter';
SelectDateFilter.displayName = 'SelectDateFilter';
DefaultColumnFilter.displayName = 'DefaultColumnFilter';

export default function() {
    return "";
}