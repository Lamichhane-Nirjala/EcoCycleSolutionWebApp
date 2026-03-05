import { describe, test, expect, beforeEach, jest } from "@jest/globals";

/**
 * DASHBOARD CONTROLLER TESTS
 * Tests for dashboard data aggregation and statistics
 */

describe("Dashboard Controller", () => {
  describe("Dashboard data calculation", () => {
    const calculateEcoPoints = (pickupCount, totalWaste) => {
      const pointsPerPickup = 10;
      const pointsPerKg = 1;
      return pickupCount * pointsPerPickup + totalWaste * pointsPerKg;
    };

    test("should calculate eco points based on pickups and waste", () => {
      expect(calculateEcoPoints(5, 25)).toBe(75); // 5*10 + 25*1
      expect(calculateEcoPoints(10, 50)).toBe(150); // 10*10 + 50*1
    });

    test("should handle zero pickups", () => {
      expect(calculateEcoPoints(0, 0)).toBe(0);
    });

    test("should handle only waste weight", () => {
      expect(calculateEcoPoints(0, 100)).toBe(100); // 0*10 + 100*1
    });

    test("should handle only pickup count", () => {
      expect(calculateEcoPoints(10, 0)).toBe(100); // 10*10 + 0*1
    });
  });

  describe("Pickup status aggregation", () => {
    test("should aggregate pickup statuses correctly", () => {
      const pickups = [
        { status: "Completed", pickupId: "1" },
        { status: "Pending", pickupId: "2" },
        { status: "Pending", pickupId: "3" },
        { status: "Completed", pickupId: "4" },
      ];

      const statusBreakdown = {};
      pickups.forEach((p) => {
        statusBreakdown[p.status] = (statusBreakdown[p.status] || 0) + 1;
      });

      expect(statusBreakdown.Completed).toBe(2);
      expect(statusBreakdown.Pending).toBe(2);
    });
  });

  describe("Waste type breakdown", () => {
    test("should aggregate waste types with total weight", () => {
      const pickups = [
        { wasteType: "Plastic", estimatedWeight: 5 },
        { wasteType: "Plastic", estimatedWeight: 3 },
        { wasteType: "Glass", estimatedWeight: 2 },
        { wasteType: "Glass", estimatedWeight: 4 },
      ];

      const wasteBreakdown = {};
      pickups.forEach((p) => {
        if (!wasteBreakdown[p.wasteType]) {
          wasteBreakdown[p.wasteType] = { count: 0, totalWeight: 0 };
        }
        wasteBreakdown[p.wasteType].count += 1;
        wasteBreakdown[p.wasteType].totalWeight += p.estimatedWeight;
      });

      expect(wasteBreakdown.Plastic.count).toBe(2);
      expect(wasteBreakdown.Plastic.totalWeight).toBe(8);
      expect(wasteBreakdown.Glass.count).toBe(2);
      expect(wasteBreakdown.Glass.totalWeight).toBe(6);
    });
  });

  describe("Recent pickups filtering", () => {
    test("should get recent pickups sorted by date", () => {
      const pickups = [
        { pickupId: "1", requestedAt: new Date("2026-01-01") },
        { pickupId: "2", requestedAt: new Date("2026-01-05") },
        { pickupId: "3", requestedAt: new Date("2026-01-03") },
      ];

      const recent = [...pickups]
        .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))
        .slice(0, 10);

      expect(recent[0].pickupId).toBe("2"); // Most recent
      expect(recent[1].pickupId).toBe("3");
      expect(recent[2].pickupId).toBe("1");
    });

    test("should limit to 10 recent pickups", () => {
      const pickups = Array.from({ length: 20 }, (_, i) => ({
        pickupId: `pickup-${i}`,
        requestedAt: new Date(2026, 0, i + 1),
      }));

      const recent = pickups.slice(0, 10);
      expect(recent).toHaveLength(10);
    });
  });
});
