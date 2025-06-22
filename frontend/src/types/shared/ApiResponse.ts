export type ApiResponse<T> = {
  ok: boolean;
  status: number;
  message?: string;
  data?: T;
};
