import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'quiz/shared/:token',
    renderMode: RenderMode.Server
  },
  {
    path: 'pl/quiz/shared/:token',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
