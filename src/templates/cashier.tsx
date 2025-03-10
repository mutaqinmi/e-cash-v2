'use client'
import Body from "@/src/components/body";
import { CaretRight, Minus, Plus, UserPlus } from "@phosphor-icons/react";
import SearchField from "../components/search-field";
import IconButton from "../components/icon-button";
import { formatCurrency } from "../lib/number-formatter";
import Form from "next/form";
import Button from "../components/button";
import { create } from "zustand";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import * as table from "@/src/db/schema";
import HorizontalDivider from "../components/horizontal-divider";
import LoadingSpin from "../components/loading-spin";
import PhoneField from "../components/phone-field";

interface ProductItem {
    product_id: number;
    product_name: string;
    price: number;
    stock: number;
    quantity: number;
    subtotal: number;
} 

interface Component {
    errorSnackBarMessage: string | null;
    setErrorSnackBarMessage: (message: string | null) => void;
    successSnackBarMessage: string | null;
    setSuccessSnackBarMessage: (message: string | null) => void;
    dataCustomer: table.customerType[] | null;
    setDataCustomer: (value: table.customerType[] | null) => void;
    showAddCustomerDialog?: boolean | null;
    setShowAddCustomerDialog?: (value: boolean | null) => void;
    showSuccessfullTransactionDialog: boolean | null;
    setShowSuccessfullTransactionDialog: (value: boolean | null) => void;
    transactionData: table.saleType | null;
    setTransactionData: (value: table.saleType | null) => void;
}

interface ProductData {
    data: table.productType[];
    setData: (value: table.productType[]) => void;
    cart: ProductItem[];
    setCart: (value: ProductItem[]) => void;
    total: number;
    setTotal: (value: number) => void;
    totalDiscounted: number | null;
    setTotalDiscounted: (value: number | null) => void;
}

const useComponent =  create<Component>((set) => ({
    errorSnackBarMessage: null,
    setErrorSnackBarMessage: (message: string | null) => set(() => ({errorSnackBarMessage: message})),
    successSnackBarMessage: null,
    setSuccessSnackBarMessage: (message: string | null) => set(() => ({successSnackBarMessage: message})),
    dataCustomer: null,
    setDataCustomer: (value: table.customerType[] | null) => set(() => ({dataCustomer: value})),
    showAddCustomerDialog: false,
    setShowAddCustomerDialog: (value: boolean | null) => set(() => ({showAddCustomerDialog: value})),
    showSuccessfullTransactionDialog: false,
    setShowSuccessfullTransactionDialog: (value: boolean | null) => set(() => ({showSuccessfullTransactionDialog: value})),
    transactionData: null,
    setTransactionData: (value: table.saleType | null) => set(() => ({transactionData: value})),
}));

const useProductData = create<ProductData>((set) => ({
    data: [],
    setData: (value: table.productType[]) => set(() => ({data: value})),
    cart: [],
    setCart: (value: ProductItem[]) => set(() => ({cart: value})),
    total: 0,
    setTotal: (value: number) => set(() => ({total: value})),
    totalDiscounted: null,
    setTotalDiscounted: (value: number | null) => set(() => ({totalDiscounted: value})),
}));

export default function Cashier(){
    const {
        errorSnackBarMessage,
        setErrorSnackBarMessage,
        successSnackBarMessage,
        setSuccessSnackBarMessage,
        dataCustomer,
        setDataCustomer,
        showAddCustomerDialog,
        setShowAddCustomerDialog,
        showSuccessfullTransactionDialog,
        setShowSuccessfullTransactionDialog,
        transactionData,
        setTransactionData
    } = useComponent();
    const {
        data,
        setData,
        cart,
        setCart,
        total,
        setTotal,
        totalDiscounted,
        setTotalDiscounted
    } = useProductData();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMemberLoading, setIsMemberLoading] = useState<boolean>(false);
    const searchField = useRef<HTMLInputElement | null>(null);

    const searchProduct = useCallback(async (searchQuery: string) => {
        return await axios.get(`${process.env.API_URL}/product?search=${searchQuery}`).then((response) => {
            if(response.status === 200){
                const data: table.productType[] = response.data;
                setData(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            setErrorSnackBarMessage(message);
        }).finally(() => setIsLoading(false));
    }, []);

    const searchHandler = async (searchQuery: string) => {
        setIsLoading(true);

        if(!searchQuery){
            setData([]);
            setIsLoading(false);
            return;
        };

        await searchProduct(searchQuery);
    }

    const addProductToCartHandler = (product: ProductItem) => {
        const localStorage = window.localStorage;

        let cart: ProductItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

        if(product.stock < 1){
            setErrorSnackBarMessage("Stok barang habis");
            return;
        }

        cart.push(product);

        localStorage.setItem("cart", JSON.stringify(cart));
        setCart(cart);
    }

    const deleteProductFromCartHandler = (index: number) => {
        const localStorage = window.localStorage;

        let cart: ProductItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

        cart.splice(index, 1);

        localStorage.setItem("cart", JSON.stringify(cart));
        setCart(cart);
        getTotalPayment(cart);
        setDataCustomer(null);
    }

    const increaseProductQuantityHandler = (index: number) => {
        const localStorage = window.localStorage;

        let cart: ProductItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

        if(cart[index].quantity < cart[index].stock){
            cart[index].quantity += 1;
        }
        cart[index].subtotal = cart[index].price * cart[index].quantity;

        localStorage.setItem("cart", JSON.stringify(cart));
        setCart(cart);
        getTotalPayment(cart);
    }

    const decreaseProductQuantityHandler = (index: number) => {
        const localStorage = window.localStorage;

        let cart: ProductItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

        if(cart[index].quantity > 1){
            cart[index].quantity -= 1;
        } else {
            deleteProductFromCartHandler(index);
            return;
        }

        cart[index].subtotal = cart[index].price * cart[index].quantity;

        localStorage.setItem("cart", JSON.stringify(cart));
        setCart(cart);
        getTotalPayment(cart);
    }

    const getTotalPayment = (cart: ProductItem[]) => {
        let total = 0;
        
        cart.forEach((product: ProductItem) => {
            total += product.subtotal;
        });
        
        const tax = (total / 100) * 12;
        setTotal(total + tax);
    }

    const getMemberData = useCallback(async (formData: FormData) => {
        return await axios.get(`${process.env.API_URL}/customer?phone_number=${formData.get("membership") as string}`).then((response) => {
            if(response.status === 200){
                const data: table.customerType[] = response.data;
                const total = formData.get("total") as unknown as number;
                setTotalDiscounted(total - ((total / 100) * 5));
                setDataCustomer(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            setErrorSnackBarMessage(message);
        }).finally(() => setIsMemberLoading(false));
    }, []);

    const newTransactionHandler = useCallback(async (cart: ProductItem[], total: number, customer_id: number | null) => {
        return await axios.post(`${process.env.API_URL}/transaction`, {
            cart,
            total,
            customer_id
        }).then((response) => {
            if(response.status === 200){
                const data: table.saleType = response.data.data;
                setTransactionData(data);
                setShowSuccessfullTransactionDialog(true);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            setErrorSnackBarMessage(message);
        }).finally(() => {
            const localStorage = window.localStorage;
            localStorage.setItem("cart", JSON.stringify([]));
            setCart([]);
            setTotal(0);
            setDataCustomer([]);
            setTotalDiscounted(null);
        });
    }, [])

    const getMemberDataHandler = useCallback(async (formData: FormData) => {
        setIsMemberLoading(true);

        await getMemberData(formData)
    }, [getMemberData]);

    useEffect(() => {
        if(typeof window === "undefined") return;
        const localStorage = window.localStorage;

        const cart: ProductItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

        setCart(cart);
        getTotalPayment(cart);
    }, []);

    return <Body className="pt-20 pl-72 p-8" errorSnackBarMessage={errorSnackBarMessage} errorSnackBarController={setErrorSnackBarMessage} successSnackBarMessage={successSnackBarMessage} successSnackBarController={setSuccessSnackBarMessage} showAddCustomerDialog={showAddCustomerDialog} setShowAddCustomerDialog={setShowAddCustomerDialog} showSuccessfullTransactionDialog={showSuccessfullTransactionDialog} setShowSuccessfullTransactionDialog={setShowSuccessfullTransactionDialog} transactionData={transactionData}>
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 max-h-fit bg-white p-4 rounded-lg">
                <div className="flex flex-col gap-4 relative">
                    <SearchField useRef={searchField} placeholder="Cari barang ..." autoFocus onChange={searchHandler} onKeyDown={(e) => {
                        if(e.key === "Enter"){
                            e.preventDefault();
                            addProductToCartHandler({
                                product_id: data[0].product_id,
                                product_name: data[0].product_name!,
                                price: data[0].price!,
                                stock: data[0].stock!,
                                quantity: 1,
                                subtotal: data[0].price! * 1
                            });
                            setData([]);
                            getTotalPayment([...cart, {
                                product_id: data[0].product_id,
                                product_name: data[0].product_name!,
                                price: data[0].price!,
                                stock: data[0].stock!,
                                quantity: 1,
                                subtotal: data[0].price! * 1
                            }]);
                            e.currentTarget.value = "";
                        }
                    }}/>
                    {isLoading ? <div className="absolute top-12 bg-white px-2 py-3 rounded-md w-full shadow-md flex justify-center items-center"><LoadingSpin className="h-6 w-6 border-[3px]"/></div> : data.length ? <div className="absolute top-12 bg-white px-4 py-2 rounded-md w-full shadow-md">
                        {data.map((product: table.productType, index: number) => {
                            return <div key={index} className="flex flex-col gap-2 my-2 hover:bg-gray-100" onClick={() => {
                                addProductToCartHandler({
                                    product_id: product.product_id,
                                    product_name: product.product_name!,
                                    price: product.price!,
                                    stock: product.stock!,
                                    quantity: 1,
                                    subtotal: product.price! * 1
                                });
                                setData([]);
                                getTotalPayment([...cart, {
                                    product_id: product.product_id,
                                    product_name: product.product_name!,
                                    price: product.price!,
                                    stock: product.stock!,
                                    quantity: 1,
                                    subtotal: product.price! * 1
                                }]);

                                if (searchField.current) {
                                    searchField.current.value = "";
                                }
                            }}>
                                <div className={`w-full grid grid-cols-3 ${data.length > 1 ? "pt-2" : "py-2"} px-2 cursor-pointer`}>
                                    <span className="col-span-1">{product.product_name}</span>
                                    <span className="text-gray-400 col-span-1 text-center">Stok: {product.stock}</span>
                                    <span className="text-gray-400 col-span-1 text-end">{formatCurrency(product.price!)}</span>
                                </div>
                                {data.length > 1 ? <HorizontalDivider className="border-gray-100"/> : null}
                            </div>
                        })}
                    </div> : null}
                </div>
                {cart.length ? <div className="mt-6">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="font-normal text-gray-400 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Nama Produk</span>
                                    </div>
                                </th>
                                <th className="font-normal text-gray-400 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Harga</span>
                                    </div>
                                </th>
                                <th className="font-normal text-gray-400 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Jumlah</span>
                                    </div>
                                </th>
                                <th className="font-normal text-gray-400 py-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <span>Total</span>
                                    </div>
                                </th>
                                <th className="font-normal py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((product: ProductItem, index: number) => {
                                return <tr key={index} className="text-center">
                                    <td className="p-2">{product.product_name}</td>
                                    <td className="p-2">{formatCurrency(product.price!)}</td>
                                    <td className="p-2 flex gap-3 items-center justify-center">
                                        <IconButton icon={<Minus size={10} weight="bold"/>} onClick={() => decreaseProductQuantityHandler(index)} className="aspect-square px-1 py-1"/>
                                        <span>{product.quantity}</span>
                                        <IconButton icon={<Plus size={10} weight="bold"/>} onClick={() => increaseProductQuantityHandler(index)} className="aspect-square px-1 py-1"/>
                                    </td>
                                    <td className="p-2">{formatCurrency(product.subtotal ?? 0)}</td>
                                    <td className="p-2 flex gap-2 justify-center items-center">
                                        <IconButton icon={<Minus size={12} weight="bold"/>} onClick={() => deleteProductFromCartHandler(index)} className="aspect-square px-1 py-1 bg-red-500 hover:bg-red-700"/>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div> : null}
            </div>
            <div className="col-span-1 max-h-fit flex flex-col gap-4">
                <div className="text-center bg-white p-4 rounded-lg">
                    <span>Total</span>
                    <h1 className="text-4xl font-semibold mt-2">{formatCurrency(total)}</h1>
                </div>
                {cart.length ? <div className="bg-white p-4 rounded-lg">
                    <Form action={getMemberDataHandler} formMethod="GET" className="mb-4">
                        <div className="flex gap-2 justify-between items-center">
                            <div className="w-full relative">
                                <input type="hidden" name="total" id="total" defaultValue={total}/>
                                <PhoneField label="Membership"/>
                                <IconButton icon={<CaretRight size={12} weight="bold"/>} className="!h-fit p-3 aspect-square absolute top-1/2 right-2 -translate-y-1/2" formButton/>
                            </div>
                            <IconButton icon={<UserPlus size={24} weight="bold"/>} className="p-3" onClick={() => setShowAddCustomerDialog!(true)}/>
                        </div>
                        {isMemberLoading ? <div className="flex justify-center items-center"><LoadingSpin className="h-6 w-6 border-[3px]"/></div> : dataCustomer && dataCustomer.length && cart.length ? <div>
                            {dataCustomer.map((customer: table.customerType, index: number) => {
                                return <div key={index} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Nama</span>
                                        <span>{customer.customer_name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Diskon</span>
                                        <span>5%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Total Bayar</span>
                                        <span className="font-semibold">{formatCurrency(totalDiscounted!)}</span>
                                    </div>
                                </div>
                            })}
                        </div> : null}
                    </Form>
                    <Form action={() => newTransactionHandler(cart, totalDiscounted?? total, dataCustomer ? dataCustomer[0].customer_id : null)} formMethod="POST" className="mt-2">
                        <Button className="w-full" label="Bayar" formButton/>
                    </Form>
                </div> : null}
            </div>
        </div>
    </Body>
}