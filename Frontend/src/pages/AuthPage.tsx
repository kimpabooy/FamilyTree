import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login, register as registerUser } from "../services/AuthService";
import type { LoginRequest, RegisterRequest } from "../types/Requests";

type AuthFormData = RegisterRequest; // Superset av LoginRequest — innehåller alla fält

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AuthFormData>();

  // Byt läge och rensa formuläret
  const toggleMode = () => {
    reset();
    setIsLogin((prev) => !prev);
  };

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isLogin) {
        const loginData: LoginRequest = {
          email: data.email,
          password: data.password,
        };
        await login(loginData);
      } else {
        await registerUser(data);
      }
      navigate("/familytree");
    } catch {
      setError("password", {
        type: "manual",
        message: isLogin
          ? "Fel e-post eller lösenord. Försök igen."
          : "Registreringen misslyckades. Kontrollera uppgifterna.",
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card-heading">
          {isLogin ? "Logga in" : "Skapa konto"}
        </h1>
        <p className="auth-card-subtext">
          {isLogin
            ? "Logga in för att komma åt ditt familjeträd."
            : "Skapa ett konto för att börja bygga ditt familjeträd."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Visas bara vid registrering */}
          {!isLogin && (
            <div className="auth-form-field">
              <label className="auth-form-label" htmlFor="displayName">
                Namn
              </label>
              <input
                id="displayName"
                type="text"
                className={`flow-input ${errors.displayName ? "flow-input--error" : ""}`}
                placeholder="Ditt namn"
                {...register("displayName", {
                  required: "Namn krävs",
                  minLength: {
                    value: 2,
                    message: "Namnet måste vara minst 2 tecken",
                  },
                })}
              />
              {errors.displayName && (
                <span className="auth-form-error">
                  {errors.displayName.message}
                </span>
              )}
            </div>
          )}

          <div className="auth-form-field">
            <label className="auth-form-label" htmlFor="email">
              E-post
            </label>
            <input
              id="email"
              type="email"
              className={`flow-input ${errors.email ? "flow-input--error" : ""}`}
              placeholder="din@epost.se"
              {...register("email", {
                required: "E-post krävs",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ange en giltig e-postadress",
                },
              })}
            />
            {errors.email && (
              <span className="auth-form-error">{errors.email.message}</span>
            )}
          </div>

          <div className="auth-form-field">
            <label className="auth-form-label" htmlFor="password">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              className={`flow-input ${errors.password ? "flow-input--error" : ""}`}
              placeholder="••••••••"
              {...register("password", {
                required: "Lösenord krävs",
                minLength: { value: 6, message: "Minst 6 tecken" },
                maxLength: { value: 60, message: "Max 60 tecken" },
              })}
            />
            {errors.password && (
              <span className="auth-form-error">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="flow-btn flow-btn--primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isLogin
                ? "Loggar in..."
                : "Skapar konto..."
              : isLogin
                ? "Logga in"
                : "Skapa konto"}
          </button>
        </form>

        {/* Växla mellan login och register */}
        <p className="auth-card-footer">
          {isLogin ? "Inget konto? " : "Har du redan ett konto? "}
          <button
            className="auth-card-toggle"
            onClick={toggleMode}
            type="button"
          >
            {isLogin ? "Registrera dig" : "Logga in"}
          </button>
        </p>
      </div>
    </div>
  );
}
