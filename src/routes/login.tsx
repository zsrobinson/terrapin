import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { BookOpenCheckIcon, MailIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, useRef, useState } from "react";
import z from "zod";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState<string | null>(null);

  return (
    <main className="bg-secondary min-h-screen pt-10">
      <div className="bg-card text-card-foreground rounded-2xl mx-auto max-w-lg border p-8 flex gap-4 flex-col items-center">
        <header className="flex gap-2 items-center justify-center">
          <BookOpenCheckIcon className="translate-y-0.5" />
          <h1 className="font-semibold text-2xl">Simple Student Org</h1>
        </header>

        {!email ? <LoginStep setEmail={setEmail} /> : <OTPStep email={email} />}
      </div>
    </main>
  );
}

type LoginStepProps = { setEmail: Dispatch<SetStateAction<string | null>> };
export function LoginStep({ setEmail }: LoginStepProps) {
  const [error, setError] = useState("");

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const field = new FormData(e.target).get("email");
    const { data: email, error: parseErr } = z.email().safeParse(field);
    if (parseErr) {
      e.preventDefault();
      return setError("Please enter a valid email.");
    }

    const req = { email, type: "sign-in" as const };
    const { data, error } = await authClient.emailOtp.sendVerificationOtp(req);
    if (error || data.success === false) {
      e.preventDefault();
      return setError("Unable to send verification email.");
    }

    setEmail(email); // success, transition to OTP step
  };

  return (
    <>
      <p>
        To login or create an account, provide your email below and we’ll send
        you a code.
      </p>

      <form onSubmit={onSubmit} className="flex gap-2 w-full">
        <InputGroup>
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>

          <InputGroupInput type="email" name="email" placeholder="Email" />
        </InputGroup>

        <Button type="submit">Submit</Button>
        {error && <p className="text-destructive">{error}</p>}
      </form>
    </>
  );
}

const OTP_REGEXP = /^\d{6}$/g;

export function OTPStep({ email }: { email: string }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  /* optional e, can be called from form onSubmit or other handler */
  const onSubmit = async (e?: React.SubmitEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!formRef.current) return;

    const field = new FormData(formRef.current).get("otp");
    const schema = z.string().regex(OTP_REGEXP);
    const { data: otp, error: parseErr } = schema.safeParse(field);
    if (parseErr) return setError("Please enter a valid otp.");

    const { error } = await authClient.signIn.emailOtp({ email, otp });
    if (error) return setError("Unable to verify code.");

    await navigate({ to: "/" });
  };

  return (
    <>
      <p>
        Please enter the verification code sent to your email address{" "}
        <span className="font-semibold">{email}</span>.
      </p>

      <form onSubmit={onSubmit} className="flex gap-2" ref={formRef}>
        <InputOTP
          maxLength={6}
          name="otp"
          pattern={REGEXP_ONLY_DIGITS}
          onComplete={() => onSubmit()} /* don't call with event */
          autoFocus
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <Button type="submit">Verify</Button>
      </form>

      {error && <p className="text-destructive">{error}</p>}
    </>
  );
}
