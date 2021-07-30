export interface Pagination {
    CurrentPage: number;
    TotalPages: number;
    ItemsPerPage: number;
    TotalItems: number;
}

export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
}