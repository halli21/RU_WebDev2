import { fetchWithCredentials } from "../utilities/fetch-utilites";

export async function getUser() {
  const response = await fetchWithCredentials("user/info");

  const text = await response.text();

  if (response.ok) {
    try {
      return JSON.parse(text);
    } catch (error) {
      return null;
    }
  } else {
    console.error("Response status:", response.status);
    return null;
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
  await fetchWithCredentials("logout", {
    method: "POST",
  });
}
