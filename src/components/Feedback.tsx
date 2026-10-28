export function ErrorMessage({ message }: { message: string }) {
  return message ? (
    <div className="error" role="alert">
      {message}
    </div>
  ) : null;
}
export function Loading() {
  return (
    <div className="empty" role="status">
      Đang tải dữ liệu…
    </div>
  );
}
