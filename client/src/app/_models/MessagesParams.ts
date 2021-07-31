import { PaginationParams } from "./PaginationParams";

export class MessagesParams extends PaginationParams {
    container: string;
    
    constructor(container: string, pageNumber: number = 1, pageSize: number = 5) {
        super(pageNumber, pageSize);
        this.container = container;
    }
}