import jsomUtils from './JSOMUtils';

// SOD dependancies:
// - sp.js
// - sp.publishing.js
// - sp.taxonomy.js

function getNavSettings(ctx) {
  if (typeof _spFriendlyUrlPageContextInfo !== 'undefined') {
    const termStoreId = _spFriendlyUrlPageContextInfo.termStoreId;
    const termSetId = _spFriendlyUrlPageContextInfo.termSetId;

    return Promise.resolve({ termStoreId, termSetId });
  }

  const web = ctx.get_web();
  const webNavSettings = new SP.Publishing.Navigation.WebNavigationSettings(ctx, web);
  const globalNavSettings = webNavSettings.get_globalNavigation();

  ctx.load(globalNavSettings, 'TermStoreId', 'TermSetId');

  return jsomUtils.executeQueryAsync(ctx)
    .then(() => {
      const termStoreId = globalNavSettings.get_termStoreId().toString();
      const termSetId = globalNavSettings.get_termSetId().toString();

      return { termStoreId, termSetId };
    });
}

function getTermSet(ctx, termStoreId, termSetId) {
  const taxonomySession = SP.Taxonomy.TaxonomySession.getTaxonomySession(ctx);
  const termStoreGuid = new SP.Guid(termStoreId);
  const termStore = taxonomySession.get_termStores().getById(termStoreGuid);
  const termSetGuid = new SP.Guid(termSetId);
  const termSet = termStore.getTermSet(termSetGuid);

  return termSet;
}

function getDefaultTermSet(ctx) {
  return getNavSettings(ctx)
    .then(navSettings => getTermSet(ctx, navSettings.termStoreId, navSettings.termSetId));
}

function convertToNavTermSet(ctx, termSet) {
  const web = ctx.get_web();
  const navTermSet = SP.Publishing.Navigation.NavigationTermSet.getAsResolvedByWeb(ctx, termSet, web, 'GlobalNavigationTaxonomyProvider');

  return navTermSet;
}

function convertToNavTerm(ctx, term) {
  const web = ctx.get_web();
  const navTerm = SP.Publishing.Navigation.NavigationTerm.getAsResolvedByWeb(ctx, term, web, 'GlobalNavigationTaxonomyProvider');

  return navTerm;
}

export default { getNavSettings, getTermSet, getDefaultTermSet, convertToNavTermSet, convertToNavTerm };