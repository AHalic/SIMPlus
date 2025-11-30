// tests/userManagement.test.js  
//Hazem


// UC-01 / FR-03 & FR-04 – List and search users
function listUsers(users, query = "") {
  if (!Array.isArray(users)) {
    throw new Error("Users must be an array");
  }

  const trimmedQuery = (query ?? "").trim().toLowerCase();
  if (trimmedQuery === "") {
    // no filter → show all users
    return users;
  }

  return users.filter((u) => {
    const name = (u.name ?? "").toLowerCase();
    const email = (u.email ?? "").toLowerCase();
    return (
      name.includes(trimmedQuery) ||
      email.includes(trimmedQuery)
    );
  });
}

// UC-02 / FR-05 – Validate update payload (email / password)
function validateUpdatePayload(payload) {
  const errors = {};

  if (!payload || typeof payload !== "object") {
    return {
      isValid: false,
      errors: { general: "Invalid payload" },
    };
  }

  const { email, password } = payload;

  // Must provide at least one of email or password
  if (!email && !password) {
    errors.general =
      "At least one field (email or password) must be provided";
  }

  // Email validation (if provided)
  if (email !== undefined) {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (trimmedEmail === "") {
      errors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = "Email format is invalid";
    }
  }

  // Password validation (if provided)
  if (password !== undefined) {
    const pwd = password;
    const lengthOk = pwd.length >= 8 && pwd.length <= 20;
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (!lengthOk) {
      errors.password = "Password must be between 8 and 20 characters";
    } else if (!hasLetter || !hasNumber || !hasSpecial) {
      errors.password =
        "Password must contain at least one letter, one number, and one special character";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ================= TESTS =================

describe("UC-01 / FR-03 & FR-04 – List and search users", () => {
  const users = [
    { name: "Alice Manager", email: "alice.manager@test.com", role: "Manager" },
    { name: "Bob Associate", email: "bob.associate@test.com", role: "Associate" },
    { name: "Charlie Tester", email: "charlie@test.com", role: "Associate" },
  ];

  test("Test-04-A: no query → returns all users", () => {
    const result = listUsers(users, "");

    expect(result).toHaveLength(3);
    expect(result).toEqual(users);
  });

  test("Test-04-B: query matches name → filters by name", () => {
    const result = listUsers(users, "alice");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(users[0]);
  });

  test("Test-04-C: query matches email → filters by email", () => {
    const result = listUsers(users, "bob.associate");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(users[1]);
  });

  test("Test-04-D: no user matches query → empty result", () => {
    const result = listUsers(users, "nonexistent");

    expect(result).toHaveLength(0);
  });

  test("Test-04-E: passing non-array throws error", () => {
    expect(() => listUsers(null, "")).toThrow("Users must be an array");
  });
});

describe("UC-02 / FR-05 – Update user validation", () => {
  test("Test-05-A: valid new email only → payload accepted", () => {
    const { isValid, errors } = validateUpdatePayload({
      email: "new.manager@test.com",
    });

    expect(isValid).toBe(true);
    expect(errors).toEqual({});
  });

  test("Test-05-B: valid new password only → payload accepted", () => {
    const { isValid, errors } = validateUpdatePayload({
      password: "NewPass123!",
    });

    expect(isValid).toBe(true);
    expect(errors).toEqual({});
  });

  test("Test-05-C: invalid email format → error on email", () => {
    const { isValid, errors } = validateUpdatePayload({
      email: "bad-email-format",
    });

    expect(isValid).toBe(false);
    expect(errors.email).toBe("Email format is invalid");
  });

  test("Test-05-D: invalid password (too short / missing constraints)", () => {
    const { isValid, errors } = validateUpdatePayload({
      password: "abc123", // too short and missing special char
    });

    expect(isValid).toBe(false);
    expect(errors.password).toBeDefined();
  });

  test("Test-05-E: no email and no password → general error", () => {
    const { isValid, errors } = validateUpdatePayload({});

    expect(isValid).toBe(false);
    expect(errors.general).toBe(
      "At least one field (email or password) must be provided"
    );
  });
});
