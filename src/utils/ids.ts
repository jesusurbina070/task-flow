/**
 * Genera un identificador único universal (UUID v4) utilizando la API Nativa de Web Crypto.
 * @returns string UUID
 */
export const generateId = (): string => {
  return crypto.randomUUID();
};
