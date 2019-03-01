import jsomUtils from '../utilities/JSOMUtils';
import managedNavUtils from '../utilities/ManagedNavUtils';

// The breadcrumb data is also used to generate the heading on the left
// nav. This isn't an ideal approach but caching the promise in memory
// allows the data to be accessed a second time without re-querying the
// term store.
let navigationDataPromise = null;

function getParentNavTerms(ctx, termSet, termId) {
  const term = termSet.getTerm(new SP.Guid(termId));
  const navTerm = managedNavUtils.convertToNavTerm(ctx, term);
  const parentNavTerms = navTerm.getAllParentTerms();

  ctx.load(parentNavTerms, 'Include(Title)');

  return jsomUtils.executeQueryAsync(ctx)
    .then(() => parentNavTerms);
}

function getModelData(ctx, webInfo, navTerms) {
  const tempData = [];
  const enumerator = navTerms.getEnumerator();

  while (enumerator.moveNext()) {
    const navTerm = enumerator.get_current();
    const title = navTerm.get_title().get_value();
    const url = navTerm.getResolvedDisplayUrl();

    tempData.push({ title, url });
  }

  return jsomUtils.executeQueryAsync(ctx)
    .then(() => {
      const modelData = tempData.map(item => {
        return Object.assign(item, { url: item.url.get_value() });
      });

      return [].concat(webInfo, modelData.reverse());
    });
}

function getNavigationData(navRootWebUrl) {
  if (typeof _spFriendlyUrlPageContextInfo === 'undefined') {
    return null;
  }

  const webUrl = navRootWebUrl || _spPageContextInfo.webAbsoluteUrl;
  const ctx = new SP.ClientContext(webUrl);
  const webInfo = { title: 'Home', url: webUrl };
  const pageTitle = _spFriendlyUrlPageContextInfo.title;
  const termId = _spFriendlyUrlPageContextInfo.termId;

  return managedNavUtils.getDefaultTermSet(ctx)
    .then(termSet => getParentNavTerms(ctx, termSet, termId))
    .then(navTerms => getModelData(ctx, webInfo, navTerms))
    .then(links => {
      return { pageTitle, links };
    });
}

function getNavigationDataAfterSod(navRootWebUrl) {
  return jsomUtils.ensureScripts('sp.js', 'sp.publishing.js', 'sp.taxonomy.js')
    .then(() => {
      return getNavigationData(navRootWebUrl);
    });
}

function getCachedNavigationData(navRootWebUrl) {
  if (navigationDataPromise === null) {
    navigationDataPromise = getNavigationDataAfterSod(navRootWebUrl);
  }

  return navigationDataPromise;
}

export default { getNavigationData: getCachedNavigationData };