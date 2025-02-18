import { ArrowUpRight, CaretUpDown, MoneyWavy, Package, Users } from "@phosphor-icons/react";
import Body from "../components/body";
import { formatCurrency } from "../lib/number-formatter";
import Chart from "../components/chart";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { create } from "zustand";
import Loading from "../components/loading";
import * as table from "@/src/db/schema";

const data = [
  {
    date: 'Page A',
    Total: 4000,
  },
  {
    date: 'Page B',
    Total: 3000,
  },
  {
    date: 'Page C',
    Total: 2000,
  },
  {
    date: 'Page D',
    Total: 2780,
  },
  {
    date: 'Page E',
    Total: 1890,
  },
  {
    date: 'Page F',
    Total: 2390,
  },
  {
    date: 'Page G',
    Total: 3490,
  },
];

interface ComponentState {
    errorSnackBarMessage: string | null;
    setErrorSnackBarMessage: (message: string | null) => void;
    successSnackBarMessage: string | null;
    setSuccessSnackBarMessage: (message: string | null) => void;
}

interface OverviewData {
    transactionData: {employee: table.employeeType, customer: table.customerType, sale: table.saleType}[];
    setTransactionData: (data: {employee: table.employeeType, customer: table.customerType, sale: table.saleType}[]) => void;
    productData: table.productType[];
    setProductData: (data: table.productType[]) => void;
    customerData: table.customerType[];
    setCustomerData: (data: table.customerType[]) => void;
}

const useComponent = create<ComponentState>((set) => ({
    errorSnackBarMessage: null,
    setErrorSnackBarMessage: (message: string | null) => set(() => ({errorSnackBarMessage: message})),
    successSnackBarMessage: null,
    setSuccessSnackBarMessage: (message: string | null) => set(() => ({successSnackBarMessage: message})),
}));

const useOverview = create<OverviewData>((set) => ({
    transactionData: [],
    setTransactionData: (data: {employee: table.employeeType, customer: table.customerType, sale: table.saleType}[]) => set(() => ({transactionData: data})),
    productData: [],
    setProductData: (data: table.productType[]) => set(() => ({productData: data})),
    customerData: [],
    setCustomerData: (data: table.customerType[]) => set(() => ({customerData: data})),
}));

export default function Overview(props: {setSidebar: (sidebar: string) => void}){
    const {
        errorSnackBarMessage,
        setErrorSnackBarMessage,
        successSnackBarMessage,
        setSuccessSnackBarMessage,
    } = useComponent();
    const {
        transactionData,
        setTransactionData,
        productData,
        setProductData,
        customerData,
        setCustomerData
    } = useOverview();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const getAllTransaction = useCallback(async () => {
        return await axios.get(`${process.env.API_URL}/transaction`).then((response) => {
            if(response.status === 200){
                const data: {employee: table.employeeType, customer: table.customerType, sale: table.saleType}[] = response.data.data;
                setTransactionData(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            setErrorSnackBarMessage(message);
        }).finally(() => setIsLoading(false));
    }, [])

    const getAllProducts = useCallback(async () => {
        return axios.get(`${process.env.API_URL}/product`).then((response) => {
            if(response.status === 200){
                const data: table.productType[] = response.data;
                data.sort((a, b) => a.stock! - b.stock!);
                setProductData(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            setErrorSnackBarMessage(message);
        }).finally(() => setIsLoading(false));
    }, []);

    const getAllCustomers = useCallback(async () => {
        return await axios.get(`${process.env.API_URL}/customer`).then((response) => {
            if(response.status === 200){
                const data: table.customerType[] = response.data;
                setCustomerData(data);
            }
        }).catch((error) => {
            const { message } = error.response?.data as { message: string };
            setErrorSnackBarMessage(message);
        }).finally(() => setIsLoading(false));
    }, []);

    const setStockColor = (stock: number): string => {
        if(stock <= 20){
            return "text-red-500";
        } else if(stock <= 50){
            return "text-yellow-500";
        } else {
            return "text-black";
        }
    }

    const sumTransaction = (transactionData: {employee: table.employeeType, customer: table.customerType, sale: table.saleType}[]): number => {
        const getCurrentDate = new Date().getDate();
        const getCurrentMonth = new Date().getMonth();
        const getCurrentYear = new Date().getFullYear();

        return transactionData.reduce((acc, transaction) => {
            if (new Date(transaction.sale.sale_date!).getDate() === getCurrentDate && new Date(transaction.sale.sale_date!).getMonth() === getCurrentMonth && new Date(transaction.sale.sale_date!).getFullYear() === getCurrentYear) {
                return acc + (transaction.sale.total_price ?? 0);
            }
            return acc;
        }, 0);
    }

    const loadData = useCallback(async () => {
        setIsLoading(true);

        await getAllTransaction();
        await getAllProducts();
        await getAllCustomers();
    }, [getAllTransaction, getAllProducts, getAllCustomers]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? <Loading className="pt-20 pl-72 p-8"/> : <Body className="pt-20 pl-72 p-8" successSnackBarMessage={successSnackBarMessage} errorSnackBarMessage={errorSnackBarMessage} errorSnackBarController={setErrorSnackBarMessage} successSnackBarController={setSuccessSnackBarMessage}>
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 bg-white p-4 rounded-md flex items-center justify-between gap-4 cursor-pointer" onClick={() => props.setSidebar("product")}>
                <div className="flex items-center gap-4">
                    <div className="w-fit h-fit p-2 bg-blue-500 text-white rounded-full">
                        <Package size={32}/>
                    </div>
                    <div>
                        <h1 className="text-gray-400">Barang</h1>
                        <h2 className="font-semibold text-3xl">{productData.length}</h2>
                    </div>
                </div>
                <ArrowUpRight size={18} weight="bold" className="text-gray-400"/>
            </div>
            <div className="col-span-1 bg-white p-4 rounded-md flex items-center justify-between gap-4 cursor-pointer" onClick={() => props.setSidebar("customer")}>
                <div className="flex items-center gap-4">
                    <div className="w-fit h-fit p-2 bg-blue-500 text-white rounded-full">
                        <Users size={32}/>
                    </div>
                    <div>
                        <h1 className="text-gray-400">Pelanggan</h1>
                        <h2 className="font-semibold text-3xl">{customerData.length}</h2>
                    </div>
                </div>
                <ArrowUpRight size={18} weight="bold" className="text-gray-400"/>
            </div>
            <div className="col-span-1 bg-white p-4 rounded-md flex items-center justify-between gap-4 cursor-pointer" onClick={() => router.push("#transaction-history")}>
                <div className="flex items-center gap-4">
                    <div className="w-fit h-fit p-2 bg-blue-500 text-white rounded-full">
                        <MoneyWavy size={32}/>
                    </div>
                    <div>
                        <h1 className="text-gray-400">Pendapatan hari ini</h1>
                        <h2 className="font-semibold text-3xl">{formatCurrency(sumTransaction(transactionData))}</h2>
                    </div>
                </div>
                <ArrowUpRight size={18} weight="bold" className="text-gray-400"/>
            </div>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-4">
            <div className="w-full h-fit col-span-3 bg-white py-4 px-8 rounded-md">
                <h1 className="text-xl font-semibold block mb-8">Statistik Riwayat Penjualan</h1>
                <div className="w-full h-64">
                    <Chart data={data}/>
                </div>
            </div>
            <div className="col-span-2 bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold block mb-4">Ketersediaan Barang</h1>
                <div className="overflow-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="font-normal text-gray-400 py-2 cursor-pointer text-start">
                                    <span>Nama Barang</span>
                                </th>
                                <th className="font-normal text-gray-400 py-2 cursor-pointer text-end">
                                    <span>Stok</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((product: table.productType, index: number) => {
                                return <tr key={index}>
                                    <td className="py-2 text-start">{product.product_name}</td>
                                    <td className={`${setStockColor(product.stock!)} py-2 text-end`}>{product.stock}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div className="bg-white p-4 rounded-md mt-4" id="transaction-history">
            <h1 className="text-xl font-semibold block p-4 mb-2">Riwayat Penjualan</h1>
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="font-normal text-gray-400 py-2 cursor-pointer">
                            <div className="flex justify-center items-center gap-2">
                                <span>Tanggal</span>
                                <CaretUpDown className="text-gray-400"/>
                            </div>
                        </th>
                        <th className="font-normal text-gray-400 py-2 cursor-pointer">
                            <div className="flex justify-center items-center gap-2">
                                <span>ID Transaksi</span>
                                <CaretUpDown className="text-gray-400"/>
                            </div>
                        </th>
                        <th className="font-normal text-gray-400 py-2 cursor-pointer">
                            <div className="flex justify-center items-center gap-2">
                                <span>Total Pembelian</span>
                                <CaretUpDown className="text-gray-400"/>
                            </div>
                        </th>
                        <th className="font-normal text-gray-400 py-2 cursor-pointer">
                            <div className="flex justify-center items-center gap-2">
                                <span>Pelanggan</span>
                                <CaretUpDown className="text-gray-400"/>
                            </div>
                        </th>
                        <th className="font-normal text-gray-400 py-2 cursor-pointer">
                            <div className="flex justify-center items-center gap-2">
                                <span>Kasir</span>
                                <CaretUpDown className="text-gray-400"/>
                            </div>
                        </th>
                        <th className="font-normal py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {transactionData.map((transaction: {employee: table.employeeType, customer: table.customerType, sale: table.saleType}, index: number) => {
                        return <tr key={index} className="text-center cursor-pointer hover:bg-gray-100" onClick={() => {}}>
                            <td className="p-2">{transaction.sale.sale_date}</td>
                            <td className="p-2">{transaction.sale.sale_id}</td>
                            <td className="p-2">{formatCurrency(transaction.sale.total_price!)}</td>
                            <td className="p-2">{transaction.customer.customer_name}</td>
                            <td className="p-2">{transaction.employee.full_name}</td>
                            <td><ArrowUpRight size={16}/></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    </Body>
}