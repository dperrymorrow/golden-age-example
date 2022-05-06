const superagent = require("superagent");
const { Octokit } = require("@octokit/core");

module.exports = {
  logout(req, res) {
    req.session = null;
    res.redirect("/todo");
  },

  oauthStart(req, res) {
    const { CLIENT_ID, REDIRECT_URI } = process.env;
    const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&amp;redirect_uri=${REDIRECT_URI}`;
    res.render("oauth", { authorizeUrl });
  },

  async oauthFinish(req, res) {
    const { body } = await superagent.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: req.query.code,
        redirect_uri: process.env.REDIRECT_URI,
      }
    );

    const octokit = new Octokit({ auth: body.access_token });
    const { data } = await octokit.request("GET /user");
    req.session.user = data;

    res.redirect("/todo");
  },
};
