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
require('sp-publishing');
require('sp-taxonomy');
let navigationDataPromise = null;
class Breadcrumbs extends React.Component<IBreadcrumbProps,IBreadcrumbState> {
  static propTypes: { navRootWebUrl: any; };
  constructor(props) {
    super(props);

    this.state = {
     links:[{title:'Home',url:''},{title:'Employee centre',url:''},{title:'HR Resources',url:''}],
     pageTitle:'HR business partners'
    };
  }

  componentDidMount() {
    const siteURL = "https://treasuryqldtest.sharepoint.com/sites/corporate2";
    //this.getNavigationData(siteURL);
    }

    getCachedNavigationData(navRootWebUrl) {
      if (navigationDataPromise === null) {
        navigationDataPromise = this.getNavigationDataAfterSod(navRootWebUrl);
      }
    
      return navigationDataPromise;
    }

    

  getNavigationData(navRootWebUrl) {
  //   if (typeof _spFriendlyUrlPageContextInfo === 'undefined') {
  //     return null;
  //   }
  // console.log(_spFriendlyUrlPageContextInfo);
  //   const webUrl = navRootWebUrl || _spPageContextInfo.webAbsoluteUrl;
  //   const ctx = new SP.ClientContext(webUrl);
  //   const webInfo = { title: 'Home', url: webUrl };
  //   const pageTitle = _spFriendlyUrlPageContextInfo.title;
  //   const termId = _spFriendlyUrlPageContextInfo.termId;
  //   console.log(pageTitle,termId);

          var context =  new SP.ClientContext(navRootWebUrl);
        // Get the default Term Store for context
        var session = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
        var termStores = session.get_termStores();

        var termStore = termStores.getByName("Taxonomy_nlttXz0jheSz00iK2W2QZg==");
        var termSet = termStore.getTermSet(new SP.Guid("481581ac-be39-4ed9-bb27-7fce69856083"))
        var terms = termSet.getAllTerms();
        context.load(terms);

        context.executeQueryAsync(function(){

        var termEnumerator = terms.getEnumerator();

        var termList = "Terms: \n";

            while(termEnumerator.moveNext()){

                var currentTerm = termEnumerator.get_current();

                termList += currentTerm.get_name() + "\n";

            } 

              //alert(termList);

        },function(sender,args){

              console.log(args.get_message());

        });
  }

  getNavigationDataAfterSod(navRootWebUrl) {
    return this.getNavigationData(navRootWebUrl);
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