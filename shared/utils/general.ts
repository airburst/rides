export const flattenQuery = (param?: string[] | string | undefined): string => {
  const makeString = (s?: string): string => s ?? "";

  return Array.isArray(param) ? makeString(param[0]) : makeString(param);
};

export const getScalarValue = (
  value?: number[] | number | null,
): number | null => {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? Number(value[0]) : value || null;
};
