module.exports = function (req) {
  return {
    highlight(string) {
      const search = req.session?.options?.search;
      return search
        ? string.replace(search, `<span class="highlight">${search}</span>`)
        : string;
    },
  };
};
