import React from 'react';
import Image from 'next/image';

import caretUp from '../assets/images/caret-up.svg';
import caretDown from '../assets/images/caret-down.svg';

interface Props {
    column: any
}

const TableSort = ({ column }: Props) => {
    return (
        <span>
            {(!column.isSorted || !column.isSortedDesc) && <Image src={caretUp} alt="caret-down" />}
            {(!column.isSorted || column.isSortedDesc) && <Image src={caretDown} alt="caret-down" />}

            {/* {(column.isSorted) && <Image src={!column.isSortedDesc ? caretUp : caretDown} alt="caret-down" />} */}
        </span>
    )
}

export default TableSort