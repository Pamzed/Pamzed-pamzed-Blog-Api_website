export const setToken = (localStorage: any, item: any) => {
  localStorage.setItem(process.env.NEXT_PUBLIC_KEY, item);
};

export const getToken = (localStorage: any) => {
  return localStorage.getItem(process.env.NEXT_PUBLIC_KEY);
};

export const removeToken = (localStorage: any) => {
  return localStorage.removeItem(process.env.NEXT_PUBLIC_KEY);
};

export const checkIfToken = (
  localStorage: any,
  callback: any,
  secondCallBack?: any
) => {
  const result = localStorage.getItem(process.env.NEXT_PUBLIC_KEY);
  if (result) return callback();
  if (secondCallBack && !result) secondCallBack();
};
