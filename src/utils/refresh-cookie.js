import env from "../../config/env.service.js";

const refreshTokenCookieName = "refreshToken";

const getRefreshTokenCookieOptions = () => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: env.jwtRefreshMaxAgeMs
  };

  if (env.refreshTokenCookieDomain) {
    options.domain = env.refreshTokenCookieDomain;
  }

  return options;
};

const getClearRefreshTokenCookieOptions = () => {
  const { maxAge, ...options } = getRefreshTokenCookieOptions();
  return options;
};

export {
  refreshTokenCookieName,
  getRefreshTokenCookieOptions,
  getClearRefreshTokenCookieOptions
};
