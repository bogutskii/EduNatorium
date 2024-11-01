// src/typeDefs/types.ts

export interface UserArgs {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export interface LoginArgs {
    email: string;
    password: string;
}

export interface UpdateUserArgs {
    id: string;
    bio?: string;
    location?: string;
    phoneNumber?: string;
}

export interface Context {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

