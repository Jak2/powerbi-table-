"use strict";

import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import * as React from "react";
import * as ReactDOM from "react-dom";
import { SuperTablesVisual } from "./SuperTablesVisual";

export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.Root;
    private settings: {
        enableSorting: boolean;
        enableFiltering: boolean;
        enableEditing: boolean;
        theme: string;
    };
    private host: IVisualHost; // Add a host property

    constructor(options: VisualConstructorOptions) {
        this.reactRoot = ReactDOM.createRoot(options.element);
        this.target = options.element;
        this.host = options.host; // Store the host
        this.settings = {
            enableSorting: true,
            enableFiltering: true,
            enableEditing: false,
            theme: "ag-theme-alpine"
        };
    }

    public update(options: VisualUpdateOptions) {
        if (options.dataViews && options.dataViews[0]) {
            const dataView: DataView = options.dataViews[0];
            const objectProperties = dataView.metadata.objects;
            if (objectProperties) {
                const tableSettings = objectProperties['tableSettings'];
                if (tableSettings) {
                    this.settings.enableSorting = tableSettings['enableSorting'] as boolean;
                    this.settings.enableFiltering = tableSettings['enableFiltering'] as boolean;
                    this.settings.enableEditing = tableSettings['enableEditing'] as boolean;
                    this.settings.theme = tableSettings['theme'] as string;
                }
            }
            // Use the stored host here
            this.reactRoot.render(
                React.createElement(SuperTablesVisual, {
                    dataView: dataView,
                    host: this.host, // Use stored host
                    settings: this.settings
                })
            );
        } else {
            this.reactRoot.render(React.createElement("div", null, "No data to display"));
        }
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        const objectName = options.objectName;
        const objectEnumeration: VisualObjectInstance[] = [];

        switch (objectName) {
            case 'tableSettings':
                objectEnumeration.push({
                    objectName: objectName,
                    properties: {
                        enableSorting: this.settings.enableSorting,
                        enableFiltering: this.settings.enableFiltering,
                        enableEditing: this.settings.enableEditing,
                        theme: this.settings.theme
                    },
                    selector: null
                });
                break;
        }

        return objectEnumeration;
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this.target);
    }
}