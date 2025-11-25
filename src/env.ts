import * as yup from "yup";

const envSchema = yup.object({
  FE_CNB_API_URL: yup.string().required("CNB_API_URL is required"),
});

function validateEnv() {
  try {
    const validatedEnv = envSchema.validateSync(import.meta.env, {
      abortEarly: false,
      stripUnknown: true,
    });
    return validatedEnv;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error("Environment validation failed:");
      for (const err of error.errors) {
        console.error(`  - ${err}`);
      }
      throw new Error("Invalid environment variables");
    }
    throw error;
  }
}

export const env = validateEnv();
