function applyPosTransactions(initialInventory, transactions) {
  // inventory: { [sku]: quantity }
  const inventory = { ...initialInventory };
  const processedTx = new Set();
  const errors = [];

  for (const tx of transactions) {
    const { id, type, items } = tx;

    if (processedTx.has(id)) {
      errors.push({ txId: id, code: "DUPLICATE_TRANSACTION" });
      continue;
    }
    processedTx.add(id);

    for (const item of items) {
      const sku = String(item.sku);
      const qty = Number(item.qty);

      if (!Number.isFinite(qty) || qty <= 0) {
        errors.push({ txId: id, sku, code: "INVALID_QUANTITY" });
        continue;
      }

      if (inventory[sku] === undefined) {
        errors.push({ txId: id, sku, code: "UNKNOWN_SKU" });
        continue;
      }

      if (type === "SALE") {
        inventory[sku] -= qty;
      } else if (type === "RETURN") {
        inventory[sku] += qty;
      } else {
        errors.push({ txId: id, sku, code: "UNKNOWN_TYPE" });
      }
    }
  }

  return { inventory, errors };
}

describe("POS Integration Logic", () => {
  const baseInventory = {
    "1234-5678": 10,
    "2345-6789": 5,
  };

  it("valid sale transaction with existing SKUs", () => {
    const transactions = [
      {
        id: "tx1",
        type: "SALE",
        items: [{ sku: "1234-5678", qty: 2 }],
      },
    ];

    const { inventory, errors } = applyPosTransactions(baseInventory, transactions);

    expect(errors).toHaveLength(0);
    expect(inventory["1234-5678"]).toBe(8);
    expect(inventory["2345-6789"]).toBe(5);
  });

  it("sale with unknown SKU = error, no stock update for that item", () => {
    const transactions = [
      {
        id: "tx2",
        type: "SALE",
        items: [{ sku: "9999-0000", qty: 1 }],
      },
    ];

    const { inventory, errors } = applyPosTransactions(baseInventory, transactions);

    expect(errors).toHaveLength(1);
    expect(errors[0].code).toBe("UNKNOWN_SKU");
    // known SKUs unchanged
    expect(inventory["1234-5678"]).toBe(10);
    expect(inventory["2345-6789"]).toBe(5);
  });

  it("duplicate transaction ID is ignored on second time", () => {
    const transactions = [
      {
        id: "tx3",
        type: "SALE",
        items: [{ sku: "1234-5678", qty: 2 }],
      },
      {
        id: "tx3", // duplicate
        type: "SALE",
        items: [{ sku: "1234-5678", qty: 2 }],
      },
    ];

    const { inventory, errors } = applyPosTransactions(baseInventory, transactions);

    // First tx applied, second flagged as duplicate
    expect(inventory["1234-5678"]).toBe(8);
    expect(errors.some((e) => e.code === "DUPLICATE_TRANSACTION")).toBe(true);
  });

  it("valid return transaction increases stock", () => {
    const transactions = [
      {
        id: "tx4",
        type: "RETURN",
        items: [{ sku: "2345-6789", qty: 2 }],
      },
    ];

    const { inventory, errors } = applyPosTransactions(baseInventory, transactions);

    expect(errors).toHaveLength(0);
    expect(inventory["2345-6789"]).toBe(7);
  });

  it("return with unknown SKU = error", () => {
    const transactions = [
      {
        id: "tx5",
        type: "RETURN",
        items: [{ sku: "0000-0000", qty: 1 }],
      },
    ];

    const { inventory, errors } = applyPosTransactions(baseInventory, transactions);

    expect(errors).toHaveLength(1);
    expect(errors[0].code).toBe("UNKNOWN_SKU");
  });
});
