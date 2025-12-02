function computeLowStockNotifications(inventory, previousFlags) {
  // inventory: [{ sku, name, qty }]
  // previousFlags: { [sku]: boolean } -> whether we've already notified
  const notifications = [];
  const newFlags = { ...previousFlags };

  for (const item of inventory) {
    const sku = item.sku;
    const qty = Number(item.qty);
    const alreadyNotified = !!previousFlags[sku];

    if (!Number.isFinite(qty)) continue;

    if (qty <= 4) {
      if (!alreadyNotified) {
        notifications.push({
          sku,
          name: item.name,
          qty,
        });
        newFlags[sku] = true;
      }
    } else if (qty >= 5) {
      // reset flag so a future drop can re-trigger
      newFlags[sku] = false;
    }
  }

  return { notifications, newFlags };
}

describe("Low Stock Notification Logic", () => {
  it("quantity drops from 5 to 4 = notification sent once", () => {
    const prevFlags = {};
    const inventory = [{ sku: "1234-5678", name: "Shirt", qty: 4 }];

    const { notifications, newFlags } = computeLowStockNotifications(
      inventory,
      prevFlags
    );

    expect(notifications).toHaveLength(1);
    expect(notifications[0]).toMatchObject({ sku: "1234-5678", qty: 4 });
    expect(newFlags["1234-5678"]).toBe(true);
  });

  it("quantity remains low (4→3→2) = no duplicate notifications", () => {
    const initialFlags = {};
    const firstInventory = [{ sku: "1234-5678", name: "Shirt", qty: 4 }];
    const first = computeLowStockNotifications(firstInventory, initialFlags);

    const secondInventory = [{ sku: "1234-5678", name: "Shirt", qty: 2 }];
    const second = computeLowStockNotifications(secondInventory, first.newFlags);

    expect(first.notifications).toHaveLength(1);
    expect(second.notifications).toHaveLength(0);
    expect(second.newFlags["1234-5678"]).toBe(true);
  });

  it("item restocks to 5 then drops again = second notification", () => {
    // First time: hits low stock
    const step1 = computeLowStockNotifications(
      [{ sku: "1234-5678", name: "Shirt", qty: 3 }],
      {}
    );

    // Restock to 5 = reset flag
    const step2 = computeLowStockNotifications(
      [{ sku: "1234-5678", name: "Shirt", qty: 5 }],
      step1.newFlags
    );

    // Drop again to 4 = new notification
    const step3 = computeLowStockNotifications(
      [{ sku: "1234-5678", name: "Shirt", qty: 4 }],
      step2.newFlags
    );

    expect(step1.notifications).toHaveLength(1); // first notification
    expect(step2.notifications).toHaveLength(0); // no low stock at 5
    expect(step3.notifications).toHaveLength(1); // second notification after drop again
  });
});
