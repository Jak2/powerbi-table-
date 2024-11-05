// MyGrid.tsx
import React, { useCallback, useMemo, useRef, useState, StrictMode } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../../style/styles.css"; // Ensure this file is available in your project
import { IOlympicData } from "./interface.js";
// import olympicWinners from './olympic-winners.json';
import olympicWinners from './json-data-exporter.js';
import {
    ColDef,
    ColGroupDef,
    GridApi,
    GridOptions,
    GridReadyEvent,
    IDateFilterParams,
    SideBarDef,
    createGrid,
  } from "ag-grid-community";

var savedFilterModel: any = null;

const MyGrid: React.FC = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", filter: "agTextColumnFilter" },
    { field: "age", filter: "agNumberColumnFilter", maxWidth: 100 },
    { field: "country" },
    { field: "year", maxWidth: 100 },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: filterParams,
    },
    { field: "sport" },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: "agNumberColumnFilter" },
  ]);
  const defaultColDef = useMemo(() => ({ flex: 1, minWidth: 150, filter: true }), []);

  // const onGridReady = useCallback((params: GridReadyEvent) => {
  //   fetch("./olympic-winners.json")
  //     .then((resp) => resp.json())
  //     .then((data: IOlympicData[]) => setRowData(data));
  //   params.api.getToolPanelInstance("filters")!.expandFilters();
  // }, []);

  // const onGridReady = useCallback(async (params: GridReadyEvent) => {
  //   // Use import for local JSON data
  //   const response = await import('./olympic-winners.json');
  //   setRowData(response.default); // Use .default if the JSON was exported as default
  //   params.api.getToolPanelInstance("filters")!.expandFilters();
  // }, []);
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setRowData(olympicWinners); // Use the imported data
    params.api.getToolPanelInstance("filters")!.expandFilters();
  }, []);
  

  const clearFilters = useCallback(() => {
    gridRef.current!.api.setFilterModel(null);
  }, []);

  const saveFilterModel = useCallback(() => {
    savedFilterModel = gridRef.current!.api.getFilterModel();
    var keys = Object.keys(savedFilterModel);
    var savedFilters: string = keys.length > 0 ? keys.join(", ") : "(none)";
    (document.querySelector("#savedFilters") as any).textContent = savedFilters;
  }, []);

  const restoreFilterModel = useCallback(() => {
    gridRef.current!.api.setFilterModel(savedFilterModel);
  }, [savedFilterModel]);

  const restoreFromHardCoded = useCallback(() => {
    var hardcodedFilter = {
      country: {
        type: "set",
        values: ["Ireland", "United States"],
      },
      age: { type: "lessThan", filter: "30" },
      athlete: { type: "startsWith", filter: "Mich" },
      date: { type: "lessThan", dateFrom: "2010-01-01" },
    };
    gridRef.current!.api.setFilterModel(hardcodedFilter);
  }, []);

  const destroyFilter = useCallback(() => {
    gridRef.current!.api.destroyFilter("athlete");
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
      <div>
          <div className="button-group">
            <button onClick={saveFilterModel}>Save Filter Model</button>
            <button onClick={restoreFilterModel}>
              Restore Saved Filter Model
            </button>
            <button
              onClick={restoreFromHardCoded}
              title="Name = 'Mich%', Country = ['Ireland', 'United States'], Age < 30, Date < 01/01/2010"
            >
              Set Custom Filter Model
            </button>
            <button onClick={clearFilters}>Reset Filters</button>
            <button onClick={destroyFilter}>Destroy Filter</button>
          </div>
        </div>
        <div>
          <div className="button-group">
            Saved Filters: <span id="savedFilters">(none)</span>
          </div>
        </div>
        <div style={gridStyle} className={"ag-theme-quartz-dark"}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            sideBar={"filters"}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  );
};

export default MyGrid;


var filterParams: IDateFilterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split("/");
    var cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0]),
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
};
