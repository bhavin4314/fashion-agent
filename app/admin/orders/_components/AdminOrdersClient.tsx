"use client";

import * as React from "react";
import Image from "next/image";
import { X, Save, Loader2, MoreVertical } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { updateOrderStatusAction, getAdminOrderDetailsAction } from "../actions";
import toast from "react-hot-toast";
import { Select, Pagination, SearchInput, Chip } from "@/components/ui";
import { ORDER_STATUS_OPTIONS, getStatusBadgeClass, type OrderStatus } from "@/lib/constants";
import { formatOrderId } from "@/lib/utils";

function getOrderChipColor(status: string): "success" | "warning" | "info" | "purple" | "error" | "secondary" {
  switch (status.toLowerCase()) {
    case "delivered":
      return "success";
    case "shipped":
      return "warning";
    case "confirmed":
      return "info";
    case "out_for_delivery":
      return "purple";
    case "cancelled":
      return "error";
    default:
      return "secondary";
  }
}

interface OrderSummary {
  id: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  paymentStatus: string;
  stripeSessionId: string | null;
}

interface OrderItemDetail {
  id: string;
  quantity: number;
  size: string | null;
  price: number;
  title: string;
  image: string;
}

interface SelectedOrderDetails {
  id: string;
  createdAt: string;
  status: string;
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
  paymentStatus: string;
  totalAmount: number;
  stripeSessionId: string | null;
  internalNote: string | null;
  buyerId: string;
}

interface AdminOrdersClientProps {
  orders: OrderSummary[];
  totalCount: number;
  currentPage: number;
  searchQuery: string;
}

export function AdminOrdersClient({
  orders: initialOrders,
  totalCount,
  currentPage,
  searchQuery,
}: AdminOrdersClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [orders, setOrders] = React.useState<OrderSummary[]>(initialOrders);

  // Sync state with props
  React.useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // Search input local state to keep typing responsive
  const [localSearch, setLocalSearch] = React.useState<string>(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);

  // Track the last query value that was pushed to the URL
  const lastPushedQueryRef = React.useRef<string>(searchQuery);

  // Pagination config
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  // Helper to update query parameters in the URL
  const updateQueryParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || (key === "q" && !val)) {
          params.delete(key);
        } else {
          params.set(key, val);
        }
        if (key === "q") {
          lastPushedQueryRef.current = val || "";
        }
      });
      // Reset to page 1 if we're searching
      if (!updates.hasOwnProperty("page")) {
        params.delete("page");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  // Debounce search query input to update the URL
  React.useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      updateQueryParams({ q: debouncedSearch });
    }
  }, [debouncedSearch, searchQuery, updateQueryParams]);

  // Keep local search query in sync with URL changes (e.g. back/forward navigation)
  React.useEffect(() => {
    if (searchQuery !== lastPushedQueryRef.current) {
      setLocalSearch(searchQuery);
      lastPushedQueryRef.current = searchQuery;
    }
  }, [searchQuery]);

  // Drawer states
  const [drawerLoading, setDrawerLoading] = React.useState(false);
  const [drawerOrder, setDrawerOrder] = React.useState<SelectedOrderDetails | null>(null);
  const [drawerItems, setDrawerItems] = React.useState<OrderItemDetail[]>([]);

  // Form edit states
  const [statusVal, setStatusVal] = React.useState<OrderStatus>("ordered");
  const [noteVal, setNoteVal] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState(false);

  // Open drawer & load detailed info
  const handleOpenDrawer = async (orderId: string) => {
    setSelectedOrderId(orderId);
    setDrawerLoading(true);
    setDrawerOrder(null);
    setDrawerItems([]);

    try {
      const result = await getAdminOrderDetailsAction(orderId);
      if (result.success && result.order && result.items) {
        setDrawerOrder(result.order);
        setDrawerItems(result.items);
        setStatusVal(result.order.status);
        setNoteVal(result.order.internalNote || "");
      } else {
        toast.error(result.error || "Failed to load order details.");
        setSelectedOrderId(null);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load order details.");
      setSelectedOrderId(null);
    } finally {
      setDrawerLoading(false);
    }
  };

  // Submit changes
  const handleSaveChanges = async () => {
    if (!selectedOrderId || !drawerOrder) return;
    setIsSaving(true);
    const toastId = toast.loading("Updating order curation...");

    try {
      const result = await updateOrderStatusAction({
        orderId: selectedOrderId,
        status: statusVal,
        internalNote: noteVal,
      });

      if (result.success) {
        toast.success("Order updated successfully!", { id: toastId });

        // Update local state in table list
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrderId
              ? { ...o, status: statusVal }
              : o
          )
        );

        // Update drawer state
        setDrawerOrder((prev) => {
          if (!prev) return null;
          return { ...prev, status: statusVal, internalNote: noteVal };
        });

        // Close drawer
        setSelectedOrderId(null);

        // Refresh server data
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save changes.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while saving.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow select-none w-full min-h-screen relative overflow-hidden">
      {/* TopAppBar Navigation */}
      <header className="flex justify-between items-center w-full px-margin-desktop py-md bg-white border-b border-secondary-container z-40 select-none">
        <div className="flex items-center flex-1">
          <SearchInput
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search orders or clients..."
          />
        </div>

        <div className="flex items-center gap-md select-none">
          {/* Empty right-hand side matching layout */}
        </div>
      </header>

      {/* Main Content Pane */}
      <div className="flex-grow overflow-y-auto p-xl bg-background w-full select-none custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-xl">
          {/* Section Header */}
          <div className="flex flex-col gap-xs mb-lg select-none">
            <div className="flex items-center gap-md">
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Client Orders</h2>
              <span className="bg-primary-container text-white px-md py-xs rounded-full text-xs font-bold">
                {orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled").length} Active
              </span>
            </div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider mt-1">
              Manage customer orders, status transitions, and stylist logs.
            </p>
          </div>
          {/* Table Container Card */}
          <div className="bg-white border border-secondary-container rounded-2xl overflow-hidden shadow-sm select-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse select-none min-w-[800px]">
                <thead>
                  <tr className="border-b border-secondary-container bg-surface-container-low select-none">
                    <th className="px-xl py-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant">Order ID</th>
                    <th className="px-lg py-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant">Customer</th>
                    <th className="px-lg py-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant">Date</th>
                    <th className="px-lg py-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total</th>
                    <th className="px-lg py-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant">Payment Status</th>
                    <th className="px-lg py-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant">Order Status</th>
                    <th className="px-xl py-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => handleOpenDrawer(o.id)}
                      className="hover:bg-surface-container-low/50 transition-colors duration-150 group cursor-pointer"
                    >
                      <td className="px-xl py-lg text-xs font-bold text-charcoal">{formatOrderId(o.id)}</td>
                      <td className="px-lg py-lg">
                        <div className="flex flex-col">
                          <span className="font-bold text-charcoal">{o.customerName}</span>
                          <span className="text-[10px] text-secondary font-medium mt-0.5">{o.customerEmail}</span>
                        </div>
                      </td>
                      <td className="px-lg py-lg text-xs font-semibold text-secondary">
                        {new Date(o.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-lg py-lg text-xs font-bold text-charcoal">₹{o.totalAmount.toLocaleString("en-US")}</td>
                      <td className="px-lg py-lg">
                        <Chip label={o.paymentStatus} color="success" />
                      </td>
                      <td className="px-lg py-lg">
                        <Chip label={o.status} color={getOrderChipColor(o.status)} />
                      </td>
                      <td className="px-xl py-lg text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenDrawer(o.id)}
                          className="p-1.5 hover:bg-surface-container hover:text-primary text-on-surface-variant rounded-lg transition-colors border-none bg-transparent cursor-pointer shrink-0"
                          title="View Details"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-xxl font-semibold text-secondary text-xs select-none">
                        No active orders found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <Pagination
              totalCount={totalCount}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => updateQueryParams({ page: String(page) })}
            />
          </div>
        </div>
      </div>

      {/* Slide-over Detail Drawer Panel */}
      {selectedOrderId && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedOrderId(null)}
          />

          {/* Drawer Wrapper */}
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-[110] border-l border-border-light flex flex-col animate-[slideIn_0.35s_cubic-bezier(0.16,1,0.3,1)]">
            {/* Header */}
            <div className="px-lg py-md border-b border-border-light flex justify-between items-center bg-stone-50">
              <div className="flex flex-col">
                <h3 className="text-sm font-extrabold text-charcoal uppercase tracking-wider">
                  Order Details
                </h3>
                {drawerOrder && (
                  <span className="text-[10px] text-secondary font-bold mt-0.5">
                    {formatOrderId(drawerOrder.id)} · {drawerOrder.customerName}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="w-8 h-8 rounded-full bg-white border border-border-light flex items-center justify-center hover:bg-neutral-100 transition-all cursor-pointer font-bold text-charcoal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Drawer Scroll */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-lg space-y-xl bg-white">
              {drawerLoading && (
                <div className="h-40 flex flex-col items-center justify-center gap-sm">
                  <Loader2 className="h-8 w-8 text-brand animate-spin" />
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Loading Order details...</p>
                </div>
              )}

              {!drawerLoading && drawerOrder && (
                <>
                  {/* Customer Block */}
                  <div className="space-y-md">
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest border-b border-border-light pb-xs">
                      Customer Information
                    </p>
                    <div className="flex items-center gap-md p-md bg-stone-50 rounded-xl border border-border-light">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-border-light bg-secondary-container flex items-center justify-center shrink-0">
                        <span className="font-bold text-sm text-secondary">
                          {drawerOrder.customerName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-extrabold text-charcoal">{drawerOrder.customerName}</span>
                        <span className="text-[10px] text-secondary font-bold">Registered Buyer</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-md text-xs leading-relaxed">
                      <div className="space-y-xs">
                        <p className="text-secondary font-semibold">Shipping Address</p>
                        <p className="font-bold text-charcoal whitespace-pre-line">{drawerOrder.shippingAddress}</p>
                      </div>
                      <div className="space-y-xs">
                        <p className="text-secondary font-semibold">Contact Email</p>
                        <p className="font-bold text-charcoal select-text">{drawerOrder.customerEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items List Block */}
                  <div className="space-y-md">
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest border-b border-border-light pb-xs">
                      Itemized Curation
                    </p>
                    <div className="space-y-md">
                      {drawerItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-md">
                          <div className="w-16 h-20 rounded-lg overflow-hidden border border-border-light bg-stone-50 relative shrink-0">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-xs text-charcoal">{item.title}</h4>
                            <p className="text-[10px] text-secondary font-semibold">
                              {item.size ? `Size: ${item.size} • ` : ""}Qty: {item.quantity}
                            </p>
                            <p className="font-bold text-xs text-primary mt-1">₹{item.price.toLocaleString("en-US")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order status dropdown */}
                  <div className="space-y-md p-md bg-stone-50 rounded-xl border border-border-light">
                    <div>
                      <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-xs">
                        Update Order Status
                      </p>
                      <Select
                        options={[...ORDER_STATUS_OPTIONS]}
                        value={statusVal}
                        onChange={(val) => setStatusVal(val as OrderStatus)}
                        className="w-full text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-xs">
                      <p className="text-[10px] font-black text-secondary uppercase tracking-widest">
                        Internal stylist notes
                      </p>
                      <textarea
                        value={noteVal}
                        onChange={(e) => setNoteVal(e.target.value)}
                        className="w-full bg-white border border-border-light rounded-xl p-md text-xs font-semibold focus:outline-none focus:border-charcoal h-24 resize-none"
                        placeholder="Type updates or coordination logs..."
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Save Button */}
            {!drawerLoading && drawerOrder && (
              <div className="p-lg border-t border-border-light bg-stone-50 shrink-0">
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-sm cursor-pointer border-none shadow-md"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 text-white" />
                  )}
                  Save Changes
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
