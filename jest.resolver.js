module.exports = (path, options) => {
  // Call the defaultResolver, so we leverage its cache, error handling, etc.
  return options.defaultResolver(path, {
    ...options,

    // Use package filter to process parsed 'package.json' before the resolution
    packageFilter: (pkg) => {
      const pkgNamesToTarget = new Set([
        "firebase",
        "@firebase/app",
        "@firebase/auth",
        "@firebase/firestore",
      ]);

      if (pkgNamesToTarget.has(pkg.name)) {
        delete pkg["exports"];
        delete pkg["module"];
      }

      return pkg;
    }
  })
}