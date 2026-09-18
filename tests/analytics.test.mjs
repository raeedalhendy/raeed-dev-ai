import test from "node:test";
import assert from "node:assert/strict";
import { parseVisit } from "../app/_lib/analytics-input.ts";

const visit = { eventId: "550e8400-e29b-41d4-a716-446655440000", sessionId: "550e8400-e29b-41d4-a716-446655440001", kind: "product", slug: "منتج", source: "facebook", campaign: "launch" };
test("accepts product and homepage visits without changing their stable identities", () => {
  assert.deepEqual(parseVisit(visit), visit);
  assert.ok(parseVisit({ ...visit, kind: "home", slug: "" }));
  assert.ok(parseVisit({ ...visit, kind: "category" }));
});
test("rejects malformed IDs, private page kinds and oversized attribution", () => {
  for (const input of [null, [], { ...visit, eventId: "bad" }, { ...visit, sessionId: "" }, { ...visit, kind: "dashboard" }, { ...visit, slug: "" }, { ...visit, kind: "home" }, { ...visit, source: "a".repeat(101) }, { ...visit, campaign: {} }, { ...visit, slug: "a".repeat(201) }]) {
    assert.equal(parseVisit(input), null);
  }
});
