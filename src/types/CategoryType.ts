export type CategoryType = {
    name: string;
    slug: string;
    description: string;
}

export type CategoryWithId = CategoryType & {
    _id: string;
}