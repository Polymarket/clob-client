export function generateOrderSalt(): string {
    return Math.round(Math.random() * Date.now()).toString();
}
