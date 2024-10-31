// import * as React from 'react';
// import powerbi from 'powerbi-visuals-api';
// import { AgGridReact } from 'ag-grid-react';
// import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   getSortedRowModel,
//   getFilteredRowModel,
// } from '@tanstack/react-table';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// // import 'ag-grid-community/styles/ag-theme-alpine-dark.css';

// interface SuperTablesVisualProps {
//   dataView: powerbi.DataView;
//   host: powerbi.extensibility.visual.IVisualHost;
//   settings: {
//     enableSorting: boolean;
//     enableFiltering: boolean;
//     enableEditing: boolean;
//     theme: string;
//   };
// }

// export const SuperTablesVisual: React.FC<SuperTablesVisualProps> = ({ dataView, host, settings }) => {
//   const [columnDefs, setColumnDefs] = React.useState<ColDef[]>([]);
//   const [rowData, setRowData] = React.useState<any[]>([]);
//   const [gridApi, setGridApi] = React.useState<GridApi | null>(null);

//   React.useEffect(() => {
//     if (dataView.table) {
//       const columns = dataView.table.columns.map(column => ({
//         headerName: column.displayName,
//         field: column.displayName,
//         sortable: settings.enableSorting,
//         filter: settings.enableFiltering,
//         editable: settings.enableEditing,
//       }));
//       setColumnDefs(columns);

//       const rows = dataView.table.rows.map(row => {
//         const rowObj: { [key: string]: any } = {};
//         dataView.table.columns.forEach((column, index) => {
//           rowObj[column.displayName] = row[index];
//         });
//         return rowObj;
//       });
//       setRowData(rows);
//     }
//   }, [dataView, settings]);

//   const columnHelper = createColumnHelper<any>();

//   const columns = React.useMemo(
//     () => columnDefs.map(col => 
//       columnHelper.accessor(col.field, {
//         header: col.headerName,
//         cell: info => info.getValue(),
//       })
//     ),
//     [columnDefs]
//   );

//   const table = useReactTable({
//     data: rowData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//   });

//   const onGridReady = (params: GridReadyEvent) => {
//     setGridApi(params.api);
//     params.api.sizeColumnsToFit();
//   };

//   const onCellValueChanged = (event: any) => {
//     console.log('Cell value changed:', event);
//     host.persistProperties({
//       merge: [{
//         objectName: "general",
//         properties: {
//           filter: {
//             $schema: "https://powerbi.com/product/schema#basic",
//             target: {
//               table: dataView.table.name,
//               column: event.column.colId
//             },
//             operator: "Is",
//             values: [event.newValue]
//           }
//         }
//       }]
//     });
//   };

//   const exportToCsv = () => {
//     if (gridApi) {
//       gridApi.exportDataAsCsv();
//     }
//   };

//   const applyQuickFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (gridApi) {
//       gridApi.setQuickFilter(event.target.value);
//     }
//   };

//   return (
//     <div className="super-tables-visual">
//       <div className="controls">
//         <input
//           type="text"
//           onChange={applyQuickFilter}
//           placeholder="Quick filter..."
//           className="quick-filter"
//         />
//         <button onClick={exportToCsv} className="export-button">Export to CSV</button>
//       </div>
//       <div className={settings.theme} style={{ height: 'calc(100% - 40px)', width: '100%' }}>
//         <AgGridReact
//           columnDefs={columnDefs}
//           rowData={rowData}
//           onGridReady={onGridReady}
//           onCellValueChanged={onCellValueChanged}
//           defaultColDef={{
//             flex: 1,
//             minWidth: 100,
//             filter: settings.enableFiltering,
//             sortable: settings.enableSorting,
//             editable: settings.enableEditing,
//             resizable: true,
//           }}
//           enableRangeSelection={true}
//           copyHeadersToClipboard={true}
//           rowSelection="multiple"
//         />
//       </div>
//       <div className="tanstack-table">
//         <table>
//           <thead>
//             {table.getHeaderGroups().map(headerGroup => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map(header => (
//                   <th key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table.getRowModel().rows.map(row => (
//               <tr key={row.id}>
//                 {row.getVisibleCells().map(cell => (
//                   <td key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';
import powerbi from 'powerbi-visuals-api';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import { ChevronUp, ChevronDown } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface SuperTablesVisualProps {
  dataView: powerbi.DataView;
  host: powerbi.extensibility.visual.IVisualHost;
  settings: {
    enableSorting: boolean;
    enableFiltering: boolean;
    enableEditing: boolean;
    theme: string;
  };
}

export const SuperTablesVisual: React.FC<SuperTablesVisualProps> = ({ dataView, host, settings }) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const columnDefs: ColDef[] = useMemo(() => [
    { 
      headerName: '', 
      field: 'checkboxColumn', 
      width: 50, 
      checkboxSelection: true, 
      headerCheckboxSelection: true,
      filter: false,
      sortable: false
    },
    { headerName: 'Order ID', field: 'orderId', filter: 'agTextColumnFilter' },
    { 
      headerName: 'Order Date', 
      field: 'orderDate', 
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
          const dateAsString = cellValue;
          const dateParts = dateAsString.split('-');
          const cellDate = new Date(
            Number(dateParts[0]),
            Number(dateParts[1]) - 1,
            Number(dateParts[2])
          );
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },
    { headerName: 'Ship Mode', field: 'shipMode', filter: 'agTextColumnFilter' },
    { headerName: 'Product Name', field: 'productName', filter: 'agTextColumnFilter' },
    { headerName: 'Quantity', field: 'quantity', filter: 'agNumberColumnFilter' },
    { 
      headerName: 'Sales', 
      field: 'sales', 
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toFixed(2)}` : '';
      },
    },
    { 
      headerName: 'Profit', 
      field: 'profit', 
      filter: 'agNumberColumnFilter',
      cellRenderer: (params) => {
        const value = params.value;
        const formattedValue = value ? `$${Math.abs(value).toFixed(2)}` : '';
        const icon = value >= 0 ? <ChevronUp className="text-green-500" /> : <ChevronDown className="text-red-500" />;
        return (
          <div className="flex items-center">
            {icon}
            <span>{formattedValue}</span>
          </div>
        );
      },
    },
    { headerName: 'Category', field: 'category', filter: 'agTextColumnFilter' },
    { headerName: 'Sub-Category', field: 'subCategory', filter: 'agTextColumnFilter' },
  ], []);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    filter: settings.enableFiltering,
    sortable: settings.enableSorting,
    resizable: true,
  }), [settings]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  const rowData = useMemo(() => {
    if (dataView && dataView.table) {
      return dataView.table.rows.map((row, index) => ({
        id: index,
        orderId: row[0],
        orderDate: row[1],
        shipMode: row[2],
        productName: row[3],
        quantity: row[4],
        sales: row[5],
        profit: row[6],
        category: row[8],
        subCategory: row[9],
      }));
    }
    return [];
  }, [dataView]);

  return (
    <div className="super-tables-visual h-full w-full">
      <div className="ag-theme-alpine h-full w-full">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          groupSelectsChildren={true}
          rowGroupPanelShow={'always'}
        />
      </div>
    </div>
  );
};