enum UserOrderBy {
    LAST_ACTIVE = 'lastActive',
    CREATED = 'created'
}

export class UserParams {
    minAge: number;
    maxAge: number;
    pageNumber: number;
    pageSize: number;
    gender: string;
    orderBy: UserOrderBy;

    constructor(gender: string, minAge = 18, maxAge = 99, pageNumber = 1,pageSize = 5, orderBy=UserOrderBy.LAST_ACTIVE) {
        this.gender = gender;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.orderBy = orderBy;
    }

    toString() {
        return Object.values(this).join('-');
    }

    static oppositeGender(gender: string) {
        return gender === 'male' ? 'female' : 'male';
    }
}