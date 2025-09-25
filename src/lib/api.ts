/* src/lib/api.ts */

 * @file api.ts
 * @brief Namespaced API helpers used by the UI
 * @author Canmi
 */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export interface ListingResponse {
  groups: string[];
  values: string[];
}

async function apiFetch<T>(
  baseUrl: string,
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ error: "An unknown error occurred" }));
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }

  if (response.status === 204) {
    // No content; cast to T for callers that expect void|null
    return null as unknown as T;
  }

  return response.json();
}

export const getProjects = (baseUrl: string): Promise<string[]> => {
  return apiFetch<string[]>(baseUrl, "/_namespaced/projects");
};

export const listPathContents = (
  baseUrl: string,
  project: string,
  path: string = "",
): Promise<ListingResponse> => {
  const fullPath = path ? `/${path}` : "";
  return apiFetch<ListingResponse>(baseUrl, `/ls/${project}${fullPath}`);
};

export const getValue = (
  baseUrl: string,
  project: string,
  path: string,
): Promise<JsonValue> => {
  return apiFetch<JsonValue>(baseUrl, `/namespaced/${project}/${path}`);
};

export const updateValue = (
  baseUrl: string,
  project: string,
  path: string,
  value: JsonValue,
): Promise<void> => {
  return apiFetch<void>(baseUrl, `/namespaced/${project}/${path}`, {
    method: "PUT",
    body: JSON.stringify(value),
  });
};

export const deleteValue = (
  baseUrl: string,
  project: string,
  path: string,
): Promise<void> => {
  return apiFetch<void>(baseUrl, `/namespaced/${project}/${path}`, {
    method: "DELETE",
  });
};
