import { describe, expect, it } from "bun:test";
import { rideFormSchema, userProfileFormSchema } from "./formSchemas";

const validProfile = {
  id: "user-123",
  name: "Jane Smith",
  mobile: "07700 900123",
  emergency: "John Smith 07700 900456",
  email: "jane@example.com",
  preferences: { units: "km" },
  role: "USER",
  membershipId: "M001",
  membershipStatus: "MEMBER",
};

describe("userProfileFormSchema", () => {
  it("parses valid profile data", () => {
    const result = userProfileFormSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Jane Smith");
      expect(result.data.email).toBe("jane@example.com");
      expect(result.data.preferences.units).toBe("km");
    }
  });

  it("rejects empty name", () => {
    const result = userProfileFormSchema.safeParse({
      ...validProfile,
      name: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((i) => i.path[0] === "name");
      expect(nameError?.message).toBe("Name must contain at least 3 letters");
    }
  });

  it("rejects name shorter than 3 chars", () => {
    const result = userProfileFormSchema.safeParse({
      ...validProfile,
      name: "AB",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((i) => i.path[0] === "name");
      expect(nameError?.message).toBe("Name must contain at least 3 letters");
    }
  });

  it("rejects missing mobile", () => {
    const result = userProfileFormSchema.safeParse({
      ...validProfile,
      mobile: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === "mobile");
      expect(err?.message).toBe("Mobile number is required");
    }
  });

  it("rejects emergency without phone number", () => {
    const result = userProfileFormSchema.safeParse({
      ...validProfile,
      emergency: "No phone here!!!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === "emergency");
      expect(err?.message).toBe(
        "Emergency contact must include a telephone number",
      );
    }
  });

  it("rejects emergency too short", () => {
    const result = userProfileFormSchema.safeParse({
      ...validProfile,
      emergency: "J 07700",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === "emergency");
      expect(err?.message).toBe(
        "Too short for an emergency contact and number",
      );
    }
  });

  it("rejects invalid email", () => {
    const result = userProfileFormSchema.safeParse({
      ...validProfile,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === "email");
      expect(err?.message).toBe("Invalid email address");
    }
  });

  it("trims whitespace from string fields", () => {
    const result = userProfileFormSchema.safeParse({
      ...validProfile,
      name: "  Jane Smith  ",
      mobile: " 07700 900123 ",
      email: " jane@example.com ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Jane Smith");
      expect(result.data.mobile).toBe("07700 900123");
      expect(result.data.email).toBe("jane@example.com");
    }
  });
});

// rideFormSchema uses zfd.formData — it expects FormData or a plain object
const validRide = {
  name: "Sunday Club Ride",
  rideDate: "2025-03-15",
  time: "08:30",
  distance: 50,
  rideGroup: "Fast",
  destination: "Bath",
  meetPoint: "Brunel Square",
  notes: "Bring lights",
  leader: "Mark",
  route: "https://ridewithgps.com/123",
  rideLimit: -1,
  freq: 0,
};

describe("rideFormSchema", () => {
  it("parses valid ride data", () => {
    const result = rideFormSchema.safeParse(validRide);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Sunday Club Ride");
      expect(result.data.distance).toBe(50);
      expect(result.data.rideDate).toBe("2025-03-15");
    }
  });

  it("rejects empty ride name", () => {
    const result = rideFormSchema.safeParse({ ...validRide, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === "name");
      // zfd.text() treats empty string as missing → required_error fires
      expect(err?.message).toBe("Ride name is required");
    }
  });

  it("rejects ride name shorter than 3 chars", () => {
    const result = rideFormSchema.safeParse({ ...validRide, name: "AB" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === "name");
      expect(err?.message).toBe(
        "Ride name must contain at least 3 letters",
      );
    }
  });

  it("rejects missing rideDate", () => {
    const { rideDate: _, ...noDate } = validRide;
    const result = rideFormSchema.safeParse(noDate);
    expect(result.success).toBe(false);
  });

  it("rejects distance less than 10", () => {
    const result = rideFormSchema.safeParse({ ...validRide, distance: 5 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === "distance");
      expect(err?.message).toBe("Ride must be at least 10km");
    }
  });

  it("coerces string distance to number via zfd.numeric", () => {
    const result = rideFormSchema.safeParse({ ...validRide, distance: "50" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.distance).toBe(50);
    }
  });

  it("treats absent optional fields as undefined", () => {
    const minimal = {
      name: "Test Ride",
      rideDate: "2025-03-15",
      time: "09:00",
      distance: 20,
      freq: 0,
      rideLimit: -1,
    };
    const result = rideFormSchema.safeParse(minimal);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.destination).toBeUndefined();
      expect(result.data.meetPoint).toBeUndefined();
      expect(result.data.notes).toBeUndefined();
      expect(result.data.leader).toBeUndefined();
      expect(result.data.route).toBeUndefined();
      expect(result.data.id).toBeUndefined();
    }
  });

  it("parses valid repeating ride fields", () => {
    const repeating = {
      ...validRide,
      interval: 1,
      freq: 2,
      startDate: "2025-03-15",
      endDate: "2025-12-31",
      byweekday: 6,
    };
    const result = rideFormSchema.safeParse(repeating);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.interval).toBe(1);
      expect(result.data.freq).toBe(2);
      expect(result.data.startDate).toBe("2025-03-15");
      expect(result.data.endDate).toBe("2025-12-31");
      expect(result.data.byweekday).toBe(6);
    }
  });
});
