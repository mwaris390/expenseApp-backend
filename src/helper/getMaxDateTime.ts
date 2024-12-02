export function getMaxDateTime() {
  let maxAllowedDateTime = new Date();
  maxAllowedDateTime.setDate(new Date().getDate() + 1);
  return maxAllowedDateTime;
}
