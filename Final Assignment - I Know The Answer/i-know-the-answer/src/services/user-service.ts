import { fetchWithCredentials } from "../utilities/fetch-utilites";

export async function getUser() {
  const response = await fetchWithCredentials("user/info");

  if (response.ok && response.headers.get("Content-Length") !== "0") {
    return await response.json();
  }
}

export async function authenticateUser(username: string, password: string) {
  const response = await fetchWithCredentials("login/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (response.ok) {
    return await response.json();
  }
}

export async function registerUser(
  username: string,
  displayName: string,
  password: string
) {
  const response = await fetchWithCredentials("register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      displayName,
      password,
    }),
  });

  if (response.ok) {
    return await response.text();
  }
}

export async function logoutUser() {
  const response = await fetchWithCredentials("logout", {
    method: "POST",
  });

  if (response.ok) {
    // Handle successful logout
    console.log("User logged out successfully");
    // Optionally clear any client-side storage or state here if needed
  } else {
    // Handle failed logout attempt
    console.error("Logout failed", response.status);
  }
}
