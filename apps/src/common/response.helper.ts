import { Request } from 'express';

export function paginateResponse(rows: any[], count: number, limit = 50, offset = 0) {
  return {
    code: 'success',
    message: '',
    payload: {
      count,
      limit,
      offset,
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
