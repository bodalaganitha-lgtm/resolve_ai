// Pure helpers for the auth routes (no Express/Mongoose imports so they can
// be unit-tested without a database).

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MIN_PASSWORD_LENGTH = 8;
// bcrypt only uses the first 72 bytes of a password.
const MAX_PASSWORD_BYTES = 72;

/**
 * Validate and normalise a registration request body.
 * Returns { value: { name, email, password } } or { error: "message" }.
 */
export const validateRegistration = (body) => {
  const { name, email, password } = body || {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    return { error: "Please fill in all fields" };
  }

  const cleanName = name.trim().replace(/\s+/g, " ");

  if (cleanName.length < MIN_NAME_LENGTH) {
    return { error: `Name must be at least ${MIN_NAME_LENGTH} characters` };
  }

  if (cleanName.length > MAX_NAME_LENGTH) {
    return { error: `Name must be ${MAX_NAME_LENGTH} characters or fewer` };
  }

  const cleanEmail = email.trim().toLowerCase();

  if (cleanEmail.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(cleanEmail)) {
    return { error: "Please enter a valid email address" };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    };
  }

  if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
    return {
      error: `Password must be ${MAX_PASSWORD_BYTES} bytes or fewer`,
    };
  }

  return { value: { name: cleanName, email: cleanEmail, password } };
};

const DATABASE_ERROR_NAMES = [
  "MongooseServerSelectionError",
  "MongoServerSelectionError",
  "MongoNetworkError",
  "MongoNetworkTimeoutError",
  "MongoNotConnectedError",
];

/**
 * Turn an error thrown while creating a user into an HTTP status and a
 * message that is safe to show to the customer.
 */
export const mapRegistrationError = (error) => {
  // Unique index violation: someone registered this email a moment earlier.
  if (error?.code === 11000) {
    return { status: 409, message: "Email already registered" };
  }

  if (error?.name === "ValidationError") {
    return {
      status: 400,
      message: "Please check your details and try again",
    };
  }

  const message = String(error?.message || "");

  if (
    DATABASE_ERROR_NAMES.includes(error?.name) ||
    message.includes("buffering timed out") ||
    message.includes("Client must be connected")
  ) {
    return {
      status: 503,
      message:
        "The service is temporarily unavailable. Please try again in a moment.",
    };
  }

  return { status: 500, message: "Registration failed. Please try again." };
};
