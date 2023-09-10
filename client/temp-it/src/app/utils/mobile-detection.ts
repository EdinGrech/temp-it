export function isMobile(size: number): boolean {
  const screenWidth = window.innerWidth;
  return screenWidth < size ? true : false;
}
