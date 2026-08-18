import { env } from "cloudflare:workers";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { ResultAsync } from "neverthrow";
import { db } from "~/db";
import { account, session, user, verification } from "~/db/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { user, session, account, verification },
  }),

  // tanstackStartCookies should always be last in the array, apparently
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const send = ResultAsync.fromThrowable(env.EMAIL.send);

        const result = await send({
          to: email,
          from: "auth@simplestudent.org",
          subject: `Simple Student Org Code: ${otp}`,
          html: `<h1>Simple Student Org</h1>
            <p>Your ${type.replaceAll("-", " ")} code is ${otp}.</p>`,
        });

        result.match(
          ({ messageId }) => {
            console.log("Sent OTP email", { email, type, messageId });
          },
          (error) => {
            console.error("Error sending OTP email", { email, type, error });
          },
        );
      },
    }),
    tanstackStartCookies(),
  ],
});
