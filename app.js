const express = require("express");
const axios = require("axios");
const app = express();
const ip = require("request-ip");
app.set("trust proxy", true); // trust first proxy

const IPSTACK_API_KEY = "d9711815ca3d9972bb0fda2a9811ed91";

app.get("/ip-info", async (req, res) => {
  try {
    // extract IPv4 address only
    const ipaddress = ip.getClientIp(req);

    const ipInfoResponse = await axios.get(
      `https://api.ipstack.com/${ipaddress}?access_key=${IPSTACK_API_KEY}`
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
