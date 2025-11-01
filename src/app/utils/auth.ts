import { GetServerSidePropsContext } from 'next';

export async function requireAuth(shouldAuth: boolean, context: GetServerSidePropsContext) {
  const refreshToken = context.req.cookies.refresh_token || null;

  if (!refreshToken && shouldAuth) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
      props: { showModal: true },
    };
  } else if (refreshToken && !shouldAuth) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: { authenticated: Boolean(refreshToken) },
  };
}
export const gsspRequireAuth = async (context: GetServerSidePropsContext) =>
  requireAuth(true, context);

export const gsspNotRequireAuth = async (context: GetServerSidePropsContext) =>
  requireAuth(false, context);
