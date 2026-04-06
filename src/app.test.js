import test from "node:test";
import assert from "node:assert/strict";

import mongoose from "mongoose";

import app from "./app.js";
import appRouter from "./app.controller.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";

const createResponse = () => {
  const response = {
    statusCode: 200,
    headers: {},
    body: null,
    redirectUrl: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    redirect(code, url) {
      this.statusCode = code;
      this.redirectUrl = url;
      return this;
    }
  };

  return response;
};

const getRouteHandler = (router, path) => {
  const layer = router.stack.find((entry) => entry.route?.path === path);
  assert.ok(layer, `Expected route ${path} to exist`);
  return layer.route.stack.at(-1).handle;
};

test("versioned health route returns service status", () => {
  const handler = getRouteHandler(appRouter, "/health");
  const response = createResponse();

  handler({}, response);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.status, "ok");
  assert.equal(typeof response.body.uptime, "number");
  assert.ok(response.body.timestamp);
});

test("versioned readiness route reports degraded while mongoose is disconnected", () => {
  const handler = getRouteHandler(appRouter, "/ready");
  const response = createResponse();

  const originalReadyState = mongoose.connection.readyState;
  Object.defineProperty(mongoose.connection, "readyState", {
    configurable: true,
    value: 0
  });

  handler({}, response);

  Object.defineProperty(mongoose.connection, "readyState", {
    configurable: true,
    value: originalReadyState
  });

  assert.equal(response.statusCode, 503);
  assert.equal(response.body.status, "degraded");
  assert.equal(response.body.database, "disconnected");
});

test("root health route redirects to versioned endpoint", () => {
  const layer = app._router.stack.find((entry) => entry.route?.path === "/health");
  assert.ok(layer, "Expected app-level /health route to exist");

  const response = createResponse();
  layer.route.stack.at(-1).handle({}, response);

  assert.equal(response.statusCode, 307);
  assert.equal(response.redirectUrl, "/api/v1/health");
});

test("not found and error middleware include request ids in error responses", () => {
  const request = {
    originalUrl: "/api/v1/missing-route",
    requestId: "req-test-123"
  };
  const response = createResponse();

  let capturedError;
  notFound(request, response, (error) => {
    capturedError = error;
  });

  assert.ok(capturedError);
  errorHandler(capturedError, request, response, () => {});

  assert.equal(response.statusCode, 404);
  assert.equal(response.body.requestId, "req-test-123");
  assert.match(response.body.message, /missing-route/);
});
