'use strict';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, GridReadyEvent, ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import React, { useMemo, useRef, useState } from 'react';

// Registering ag-Grid Modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

// Define the grid component
export const GridExample = ({ data }) => {
    const gridRef = useRef<AgGridReact>(null);
    const columnDefs = useMemo<ColDef[]>(() => [
        { field: 'athlete', width: 150 },
        { field: 'age', width: 90 },
        { field: 'country', width: 150 },
        { field: 'year', width: 90 },
        { field: 'date', width: 150 },
        { field: 'sport', width: 150 },
        { field: 'gold', width: 100 },
        { field: 'silver', width: 100 },
        { field: 'bronze', width: 100 },
        { field: 'total', width: 100 },
    ], []);

    return (
        <div className="example-wrapper">
            <div className="grid-wrapper ag-theme-quartz-dark" style={{ height: '100%', width: '100%' }}>
                <AgGridReact ref={gridRef} rowData={data} columnDefs={columnDefs} />
            </div>
        </div>
    );
};
