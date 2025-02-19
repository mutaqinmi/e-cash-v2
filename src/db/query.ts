import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "./index";
import * as table from "./schema";

interface ProductItem {
    product_id: number;
    product_name: string;
    price: number;
    stock: number;
    quantity: number;
    subtotal: number;
} 

export class Employee {
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

export class Product {
    public static get get(){
        async function all() {
            try {
                return await db.select().from(table.product);
            } catch (error) {
                console.error(error);
            }
        }

        async function byId(product_id: number) {
            try {
                return await db.select().from(table.product).where(eq(table.product.product_id, product_id));
            } catch (error) {
                console.error(error);
            }
        }

        async function search(keyword: string){
            try {
                return await db.select().from(table.product).where(and(ilike(table.product.product_name, `%${keyword}%`), eq(table.product.active, true)));
            } catch (error) {
                console.error(error);
            }
        }

        async function activeProduct(){
            try {
                return await db.select().from(table.product).where(eq(table.product.active, true));
            } catch (error) {
                console.error(error);
            }
        }

        async function inactiveProduct(){
            try {
                return await db.select().from(table.product).where(eq(table.product.active, false));
            } catch (error) {
                console.error(error);
            }
        }

        return { all, byId, search, activeProduct, inactiveProduct };
    }

    public static async create(product_name: string, price: number, stock: number) {
        try {
            return await db.insert(table.product).values({
                product_name,
                price,
                stock
            });
        } catch (error) {
            console.error(error);
        }
    }

    public static get update() {
        async function data(product_id: number, price: number, stock: number){
            try {
                return await db.update(table.product).set({
                    price,
                    stock
                }).where(eq(table.product.product_id, product_id));
            } catch (error) {
                console.error(error);
            }
        }

        async function stock(product_id: number, stock: number){
            try {
                return await db.update(table.product).set({
                    stock
                }).where(eq(table.product.product_id, product_id));
            } catch (error) {
                console.error(error);
            }
        }

        async function status(product_id: number, active: boolean){
            try {
                return await db.update(table.product).set({
                    active
                }).where(eq(table.product.product_id, product_id));
            } catch (error) {
                console.error(error);
            }
        }

        return { data, stock, status };
    }
}

export class Customer {
    public static get get(){
        async function all() {
            try {
                return await db.select().from(table.customer);
            } catch (error) {
                console.error(error);
            }
        }

        async function byId(customer_id: number) {
            try {
                return await db.select().from(table.customer).where(eq(table.customer.customer_id, customer_id));
            } catch (error) {
                console.error(error);
            }
        }

        async function byPhoneNumber(phone_number: string){
            try {
                return await db.select().from(table.customer).where(eq(table.customer.phone_number, phone_number));
            } catch (error) {
                console.error(error);
            }
        }

        async function search(keyword: string){
            try {
                return await db.select().from(table.customer).where(ilike(table.customer.customer_name, `%${keyword}%`));
            } catch (error) {
                console.error(error);
            }
        }

        return { all, byId, byPhoneNumber, search };
    }

    public static async create(customer_name: string, customer_address: string, phone_number: string) {
        try {
            return await db.insert(table.customer).values({
                customer_name,
                customer_address,
                phone_number
            });
        } catch (error) {
            console.error(error);
        }
    }

    public static async update(customer_id: number, customer_name: string, customer_address: string, phone_number: string) {
        try {
            return await db.update(table.customer).set({
                customer_name,
                customer_address,
                phone_number
            }).where(eq(table.customer.customer_id, customer_id));
        } catch (error) {
            console.error(error);
        }
    }

    public static async delete(customer_id: number) {
        try {
            return await db.delete(table.customer).where(eq(table.customer.customer_id, customer_id));
        } catch (error) {
            console.error(error);
        }
    }
}

export class Transaction {
    public static get get(){
        async function all(){
            try {
                return await db.select().from(table.sale).leftJoin(table.employee, eq(table.sale.employee_id, table.employee.employee_id)).leftJoin(table.customer, eq(table.sale.customer_id, table.customer.customer_id));
            } catch (error) {
                console.error(error);
            }
        }

        async function saleDetail(sale_id: number){
            try {
                return await db.select().from(table.sale).leftJoin(table.saleDetail, eq(table.saleDetail.sale_id, table.sale.sale_id)).leftJoin(table.product, eq(table.saleDetail.product_id, table.product.product_id)).where(eq(table.saleDetail.sale_id, sale_id));
            } catch (error) {
                console.error(error);
            }
        }

        return { all, saleDetail };
    }

    public static get create() {
        async function newTransaction(sale_date: string, total_price: number, customer_id: number | null, employee_id: number){
            try {
                return await db.insert(table.sale).values({
                    sale_date,
                    total_price,
                    customer_id,
                    employee_id
                }).returning();
            } catch (error) {
                console.error(error);
            }
        }

        async function detailTransaction(sale_id: number, products: ProductItem[]){
            try {
                const data = products.map((product: ProductItem) => {
                    Product.update.stock(product.product_id, product.stock - product.quantity);

                    return {
                        sale_id,
                        product_id: product.product_id,
                        quantity: product.quantity,
                        subtotal: product.subtotal
                    }
                })

                return await db.insert(table.saleDetail).values(data);
            } catch (error) {
                console.error(error);
            }
        }

        return { newTransaction, detailTransaction };
    }
}