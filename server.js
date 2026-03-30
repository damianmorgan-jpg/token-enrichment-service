const express = require("express");
const cors = require("cors");
const users = require("./users.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "token-enrichment-service-rest",
    version: "1.1",
    endpoints: [
      "GET /health",
      "GET /access/:id",
      "GET /access/:id?primaryMsisdn=64210000001"
    ]
  });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/access/:id", (req, res) => {
  const { id } = req.params;
  const { primaryMsisdn } = req.query;

  const user = users[id];

  if (!user) {
    return res.status(404).json({
      timestamp: new Date().toISOString(),
      exception: "NotFoundError",
      message: `No access details found for id '${id}'`,
      error: "Not Found",
      status: 404
    });
  }

  if (primaryMsisdn && user.primaryMsisdn !== primaryMsisdn) {
    return res.status(404).json({
      timestamp: new Date().toISOString(),
      exception: "NotFoundError",
      message: `No access details found for id '${id}' with primaryMsisdn '${primaryMsisdn}'`,
      error: "Not Found",
      status: 404
    });
  }

  return res.json({
    onenz_acs: user.onenz_acs
  });
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});