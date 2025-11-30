export const getContainerHeight = (
  rowHeight: number,
  rowItemsCount: number,
  verticalGap: number
) => {
  return rowHeight * rowItemsCount + verticalGap * (rowItemsCount - 1);
};
