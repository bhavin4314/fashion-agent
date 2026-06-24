"use client";

import * as React from "react";
import Image from "next/image";
import { User, Package, MapPin, Mail, Phone } from "lucide-react";
import { Form } from "@/components/forms/Form";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { updateProfileAction } from "../actions";
import { profileSchema, type ProfileFormValues } from "../schemas";
import toast from "react-hot-toast";
import { getStatusBadgeClass } from "@/lib/constants";
import { generateInvoicePdf } from "@/lib/invoice";
import { TrackingTimeline } from "./TrackingTimeline";
import { InvoiceModal } from "./InvoiceModal";
import { getAvatarInitials, formatOrderId } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface ProfileItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  shippingAddress: string | null;
}

interface OrderItem {
  id: string;
  quantity: number;
  size: string | null;
  price: number;
  title: string;
  image: string;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  shippingAddress: string;
  totalAmount: number;
  paymentStatus: string;
  items: OrderItem[];
}

interface ProfileClientProps {
  profile: ProfileItem;
  orders: Order[];
}

export function ProfileClient({ profile, orders }: ProfileClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "orders" ? "orders" : "profile";

  const [isEditing, setIsEditing] = React.useState(false);

  const handleTabChange = (tab: "profile" | "orders") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const [userProfile, setUserProfile] = React.useState(profile);
  const [trackingOrderId, setTrackingOrderId] = React.useState<string | null>(null);
  const [invoiceOrder, setInvoiceOrder] = React.useState<Order | null>(null);
  const [invoicePdfUrl, setInvoicePdfUrl] = React.useState<string | null>(null);

  const handleViewInvoice = (order: Order) => {
    const doc = generateInvoicePdf(
      {
        id: order.id,
        createdAt: order.createdAt,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        items: order.items.map((item) => ({
          title: item.title,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
      },
      {
        fullName: userProfile.fullName,
        email: userProfile.email,
        phone: userProfile.phone,
      }
    );
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setInvoiceOrder(order);
    setInvoicePdfUrl(pdfUrl);
  };

  const handleCloseInvoice = () => {
    if (invoicePdfUrl) {
      URL.revokeObjectURL(invoicePdfUrl);
    }
    setInvoicePdfUrl(null);
    setInvoiceOrder(null);
  };

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    const toastId = toast.loading("Updating your profile details...");
    try {
      const result = await updateProfileAction(values);
      if (result.success) {
        toast.success("Profile updated successfully!", { id: toastId });
        setUserProfile((prev) => ({
          ...prev,
          fullName: values.fullName,
          phone: values.phone || null,
          shippingAddress: values.address || null,
        }));
        setIsEditing(false);
      } else {
        toast.error(result.error || "Failed to update profile.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while saving.", { id: toastId });
    }
  };



  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start select-none">
      {/* Sidebar Navigation */}
      <aside className="col-span-12 md:col-span-3 space-y-md">
        <nav className="flex flex-col space-y-sm">
          <button
            onClick={() => handleTabChange("profile")}
            className={`flex items-center gap-sm px-md py-3 font-label-md text-label-md rounded-xl transition-all border-none text-left cursor-pointer w-full ${
              activeTab === "profile"
                ? "bg-neutral-900 text-white font-bold"
                : "text-secondary hover:bg-stone-100 bg-white border border-border-light"
            }`}
          >
            <User className="h-4 w-4" />
            My Profile
          </button>
          <button
            onClick={() => handleTabChange("orders")}
            className={`flex items-center gap-sm px-md py-3 font-label-md text-label-md rounded-xl transition-all border-none text-left cursor-pointer w-full ${
              activeTab === "orders"
                ? "bg-neutral-900 text-white font-bold"
                : "text-secondary hover:bg-stone-100 bg-white border border-border-light"
            }`}
          >
            <Package className="h-4 w-4" />
            Order History
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="col-span-12 md:col-span-9 space-y-xl">
        {/* Page Header */}
        <header className="flex items-center gap-md">
          <div className="w-12 h-12 rounded-full border border-brand/20 bg-brand/10 text-brand flex items-center justify-center font-bold text-base tracking-wider shadow-sm shrink-0 select-none">
            {getAvatarInitials(userProfile.fullName)}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-charcoal tracking-tight">
              Welcome back, {userProfile.fullName}
            </h1>
            <p className="text-xs text-muted font-semibold mt-1">
              Manage your luxury fashion orders and personal styling details.
            </p>
          </div>
        </header>

        {/* Tab 1: Edit Profile */}
        {activeTab === "profile" && (
          <section className="bg-white border border-border-light rounded-xl p-lg md:p-xl shadow-sm space-y-lg">
            <div className="flex justify-between items-center border-b border-border-light pb-md">
              <h3 className="text-sm font-black text-charcoal uppercase tracking-wider">
                Identity Profile
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-charcoal text-charcoal hover:bg-stone-50 rounded-lg text-xs font-bold transition-all cursor-pointer bg-white"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <Form
                schema={profileSchema}
                defaultValues={{
                  fullName: userProfile.fullName,
                  phone: userProfile.phone || "",
                  address: userProfile.shippingAddress || "",
                }}
                onSubmit={handleUpdateProfile}
                className="space-y-md"
              >
                <div className="grid grid-cols-2 gap-md">
                  <div className="col-span-2 md:col-span-1">
                    <FormInput
                      name="fullName"
                      label="Full Name"
                      placeholder="Jane Cooper"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <FormInput
                      name="phone"
                      label="Phone Number"
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                    />
                  </div>
                  <div className="col-span-2">
                    <FormTextarea
                      name="address"
                      label="Default Shipping Address"
                      placeholder="123 Fashion Ave, Suite 400, New York, NY 10001"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-sm justify-end pt-md border-t border-border-light">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 border border-border-light text-secondary rounded-lg text-xs font-bold hover:bg-stone-50 cursor-pointer bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold cursor-pointer border-none shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </Form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg text-xs">
                <div className="space-y-md">
                  <div className="flex items-center gap-sm">
                    <Mail className="h-4 w-4 text-muted" />
                    <div>
                      <p className="text-secondary font-semibold">Email Address</p>
                      <p className="font-bold text-charcoal mt-0.5">{userProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm">
                    <Phone className="h-4 w-4 text-muted" />
                    <div>
                      <p className="text-secondary font-semibold">Phone Number</p>
                      <p className="font-bold text-charcoal mt-0.5">
                        {userProfile.phone || "No phone added yet"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-md bg-stone-50 rounded-xl border border-border-light flex gap-sm">
                  <MapPin className="h-4 w-4 text-muted shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-charcoal uppercase tracking-wider text-[10px] mb-xs">
                      Default Shipping Address
                    </h4>
                    <p className="text-secondary font-semibold leading-relaxed whitespace-pre-line">
                      {userProfile.shippingAddress || "No default address saved yet."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Order History */}
        {activeTab === "orders" && (
          <section className="space-y-lg">
            <h2 className="text-lg font-bold text-charcoal">Your Selection Orders</h2>

            {orders.length === 0 ? (
              <div className="bg-white border border-border-light rounded-xl p-xxl text-center">
                <Package className="h-12 w-12 text-muted mx-auto opacity-40 mb-4" />
                <p className="text-sm font-bold text-charcoal">No orders found</p>
                <p className="text-xs text-muted font-semibold mt-1">
                  You haven&apos;t purchased any quiet luxury pieces yet.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-border-light rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="p-lg md:p-xl flex flex-col md:flex-row justify-between gap-lg">
                    <div className="flex-grow space-y-md">
                      {/* Order info header row */}
                      <div className="flex flex-wrap items-center gap-lg border-b border-border-light pb-md text-xs">
                        <div>
                          <p className="text-secondary font-semibold">Order ID</p>
                          <p className="font-bold text-charcoal mt-1">
                            {formatOrderId(order.id)}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary font-semibold">Date</p>
                          <p className="font-bold text-charcoal mt-1">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary font-semibold">Total</p>
                          <p className="font-bold text-charcoal mt-1">
                            ₹{order.totalAmount.toLocaleString("en-US")}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary font-semibold">Status</p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mt-1 ${getStatusBadgeClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items ordered */}
                      <div className="space-y-md">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-md">
                            <div className="w-12 h-16 rounded-lg overflow-hidden border border-border-light bg-stone-50 relative shrink-0">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-bold text-xs text-charcoal">{item.title}</h4>
                              <p className="text-[10px] text-secondary font-semibold">
                                {item.size ? `Size: ${item.size} • ` : ""}Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right text-xs font-black text-charcoal">
                              ₹{item.price.toLocaleString("en-US")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions panel */}
                    <div className="flex md:flex-col justify-end gap-sm md:w-36 shrink-0 h-fit">
                      <button
                        onClick={() => handleViewInvoice(order)}
                        className="flex-1 px-4 py-2.5 border border-border-light hover:bg-stone-50 text-charcoal rounded-lg text-xs font-bold transition-all cursor-pointer bg-white"
                      >
                        View Invoice
                      </button>
                      <button
                        onClick={() => setTrackingOrderId((prev) => (prev === order.id ? null : order.id))}
                        className="flex-1 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer border-none"
                      >
                        {trackingOrderId === order.id ? "Hide Tracking" : "Track Package"}
                      </button>
                    </div>
                  </div>

                  {/* Accordion for Stepper Tracking Timeline */}
                  {trackingOrderId === order.id && (
                    <div className="px-lg pb-lg md:px-xl md:pb-xl border-t border-border-light pt-lg space-y-md animate-[fadeIn_0.3s_ease-out]">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-charcoal uppercase tracking-widest text-[10px]">
                          Package Tracking Timeline
                        </h4>
                        <span className="text-[10px] text-secondary font-semibold">
                          Current Status: <span className="font-extrabold uppercase text-neutral-900">{order.status}</span>
                        </span>
                      </div>

                      <TrackingTimeline status={order.status} />
                    </div>
                  )}
                </div>
              ))
            )}
          </section>
        )}
      </div>

       {/* Invoice Modal */}
       {invoicePdfUrl && invoiceOrder && (
         <InvoiceModal
           isOpen={!!invoicePdfUrl}
           onClose={handleCloseInvoice}
           order={invoiceOrder}
           profile={userProfile}
           invoicePdfUrl={invoicePdfUrl}
         />
       )}
    </div>
  );
}
