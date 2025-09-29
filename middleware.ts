/* import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  { path: '/sign-in', whenAuthenticated: 'redirect' },
  { path: '/sign-up', whenAuthenticated: 'redirect' },
  { path: '/forgot-pass', whenAuthenticated: 'redirect' },
  { path: '/recover-pass', whenAuthenticated: 'redirect' }
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/sign-in";

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const authToken = request.cookies.get('authToken')?.value;
  const publicRoute = publicRoutes.find(route => route.path === path);

  const hostname = request.nextUrl.hostname;

  // Decide ambiente
  let publicHost: string;
  let protocol = "https";
  let port = "";

  if (hostname.includes("localhost")) {
    publicHost = "localhost";
    protocol = "http";
    port = "3000";
  } else if (hostname.includes("homologa")) {
    publicHost = "nowastev2-homologa.dikmadigital.com.br";
  }

  else {
    // usa o host atual 
    publicHost = hostname;
  }

  // Usuário autenticado em rota pública → redireciona para "/"
  if (authToken && publicRoute?.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = publicHost;
    redirectUrl.port = port;
    redirectUrl.protocol = protocol;
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  // Rotas públicas → segue o fluxo
  if (publicRoute) return NextResponse.next();

  // Usuário sem autenticação → redireciona para sign-in
  if (!authToken) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = publicHost;
    redirectUrl.port = port;
    redirectUrl.protocol = protocol;
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
};
 */

import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  { path: '/sign-in', whenAuthenticated: 'redirect' },
  { path: '/sign-up', whenAuthenticated: 'redirect' },
  { path: '/forgot-pass', whenAuthenticated: 'redirect' },
  { path: '/recover-pass', whenAuthenticated: 'redirect' }
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/sign-in";

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const authToken = request.cookies.get('authToken')?.value;
  const publicRoute = publicRoutes.find(route => route.path === path);

  const hostname = request.nextUrl.hostname;

  // Default = usar o host da própria request (Vercel, prod, etc.)
  let publicHost = hostname;
  let protocol = request.nextUrl.protocol.replace(":", ""); // mantém https/http
  let port = "";

  // Só muda no caso de localhost
  if (hostname.includes("localhost")) {
    publicHost = "localhost";
    protocol = "http";
    port = "3000";
  }

  // Usuário autenticado em rota pública → redireciona para "/"
  if (authToken && publicRoute?.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = publicHost;
    redirectUrl.port = port;
    redirectUrl.protocol = protocol;
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  // Rotas públicas → segue o fluxo
  if (publicRoute) return NextResponse.next();

  // Usuário sem autenticação → redireciona para sign-in
  if (!authToken) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = publicHost;
    redirectUrl.port = port;
    redirectUrl.protocol = protocol;
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
};
