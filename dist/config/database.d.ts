import { Db } from 'mongodb';
export declare function connectDB(): Promise<void>;
export declare function getDB(): Db;
export declare function closeDB(): Promise<void>;
