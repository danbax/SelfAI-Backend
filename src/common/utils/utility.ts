export const toTitleCase = (str: string): string => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

export const camelCaseToDotSeparated = (str: string): string => {
    return str.replace(/([a-z])([A-Z])/g, '$1.$2').toLowerCase();
}
  
export const isValidJson = (text: string): boolean => {
  try {
    JSON.parse(text);
    return true;
  } catch (e) {
    return false;
  }
}