export interface Pagination {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
}

export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
}

export interface PaginationParams {
    page: number;
    itemsPerPage: number;
}