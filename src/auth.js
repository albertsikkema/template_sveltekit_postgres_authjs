import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '$lib/server/db/index'
import { users, accounts, sessions, verificationTokens, allowedUsers } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'


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
        .from(allowedUsers)
        .where(eq(allowedUsers.email, user.email))
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
        .from(allowedUsers)
        .where(eq(allowedUsers.email, session.user.email))
        .limit(1);
     
      return { ...session, user:
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
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    }

  ),
  providers: [GitHub],
})