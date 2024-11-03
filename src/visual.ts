"use strict";
import powerbi from "powerbi-visuals-api";
// import { VisualConstructorOptions, VisualUpdateOptions } from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import VisualFormattingSettingsModel = powerbi.visuals.FormattingModel;
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
// import { VisualFormattingSettingsModel } from "./settings";

// import * as React from "react";
import React, { StrictMode } from 'react';
import * as ReactDOM from "react-dom";
import { HelloWorld, } from "./component";

import "./../style/visual.less";

// export class Visual implements IVisual {
//     private target: HTMLElement;
//     private reactRoot: React.ReactElement;
//     private formattingSettings: FormattingSettingsService;

//     constructor(options: VisualConstructorOptions) {
//         this.formattingSettings = new FormattingSettingsService();
//         this.target = options.element;

//         ReactDOM.render(React.createElement(HelloWorld as typeof HelloWorld), this.target);
//         this.reactRoot = React.createElement(HelloWorld, { text: "Hello, Worldss!" });
//     }

//     public update(options: VisualUpdateOptions) {
//         console.log('Update method called', options);
//         if (!options || !options.dataViews || !options.dataViews[0]) {
//             return;
//         }
//         // You can process dataView here if needed
//         // const dataView = options.dataViews[0];
        
//         // this.formattingSettings.populateFormattingSettingsModel(powerbi.extensibility.visual.FormattingSettingsModel);
        
//         ReactDOM.render(this.reactRoot, this.target);
//     }

//     public getFormattingModel(): powerbi.visuals.FormattingModel {
//         return 
//         {
//             cards: [
//                 {
//                     displayName: "Hello World Settings",
//                     uid: "helloWorldSettings",
//                     groups: []
//                 }
//             ]
//         };
//         }
//         // return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    
//     public destroy(): void  {
//         ReactDOM.unmountComponentAtNode(this.target);
//     }
// }


// visual.ts

import { createRoot } from "react-dom/client";
import MyGrid from './ag-grid';

export class Visual implements IVisual {
  private rootElement: HTMLElement;
  private reactRoot: ReactDOM.Root;

  constructor(options: VisualConstructorOptions) {
    this.rootElement = options.element;
    this.reactRoot = createRoot(this.rootElement); // Create React root
    ReactDOM.render(React.createElement(MyGrid as typeof MyGrid), this.rootElement);

    // this.reactRoot.render(
    //   <StrictMode>
    //     <MyGrid />

    //   </StrictMode>
    // );
  }

  public update(options: VisualUpdateOptions) {
    // Handle updates here if necessary
  }
}
