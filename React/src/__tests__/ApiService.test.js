import {
  registerUser,
  loginUser,
  pullReadingsFunction,
  logoutUser,
  pullHistory,
} from "../ApiService";

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe("API functions", () => {
  describe("registerUser", () => {
    it("should successfully register a user", async () => {
      const mockResponse = { success: true, message: "User registered" };
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      });

      const formData = { username: "test", password: "test123" };
      const result = await registerUser(formData);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Readings_From_Sensors/form_capture.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle registration errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const formData = { username: "test", password: "test123" };
      await expect(registerUser(formData)).rejects.toThrow(
        "An error occurred."
      );
    });
  });

  describe("loginUser", () => {
    it("should successfully login a user", async () => {
      const mockResponse = { success: true, message: "Login successful" };
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      });

      const formData = { username: "test", password: "test123" };
      const result = await loginUser(formData);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Readings_From_Sensors/login_capture.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle login errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const formData = { username: "test", password: "test123" };
      await expect(loginUser(formData)).rejects.toThrow("An error occurred.");
    });
  });

  describe("pullReadingsFunction", () => {
    it("should successfully fetch sensor readings", async () => {
      const mockData = { readings: [] };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await pullReadingsFunction();

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Readings_From_Sensors/pull_readings.php",
        {
          method: "GET",
          credentials: "include",
        }
      );
      expect(result).toEqual(mockData);
    });

    it("should handle failed requests", async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(pullReadingsFunction()).rejects.toThrow("Request failed");
    });

    it("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(pullReadingsFunction()).rejects.toThrow(
        "Failed to fetch agreement: Network error"
      );
    });
  });

  describe("logoutUser", () => {
    it("should successfully logout a user", async () => {
      fetch.mockResolvedValueOnce({ ok: true });

      await logoutUser();

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Readings_From_Sensors/logout_component.php",
        {
          method: "POST",
          credentials: "include",
        }
      );
    });

    it("should handle logout failures", async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(logoutUser()).rejects.toThrow("An error occurred during logout.");
    });
  });

  describe("pullHistory", () => {
    it("should successfully fetch history", async () => {
      const mockPayload = {
        success: true,
        message: "History fetched successfully",
        data: [],
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPayload),
      });

      const result = await pullHistory();

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Readings_From_Sensors/pull_history.php",
        {
          method: "GET",
          credentials: "include",
        }
      );
      expect(result).toEqual(mockPayload);
    });

    it("should handle failed history requests", async () => {
      const mockPayload = {
        success: false,
        message: "Error fetching history",
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPayload),
      });

      const result = await pullHistory();

      expect(result).toEqual({
        success: false,
        message: "Error fetching history",
        data: [],
      });
    });

    it("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await pullHistory();

      expect(result).toEqual({
        success: false,
        message: "Network error",
        data: [],
      });
    });
  });
});
