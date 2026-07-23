(() => {
  "use strict";

  const config = window.OpenHouseConfig?.api;
  if (!config?.baseUrl) {
    throw new Error("OpenHouseConfig.api.baseUrl is required.");
  }

  class ApiError extends Error {
    constructor(code, message, status) {
      super(message);
      this.name = "ApiError";
      this.code = code;
      this.status = status;
    }
  }

  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      config.requestTimeoutMs,
    );

    try {
      const response = await fetch(
        `${config.baseUrl.replace(/\/$/, "")}${path}`,
        {
          method: options.method ?? "GET",
          headers: {
            Accept: "application/json",
            ...(options.body ? { "Content-Type": "application/json" } : {}),
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: controller.signal,
        },
      );
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new ApiError(
          payload.error?.code ?? "REQUEST_FAILED",
          payload.error?.message ?? `Request failed (${response.status}).`,
          response.status,
        );
      }
      return payload;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new ApiError(
          "REQUEST_TIMEOUT",
          "The server took too long to respond.",
          408,
        );
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        "NETWORK_ERROR",
        "Unable to connect to the service.",
        0,
      );
    } finally {
      window.clearTimeout(timeout);
    }
  }

  const encode = encodeURIComponent;
  window.OpenHouseApi = Object.freeze({
    ApiError,
    registration: Object.freeze({
      register: (studentId, hasVisitedOpenHouse) =>
        request("/registration/register", {
          method: "POST",
          body: { studentId, hasVisitedOpenHouse },
        }),
      recover: (studentId) =>
        request("/registration/recover", {
          method: "POST",
          body: { studentId },
        }),
    }),
    participant: Object.freeze({
      login: (accessCode) =>
        request("/participants/login", {
          method: "POST",
          body: { accessCode },
        }),
      get: (accessCode) =>
        request(`/participants/${encode(accessCode)}`),
      completeStation: (accessCode, stationId, rating, qrPayload) =>
        request(
          `/participants/${encode(accessCode)}/stations/${stationId}`,
          {
            method: "POST",
            body: { rating, qrPayload },
          },
        ),
      redeem: (accessCode, finalIntentionRating) =>
        request(`/participants/${encode(accessCode)}/redeem`, {
          method: "POST",
          body: { finalIntentionRating },
        }),
      draw: (accessCode) =>
        request(`/participants/${encode(accessCode)}/draw`, {
          method: "POST",
        }),
    }),
    admin: Object.freeze({
      getUsers: () => request("/admin/users"),
      resetCodes: () =>
        request("/admin/codes/reset", {
          method: "POST",
          body: { confirmation: "RESET_ALL_USERS" },
        }),
      clearUsers: () =>
        request("/admin/users/clear", {
          method: "DELETE",
          body: { confirmation: "DELETE_ALL_USERS" },
        }),
    }),
  });
})();
