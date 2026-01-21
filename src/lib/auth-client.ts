import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
    plugins: [inferAdditionalFields<typeof auth>()],
})