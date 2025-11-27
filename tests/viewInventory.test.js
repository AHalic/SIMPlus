// viewInventory.test.js

// Simple logical helpers to represent the behavior of UC3 + UC7
function viewInventory(inventory) {
  // UC3 – View Inventory
  if (!Array.isArray(inventory)) {
    throw new Error("Inventory must be an array");
  }
  return inventory.length > 0 ? "INVENTORY_EXISTS" : "INVENTORY_EMPTY";
}

function searchBySku(inventory, sku) {
  // UC7 – Search by SKU
  if (!sku || typeof sku !== "string" || sku.trim() === "") {
    return { status: "EMPTY_INPUT", item: null };
  }

  const item = inventory.find((i) => i.SKU === sku);
  if (!item) {
    return { status: "NOT_FOUND", item: null };
  }
  return { status: "FOUND", item };
}

describe("UC3 – FR-06 View Inventory", () => {
  test("Test-06-A: inventory exists → table displays items", () => {
    const inventory = [
      { SKU: "1234", Qty: 15, Dept: "Health" },
      { SKU: "5678", Qty: 5, Dept: "Beauty" },
    ];

    const result = viewInventory(inventory);

    expect(result).toBe("INVENTORY_EXISTS");
  });

  test("Test-06-B: inventory empty → 'No Data Available'", () => {
    const inventory = [];

    const result = viewInventory(inventory);

    expect(result).toBe("INVENTORY_EMPTY");
  });
});

describe("UC3 – FR-07 Search by SKU", () => {
  const inventory = [
    { SKU: "12345", name: "Item A" },
    { SKU: "67890", name: "Item B" },
  ];

  test("Test-07-A: valid existing SKU → item details displayed", () => {
    const { status, item } = searchBySku(inventory, "12345");

    expect(status).toBe("FOUND");
    expect(item).toEqual({ SKU: "12345", name: "Item A" });
  });

  test("Test-07-B: non-existing SKU → 'No Data Available'", () => {
    const { status, item } = searchBySku(inventory, "99999");

    expect(status).toBe("NOT_FOUND");
    expect(item).toBeNull();
  });

  test("Test-07-C: empty input → prompt user to enter SKU", () => {
    const { status, item } = searchBySku(inventory, "");

    expect(status).toBe("EMPTY_INPUT");
    expect(item).toBeNull();
  });
});
