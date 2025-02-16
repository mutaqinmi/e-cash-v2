import { date, decimal, index, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const employee = pgTable('employee', {
    employee_id: serial('employee_id').primaryKey(),
    full_name: varchar('full_name', {length: 255}),
    user_name: varchar('user_name', {length: 50}),
    password: varchar('password', {length: 255}),
    role: varchar('role', {length: 50}),
}, (table) => [
    index("user_name_idx").on(table.user_name),
    index("name_idx").on(table.full_name)
]);
export type employeeType = typeof employee.$inferSelect;

export const customer = pgTable('customer', {
    customer_id: serial('customer_id').primaryKey(),
    customer_name: varchar('customer_name', {length: 255}),
    customer_address: text('customer_address'),
    phone_number: varchar('phone_number', {length: 15}),
}, (table) => [
    index("customer_name_idx").on(table.customer_name),
    index("phone_number_idx").on(table.phone_number)
]);
export type customerType = typeof customer.$inferSelect;

export const product = pgTable('product', {
    product_id: serial('product_id').primaryKey(),
    product_name: varchar('product_name', {length: 255}),
    price: integer('price'),
    stock: integer('stock'),
}, (table) => [
    index("product_name_idx").on(table.product_name)
]);
export type productType = typeof product.$inferSelect;

export const sale = pgTable('sale', {
    sale_id: serial('sale_id').primaryKey(),
    sale_date: date('sale_date').default('NOW()'),
    total_price: integer('total_price'),
    customer_id: integer('customer_id').references(() => customer.customer_id),
    employee_id: integer('employee_id').references(() => employee.employee_id),
});
export type saleType = typeof sale.$inferSelect;

export const saleDetail = pgTable('saleDetail', {
    detail_id: serial('detail_id').primaryKey(),
    sale_id: integer('sale_id').references(() => sale.sale_id),
    product_id: integer('product_id').references(() => product.product_id),
    quantity: integer('quantity'),
    subtotal: integer('subtotal'),
});
export type saleDetailType = typeof saleDetail.$inferSelect;