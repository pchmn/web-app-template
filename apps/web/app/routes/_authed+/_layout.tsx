import { getSessionCookie } from 'better-auth/cookies';
import { Outlet, redirect } from 'react-router';
import type { Route } from './+types/_layout';

export async function loader({ request }: Route.LoaderArgs) {
  const session = getSessionCookie(request.headers);
  if (!session) {
    return redirect('/sign-in');
  }
  return { isAuthed: true };
}

export default function AuthedLayout() {
  return <Outlet />;
}
