import { Request } from 'express';

function buildUrl(req: Request, params: Record<string, any>) {
  const protocol = (req.protocol || 'http');
  const host = req.get('host');
  const url = new URL(req.originalUrl, `${protocol}://${host}`);
  Object.keys(params).forEach(k => {
    if (params[k] === null || params[k] === undefined) url.searchParams.delete(k);
    else url.searchParams.set(k, String(params[k]));
  });
  return url.toString();
}

export function paginateResponse(req: Request, rows: any[], count: number, limit = 50, offset = 0) {
  const nextOffset = offset + limit;
  const prevOffset = Math.max(0, offset - limit);
  const next = nextOffset < count ? buildUrl(req, { limit, offset: nextOffset }) : null;
  const prev = offset > 0 ? buildUrl(req, { limit, offset: prevOffset }) : null;

  return {
    code: 'success',
    message: '',
    payload: {
      count,
      next,
      prev,
      results: rows,
    },
  };
}

export function singleResponse(obj: any) {
  return {
    code: 'success',
    message: '',
    payload: obj,
  };
}
