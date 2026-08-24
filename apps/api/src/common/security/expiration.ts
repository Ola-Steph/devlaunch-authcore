import ms, {
  type StringValue,
} from "ms";

export function getExpirationDate(
  duration: string,
): Date {
  const milliseconds = ms(
    duration as StringValue,
  );

  return new Date(
    Date.now() + milliseconds,
  );
}