export const getContainerHeight = (
  rowHeight: number,
  rowItemsCount: number,
  verticalGap: number
) => {
  return rowHeight * rowItemsCount + verticalGap * (rowItemsCount - 1);
};

export const getNumberOfRows = (totalItems: number, itemsPerRow: number) => {
  return Math.ceil(totalItems / itemsPerRow);
};

// index starts from 0
export const getItemRowByIndex = (index: number, columnsCount: number) => {
  return Math.floor(index / columnsCount);
};

// index starts from 0
export const getItemColumnByIndex = (index: number, columnsCount: number) => {
  const rowsCount = getNumberOfRows(index, columnsCount);
  return index - rowsCount * columnsCount;
};

export const getItemLeftPositionByIndex = (
  index: number,
  columnsCount: number,
  columnWidth: number,
  gridHorizontalGap: number
) => {
  const column = getItemColumnByIndex(index, columnsCount);
  return column * (columnWidth + gridHorizontalGap);
};

export const getItemTopPositionByIndex = (
  rowIndex: number,
  rowHeight: number,
  gridVerticalGap: number
) => {
  return rowIndex * (rowHeight + gridVerticalGap);
};
