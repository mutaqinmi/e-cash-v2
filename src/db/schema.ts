import { date, decimal, index, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const user = pgTable('user', {
    userID: serial('userID').primaryKey(),
    namaLengkap: varchar('namaLengkap', {length: 255}),
    username: varchar('username', {length: 50}),
    password: varchar('password', {length: 255}),
    hakAkses: varchar('hakAkses', {length: 50}),
}, (table) => [
    index("username_idx").on(table.username)
]);
export const userType = user.$inferSelect;

export const pelanggan = pgTable('pelanggan', {
    pelangganID: serial('pelangganID').primaryKey(),
    namaPelanggan: varchar('namaPelanggan', {length: 255}),
    alamat: text('alamat'),
    nomorTelepon: varchar('nomorTelepon', {length: 15}),
}, (table) => [
    index("nama_pelanggan_idx").on(table.namaPelanggan),
    index("nomor_telepon_idx").on(table.nomorTelepon)
]);
export const pelangganType = pelanggan.$inferSelect;

export const produk = pgTable('produk', {
    produkID: serial('produkID').primaryKey(),
    namaProduk: varchar('namaProduk', {length: 255}),
    harga: decimal('harga', {precision: 10, scale: 6}),
    stok: integer('stok'),
}, (table) => [
    index("nama_produk_idx").on(table.namaProduk)
]);
export const produkType = produk.$inferSelect;

export const penjualan = pgTable('penjualan', {
    penjualanID: serial('penjualanID').primaryKey(),
    tanggalPenjualan: date('tanggalPenjualan').default('NOW()'),
    totalHarga: decimal('totalHarga', {precision: 10, scale: 6}),
    pelangganID: integer('pelangganID').references(() => pelanggan.pelangganID),
    userID: integer('userID').references(() => user.userID),
});
export const penjualanType = penjualan.$inferSelect;

export const detailPenjualan = pgTable('detailPenjualan', {
    detailID: serial('detailID').primaryKey(),
    penjualanID: integer('penjualanID').references(() => penjualan.penjualanID),
    produkID: integer('produkID').references(() => produk.produkID),
    jumlahProduk: integer('jumlahProduk'),
    subtotal: decimal('subtotal', {precision: 10, scale: 6}),
});
export const detailPenjualanType = detailPenjualan.$inferSelect;