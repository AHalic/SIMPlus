// app/api/employee/validation.js

/**
 * Backend validation helper for Create Employee
 * for logical testing purposes
 */
export function validateEmployeeData(data) {
  const errors = {};
  const trim = (v) => (typeof v === "string" ? v.trim() : "");

  // First name: required, 2–16
  const first = trim(data.first_name);
  if (!first) {
    errors.first_name = "First name is required";
  } else if (first.length < 2) {
    errors.first_name = "First name must be at least 2 characters";
  } else if (first.length > 16) {
    errors.first_name = "First name must be at most 16 characters";
  }

  // Last name: required, 2–16
  const last = trim(data.last_name);
  if (!last) {
    errors.last_name = "Last name is required";
  } else if (last.length < 2) {
    errors.last_name = "Last name must be at least 2 characters";
  } else if (last.length > 16) {
    errors.last_name = "Last name must be at most 16 characters";
  }

  // Email: required + basic format
  const email = trim(data.email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Email format is invalid";
  }

  // Password: required, 8–20, letter+number+special
  const password = data.password || "";
  const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/;
  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (!pwRegex.test(password)) {
    errors.password =
      "Password must be 8–20 chars and include a letter, a number and a special character";
  }

  // Department: required
  const deptId = trim(data.dept_id);
  if (!deptId) {
    errors.dept_id = "Department is required";
  }

  // Role: required
  const role = trim(data.role);
  if (!role) {
    errors.role = "Role is required";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
