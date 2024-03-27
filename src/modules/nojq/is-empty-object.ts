export const isEmptyObject = ( obj: Record<string, any> ): boolean => {
  let name: string;

  for ( name in obj ) {
    return false;
  }
  return true;
};