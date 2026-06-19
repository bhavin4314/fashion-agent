import * as React from "react";
import Link from "next/link";

interface OrderItem {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface RecentOrdersProps {
  recentOrders: OrderItem[];
}

export function RecentOrders({ recentOrders }: RecentOrdersProps) {
  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "shipped" || s === "delivered") {
      return "bg-[#E3FCEF] text-[#00875A]";
    }
    if (s === "processing") {
      return "bg-[#DEEBFF] text-[#0747A6]";
    }
    if (s === "pending") {
      return "bg-[#FFFAE6] text-[#BF2600]";
    }
    return "bg-surface-container-high text-secondary";
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="lg:col-span-2 bg-white border border-border-light rounded-xl overflow-hidden flex flex-col select-none">
      <div className="p-xl border-b border-secondary-container/50 flex justify-between items-center">
        <h4 className="text-lg font-bold text-on-surface">Recent Orders</h4>
        <Link href="/admin/orders" className="text-brand font-bold text-xs uppercase tracking-wider hover:underline">
          View All Orders
        </Link>
      </div>
      <div className="flex-grow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-semibold text-[11px] uppercase tracking-wider">
              <th className="px-xl py-md">Order ID</th>
              <th className="px-xl py-md">Customer</th>
              <th className="px-xl py-md">Amount</th>
              <th className="px-xl py-md">Status</th>
              <th className="px-xl py-md">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-container/30">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-xl py-lg font-semibold text-xs text-on-surface">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-xl py-lg text-xs font-semibold text-on-surface">
                    {order.customerName}
                  </td>
                  <td className="px-xl py-lg font-semibold text-xs text-on-surface">
                    ₹{order.totalAmount.toLocaleString("en-US")}
                  </td>
                  <td className="px-xl py-lg">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-xl py-lg text-xs text-on-surface-variant">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-xl text-xs text-on-surface-variant">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
