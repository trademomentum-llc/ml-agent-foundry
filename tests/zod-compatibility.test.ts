import assert from "node:assert/strict";
import test from "node:test";
import type { Request, Response } from "express";
import { z } from "zod";
import { validateRequest, validateQuery, validateParams } from "../server/middleware/validation";
import { insertAgentSchema } from "../shared/schema";

for (const [field, validate] of [
  ["body", validateRequest],
  ["query", validateQuery],
  ["params", validateParams],
] as const) {
  test(`${field}: Zod 4 issues produce a 400 with the original error shape`, () => {
    let status = 200;
    let payload: { errors: { field: string; message: string }[] } | undefined;
    let nextCalled = false;
    const res = {
      status(code: number) { status = code; return this; },
      json(value: typeof payload) { payload = value; return this; },
    } as Response;
    const req = { [field]: { profile: { name: 42 } } } as unknown as Request;
    validate(z.object({ profile: z.object({ name: z.string() }) }))(req, res, () => { nextCalled = true; });
    assert.equal(status, 400);
    assert.equal(nextCalled, false);
    assert.equal(payload?.errors.length, 1);
    assert.equal(payload?.errors[0].field, "profile.name");
    assert.ok(payload?.errors[0].message);
  });

  test(`${field}: valid requests reach the next handler`, () => {
    let calls = 0;
    validate(z.object({ name: z.string() }))(
      { [field]: { name: "valid" } } as unknown as Request,
      {} as Response,
      () => { calls++; },
    );
    assert.equal(calls, 1);
  });
}

test("drizzle-zod uses Zod 4 and retains nullable optional agent security configuration", () => {
  const input = { name: "Test agent", typeId: 1 };
  assert.equal(insertAgentSchema.safeParse(input).success, true);
  assert.equal(insertAgentSchema.safeParse({ ...input, securityConfig: null }).success, true);
  assert.equal(insertAgentSchema.safeParse({ ...input, securityConfig: { encryption: true } }).success, true);
  assert.equal(insertAgentSchema.safeParse({ ...input, name: 42 }).success, false);
});
