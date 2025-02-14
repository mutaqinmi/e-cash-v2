export function formatInputtedCurrency(value: string): string {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatCurrency(value: number): string {
    return 'Rp. ' + value.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatPhoneNumber(value: string): string {
    return value.startsWith("0") ? value.replace(/\D/g, '').replace(/^0/, '+62 ').replace(/(\d{3})(\d{4})(\d{4,5})/, '$1-$2-$3') : value;
}