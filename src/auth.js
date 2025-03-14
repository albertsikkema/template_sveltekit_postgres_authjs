import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import Nodemailer from "@auth/sveltekit/providers/nodemailer"
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '$lib/server/db/index'
import { auth_accounts, auth_authenticators, auth_sessions, auth_users, auth_verificationTokens, users } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { env } from "$env/dynamic/private"

const providers = []

 // Conditionally add GitHub provider if ALLOW_GITHUB_LOGIN is set
 if (env.ALLOW_GITHUB_LOGIN  === 'true') {
  providers.push(
    GitHub
  );
}

// Conditionally add Nodemailer provider if EMAIL_SERVER is set
if (env.ALLOW_EMAIL_LOGIN === 'true') {
  providers.push(
    Nodemailer({
      name: 'Email',
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    })
  );
}


export const { handle, signIn, signOut } = SvelteKitAuth({
  callbacks: {
    async signIn({ user }) {
      // Ensure user.email is defined before querying
      if (!user.email) {
        return false; // Reject login if email is missing
      }
      // Check if the user exists in the allowed users table and is active
      const allowedUser = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email))
        .limit(1);

      if (allowedUser.length === 0 || !allowedUser[0].active) {
        return false; // Reject login if not found or not active
      }

      return true;
    },

    async session({ session }) {
      if (!session.user || !session.user?.email) return session; // Return early if no user

      // Fetch user role from DB
      const dbUser = await db
        .select()
        .from(users)
        .where(eq(users.email, session.user.email))
        .limit(1);

      return {
        ...session, user:
        {
          ...session.user,
          role: dbUser[0].role,
          email: dbUser[0].email
        }
      }

    }
  },

  adapter: DrizzleAdapter(db,
    {
      usersTable: auth_users,
      accountsTable: auth_accounts,
      sessionsTable: auth_sessions,
      verificationTokensTable: auth_verificationTokens,
    }

  ),
  providers
})

