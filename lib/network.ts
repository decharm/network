import { grantOrThrow } from "https://deno.land/std@0.152.0/permissions/mod.ts";

// Make sure there is network permission
await grantOrThrow({ name: "net" });

export * from "./tcp/client.ts";
export * from "./tcp/server.ts";
export * from "./tcp/events.ts";
export * from "./tcp/interfaces.ts";