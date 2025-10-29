import { z } from "zod/index";
import { signUpSchema } from "@/features/auth/schemas/sign-up.schema";

export type SignUpDto = z.infer<typeof signUpSchema>;
