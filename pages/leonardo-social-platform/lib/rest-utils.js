/**
 * Handles REST HTTP methods defined in `handlers`
 * as a dictionary of methods-to-functions.
 *
 * Errors are caught and returned.
 */
export function createHandlers(handlers) {
  return async (req, res) => {
    const handler = handlers[req.method];
    if (handler) {
      try {
        await handler(req, res);
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .end(
            "Could not process that request. Please contact me at 08mnekrasov@brightoncollege.net"
          );
      }
    } else {
      res.setHeader("Allow", Object.keys(handlers));
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };
}

// client-side

export async function jsonOrErrorText(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(text);
  }
}
