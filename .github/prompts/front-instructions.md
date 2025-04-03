# Implementation Plan: Frontend Authentication (`apps/web`) - v1.2 (Final)

**ID:** `#auth-instructions-root-v1.2`
**Tags:** `#frontend`, `#nextjs-15`, `#react-19`, `#typescript`, `#mui-v7`, `#supabase`, `#auth`, `#server-actions`, `#middleware`, `#detailed`, `#styling`, `#copilot-target`, `#final`

**Objective:** Implement the complete user authentication flow (Login, Signup, Logout, Route Protection, Confirmation) in `apps/web`, using Supabase SSR utilities, `@repo/ui` components (MUI v7 based), Server Actions, and middleware. The UI must adhere to a **professional, modern, edgy, clean, masculine** aesthetic (dark theme). Implement robust error handling using **structured error objects returned from Server Actions** and displayed on **Client Components** using `useFormState`.

**Core Technologies & Context:** (Next.js 15 App Router, TS, MUIv7/`@repo/ui`, Supabase utils, Dark Theme, Server Actions)

**Key Information Sources (Focus: Auth):** (`apps/web/app/utils/supabase/*`, `packages/ui/src/*`, `.env.example` for required vars, `apps/web/app/layout.tsx`)

---

**## 1. Define Authentication Actions File & Schemas (`apps/web/app/_actions/auth.actions.ts`) (#auth-actions-file)** `#server-actions`, `#validation`, `#zod`

* **Action:** Create `apps/web/app/_actions/auth.actions.ts`. Mark file with `'use server';`.
* **Imports:** `zod`, `cookies` from `next/headers`, `redirect` from `next/navigation`, `createClient` from `../utils/supabase/server` (or `@/utils/supabase/server`), `headers` from `next/headers`.
* **Schemas:** Define Zod schemas for Login and Signup.
* **Response Type:** Define a standardized `ActionResponse` type.
* **COPILOT:** Create `apps/web/app/_actions/auth.actions.ts`. Add imports. Generate Zod schemas and the `ActionResponse` type as specified below.

```typescript
// apps/web/app/_actions/auth.actions.ts
'use server';

import { z } from 'zod';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server'; // Assuming alias or adjust relative path

// COPILOT: Define Login Schema
const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

// COPILOT: Define Signup Schema
const SignupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  // confirmPassword: z.string() // Add if using confirmation field in UI
})
// Uncomment and adjust if using password confirmation
// .refine((data) => data.password === data.confirmPassword, {
//    message: "Passwords do not match.",
//    path: ["confirmPassword"], // Apply error to the confirmation field
// });

// COPILOT: Define standardized ActionResponse type
export type ActionResponse<T = null> =
  | { status: 'success'; data: T; message?: string }
  | { status: 'error'; error: { message: string; code?: string; fieldErrors?: null } }
  | { status: 'validationError'; error: { message: string; code: 'VALIDATION_ERROR'; fieldErrors: Record<string, string[] | undefined> } };

// --- Login Action ---
// COPILOT: Implement the login server action below (See Step 2.1)

// --- Signup Action ---
// COPILOT: Implement the signup server action below (See Step 3.1)

// --- Logout Action ---
// COPILOT: Implement the logout server action below (See Step 6.1)
```

## 2. Login Implementation (#auth-login) #req-login, #ui, #server-actions, #styling, #error

2.1. Login Server Action (auth.actions.ts - Add login function) (#auth-login-action):

Implement: `export async function login(prevState: any, formData: FormData): Promise<ActionResponse>`

Logic:

Parse form data: const rawFormData = Object.fromEntries(formData.entries());

Validate using LoginSchema.safeParse. If invalid, return { status: 'validationError', error: { message: 'Invalid credentials. Please check your input.', code: 'VALIDATION_ERROR', fieldErrors: validatedFields.error.flatten().fieldErrors } }.

Get email, password from validatedFields.data.

Create Supabase client: const supabase = createClient(cookies());.

Sign in: const { error } = await supabase.auth.signInWithPassword({ email, password });.

Error Handling: If error, check error.message for specific Supabase errors (e.g., "Invalid login credentials") and return a corresponding structured error. Default: { status: 'error', error: { message: error.message || 'Authentication failed. Please try again.' } }.

Success: Do not return here. Call redirect('/dashboard') after the try/catch block (or outside the function if using useFormState pattern strictly). Redirect throws an error, so it must be the last step on the success path.

COPILOT: Implement the login server action inside auth.actions.ts using the specified signature and logic. Include Zod validation, Supabase call, specific error checking, structured error returns, and success redirect.

```typescript
// Add this function to apps/web/app/_actions/auth.actions.ts

export async function login(prevState: any, formData: FormData): Promise<ActionResponse> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = LoginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      status: 'validationError',
      error: {
        message: 'Invalid input. Please correct the errors below.',
        code: 'VALIDATION_ERROR',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      },
    };
  }

  const { email, password } = validatedFields.data;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Login Error:', error.message); // Log server-side
    // Provide user-friendly messages based on common errors
    let userMessage = 'Authentication failed. Please check your credentials and try again.';
    if (error.message.includes('Invalid login credentials')) {
        userMessage = 'Invalid email or password.';
    } else if (error.message.includes('Email not confirmed')) {
        userMessage = 'Please confirm your email address before logging in.';
    }
    return { status: 'error', error: { message: userMessage } };
  }

  // Redirect on success - MUST be called outside the try/catch if error handling returns
  // If called here, execution stops.
  redirect('/dashboard');

  // This line is technically unreachable due to redirect, but satisfies type checker if needed.
  // return { status: 'success', data: null };
}
```

2.2. Login Page (apps/web/app/login/page.tsx) (#auth-login-page):

Type: 'use client';

Imports: React, useEffect. useFormState, useFormStatus from react-dom. login action. MUI (Container, Paper, Typography, Stack, Link as NextLink). Shared UI (./Input, ./Button, ./Alert).

State: const [state, formAction] = useFormState(login, null);

Component Structure:

Outer Container, Paper (styled).

Title Typography.

Form Component (`LoginForm`): Create a sub-component to use useFormStatus.

Render standard `<form action={formAction}>`.

Inside form: Stack spacing={2}.

./Input name="email": Set error={!!state?.error?.fieldErrors?.email}. Set helperText={state?.error?.fieldErrors?.email?.[0]}.

./Input name="password": Set error={!!state?.error?.fieldErrors?.password}. Set helperText={state?.error?.fieldErrors?.password?.[0]}. Set variant="password".

Submit Button (`<SubmitButton />`): Create another sub-component. Use `const { pending } = useFormStatus();`. Render `./Button type="submit" variant="primary" fullWidth aria-disabled={pending} disabled={pending}>{pending ? 'Signing In...' : 'Sign In'}</Button>`.

Error Alert: Below the form, conditionally render `<Alert severity="error" sx={{ mt: 2 }}>{state.error.message}</Alert>` if `state?.status === 'error'`.

Link to Signup.

Styling: Use sx props. Paper sx={{ mt: 8, p: { xs: 3, sm: 4 }, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}. Buttons sx={{ mt: 2 }}. Inputs default spacing via Stack. Align with dark, modern, edgy, clean theme.

COPILOT: Refactor apps/web/app/login/page.tsx as a Client Component. Use useFormState. Create the LoginForm and SubmitButton sub-components using useFormStatus. Render standard <form>. Use ./Input and ./Button. Implement display of general and field errors from state. Apply dark theme styling hints.

## 3. Signup Implementation (#auth-signup) #req-signup, #ui, #server-actions, #styling, #error

3.1. Signup Server Action (auth.actions.ts - Add signup function) (#auth-signup-action):

Implement: export async function signup(prevState: any, formData: FormData): Promise<ActionResponse<{ emailSent: boolean }>>

Logic:

Parse & Validate using SignupSchema. Return validation error if fails.

Get email, password from validatedFields.data.

Get origin from headers().

Create Supabase client.

Sign up: const { error, data } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo:${origin}/auth/confirm} });.

Error Handling: If error, check common messages (e.g., "User already registered", rate limits) and return structured error. Default: { status: 'error', error: { message: error.message || 'Signup failed. Please try again.' } }.

Success: Return { status: 'success', data: { emailSent: data.session === null }, message: 'Account created! Check your email to confirm.' }. (Check data.session to see if email confirmation is required).

COPILOT: Implement the signup server action in auth.actions.ts. Include Zod validation, Supabase signUp call, specific error checking, structured error return, and structured success return.

````ts
// Add this function to apps/web/app/_actions/auth.actions.ts

export async function signup(prevState: any, formData: FormData): Promise<ActionResponse<{ emailSent: boolean }>> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = SignupSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      status: 'validationError',
      error: {
        message: 'Invalid input. Please correct the errors below.',
        code: 'VALIDATION_ERROR',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      },
    };
  }

  const { email, password } = validatedFields.data;
  const origin = headers().get('origin'); // Get origin for email redirect
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`, // Ensure confirmation link works
    },
  });

  if (error) {
    console.error('Signup Error:', error.message);
    // Check for specific errors
    let userMessage = 'Signup failed. Please try again later.';
    if (error.message.includes('User already registered')) {
      userMessage = 'This email is already registered. Try logging in.';
    } else if (error.message.includes('rate limit')) {
        userMessage = 'Too many signup attempts. Please try again later.';
    }
    // Add more specific checks if needed
    return { status: 'error', error: { message: userMessage } };
  }

  // Check if email confirmation is required (usually session is null if it is)
  const emailConfirmationRequired = data.session === null;

  return {
    status: 'success',
    data: { emailSent: emailConfirmationRequired },
    message: emailConfirmationRequired
      ? 'Account created! Please check your email to confirm your address.'
      : 'Account created successfully!', // Or redirect immediately if no confirmation
  };
  // Optionally redirect if no email confirmation needed:
  // if (!emailConfirmationRequired) { redirect('/dashboard'); }
}
````

3.2. Signup Page (apps/web/app/signup/page.tsx - Create/Update) (#auth-signup-page):

Type: 'use client';

Imports: React, useFormState, useFormStatus, signup action, MUI, ./Input, ./Button, ./Alert, Link (Next).

State: const [state, formAction] = useFormState(signup, null);.

Structure: Similar to Login. Title: "Create Account".

Form Component (`<SignupForm />`): Use sub-component for useFormStatus. Render standard `<form action={formAction}>`.

Fields: ./Input name="email", ./Input name="password" type="password", (optional ./Input name="confirmPassword" type="password"). Display field errors from state.

Submit Button (`SubmitButton`): Use useFormStatus. Render ./Button type="submit" variant="primary" fullWidth aria-disabled={pending} disabled={pending}>{pending ? 'Creating Account...' : 'Sign Up'}</Button>.

Message Display: Use Alert outside form. If state?.status === 'success', show state.message with severity="success". If error state, show state.error.message with severity="error".

Link to Login: Include.

Styling: Consistent with Login page, dark theme.

COPILOT: Create/update apps/web/app/signup/page.tsx as a Client Component. Use useFormState with signup. Create SignupForm and SubmitButton sub-components. Render standard <form>. Use ./Input and ./Button. Implement display of success/error/field messages from state. Apply styling.

## 4. Email Confirmation (apps/web/app/auth/confirm/route.ts) (#auth-confirm) #req-confirm, #supabase

Action: Review existing route logic.

Improvements: Ensure redirects include user-friendly messages. Success: redirect('/dashboard?message=Account confirmed successfully!'). Error: redirect('/login?message=Email link invalid or expired. Please try again.').

COPILOT: Verify apps/web/app/auth/confirm/route.ts. Update redirects to include user-friendly query parameter messages.

## 5. Middleware for Route Protection (apps/web/middleware.ts) (#auth-middleware) #req-middleware, #supabase

Action: Review existing middleware logic.

Verification: Ensure it strictly follows the pattern: updateSession first, then getUser, then checks against protected/auth paths, then return response. Verify config.matcher.

COPILOT: Verify apps/web/middleware.ts for correctness according to the established pattern.

## 6. Logout Functionality (#auth-logout) #req-logout, #server-actions, #ui-integration

6.1. Logout Server Action (auth.actions.ts - Add logout function) (#auth-logout-action):

Implement: export async function logout() { 'use server'; ... }.

Logic: Create client, call signOut, log errors server-side, redirect('/login');.

COPILOT: Add the logout server action to auth.actions.ts.

```typescript
// Add this function to apps/web/app/_actions/auth.actions.ts

export async function logout() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout Error:', error.message);
    // No need to return error to client, just redirect
  }

  redirect('/login');
}
```

6.2. Trigger Logout from UI (Appbar) (#auth-logout-trigger):

Action: In `apps/web/app/layout.tsx`, ensure the Appbar's profile menu "Logout" `MenuItem` is wrapped in a form like this:

## 8. Styling & Error Handling Review (#auth-styling-error-review) #styling, #error

Action: Manually test the complete flow: Signup -> Email Confirmation -> Login -> Access Protected Route -> Logout. Verify error messages (general, field-specific, confirmation link errors) display correctly. Check UI consistency and dark theme application.

COPILOT: Remind user to perform end-to-end manual testing and style review.

---

**## Copilot Execution Notes (Authentication v1.2):**

* **File Structure:** Create new files/directories exactly as specified (e.g., `apps/web/app/_actions/auth.actions.ts`, `apps/web/app/signup/page.tsx`).
* **Imports:** Use consistent path aliases (e.g., `@/utils/supabase/server`) or relative paths. Import shared UI components from `@repo/ui` using the `./ComponentName` convention (verify alias/path). Import MUI components directly (`@mui/material`, `@mui/icons-material`). Import React/Next.js hooks (`useState`, `useEffect`, `useFormState`, `useFormStatus`, `usePathname`, `cookies`, `headers`, `redirect`, `createClient`).
* **Server Actions (`auth.actions.ts`):**
  * Ensure `'use server';` directive is at the top.
  * Implement functions with the exact signature `async function actionName(prevState: any, formData: FormData): Promise<ActionResponse<...>>`.
  * Use `Object.fromEntries(formData.entries())` for data extraction.
  * Implement Zod `safeParse` for validation and return the structured `validationError` response immediately on failure.
  * Use the Supabase server client (`createClient(cookies())`).
  * Call the correct Supabase auth methods (`signInWithPassword`, `signUp`, `signOut`).
  * Implement specific error checks (e.g., `error.message.includes(...)`) and return the structured `error` response.
  * Call `redirect()` **only** on the absolute success path for `login` and `logout`, ensuring it's the final statement executed on that path. Do *not* redirect on success for `signup` if email confirmation is needed; return the success message instead.
* **Client Components (Login/Signup Pages):**
  * **MUST** include `'use client';` at the top.
  * Use `useFormState(actionName, null)` to manage action state.
  * Use standard HTML `<form action={formAction}>`. **DO NOT** use `@repo/ui/Form` unless specifically designed for this pattern.
  * Create sub-components (`<LoginForm>`, `<SubmitButton>`, etc.) to leverage `useFormStatus` for disabling buttons during submission (`const { pending } = useFormStatus();`).
  * Render shared UI components (`./Input`, `./Button`, `./Alert`) inside the form/page structure.
  * Display general errors using `./Alert` based on `state?.status === 'error'`.
  * Display validation errors by passing `error={!!state?.error?.fieldErrors?.fieldName}` and `helperText={state?.error?.fieldErrors?.fieldName?.[0]}` to the corresponding `./Input` components.
  * Display success messages using `./Alert severity="success"` based on `state?.status === 'success'`.
* **Middleware (`middleware.ts`):**
  * Verify the exact sequence: `updateSession` first, then `getUser`, then conditional checks, then `return response`.
  * Ensure the `config.matcher` correctly targets application pages and excludes static/API assets.
* **Email Confirmation Route (`auth/confirm/route.ts`):**
  * Verify `verifyOtp` call and the use of `redirect` with user-friendly messages in query parameters for both success and error cases.
* **UI Integration (Layout/Appbar):**
  * Fetch `user` server-side in `layout.tsx` and pass it to `./Appbar`.
  * Implement the Logout trigger within the Appbar's profile menu using a `<form action={logout}>` wrapping a `MenuItem` styled as a button (`component="button" type="submit"`).
* **Styling:** Use `sx` prop with **dark theme tokens** from `@repo/ui/src/theme/index.ts` (`palette.background.paper`, `palette.primary.main`, `palette.text.secondary`, `spacing()`, `shape.borderRadius`, `alpha()`). Aim for the described **professional, modern, edgy, clean, masculine** aesthetic. Center forms using `Container maxWidth="xs"` and `Paper`.
* **Accessibility:** Ensure form inputs are associated with labels (implicitly via `./Input` or explicitly if needed). Ensure buttons have clear text or `aria-label`. Use semantic HTML for page structure.

---
