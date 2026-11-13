import { test } from "node:test";
import assert from "node:assert/strict";

import { analyzeComplaint, __internals } from "../services/aiService.js";

const complaint = {
  title: "Order arrived late",
  description: "My parcel was delayed by two weeks and the courier ignored me.",
  category: "Delivery",
};

const validAnalysis = {
  sentiment: "Negative",
  category: "Delivery",
  priority: "Medium",
  confidence: 90,
  keyIssue: "Delivery was delayed",
  sentimentReason: "The customer is upset about the delay.",
  recommendedResolution: "Expedite the delivery.",
  actionItems: ["Track the parcel", "Contact the courier", "Update the customer"],
};

const overloaded = () => {
  const error = new Error(
    '{"error":{"code":503,"message":"The model is overloaded. Please try again later.","status":"UNAVAILABLE"}}'
  );
  error.status = 503;
  return error;
};

// Fake Gemini client. `behaviours` maps model name -> array of outcomes, where
// each outcome is either an Error to throw or a string to return as text.
const fakeClient = (behaviours) => {
  const calls = [];

  return {
    calls,
    models: {
      async generateContent({ model }) {
        calls.push(model);

        const queue = behaviours[model] || [];
        const outcome = queue.length > 1 ? queue.shift() : queue[0];

        if (outcome instanceof Error) {
          throw outcome;
        }

        return { text: outcome };
      },
    },
  };
};

const options = (client, models = ["m1", "m2", "m3"]) => ({
  client,
  models,
  sleep: async () => {},
});

test("returns the Gemini result when the first model works", async () => {
  const client = fakeClient({ m1: [JSON.stringify(validAnalysis)] });

  const result = await analyzeComplaint(complaint, options(client));

  assert.equal(result.source, "gemini");
  assert.equal(result.model, "m1");
  assert.equal(result.fallback, false);
  assert.equal(result.keyIssue, "Delivery was delayed");
  assert.deepEqual(client.calls, ["m1"]);
});

test("retries the same model after a 503 and then succeeds", async () => {
  const client = fakeClient({
    m1: [overloaded(), JSON.stringify(validAnalysis)],
  });

  const result = await analyzeComplaint(complaint, options(client));

  assert.equal(result.source, "gemini");
  assert.equal(result.model, "m1");
  assert.deepEqual(client.calls, ["m1", "m1"]);
});

test("falls back to the next model when the primary stays overloaded", async () => {
  const client = fakeClient({
    m1: [overloaded()],
    m2: [JSON.stringify(validAnalysis)],
  });

  const result = await analyzeComplaint(complaint, options(client));

  assert.equal(result.source, "gemini");
  assert.equal(result.model, "m2");
  assert.equal(result.fallback, false);
  assert.deepEqual(client.calls, ["m1", "m1", "m2"]);
});

test("moves on immediately when a model does not exist (404)", async () => {
  const missing = new Error("models/m1 is not found");
  missing.status = 404;

  const client = fakeClient({
    m1: [missing],
    m2: [JSON.stringify(validAnalysis)],
  });

  const result = await analyzeComplaint(complaint, options(client));

  assert.equal(result.model, "m2");
  assert.deepEqual(client.calls, ["m1", "m2"]);
});

test("returns a rule-based analysis when every model is overloaded", async () => {
  const client = fakeClient({
    m1: [overloaded()],
    m2: [overloaded()],
    m3: [overloaded()],
  });

  const result = await analyzeComplaint(complaint, options(client));

  assert.equal(result.source, "local-fallback");
  assert.equal(result.fallback, true);
  assert.equal(result.category, "Delivery");
  assert.equal(result.actionItems.length, 3);
  assert.ok(result.notice.length > 0);
  assert.ok(result.confidence <= 60);
  assert.equal(client.calls.length, 6);
});

test("stops trying other models on an invalid API key and still resolves", async () => {
  const unauthorized = new Error("API key not valid. Please pass a valid API key.");
  unauthorized.status = 400;

  const client = fakeClient({ m1: [unauthorized], m2: [JSON.stringify(validAnalysis)] });

  const result = await analyzeComplaint(complaint, options(client));

  assert.equal(result.source, "local-fallback");
  assert.deepEqual(client.calls, ["m1"]);
});

test("retries when Gemini returns invalid JSON", async () => {
  const client = fakeClient({
    m1: ["this is not json", JSON.stringify(validAnalysis)],
  });

  const result = await analyzeComplaint(complaint, options(client));

  assert.equal(result.source, "gemini");
  assert.deepEqual(client.calls, ["m1", "m1"]);
});

test("accepts JSON wrapped in a markdown code fence", async () => {
  const client = fakeClient({
    m1: ["```json\n" + JSON.stringify(validAnalysis) + "\n```"],
  });

  const result = await analyzeComplaint(complaint, options(client));

  assert.equal(result.source, "gemini");
});

test("uses the rule-based analysis when no API key is configured", async () => {
  const previous = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  try {
    const result = await analyzeComplaint(complaint, { sleep: async () => {} });

    assert.equal(result.source, "local-fallback");
    assert.equal(result.fallback, true);
  } finally {
    if (previous !== undefined) {
      process.env.GEMINI_API_KEY = previous;
    }
  }
});

test("rejects a complaint without a title or description", async () => {
  await assert.rejects(
    analyzeComplaint({ title: "", description: "x" }, options(fakeClient({}))),
    /required/
  );
});

test("rule-based analysis flags payment problems as high priority", () => {
  const result = __internals.buildFallbackAnalysis(
    {
      title: "Charged twice",
      description:
        "My card was charged twice for one order and I want a refund immediately.",
      category: "Other",
    },
    "test"
  );

  assert.equal(result.category, "Payment");
  assert.equal(result.sentiment, "Negative");
  assert.equal(result.priority, "High");
});

test("backoff grows with each attempt and stays capped", () => {
  const fixed = () => 1;

  const first = __internals.backoffDelay(0, fixed);
  const second = __internals.backoffDelay(1, fixed);
  const late = __internals.backoffDelay(10, fixed);

  assert.ok(first <= 1000);
  assert.ok(second > first);
  assert.equal(late, 8000);
});

test("default model chain starts with the primary model", () => {
  assert.equal(__internals.DEFAULT_MODELS[0], "gemini-3.8-flash");
  assert.ok(__internals.DEFAULT_MODELS.length > 1);
});
