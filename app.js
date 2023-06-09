const express = require("express");
const axios = require("axios");
const app = express();
const ip = require("request-ip");

const IPSTACK_API_KEY = "d9711815ca3d9972bb0fda2a9811ed91";

app.get("/ip-info", async (req, res) => {
  try {
    // extract IPv4 address only
    // const ipaddress = ip.getClientIp(req);
    const ipaddress =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket.remoteAddress;

    console.log("ipaddress ->", ipaddress);

    const ipInfoResponse = await axios.get(
      `https://api.ipstack.com/${ipaddress}?access_key=${IPSTACK_API_KEY}`
    );
    res.json(ipInfoResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to retrieve IP information" });
  }
});

app.get("/", (req, res) => {
  return res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
