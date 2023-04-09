export const prerender = true;
export const csr = false;

export function load({ route }) {
  return {
    route
  }
}
