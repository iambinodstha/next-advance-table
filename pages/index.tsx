import React from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.scss';
import { useTable, usePagination, Column, useSortBy, useResizeColumns, useFlexLayout, useAsyncDebounce, useGlobalFilter, useFilters, useExpanded } from 'react-table';

import mockData from "../json/MOCK_DATA.json";
import TablePagination from "./TablePagination";
import TableSort from "./TableSort";
import 'regenerator-runtime/runtime';
import { DefaultColumnFilter, SelectFilter, NumberRangeColumnFilter, SliderColumnFilter, SelectDateFilter } from "./TableFilter";
interface ExampleObject {
  first_name: string;
  last_name: string;
  gender: string;
  age: number;
  date: string;
  country: string;
  salary: number;
}

const columns: Column<ExampleObject>[] = [
  {
    Header: () => null, // No header
    id: 'expander', // It needs an ID
    Cell: ({ row }: any) => (
      <span {...row.getToggleRowExpandedProps()}>
        {row.isExpanded ? '👇' : '👉'}
      </span>
    ),
  },
  { Header: "Firt Name", accessor: "first_name" },
  { Header: "Last Name", accessor: "last_name" },
  { Header: "Gender", accessor: "gender", Filter: SelectFilter, filter: "exactText" },
  { Header: "Age", accessor: "age", Filter: SliderColumnFilter, filter: 'equals' },
  { Header: "Date", accessor: "date", Filter: SelectDateFilter },
  { Header: "Country", accessor: "country", Filter: SelectFilter, filter: "includesSome" },
  { Header: "Salary", accessor: "salary", Filter: NumberRangeColumnFilter, filter: 'between', },
];


const cellProps = (props: any, { cell }: any) => getStyles(props, cell.column.align)

const getStyles = (props: any, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
]

export default function Home() {

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    setGlobalFilter,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: mockData,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useResizeColumns,
    useFlexLayout,
  );

  const onChangeSearchQuery = useAsyncDebounce((value: any) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className={styles.container}>

      <Head>
        <title>React Advance Table</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className={styles.searchContainer}>
        <input
          className={styles.searchBox}
          style={{ width: '250px' }}
          type="text"
          placeholder="Global Search..."
          onChange={(e: any) => {
            onChangeSearchQuery(e.target.value)
          }}
        />
      </div>

      <div className={styles.tableWrapper}>

        <div {...getTableProps()} className={styles.table}>
          <div className={styles.thead}>
            {headerGroups.map((headerGroup, index) => (
              <div
                {...headerGroup.getHeaderGroupProps()}
                className={styles.tr}
                key={index}
              >
                {headerGroup.headers.map((column, index) => (
                  <div {...column.getHeaderProps()} className={styles.th} key={index}>
                    <div {...column.getSortByToggleProps()} className={styles.innerTh}>
                      {column.render('Header')}
                      <TableSort column={column} />
                    </div>

                    <div style={{ marginTop: '10px' }}>{column.canFilter ? column.render('Filter') : null}</div>

                    {column.canResize && (
                      <div
                        {...column.getResizerProps()}
                        className={styles.resizer}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.tbody}>
            {page.map(row => {
              prepareRow(row);
              const data = row.original;
              return (
                <React.Fragment key={row.id}>
                  <div {...row.getRowProps()} className={styles.tr}>
                    {row.cells.map((cell, index) => {
                      return (
                        <div {...cell.getCellProps(cellProps)} className={styles.td} key={index}>
                          {cell.render('Cell')}
                        </div>
                      )
                    })}
                  </div>

                  {row.isExpanded ? (
                    <div key="expanded-row" className={styles.tr}>
                      <span>Hi {data.first_name} {data.last_name}</span>
                    </div>
                  ) : null}
                </React.Fragment>
              )
            })}

            {page.length === 0 && (
              <div>
                <h1>No data found</h1>
              </div>
            )}

          </div>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <TablePagination
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageOptions={pageOptions}
          pageCount={pageCount}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </div>

    </div>
  )
}

Home.displayName = 'Home';