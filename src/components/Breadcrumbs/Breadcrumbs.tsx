import * as React from "react";
import PropTypes from 'proptypes';
import * as ReactDOM from "react-dom";
import breadcrumbsUtils from './BreadcrumbsUtils';
import classes from './Breadcrumbs.module.scss'
import IBreadcrumbProps from "./IBreadcrumbProps";
import IBreadcrumbState from "./IBreadcrumbState";
class Breadcrumbs extends React.Component<IBreadcrumbProps,IBreadcrumbState> {
  static propTypes: { navRootWebUrl: any; };
  constructor(props) {
    super(props);

    this.state = {
     links:[{title:'AAA',url:''},{title:'BBB',url:''},{title:'',url:'CCC'}],
     pageTitle:'AAAAA'
    };
  }

  componentDidMount() {
    this.setState({pageTitle:'ABC',links:[{title:'AAA',url:''},{title:'BBB',url:''},{title:'',url:'CCC'}]})
     //const { navRootWebUrl } = this.props;
     breadcrumbsUtils.getNavigationData("https://treasuryqldtest.sharepoint.com")
       .then(data => {
         if (data) {
           this.setState({ pageTitle: data.pageTitle, links: data.links });
         }
       })
       .catch(error => console.error(error));
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
      <div className="breadcrumbs">
        <ul>
          {this.state.links.map(link => {
            return <li key={link.title}><a href={link.url}>{link.title}</a></li>;
          })}
          <li>{this.props.pageTitle}</li>
        </ul>
      </div>
    );
  }
}

Breadcrumbs.propTypes = {
  navRootWebUrl: PropTypes.string
};

export default Breadcrumbs;