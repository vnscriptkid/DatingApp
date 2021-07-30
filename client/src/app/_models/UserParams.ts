export class UserParams {
    minAge: number;
    maxAge: number;
    pageNumber: number;
    pageSize: number;
    gender: string;

    constructor(gender: string, minAge = 18, maxAge = 99, pageNumber = 1,pageSize = 5) {
        this.gender = gender;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}