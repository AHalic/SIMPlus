import { validateEmployeeData } from "../../app/api/employee/validation.js";


describe("UC1-FR-01 — Create Employee (logical backend tests)", () => {
  const validData = {
    first_name: "Thomas",
    last_name: "James",
    email: "thomas.james@example.com",
    password: "Password56%",
    dept_id: "dept123",
    role: "Manager",
  };

  //  everything bad
  it("Test-01-A: invalid values → valid=false, multiple errors", () => {
    const Data = {
      first_name: "   ",       // empty after trim
      last_name: "J",          // length < 2
      email: "bad-email",      // invalid format
      password: "password",    // letters only, no number/special
      dept_id: "",             // missing
      role: "   ",             // empty after trim
    };

    const result = validateEmployeeData(Data);

    expect(result.valid).toBe(false);
    expect(result.errors.first_name).toBeDefined();
    expect(result.errors.last_name).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeDefined();
    expect(result.errors.dept_id).toBeDefined();
    expect(result.errors.role).toBeDefined();
  });

  // valid values
  it("Test-01-B: valid values → valid=true, no errors", () => {
    const result = validateEmployeeData(validData);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  // Password partitions
  it("Password only numbers → invalid", () => {
    const result = validateEmployeeData({
      ...validData,
      password: "12345678",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.password).toMatch(/letter.*number.*special/i);
  });

  it("Password only letters → invalid", () => {
    const result = validateEmployeeData({
      ...validData,
      password: "PasswordOnly",
    });
    expect(result.valid).toBe(false);
  });

  it("Password only special characters → invalid", () => {
    const result = validateEmployeeData({
      ...validData,
      password: "!@#$%^&*(",
    });
    expect(result.valid).toBe(false);
  });

  it("Password valid: 8–20 chars, letter+number+special → no password error", () => {
    const result = validateEmployeeData({
      ...validData,
      password: "Abc12345!",
    });
    expect(result.errors.password).toBeUndefined();
  });

  // Email partitions
  it("Email without @ → invalid", () => {
    const result = validateEmployeeData({
      ...validData,
      email: "invalid.email.com",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toMatch(/format/i);
  });

  it("Empty email → invalid", () => {
    const result = validateEmployeeData({
      ...validData,
      email: "  ",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  // Department & Role partitions
  it("Empty department → invalid", () => {
    const result = validateEmployeeData({
      ...validData,
      dept_id: "",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.dept_id).toBe("Department is required");
  });

  it("Empty role → invalid", () => {
    const result = validateEmployeeData({
      ...validData,
      role: "   ",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.role).toBe("Role is required");
  });
});