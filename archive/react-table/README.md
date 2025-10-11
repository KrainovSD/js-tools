# @krainovsd/react-table

The library of react-table components based on @tanstack/react-table.

## Installing

### Package manager

Using pnpm:
```
pnpm install @krainovsd/react-table
```

## Usage

```js
import { Table } from "@krainovsd/react-table"

<Table<
    Row,
    CellRenderKeys,
    HeaderRenderKeys,
    FilterRenderKeys,
    SortRenderKeys,
    CellClassKeys,
    HeaderClassKeys,
    FilterTypeKeys,
    SortTypeKeys
>
    columns={columns}
    rows={rows}
    getSubRows={(row) => row.children}
    withPagination
    initialPageSize={150}
    onClickRow={(row) => {
    console.log(row, "click");
    }}
    onDoubleClickRow={(row) => {
    console.log(row, "dbClick");
    }}
    pageSizes={[25, 50, 100, 150, 250]}
    withFilters={true}
    virtualRows={true}
    virtualColumn={false}
/>
```
