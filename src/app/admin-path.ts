import adminConfig from './admin-config.json';

function normalizeAdminPath(value: unknown): string {
  const path = String(value || '').trim().replace(/^\/+|\/+$/g, '');
  return /^[a-z0-9][a-z0-9-]{8,80}$/i.test(path) ? path : 'qs-console-851-c4f9';
}

export const ADMIN_PANEL_ROUTE_PATH = normalizeAdminPath(adminConfig.panelPath);
export const ADMIN_PANEL_URL = `/${ADMIN_PANEL_ROUTE_PATH}`;
