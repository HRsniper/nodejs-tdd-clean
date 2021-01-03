module.exports = (router) => {
  router.post("/login", (request, response) => {
    return response.json({ ok: "ok" });
  });
};
