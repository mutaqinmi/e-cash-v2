CREATE TABLE "detailPenjualan" (
	"detailID" serial PRIMARY KEY NOT NULL,
	"penjualanID" integer,
	"produkID" integer,
	"jumlahProduk" integer,
	"subtotal" numeric(10, 6)
);
--> statement-breakpoint
CREATE TABLE "pelanggan" (
	"pelangganID" serial PRIMARY KEY NOT NULL,
	"namaPelanggan" varchar(255),
	"alamat" text,
	"nomorTelepon" varchar(15)
);
--> statement-breakpoint
CREATE TABLE "penjualan" (
	"penjualanID" serial PRIMARY KEY NOT NULL,
	"tanggalPenjualan" date DEFAULT 'NOW()',
	"totalHarga" numeric(10, 6),
	"pelangganID" integer,
	"userID" integer
);
--> statement-breakpoint
CREATE TABLE "produk" (
	"produkID" serial PRIMARY KEY NOT NULL,
	"namaProduk" varchar(255),
	"harga" numeric(10, 6),
	"stok" integer
);
--> statement-breakpoint
CREATE TABLE "user" (
	"userID" serial PRIMARY KEY NOT NULL,
	"namaLengkap" varchar(255),
	"username" varchar(50),
	"password" varchar(255),
	"hakAkses" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "detailPenjualan" ADD CONSTRAINT "detailPenjualan_penjualanID_penjualan_penjualanID_fk" FOREIGN KEY ("penjualanID") REFERENCES "public"."penjualan"("penjualanID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detailPenjualan" ADD CONSTRAINT "detailPenjualan_produkID_produk_produkID_fk" FOREIGN KEY ("produkID") REFERENCES "public"."produk"("produkID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penjualan" ADD CONSTRAINT "penjualan_pelangganID_pelanggan_pelangganID_fk" FOREIGN KEY ("pelangganID") REFERENCES "public"."pelanggan"("pelangganID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penjualan" ADD CONSTRAINT "penjualan_userID_user_userID_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("userID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "nama_pelanggan_idx" ON "pelanggan" USING btree ("namaPelanggan");--> statement-breakpoint
CREATE INDEX "nomor_telepon_idx" ON "pelanggan" USING btree ("nomorTelepon");--> statement-breakpoint
CREATE INDEX "nama_produk_idx" ON "produk" USING btree ("namaProduk");--> statement-breakpoint
CREATE INDEX "username_idx" ON "user" USING btree ("username");