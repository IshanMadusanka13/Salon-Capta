import React, { useState } from "react";
import { Trash2 } from "lucide-react";

interface Service {
    serviceId: number;
    name: string;
    price: number;
}

interface Product {
    productId: number;
    name: string;
    price: number;
    stockQuantity: number;
}

interface Employee {
    employeeId: number;
    name: string;
}

interface PosFormProps {
    services: Service[];
    products: Product[];
    employees: Employee[];
    onSubmit: (data: any) => void;
    isLoading: boolean;
}

type ItemType = "service" | "product";

type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    type: ItemType;
};

const PosForm: React.FC<PosFormProps> = ({
    services,
    products,
    employees,
    onSubmit,
    isLoading,
}) => {
    const [employeeId, setEmployeeId] = useState<number | "">("");
    const [customer, setCustomer] = useState("");
    const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
    const [selectedProductId, setSelectedProductId] = useState<number | "">("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD">("CASH");
    const [cashGiven, setCashGiven] = useState<number | "">("");

    // Add service to cart
    const handleAddService = () => {
        if (!selectedServiceId) return;
        const service = services.find((s) => s.serviceId === selectedServiceId);
        if (!service) return;
        if (cart.some((item) => item.type === "service" && item.id === service.serviceId)) return;
        setCart([
            ...cart,
            {
                id: service.serviceId,
                name: service.name,
                price: service.price,
                quantity: 1,
                type: "service",
            },
        ]);
        setSelectedServiceId("");
    };

    // Add product to cart
    const handleAddProduct = () => {
        if (!selectedProductId) return;
        const product = products.find((p) => p.productId === selectedProductId);
        if (!product) return;
        if (cart.some((item) => item.type === "product" && item.id === product.productId)) return;
        setCart([
            ...cart,
            {
                id: product.productId,
                name: product.name,
                price: product.price,
                quantity: 1,
                type: "product",
            },
        ]);
        setSelectedProductId("");
    };

    // Remove item from cart
    const handleRemoveItem = (type: ItemType, id: number) => {
        setCart(cart.filter((item) => !(item.type === type && item.id === id)));
    };

    // Change product quantity
    const handleProductQty = (id: number, qty: number) => {
        setCart(
            cart.map((item) =>
                item.type === "product" && item.id === id
                    ? { ...item, quantity: qty }
                    : item
            )
        );
    };

    // Calculate total
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Calculate change if cash
    const change =
        paymentMethod === "CASH" && cashGiven !== "" && Number(cashGiven) >= total
            ? Number(cashGiven) - total
            : 0;

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId || !customer || cart.length === 0) return;
        if (paymentMethod === "CASH" && (cashGiven === "" || Number(cashGiven) < total)) return;
        onSubmit({
            customer,
            employeeId,
            cart,
            paymentMethod,
            totalAmount: total,
            cashGiven: paymentMethod === "CASH" ? Number(cashGiven) : undefined,
            change: paymentMethod === "CASH" ? change : undefined,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-5xl mx-auto mt-10"
        >
            <h2 className="text-2xl font-bold mb-8 text-center">New POS Transaction</h2>
            {/* Employee | Customer */}
            <div className="flex gap-8 mb-6">
                <div className="flex-1">
                    <label className="block font-medium mb-1">Employee</label>
                    <select
                        className="w-full px-3 py-2 rounded-lg border dark:bg-gray-800"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(Number(e.target.value))}
                        required
                    >
                        <option value="">Select employee</option>
                        {employees.map((emp) => (
                            <option key={emp.employeeId} value={emp.employeeId}>
                                {emp.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block font-medium mb-1">Customer Name</label>
                    <input
                        className="w-full px-3 py-2 rounded-lg border dark:bg-gray-800"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        required
                        placeholder="Enter customer name"
                    />
                </div>
            </div>
            {/* Service | Product */}
            <div className="flex gap-8 mb-6">
                <div className="flex-1 flex gap-2">
                    <div className="flex-1">
                        <label className="block font-medium mb-1">Add Service</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border dark:bg-gray-800"
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                        >
                            <option value="">Select service</option>
                            {services
                                .filter(
                                    (s) =>
                                        !cart.some(
                                            (item) => item.type === "service" && item.id === s.serviceId
                                        )
                                )
                                .map((service) => (
                                    <option key={service.serviceId} value={service.serviceId}>
                                        {service.name} (LKR {service.price})
                                    </option>
                                ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddService}
                        className="self-end px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    >
                        Add
                    </button>
                </div>
                <div className="flex-1 flex gap-2">
                    <div className="flex-1">
                        <label className="block font-medium mb-1">Add Product</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border dark:bg-gray-800"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(Number(e.target.value))}
                        >
                            <option value="">Select product</option>
                            {products
                                .filter(
                                    (p) =>
                                        !cart.some(
                                            (item) => item.type === "product" && item.id === p.productId
                                        )
                                )
                                .map((product) => (
                                    <option key={product.productId} value={product.productId}>
                                        {product.name} (LKR {product.price})
                                    </option>
                                ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddProduct}
                        className="self-end px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    >
                        Add
                    </button>
                </div>
            </div>
            {/* Cart Table */}
            <div className="mb-6">
                <table className="w-full border rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="py-2 px-2">Type</th>
                            <th className="py-2 px-2">Name</th>
                            <th className="py-2 px-2">Price</th>
                            <th className="py-2 px-2">Qty</th>
                            <th className="py-2 px-2">Total</th>
                            <th className="py-2 px-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={`${item.type}-${item.id}`}>
                                <td className="py-2 px-2 capitalize">{item.type}</td>
                                <td className="py-2 px-2">{item.name}</td>
                                <td className="py-2 px-2">LKR {item.price}</td>
                                <td className="py-2 px-2">
                                    {item.type === "product" ? (
                                        <input
                                            type="number"
                                            className="w-16 px-2 py-1 border rounded"
                                            min={1}
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleProductQty(item.id, Number(e.target.value))
                                            }
                                        />
                                    ) : (
                                        1
                                    )}
                                </td>
                                <td className="py-2 px-2">
                                    LKR {(item.price * item.quantity).toFixed(2)}
                                </td>
                                <td className="py-2 px-2">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(item.type, item.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {cart.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">
                                    No items added
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Total */}
            <div className="mb-4 text-xl font-bold text-right">
                Total: <span className="text-green-600">LKR {total.toFixed(2)}</span>
            </div>
            {/* Payment method */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Payment Method</label>
                <select
                    className="w-full px-3 py-2 rounded-lg border dark:bg-gray-800"
                    value={paymentMethod}
                    onChange={(e) =>
                        setPaymentMethod(e.target.value as "CASH" | "CARD")
                    }
                >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                </select>
            </div>
            {/* If cash, show cash given and change */}
            {paymentMethod === "CASH" && (
                <div className="mb-4 flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block font-medium mb-1">Cash Given</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 rounded-lg border dark:bg-gray-800"
                            min={total}
                            value={cashGiven}
                            onChange={(e) => setCashGiven(Number(e.target.value))}
                            required
                            placeholder="Enter amount"
                        />
                    </div>
                    <div className="text-lg font-semibold">
                        Change:{" "}
                        <span className={change < 0 ? "text-red-600" : "text-green-600"}>
                            LKR {change >= 0 ? change.toFixed(2) : "0.00"}
                        </span>
                    </div>
                </div>
            )}
            {/* Submit */}
            <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold hover:from-green-700 hover:to-blue-700 transition-all"
                disabled={
                    isLoading ||
                    !employeeId ||
                    !customer ||
                    cart.length === 0 ||
                    (paymentMethod === "CASH" && (cashGiven === "" || Number(cashGiven) < total))
                }
            >
                {isLoading ? "Processing..." : "Create Transaction"}
            </button>
        </form>
    );
};

export default PosForm;
