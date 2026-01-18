// Format utilities

export const formatJSON = (json: unknown): string => {
  try {
    return JSON.stringify(json, null, 2);
  } catch (error) {
    return String(json);
  }
};

export const parseJSON = (str: string): unknown => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return str;
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const formatDuration = (ms: number): string => {
  if (ms < 1000) return ms + 'ms';
  return (ms / 1000).toFixed(2) + 's';
};

export const formatURL = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.href;
  } catch (error) {
    return url;
  }
};

export const getStatusColor = (status: number): string => {
  if (status >= 200 && status < 300) return 'text-green-600';
  if (status >= 300 && status < 400) return 'text-blue-600';
  if (status >= 400 && status < 500) return 'text-yellow-600';
  return 'text-red-600';
};

export const getStatusBackground = (status: number): string => {
  if (status >= 200 && status < 300) return 'bg-green-50 dark:bg-green-900';
  if (status >= 300 && status < 400) return 'bg-blue-50 dark:bg-blue-900';
  if (status >= 400 && status < 500) return 'bg-yellow-50 dark:bg-yellow-900';
  return 'bg-red-50 dark:bg-red-900';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

export const downloadFile = (content: string, filename: string): void => {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
  );
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};
