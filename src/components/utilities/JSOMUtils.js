function executeQueryAsync(ctx) {
    const promise = new Promise((resolve, reject) => {
      const onSuccess = () => {
        resolve();
      };
  
      const onFailure = (sender, args) => {
        reject(args.get_message());
      };
  
      ctx.executeQueryAsync(onSuccess, onFailure);
    });
  
    return promise;
  }
  
  function ensureScripts(...keys) {
    const promise = new Promise(resolve => {
      const keysExcludingSpJs = keys.filter(key => key !== 'sp.js');
  
      SP.SOD.loadMultiple(['sp.js'], () => {
        if (keysExcludingSpJs.length === 0) {
          resolve();
          return;
        }
  
        keysExcludingSpJs.forEach(key => {
          SP.SOD.registerSod(key, SP.Utilities.Utility.getLayoutsPageUrl(key));
        });
        SP.SOD.loadMultiple(keysExcludingSpJs, resolve);
      });
    });
  
    return promise;
  }
  
  export default { executeQueryAsync, ensureScripts };