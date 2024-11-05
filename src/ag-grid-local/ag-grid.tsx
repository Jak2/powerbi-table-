// MyGrid.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../../style/styles.css"; 
import { IOlympicData } from "./interface";
import olympicWinners from "./json-data-exporter.js";
import { ColDef, GridReadyEvent, IDateFilterParams } from "ag-grid-community";

const MyGrid: React.FC = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [isCompact, setIsCompact] = useState(false);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", filter: "agTextColumnFilter" },
    { field: "age", filter: "agNumberColumnFilter", maxWidth: 100 },
    { field: "country", rowGroup: true, hide: true },
    { field: "year", maxWidth: 100 },
    { field: "date", filter: "agDateColumnFilter", filterParams: filterParams },
    { field: "sport" },
    { field: "gold", filter: "agNumberColumnFilter", aggFunc: "sum" },
    { field: "silver", filter: "agNumberColumnFilter", aggFunc: "sum" },
    { field: "bronze", filter: "agNumberColumnFilter", aggFunc: "sum" },
    { field: "total", filter: "agNumberColumnFilter", aggFunc: "sum" },
  ]);
  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 150,
    // allow every column to be aggregated
    enableValue: true,
    // allow every column to be grouped
    enableRowGroup: true,
    // allow every column to be pivoted
    enablePivot: true,
    filter: true,
    sortable: true,
    resizable: true,
  }), []);
  const sideBar = useMemo(() => { 
    return {
          toolPanels: [
              {
                  id: 'columns',
                  labelDefault: 'Columns',
                  labelKey: 'columns',
                  iconKey: 'columns',
                  toolPanel: 'agColumnsToolPanel',
                  minWidth: 225,
                  maxWidth: 225,
                  width: 225
              },
              {
                  id: 'filters',
                  labelDefault: 'Filters',
                  labelKey: 'filters',
                  iconKey: 'filter',
                  toolPanel: 'agFiltersToolPanel',
                  minWidth: 180,
                  maxWidth: 400,
                  width: 250
              }
          ],
          position: 'left',
          defaultToolPanel: 'filters'
      };
  }, []);

 
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);

  const rowSelection = useMemo(() => { 
    return { 
          mode: 'multiRow' 
      };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    // fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    //   .then((resp) => resp.json())
    //   .then((data) => setRowData(data));
    setRowData(olympicWinners); // Load data into the grid
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={gridStyle} className={isCompact ? "ag-theme-quartz compact-theme" : "ag-theme-quartz"}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            sideBar={['columns','filters']}
            onGridReady={onGridReady}
            rowSelection={rowSelection}
            groupIncludeFooter
            animateRows
          />
        </div>
      </div>
    </div>
  );
};

export default MyGrid;

// Date filter comparator
var filterParams: IDateFilterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split("/");
    var cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0])
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) return 0;
    return cellDate < filterLocalDateAtMidnight ? -1 : 1;
  },
};
