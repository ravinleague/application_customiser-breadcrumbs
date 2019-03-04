import * as React from "react";
import * as ReactDOM from "react-dom";
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'BreadcrumbsApplicationCustomizerStrings';

const LOG_SOURCE: string = 'BreadcrumbsApplicationCustomizer';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { SPComponentLoader } from "@microsoft/sp-loader";
require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IBreadcrumbsApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class BreadcrumbsApplicationCustomizer
  extends BaseApplicationCustomizer<IBreadcrumbsApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    SPComponentLoader.loadCss("https://treasuryqldtest.sharepoint.com/SiteAssets/MegaMenuCSS.css");
    let placeholder:PlaceholderContent;
    placeholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);

    let breadcrumbelement = null
    breadcrumbelement = React.createElement(Breadcrumbs);
    ReactDOM.render(breadcrumbelement,placeholder.domElement);



    return Promise.resolve();
  }
}
