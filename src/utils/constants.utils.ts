import { Gender } from "../generated/prisma/enums.js";

export const REDIS_USER_REFRESH_TOKEN_PREFIX = "user-refresh-token:";
export const REDIS_USER_GOOGLE_REFRESH_TOKEN_PREFIX = "user-gg-refresh-token:";
export const REDIS_USER_GOOGLE_ACCESS_TOKEN_PREFIX = "user-gg-access-token:";
export const GOOGLE_ACCESS_TOKEN_EXPIRES_IN_MS = 60 * 60 * 1000;
export const GOOGLE_REFRESH_TOKEN_EXPIRES_IN_MS = 24 * 60 * 60 * 1000;
export const GOOGLE_AUTHORIZATION_STATE = "google-authorization-state:";

export function toSchemaGender(value: string): Gender | undefined {
  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "male":
      return Gender.MALE;
    case "female":
      return Gender.FEMALE;
    case "other":
      return Gender.OTHER;
    default:
      return undefined;
  }
}

export function getAgeFromBirthday(
  year?: number | null,
  month?: number | null,
  day?: number | null
): number {
  if (!year || !month || !day) {
    return 0; // no valid birth date
  }

  const birthDate = new Date(year, month - 1, day); // month is 0-based

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust if birthday hasn’t happened yet this year
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}
