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

  // Detecta ambiente
  const hostname = request.nextUrl.hostname;
  const isLocalhost = hostname.includes("localhost");

  // Define host de destino
  const publicHost = isLocalhost 
    ? "localhost:3000" 
    : "nowastev2.api.dikmadigital.com.br"; // coloca aqui o host real da API/prod

  // Usuário autenticado em rota pública → redireciona para "/"
  if (authToken && publicRoute?.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = publicHost;
    redirectUrl.port = isLocalhost ? "3000" : "";
    redirectUrl.protocol = isLocalhost ? "http" : "https";
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  // Rotas públicas → segue o fluxo
  if (publicRoute) return NextResponse.next();

  // Usuário sem autenticação → redireciona para sign-in
  if (!authToken) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = publicHost;
    redirectUrl.port = isLocalhost ? "3000" : "";
    redirectUrl.protocol = isLocalhost ? "http" : "https";
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
