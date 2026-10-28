import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { ErrorMessage } from "../components/Feedback";
export function AuthPage() {
  const [params] = useSearchParams();
  const [register, setRegister] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >;
    setBusy(true);
    setError("");
    try {
      await authenticate(register ? "register" : "login", values);
      const next = params.get("next");
      navigate(next?.startsWith("/") && !next.startsWith("//") ? next : "/");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-page">
      <div className="auth-story">
        <div className="eyebrow">JOIN THE MOVEMENT</div>
        <h1>
          Mỗi mục tiêu
          <br />
          bắt đầu từ
          <br />
          <em>một bước nhỏ.</em>
        </h1>
        <Link to="/">Khám phá cửa hàng ↗</Link>
      </div>
      <form className="panel auth-form" onSubmit={submit}>
        <span className="eyebrow">TÀI KHOẢN SPORTSHOP</span>
        <h2>{register ? "Bắt đầu hành trình" : "Chào mừng trở lại"}</h2>
        <p>
          {register
            ? "Tạo tài khoản để đặt và theo dõi đơn hàng."
            : "Đăng nhập để tiếp tục hành trình của bạn."}
        </p>
        <ErrorMessage message={error} />
        {register && (
          <label>
            Họ và tên
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
        )}
        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          Mật khẩu
          <input
            name="password"
            type="password"
            autoComplete={register ? "new-password" : "current-password"}
            required
            minLength={register ? 8 : 1}
            maxLength={64}
          />
        </label>
        <button className="button" disabled={busy}>
          {busy ? "Đang xử lý…" : register ? "Tạo tài khoản" : "Đăng nhập"}
        </button>
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setRegister(!register);
            setError("");
          }}
        >
          {register
            ? "Đã có tài khoản? Đăng nhập"
            : "Chưa có tài khoản? Đăng ký"}
        </button>
      </form>
    </section>
  );
}
