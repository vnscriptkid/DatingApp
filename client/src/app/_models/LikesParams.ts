import { PaginationParams } from "./PaginationParams";

export class LikesParams extends PaginationParams {
    public predicate: string;
    
    constructor(predicate: string, pageNumber: number, pageSize: number) {
        super(pageNumber, pageSize);
        this.predicate = predicate;
    }
}