//Frontend - backend communication must happen over HTTPS on production

export const registerUser = async (formData) => {
  try {
    const response = await fetch(
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await fetch(
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};

// createAgreementFunction() is the API call to fetch the sensor readings from the backend.

export const createAgreementFunction = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/Readings_From_Sensors/create_agreement.php",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in createAgreementFunction:", error);
    throw new Error(`Failed to fetch agreement: ${error.message}`);
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/Readings_From_Sensors/logout_component.php",
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("An error occurred during logout.");
  }
};
