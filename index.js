const express = require("express");
const app = express();
const AWS = require("aws-sdk");
require("express-async-errors");

const qMetrics = require("./qMetrics");
const instanceConfig = require("./instanceConfig");

const connectInstanceId = instanceConfig.connectInstanceId;
const connectQArns = instanceConfig.connectQArns;

var connectClient = new AWS.Connect({
  apiVersion: "2017-08-08",
  region: "us-east-1"
});

// serve static content from public directory
app.use(express.static("public"));

// handle form data
app.use(express.urlencoded({ extended: true }));

// configuration for pug views
app.set("views", "./views");
app.set("view engine", "pug");

// index - list of users
app.get("/", async (req, res) => {
  var listUsersParams = {
    InstanceId: connectInstanceId
  };
  var listUsersPromise = connectClient.listUsers(listUsersParams).promise();
  var listUsersResponse = await listUsersPromise;
  res.render("index", {
    title: "Connect Users",
    dataList: listUsersResponse.UserSummaryList
  });
});

// user detail by user id
app.get("/user/:userId", async (req, res) => {
  var userId = req.params.userId;
  var describeUserParams = {
    InstanceId: connectInstanceId,
    UserId: userId
  };
  var describeUserPromise = connectClient
    .describeUser(describeUserParams)
    .promise();
  var describeUserResult = await describeUserPromise;
  res.render("user", {
    title: describeUserResult.User.Username,
    user: describeUserResult.User
  });
});

app.get("/updateAttributes", async (req, res) => {
  res.render("updateAttributes", {
    title: "Update Contact Attributes"
  });
});

app.post("/submit-updateAttributes", async (req, res) => {
  const contactId = req.body.contactId;
  const flagForFollowUpRaw = req.body.flagForFollowUp; // will equal "on" if checked, undefined if false
  const flagForFollowUp = flagForFollowUpRaw && flagForFollowUpRaw === "on";

  var updateContactAttributesParams = {
    InstanceId: connectInstanceId,
    InitialContactId: contactId,
    Attributes: {
      FlaggedForFollowUp: flagForFollowUp.toString()
    }
  };

  var updateContactAttributesPromise = connectClient
    .updateContactAttributes(updateContactAttributesParams)
    .promise();
  var updateContactAttributesResult = await updateContactAttributesPromise;
  console.log("result", updateContactAttributesResult);

  res.render("submittedUpdateAttributes", {
    title: "Contact Attributes Updated"
  });
});

app.get("/currentMetrics", async (req, res) => {
  var getCurrentMetricsParams = {
    InstanceId: connectInstanceId,
    Filters: {
      Channels: ["VOICE"],
      Queues: connectQArns
    },
    CurrentMetrics: qMetrics.metricsList,
    Groupings: ["QUEUE"]
  };

  var getCurrentMetricsPromise = connectClient
    .getCurrentMetricData(getCurrentMetricsParams)
    .promise();
  var getCurrentMetricsResult = await getCurrentMetricsPromise;
  console.log("current metrics:", JSON.stringify(getCurrentMetricsResult));

  res.render("currentMetrics", {
    title: "Current Queue Metrics",
    metricResults: getCurrentMetricsResult.MetricResults
  });
});

app.listen(3000, () => console.log("App listening on port 3000!"));
