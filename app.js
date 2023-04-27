const express = require("express");
const axios = require("axios");
const app = express();

const IPSTACK_API_KEY = "d9711815ca3d9972bb0fda2a9811ed91";

app.get("/ip-info", async (req, res) => {
  try {
    var ip;
    if (req.headers["x-forwarded-for"]) {
      ip = req.headers["x-forwarded-for"].split(",")[0];
    } else {
      ip = req.ip;
    }
    console.log("client IP is *********************" + ip);

    //  req.connection is deprecated, so we use alter
    const ipInfoResponse = await axios.get(
      `https://api.ipstack.com/${ip}?access_key=${IPSTACK_API_KEY}`
    );
    res.json(ipInfoResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to retrieve IP information" });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
