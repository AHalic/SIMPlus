function validateUpdatePayload(data) {
  const errors = {};

  if (!data || (data.email === undefined && data.password === undefined)) {
    errors.general = "At least one field (email or password) must be provided";
    return { valid: false, errors };
  }

  if (data.email !== undefined) {
    const email = String(data.email).trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.email = "Email cannot be empty";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format";
    }
  }

  if (data.password !== undefined) {
    const password = String(data.password);
    if (!password) {
      errors.password = "Password cannot be empty";
    } else {
      if (password.length < 8 || password.length > 20) {
        errors.password = "Password must be 8-20 characters long";
      }
      if (!/[A-Za-z]/.test(password)) {
        errors.password = "Password must contain at least one letter";
      }
      if (!/[0-9]/.test(password)) {
        errors.password = "Password must contain at least one number";
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        errors.password = "Password must contain at least one special character";
      }
    }
  }

  const valid = Object.keys(errors).length === 0;
  return { valid, errors };
}

describe("UC-02 / FR-05 — Update Employee Logical Validation", () => {
  it("Test-05-A: valid email update only → valid=true", () => {
    const { valid, errors } = validateUpdatePayload({
      email: "newemail@example.com",
    });

    expect(valid).toBe(true);
    expect(errors).toEqual({});
  });

  it("Test-05-B: invalid email format → valid=false, email error", () => {
    const { valid, errors } = validateUpdatePayload({
      email: "invalidEmail",
    });

    expect(valid).toBe(false);
    expect(errors.email).toBeDefined();
  });

  it("Test-05-C: invalid password format → valid=false, password error", () => {
    const { valid, errors } = validateUpdatePayload({
      password: "abc", // too short, no number, no special
    });

    expect(valid).toBe(false);
    expect(errors.password).toBeDefined();
  });

  it("Test-05-D: valid email + valid password → valid=true", () => {
    const { valid, errors } = validateUpdatePayload({
      email: "user@example.com",
      password: "GoodPass1!",
    });

    expect(valid).toBe(true);
    expect(errors).toEqual({});
  });

  it("Test-05-E: no fields provided → valid=false, general error", () => {
    const { valid, errors } = validateUpdatePayload({});

    expect(valid).toBe(false);
    expect(errors.general).toBeDefined();
  });

  it("Test-05-F: empty email string → valid=false, email error", () => {
    const { valid, errors } = validateUpdatePayload({ email: "   " });

    expect(valid).toBe(false);
    expect(errors.email).toBeDefined();
  });
});
