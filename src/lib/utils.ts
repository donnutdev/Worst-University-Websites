export const serializeNonPrimitive = (obj: any) => {
    return structuredClone(obj);
}