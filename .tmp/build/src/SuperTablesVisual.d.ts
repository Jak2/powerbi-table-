import * as React from 'react';
import powerbi from 'powerbi-visuals-api';
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
export declare const SuperTablesVisual: React.FC<SuperTablesVisualProps>;
export {};
