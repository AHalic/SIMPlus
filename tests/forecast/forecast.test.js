function deriveStockForecastDisplay({ inStock, hasSales, aiAvailable, aiForecastDays }) {
  if (!inStock) {
    return { status: "OK", forecastDays: 0, reason: "ITEM_NOT_IN_STOCK" };
  }

  if (!hasSales) {
    return { status: "OK", forecastDays: 99, reason: "NO_SALES_HISTORY" };
  }

  if (!aiAvailable) {
    return { status: "ERROR", message: "Forecast temporarily unavailable." };
  }

  if (typeof aiForecastDays !== "number" || aiForecastDays < 0) {
    return { status: "ERROR", message: "Wrong data format." };
  }

  return { status: "OK", forecastDays: aiForecastDays, reason: "AI_FORECAST" };
}

function shouldTriggerLowStockForecastEmail(forecastDays) {
  // if forecast < 7 days, notify manager
  return typeof forecastDays === "number" && forecastDays < 7;
}

function deriveRevenueForecastDisplay({ hasData, enoughData, aiAvailable }) {
  if (!hasData) {
    return { status: "ERROR", message: "Reports not available for the period" };
  }
  if (!enoughData) {
    return { status: "ERROR", message: "Not enough data to generate forecasts" };
  }
  if (!aiAvailable) {
    return { status: "ERROR", message: "Forecast temporarily unavailable." };
  }
  return { status: "OK" };
}

function computeRevenueComparison({ actual, forecast }) {
  if (forecast == null) {
    return {
      status: "ERROR",
      message: "No forecast available to generate report.",
    };
  }
  if (actual == null) {
    return {
      status: "ERROR",
      message: "No sales data available.",
    };
  }

  const diff = actual - forecast;
  const percentDiff = forecast === 0 ? null : (diff / forecast) * 100;

  return {
    status: "OK",
    actual,
    forecast,
    diff,
    percentDiff,
  };
}

describe("Low stock forecast logic", () => {
  it("in stock, has sales, AI available = use AI forecast", () => {
    const result = deriveStockForecastDisplay({
      inStock: true,
      hasSales: true,
      aiAvailable: true,
      aiForecastDays: 5,
    });

    expect(result.status).toBe("OK");
    expect(result.forecastDays).toBe(5);
    expect(result.reason).toBe("AI_FORECAST");
    expect(shouldTriggerLowStockForecastEmail(result.forecastDays)).toBe(true);
  });

  it("no sales history = forecast defaults to 99", () => {
    const result = deriveStockForecastDisplay({
      inStock: true,
      hasSales: false,
      aiAvailable: true,
      aiForecastDays: null,
    });

    expect(result.status).toBe("OK");
    expect(result.forecastDays).toBe(99);
    expect(result.reason).toBe("NO_SALES_HISTORY");
  });

  it("item not in stock = forecast 0", () => {
    const result = deriveStockForecastDisplay({
      inStock: false,
      hasSales: true,
      aiAvailable: true,
      aiForecastDays: 10,
    });

    expect(result.status).toBe("OK");
    expect(result.forecastDays).toBe(0);
    expect(result.reason).toBe("ITEM_NOT_IN_STOCK");
  });

  it("AI unavailable = error message", () => {
    const result = deriveStockForecastDisplay({
      inStock: true,
      hasSales: true,
      aiAvailable: false,
      aiForecastDays: null,
    });

    expect(result.status).toBe("ERROR");
    expect(result.message).toBe("Forecast temporarily unavailable.");
  });

  it("AI returns wrong data format = error message", () => {
    const result = deriveStockForecastDisplay({
      inStock: true,
      hasSales: true,
      aiAvailable: true,
      aiForecastDays: "not-a-number",
    });

    expect(result.status).toBe("ERROR");
    expect(result.message).toBe("Wrong data format.");
  });
});

describe("Revenue forecast logic", () => {
  it("has data, enough data, AI available = OK", () => {
    const result = deriveRevenueForecastDisplay({
      hasData: true,
      enoughData: true,
      aiAvailable: true,
    });

    expect(result.status).toBe("OK");
  });

  it("no recorded data = 'Reports not available for the period'", () => {
    const result = deriveRevenueForecastDisplay({
      hasData: false,
      enoughData: false,
      aiAvailable: true,
    });

    expect(result.status).toBe("ERROR");
    expect(result.message).toBe("Reports not available for the period");
  });

  it("not enough data = 'Not enough data to generate forecasts'", () => {
    const result = deriveRevenueForecastDisplay({
      hasData: true,
      enoughData: false,
      aiAvailable: true,
    });

    expect(result.status).toBe("ERROR");
    expect(result.message).toBe("Not enough data to generate forecasts");
  });

  it("AI unavailable = 'Forecast temporarily unavailable.'", () => {
    const result = deriveRevenueForecastDisplay({
      hasData: true,
      enoughData: true,
      aiAvailable: false,
    });

    expect(result.status).toBe("ERROR");
    expect(result.message).toBe("Forecast temporarily unavailable.");
  });
});

describe("Actual vs Forecast comparison", () => {
  it("both actual and forecast available = compute difference and percentage", () => {
    const result = computeRevenueComparison({
      actual: 1100,
      forecast: 1000,
    });

    expect(result.status).toBe("OK");
    expect(result.diff).toBe(100);
    expect(result.percentDiff).toBeCloseTo(10);
  });

  it("no forecast data = error", () => {
    const result = computeRevenueComparison({
      actual: 1000,
      forecast: null,
    });

    expect(result.status).toBe("ERROR");
    expect(result.message).toBe("No forecast available to generate report.");
  });

  it("no sales data = error", () => {
    const result = computeRevenueComparison({
      actual: null,
      forecast: 1000,
    });

    expect(result.status).toBe("ERROR");
    expect(result.message).toBe("No sales data available.");
  });
});
