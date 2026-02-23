import { NextResponse } from 'next/server';
import { DEFAULT_LOCALE, LOCALE_COOKIE_KEY, SUPPORTED_LOCALES } from '@/i18n/config';

const PUBLIC_FILE = /\.(.*)$/;

function getLocaleFromCookie(request) {
  const locale = request.cookies.get(LOCALE_COOKIE_KEY)?.value;
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const hasLocale = segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0]);

  if (pathname === '/') {
    const locale = getLocaleFromCookie(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  if (!hasLocale) {
    const locale = getLocaleFromCookie(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
};
