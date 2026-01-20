import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { auth } from "./auth";
import type { User } from "@/api/users/types";

export const betterAuthMiddleware = createMiddleware().server(
    async ({ next, request }) => {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session) {
            throw (redirect({ to: "/login" }))
        }

        return next({
            context: {
                user: session.user,
            },
        })
    }
);

export const requireRoleMiddleware = (allowedRoles: Array<User['role']>) =>
    createMiddleware({ type: 'function' })
      .middleware([betterAuthMiddleware])
      .server(async ({ next, context }) => {
        if (!allowedRoles.includes(context.user.role as User['role'])) {
          throw new Error(
            `Zabranjeni pristup: Potrebna je uloga: ${allowedRoles.join(' ili ')}`,
          )
        }
  
        return next()
      })
  
  export const requireAdminMiddleware = requireRoleMiddleware(['admin'])
  export const requireSellerMiddleware = requireRoleMiddleware(['seller'])
  export const requireBuyerMiddleware = requireRoleMiddleware(['buyer'])
  export const requireSuperAdminMiddleware = requireRoleMiddleware([
    'super-admin',
  ])