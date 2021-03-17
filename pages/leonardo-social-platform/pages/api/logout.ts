import { magic } from "../../lib/magic";
import { removeSession, getSession } from "../../lib/auth-cookies";

export default async function logout(req, res) {
  try {
    const session = await getSession(req);

    if (session) {
      await magic.users.logoutByIssuer(session.issuer);
      removeSession(res);
    }
  } catch (error) {
    console.error(error);
  }

  res.writeHead(302, { Location: "/" });
  res.end();
}
