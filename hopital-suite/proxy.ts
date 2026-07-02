import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Liste de signatures de robots, scrapers, aspirateurs et outils automatisés
const BOT_SIGNATURES = [
  'bot', 'crawler', 'spider', 'scrape', 'fetch', 'parse', 'grab',
  'curl', 'wget', 'python', 'scrapy', 'axios', 'request', 'urllib', 'httpclient',
  'selenium', 'playwright', 'puppeteer', 'headless', 'phantomjs',
  'mj12bot', 'ahrefsbot', 'semrushbot', 'dotbot', 'rogerbot', 'exabot',
  'yandex', 'baiduspider', 'sogou', 'facebot', 'facebookexternalhit',
  'ia_archiver', 'zgrab', 'censys', 'shodan', 'nmap', 'sqlmap', 'nikto'
];

export function proxy(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // Vérification de la présence d'une signature de robot/scraper dans le User-Agent
  const isBot = BOT_SIGNATURES.some(signature => userAgent.includes(signature));

  if (isBot) {
    // Retourner un accès interdit (403) avec un message de sécurité clair
    return new NextResponse(
      JSON.stringify({
        error: 'Forbidden',
        message: 'Access denied: Automated scraping, web scrapers and bot access are strictly prohibited on Ndamatou.Suite.'
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
        }
      }
    );
  }

  // Permettre la requête pour les utilisateurs légitimes
  const response = NextResponse.next();
  
  // Ajouter les en-têtes de sécurité anti-robot sur toutes les réponses
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  
  return response;
}

// Configurer le middleware pour s'exécuter sur toutes les routes de l'application
export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
