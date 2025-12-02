function validateCsvItem(item) {
  const errors = [];

  // Required fields
  const requiredFields = [
    "name",
    "size",
    "quantity",
    "price",
    "sku",
    "color",
    "department",
    "type",
  ];
  for (const field of requiredFields) {
    if (item[field] === undefined || item[field] === null || String(item[field]).trim() === "") {
      errors.push(`MISSING_${field.toUpperCase()}`);
    }
  }

  // Name: 3-16 letters only
  if (item.name) {
    const name = String(item.name);
    if (!/^[A-Za-z]{3,16}$/.test(name)) {
      errors.push("INVALID_NAME");
    }
  }

  // SKU: format xxxx-xxxx (digits)
  if (item.sku) {
    const sku = String(item.sku);
    if (!/^\d{4}-\d{4}$/.test(sku)) {
      errors.push("INVALID_SKU_FORMAT");
    }
  }

  // Quantity: > 0
  if (item.quantity !== undefined) {
    const q = Number(item.quantity);
    if (!Number.isFinite(q) || q <= 0) {
      errors.push("INVALID_QUANTITY");
    }
  }

  // Price: positive number
  if (item.price !== undefined) {
    const p = Number(item.price);
    if (!Number.isFinite(p) || p <= 0) {
      errors.push("INVALID_PRICE");
    }
  }

  return { valid: errors.length === 0, errors };
}

function processBulkInsert(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      status: "EMPTY_FILE",
      added: [],
      rejected: [],
    };
  }

  const added = [];
  const rejected = [];

  for (const row of items) {
    const { valid, errors } = validateCsvItem(row);
    if (valid) {
      added.push(row);
    } else {
      rejected.push({ item: row, errors });
    }
  }

  let status;
  if (rejected.length === 0) status = "SUCCESS";
  else if (added.length === 0) status = "FAIL_ALL";
  else status = "PARTIAL";

  return { status, added, rejected };
}

// UC-05: Manual add/remove stock

function adjustStock(operation, { exists, currentQty }, qty) {
  const result = { status: null, message: null, newQty: null };

  const q = Number(qty);
  if (!Number.isFinite(q) || q <= 0) {
    result.status = "ERROR";
    result.message = "QUANTITY_INVALID";
    return result;
  }

  if (operation === "ADD") {
    if (!exists) {
      result.status = "NEW_ITEM_REQUIRED";
      result.message = "Item does not exist; full details required";
      return result;
    }
    if (q >= 50) {
      result.status = "ERROR";
      result.message = "MAX_INCREMENT_EXCEEDED";
      return result;
    }
    result.status = "OK";
    result.newQty = currentQty + q;
    return result;
  }

  if (operation === "REMOVE") {
    if (!exists) {
      result.status = "ERROR";
      result.message = "ITEM_NOT_FOUND";
      return result;
    }
    if (q > currentQty) {
      result.status = "ERROR";
      result.message = "NO_NEGATIVE_STOCK";
      return result;
    }
    result.status = "OK";
    result.newQty = currentQty - q;
    return result;
  }

  result.status = "ERROR";
  result.message = "UNKNOWN_OPERATION";
  return result;
}

describe("Mass Item Addition ", () => {
  it("all rows valid = SUCCESS, all added", () => {
    const items = [
      {
        name: "Shirt",
        size: "M",
        quantity: 10,
        price: 19.99,
        sku: "1234-5678",
        color: "Blue",
        department: "Clothing",
        type: "Top",
      },
      {
        name: "Pants",
        size: "L",
        quantity: 5,
        price: 29.99,
        sku: "2345-6789",
        color: "Black",
        department: "Clothing",
        type: "Bottom",
      },
    ];

    const result = processBulkInsert(items);

    expect(result.status).toBe("SUCCESS");
    expect(result.added).toHaveLength(2);
    expect(result.rejected).toHaveLength(0);
  });

  it("mix of valid and invalid rows = PARTIAL", () => {
    const items = [
      {
        name: "Shirt",
        size: "M",
        quantity: 10,
        price: 19.99,
        sku: "1234-5678",
        color: "Blue",
        department: "Clothing",
        type: "Top",
      },
      {
        // invalid SKU + quantity
        name: "Bad1",
        size: "L",
        quantity: 0,
        price: 15,
        sku: "BADSKU",
        color: "Red",
        department: "Clothing",
        type: "Top",
      },
    ];

    const result = processBulkInsert(items);

    expect(result.status).toBe("PARTIAL");
    expect(result.added).toHaveLength(1);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0].errors).toContain("INVALID_SKU_FORMAT");
    expect(result.rejected[0].errors).toContain("INVALID_QUANTITY");
  });

  it("wrong format / missing fields = FAIL_ALL", () => {
    const items = [
      {
        // missing sku, size, etc.
        name: "OnlyName",
      },
    ];

    const result = processBulkInsert(items);

    expect(result.status).toBe("FAIL_ALL");
    expect(result.added).toHaveLength(0);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0].errors).toContain("MISSING_SKU");
  });
});

describe("Manual Add/Remove Stock ", () => {
  it("add quantity to existing item = OK, newQty increased", () => {
    const result = adjustStock("ADD", { exists: true, currentQty: 10 }, 5);

    expect(result.status).toBe("OK");
    expect(result.newQty).toBe(15);
  });

  it("new SKU on ADD = NEW_ITEM_REQUIRED", () => {
    const result = adjustStock("ADD", { exists: false, currentQty: 0 }, 5);

    expect(result.status).toBe("NEW_ITEM_REQUIRED");
    expect(result.message).toBe("Item does not exist; full details required");
  });

  it("invalid quantity (0) on ADD = ERROR", () => {
    const result = adjustStock("ADD", { exists: true, currentQty: 10 }, 0);

    expect(result.status).toBe("ERROR");
    expect(result.message).toBe("QUANTITY_INVALID");
  });

  it("remove within stock = OK, newQty decreased", () => {
    const result = adjustStock("REMOVE", { exists: true, currentQty: 10 }, 3);

    expect(result.status).toBe("OK");
    expect(result.newQty).toBe(7);
  });

  it("remove more than in stock = NO_NEGATIVE_STOCK error", () => {
    const result = adjustStock("REMOVE", { exists: true, currentQty: 5 }, 10);

    expect(result.status).toBe("ERROR");
    expect(result.message).toBe("NO_NEGATIVE_STOCK");
  });

  it("remove with non-existing SKU = ITEM_NOT_FOUND", () => {
    const result = adjustStock("REMOVE", { exists: false, currentQty: 0 }, 1);

    expect(result.status).toBe("ERROR");
    expect(result.message).toBe("ITEM_NOT_FOUND");
  });
});
