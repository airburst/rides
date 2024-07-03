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

type FormDataType = Record<
  string,
  string | number | { units: string } | undefined
>;

export const convertObjectToFormData = (data: FormDataType): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      formData.append(key, "");
      return;
    }
    switch (typeof value) {
      case "number":
        formData.append(key, value.toString());
        break;
      case "object":
        formData.append(key, JSON.stringify(value));
        break;
      default:
        formData.append(key, value ?? "");
        break;
    }
  });

  return formData;
};

export const cleanUndefinedKeys = (data: FormDataType): FormDataType => {
  const cleaned = { ...data };

  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === undefined) {
      cleaned[key] = "";
    }
  });

  return cleaned;
};
