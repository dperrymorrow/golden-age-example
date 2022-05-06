module.exports = function (req) {
  return {
    get options() {
      if (req.query.page) req.query.page = Number(req.query.page);
      if (req.query.search) req.query.page = 0;

      if (!req.session.options)
        req.session.options = {
          sortOn: "modified",
          sortDir: "desc",
          search: null,
          page: 0,
        };

      req.session.options = { ...req.session.options, ...(req.query || {}) };

      console.log(req.session.options);
      return req.session.options;
    },
  };
};
