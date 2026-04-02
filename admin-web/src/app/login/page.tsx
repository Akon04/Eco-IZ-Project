"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/components/auth-provider";
import { isMockMode } from "@/lib/config";
import { loginSchema, type LoginFormValues } from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const mockMode = isMockMode();
  const defaultCredentials = mockMode
    ? {
        email: "akmaral@ecoiz.app",
        password: "admin123",
      }
    : {
        email: "admin@ecoiz.app",
        password: "admin123",
      };
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultCredentials,
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values);
      router.replace("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не удалось войти. Попробуй еще раз.";
      setError("root", { message });
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="auth-kicker">Доступ в админку ECOIZ</p>
        <h1 className="auth-title">Вход в пространство модерации</h1>
        <p className="muted">
          {mockMode
            ? "Тестовые данные уже подставлены для проверки интерфейса."
            : "Включен live-режим backend. Используй готовые аккаунты администратора или модератора."}
        </p>

        <form className="form-shell" onSubmit={handleSubmit(onSubmit)}>
          <label className="field">
            <span>Email</span>
            <input type="email" {...register("email")} />
            {errors.email ? (
              <p className="field-error">{errors.email.message}</p>
            ) : null}
          </label>

          <label className="field">
            <span>Пароль</span>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z" />
                    <path d="M9 15 15 9" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="field-error">{errors.password.message}</p>
            ) : null}
          </label>

          {errors.root ? (
            <p className="error-message">{errors.root.message}</p>
          ) : null}

          <p className="form-status muted">
            {isDirty
              ? "Есть несохраненные изменения в форме входа."
              : mockMode
                ? "Тестовые данные готовы."
                : "Данные live-аккаунта готовы."}
          </p>

          <div className="button-row">
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Входим..." : "Войти"}
            </button>
            <button
              type="button"
              className="ghost-button"
              onClick={() => reset(defaultCredentials)}
            >
              Сбросить
            </button>
          </div>
        </form>

        <div className="auth-hint">
          <strong>{mockMode ? "Тестовые аккаунты" : "Аккаунты live-backend"}</strong>
          {mockMode ? (
            <>
              <p className="muted">`akmaral@ecoiz.app / admin123`</p>
              <p className="muted">`nurdana@ecoiz.app / moderator123`</p>
            </>
          ) : (
            <>
              <p className="muted">`admin@ecoiz.app / admin123`</p>
              <p className="muted">`moderator@ecoiz.app / moderator123`</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
