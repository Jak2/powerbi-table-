// MyGrid.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../../style/styles.css"; // Ensure this file is available in your project
import { IOlympicData } from "./interface";
import olympicWinners from "./json-data-exporter.js";
import {
    ColDef,
    ColGroupDef,
    GridApi,
    GridOptions,
    GridReadyEvent,
    IDateFilterParams,
    SideBarDef,
} from "ag-grid-community";

var savedFilterModel: any = null;

const MyGrid: React.FC = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [isCompact, setIsCompact] = useState(false);

  // Column definitions with aggregation for medal counts
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", filter: "agTextColumnFilter" },
    { field: "age", filter: "agNumberColumnFilter", maxWidth: 100 },
    { field: "country", rowGroup: true, hide: true },  // Group by country
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
    filter: true,
    sortable: true,
    resizable: true,
  }), []);

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
      country: { type: "set", values: ["Ireland", "United States"] },
      age: { type: "lessThan", filter: "30" },
      athlete: { type: "startsWith", filter: "Mich" },
      date: { type: "lessThan", dateFrom: "2010-01-01" },
    };
    gridRef.current!.api.setFilterModel(hardcodedFilter);
  }, []);

  const destroyFilter = useCallback(() => {
    gridRef.current!.api.destroyFilter("athlete");
  }, []);

  // Toggle compact view
  const toggleCompactView = useCallback(() => {
    setIsCompact(prev => !prev);
    gridRef.current!.api.sizeColumnsToFit();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div>
          <div className="button-group">
            <button onClick={saveFilterModel}>Save Filter Model</button>
            <button onClick={restoreFilterModel}>Restore Saved Filter Model</button>
            <button
              onClick={restoreFromHardCoded}
              title="Name = 'Mich%', Country = ['Ireland', 'United States'], Age < 30, Date < 01/01/2010"
            >
              Set Custom Filter Model
            </button>
            <button onClick={clearFilters}>Reset Filters</button>
            <button onClick={destroyFilter}>Destroy Filter</button>
            <label>
              <input type="checkbox" onChange={toggleCompactView} />
              Compact View
            </label>
          </div>
        </div>
        <div>
          <div className="button-group">
            Saved Filters: <span id="savedFilters">(none)</span>
          </div>
        </div>
        <div style={gridStyle} className={isCompact ? "ag-theme-quartz compact-theme" : "ag-theme-quartz"}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            sideBar={"filters"}
            onGridReady={onGridReady}
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
