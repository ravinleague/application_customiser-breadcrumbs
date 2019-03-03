import * as React from "react";
import PropTypes from 'proptypes';
import * as ReactDOM from "react-dom";
import { SPComponentLoader } from '@microsoft/sp-loader';

//import * as breadcrumbsUtils from './BreadcrumbsUtils';
import styles from './Breadcrumbs.module.scss'
import IBreadcrumbProps from "./IBreadcrumbProps";
import IBreadcrumbState from "./IBreadcrumbState";
require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');

class Breadcrumbs extends React.Component<IBreadcrumbProps,IBreadcrumbState> {
  getNavigationData = null;
  static propTypes: { navRootWebUrl: any; };
  constructor(props) {
    super(props);

    this.state = {
     links:[{title:'One',url:''},{title:'Two',url:''},{title:'Three',url:''}],
     pageTitle:'Current Page'
    };
  }

  componentDidMount() {
    SPComponentLoader.loadScript('https://jellypod.sharepoint.com/testnav/SiteAssets/utilities/BreadcrumbsUtils.js', 
    { globalExportsName: 'getNavigationData' }).then((getNavigationData: any): void => {
      this.getNavigationData = getNavigationData;  
      getNavigationData("https://jellypod.sharepoint.com")
          .then(data => {
            if (data) {
              this.setState({ pageTitle: data.pageTitle, links: data.links });
            }
          })
          .catch(error => console.error(error));
    });
    

    
   
   // this.setState({pageTitle:'ABC',links:[{title:'AAA',url:''},{title:'BBB',url:''},{title:'',url:'CCC'}]})
     //const { navRootWebUrl } = this.props;
    //  breadcrumbsUtils.getNavigationData("https://jellypod.sharepoint.com")
    //    .then(data => {
    //      if (data) {
    //        this.setState({ pageTitle: data.pageTitle, links: data.links });
    //      }
    //    })
    //    .catch(error => console.error(error));
  }

  public render(): React.ReactElement<any> {
    
    if (this.state.links.length === 0) {
      // Return an empty list item to prevent the content bouncing around.
      return (
        <div className="breadcrumbs">
          <ul>
            <li>&nbsp;</li>
          </ul>
        </div>
      );
    }

    return (
      <div className={styles.breadcrumb}>
        <ul>
          {this.state.links.map(link => {
            return <li key={link.title}><a href={link.url}>{link.title}</a></li>;
          })}
          <li>{this.state.pageTitle}</li>
        </ul>
      </div>
    );
  }
}

Breadcrumbs.propTypes = {
  navRootWebUrl: PropTypes.string
};

export default Breadcrumbs;