import { eq, ilike, or } from "drizzle-orm";
import { db } from "./index";
import * as table from "./schema";

export class Employee {
    constructor(
        public employee_id: number,
        public full_name: string,
        public user_name: string,
        public password: string,
        public role: string
    ) {}

    public static get get() {
        async function all() {
            try {
                return await db.select().from(table.employee);
            } catch (error) {
                console.error(error);
            }
        }

        async function byId(employee_id: number) {
            try {
                return await db.select().from(table.employee).where(eq(table.employee.employee_id, employee_id));
            } catch (error) {
                console.error(error);
            }
        }

        async function byUsername(user_name: string) {
            try {
                return await db.select().from(table.employee).where(eq(table.employee.user_name, user_name));
            } catch (error) {
                console.error(error);
            }
        }

        async function search(keyword: string){
            try {
                return await db.select().from(table.employee).where(or(ilike(table.employee.full_name, `%${keyword}%`), ilike(table.employee.user_name, `%${keyword}%`)));
            } catch (error) {
                console.error(error);
            }
        }

        return { all, byId, byUsername, search };
    }

    public static async create(full_name: string, user_name: string, password: string, role: string) {
        try {
            return await db.insert(table.employee).values({
                full_name,
                user_name,
                password,
                role
            });
        } catch (error) {
            console.error(error);
        }
    }

    public static get update(){
        async function data(employee_id: number, full_name: string, user_name: string, role: string) {
            try {
                return await db.update(table.employee).set({
                    full_name,
                    user_name,
                    role
                }).where(eq(table.employee.employee_id, employee_id));
            } catch (error) {
                console.error(error);
            }
        }
    
        async function password(employee_id: number, password: string) {
            try {
                return await db.update(table.employee).set({
                    password
                }).where(eq(table.employee.employee_id, employee_id));
            } catch (error) {
                console.error(error);
            }
        }

        return { data, password };
    }

    public static async delete(employee_id: number) {
        try {
            return await db.delete(table.employee).where(eq(table.employee.employee_id, employee_id));
        } catch (error) {
            console.error(error);
        }
    }
}