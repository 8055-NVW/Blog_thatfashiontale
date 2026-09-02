export type UserType = {
    email: string;
    name?: string;
    image?: string;
    googleId?: string;
    is_superuser?: boolean; 
    createdAt?: Date;
    updatedAt?: Date;
}