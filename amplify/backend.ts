// amplify/backend.ts
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data, conversationHandler } from "./data/resource";

defineBackend({
  auth,
  data,
  conversationHandler,
});