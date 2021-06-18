import React from 'react';
import styles from '../styles/Home.module.scss';
import Select from "react-select";

interface Props {
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageOptions: any;
  pageCount: number;
  gotoPage: (page: number) => void;
  nextPage: () => void,
  previousPage: () => void;
  setPageSize: (size: number) => void;
  pageIndex: number;
  pageSize: number
}

const TablePagination = React.memo((props: Props) => {
  const {
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize, pageIndex, pageSize } = props;
  return (
    <div className={styles.pagination}>
      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}

        <span style={{marginLeft: "10px"}}>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
      </div>

      <div style={{display: 'flex', alignItems: 'center'}}>
        <span>
          Go to page:
        </span>

        <input
          type="number"
          defaultValue={pageIndex + 1}
          onChange={e => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            gotoPage(page)
          }}
          className={styles.searchBox}
          style={{ width: '100px', margin: '0 15px 0 5px' }}
        />

        <Select
          instanceId="show-rows"
          className="react-select-container"
          classNamePrefix='filter'
          options={[10, 20, 30, 40, 50].map(value=> ({label: `Show ${value}`, value}))}
          onChange={(e: any) => {
            setPageSize(Number(e.value))
          }}
          styles={selectStyles}
          placeholder="Show rows"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: "#00b25a",
              primary: "#00b25a",
            },
          })}
        />

      </div>
    </div>
  )
});

export default TablePagination;

const selectStyles = {
  control: (base: any) => ({
      ...base,
      minWidth: "160px",
  }),
  option: (base: any) => ({
      ...base,
      color: "#333",
  }),
};