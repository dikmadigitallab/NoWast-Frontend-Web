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

    // 1. Se estiver autenticado e for uma rota pública que deve redirecionar
    if (authToken && publicRoute?.whenAuthenticated === 'redirect') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/";
        return NextResponse.redirect(redirectUrl);
    }

    // 2. Se for uma rota pública normal (sem redirect)
    if (publicRoute) {
        return NextResponse.next();
    }

    // 3. Se não estiver autenticado, redirecionar para login
    if (!authToken) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
        return NextResponse.redirect(redirectUrl);
    }

    // 4. Rota protegida com autenticação: OK
    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)']
};
