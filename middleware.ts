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

    if (authToken && publicRoute?.whenAuthenticated === 'redirect') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/";
        return NextResponse.redirect(redirectUrl);
    }

    if (publicRoute) {
        return NextResponse.next();
    }

    if (!authToken) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)']
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

  // Determinar host público dinamicamente
   const hostMap: Record<string, string> = {
    "homologacao": "nowastev2-homologa.dikmadigital.com.br",
    "producao": "nowastev2.dikmadigital.com.br",
    "localhost": "localhost:3000"
  }; 

  // Detectar ambiente pelo hostname do request
  const hostname = request.nextUrl.hostname;
  const environment = hostname.includes("homologa") ? "homologacao" : "producao";
  const publicHost = hostMap[environment]; 



  //USE IN LOCAL
 /* 
const hostMap: Record<string, string> = {
  homologacao: "nowastev2-homologa.dikmadigital.com.br",
  producao: "nowastev2.dikmadigital.com.br",
  localhost: "localhost:3000",
};
const hostname = request.nextUrl.hostname;

let environment: keyof typeof hostMap;

if (hostname.includes("localhost")) {
  environment = "localhost";
} else if (hostname.includes("homologa")) {
  environment = "homologacao";
} else {
  environment = "producao";
}

const publicHost = hostMap[environment]; 

 */

//USE IN PROD

  // Redirecionamento quando autenticado
  if (authToken && publicRoute?.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = publicHost;
    redirectUrl.port = ""; // remove porta interna
    redirectUrl.protocol = "http";
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  // Rotas públicas
  if (publicRoute) return NextResponse.next();

  // Redirecionamento quando não autenticado
  if (!authToken) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = publicHost;
    redirectUrl.port = ""; // remove porta interna
    redirectUrl.protocol = "https";
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)']
};
