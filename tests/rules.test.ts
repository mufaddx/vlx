import assert from "node:assert/strict";
import test from "node:test";
import { ageFromDob, maskedDisplayName } from "../src/lib/crypto.ts";
import { connectionPair } from "../src/lib/ids.ts";

test("age restriction rejects 17", () => {
  const dob = new Date();
  dob.setFullYear(dob.getFullYear() - 17);
  assert.equal(ageFromDob(dob) >= 18, false);
});

test("age restriction accepts 18+", () => {
  const dob = new Date();
  dob.setFullYear(dob.getFullYear() - 19);
  assert.equal(ageFromDob(dob) >= 18, true);
});

test("follow request uses masked identity", () => {
  assert.equal(maskedDisplayName("Rahul", "Kumar"), "Rahul .... Kumar");
});

test("connection pair is canonical", () => {
  assert.deepEqual(connectionPair("b", "a"), { userAId: "a", userBId: "b" });
  assert.deepEqual(connectionPair("a", "b"), { userAId: "a", userBId: "b" });
});
