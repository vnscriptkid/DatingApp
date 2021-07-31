export class PaginationParams {
    pageNumber: number;
    pageSize: number;

    constructor(pageNumber: number, pageSize: number) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}