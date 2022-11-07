export function isNotNullOrUndefined(value: any): boolean {
  return !isNullOrUndefined(value);
}

export function isNullOrUndefined(value: any): boolean {
  return typeof value == null || typeof value == 'undefined';
}

export function isNotBlank(value: string): boolean {
  return isNotNullOrUndefined(value) && value.length > 0;
}
