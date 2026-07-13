// État partagé des formulaires publics (useActionState).

export type FormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export const initialFormState: FormState = { status: "idle" };
