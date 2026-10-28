let token: string | null = null;
export const setToken = (value: string | null) => {
  token = value;
};
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", "Bearer " + token);
  let response: Response;
  try {
    response = await fetch(
      (import.meta.env.VITE_API_BASE_URL || "/api") + path,
      { ...options, headers },
    );
  } catch {
    throw new Error("Không kết nối được máy chủ. Vui lòng thử lại.");
  }
  if (!response.ok) {
    if (response.status === 401 && token)
      window.dispatchEvent(new Event("auth-expired"));
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.message?.toString() ||
        (response.status === 401
          ? "Vui lòng đăng nhập lại"
          : response.status === 403
            ? "Bạn không có quyền thực hiện thao tác này"
            : "Yêu cầu thất bại (" + response.status + ")"),
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}
