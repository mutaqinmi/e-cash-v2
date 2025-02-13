import { eq } from "drizzle-orm";
import { db } from "./index";
import * as table from "./schema";

export class Employee {
    constructor(public employee_id: number, public full_name: string, public user_name: string, public password: string, public role: string) {
        employee_id = this.employee_id;
        full_name = this.full_name;
        user_name = this.user_name;
        password = this.password;
        role = this.role;
    }

    public static get get() {
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

        return { byId, byUsername };
    }
}