import { cn } from "../../src/lib/utils";

describe("Utils", () => {
  describe("cn function", () => {
    it("should combine class names correctly", () => {
      const result = cn("class1", "class2", "class3");
      expect(result).toBe("class1 class2 class3");
    });

    it("should handle conditional classes", () => {
      const result = cn("base", true && "conditional", false && "not-included");
      expect(result).toBe("base conditional");
    });

    it("should handle undefined and null values", () => {
      const result = cn("base", undefined, null, "valid");
      expect(result).toBe("base valid");
    });

    it("should handle empty strings", () => {
      const result = cn("base", "", "valid");
      expect(result).toBe("base valid");
    });
  });
});
