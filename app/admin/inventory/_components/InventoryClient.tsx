"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, HelpCircle, Edit, Trash2 } from "lucide-react";

import { type InventoryItem } from "@/lib/db-products";
import { archiveProductAction } from "../actions";
import { DeleteConfirmationModal, Select, Pagination, SearchInput, Chip } from "@/components/ui";
import { toast } from "react-hot-toast";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

const categoryOptions = [
  { value: "All", label: "Category: All" },
  { value: "Evening Wear", label: "Evening Wear" },
  { value: "Accessories", label: "Accessories" },
  { value: "Outerwear", label: "Outerwear" },
  { value: "Footwear", label: "Footwear" },
  { value: "Tops", label: "Tops" },
  { value: "Pants", label: "Pants" },
  { value: "Knitwear", label: "Knitwear" },
  { value: "Suiting", label: "Suiting" },
];

const statusOptions = [
  { value: "All", label: "Stock: All" },
  { value: "In Stock", label: "In Stock" },
  { value: "Low Stock", label: "Low Stock" },
  { value: "Out of Stock", label: "Out of Stock" },
];

const sortOptions = [
  { value: "Newest", label: "Sort: Newest" },
  { value: "Price: Low to High", label: "Price: Low to High" },
  { value: "Price: High to Low", label: "Price: High to Low" },
];

interface InventoryClientProps {
  items: InventoryItem[];
  totalCount: number;
  currentPage: number;
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;
  sortBy: string;
}

export function InventoryClient({
  items,
  totalCount,
  currentPage,
  searchQuery,
  categoryFilter,
  statusFilter,
  sortBy,
}: InventoryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search input local state to keep typing responsive
  const [localSearch, setLocalSearch] = React.useState<string>(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Track the last query value that was pushed to the URL
  const lastPushedQueryRef = React.useRef<string>(searchQuery);

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false);
  const [selectedDeleteProduct, setSelectedDeleteProduct] = React.useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  // Pagination config
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  // Helper to update query parameters in the URL
  const updateQueryParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === "All" || (key === "q" && !val)) {
          params.delete(key);
        } else {
          params.set(key, val);
        }
        if (key === "q") {
          lastPushedQueryRef.current = val || "";
        }
      });
      // Reset to page 1 if we're filtering or searching
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

  const handleDeleteClick = (id: string, title: string) => {
    setSelectedDeleteProduct({ id, title });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteProduct) return;
    setIsDeleting(true);
    const { id, title } = selectedDeleteProduct;
    const res = await archiveProductAction(id);
    setIsDeleting(false);
    setDeleteModalOpen(false);
    setSelectedDeleteProduct(null);

    if (res.success) {
      router.refresh();
      toast.success(`Product "${title}" has been successfully deleted.`);
    } else {
      toast.error(`Failed to delete product: ${res.error}`);
    }
  };

  return (
    <div className="flex flex-col flex-grow select-none w-full min-h-screen">
      
      {/* TopAppBar Navigation (Horizontal) */}
      <header className="flex justify-between items-center w-full px-margin-desktop py-md bg-white border-b border-secondary-container z-40 select-none">
        <div className="flex items-center flex-1">
          <SearchInput
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search product collection..."
          />
        </div>

        <div className="flex items-center gap-md select-none">
          {/* <div className="flex items-center gap-sm shrink-0">
            <button
              onClick={() => alert("Notification log represents clean system states.")}
              className="p-2 hover:bg-surface-container-low rounded-full transition-all text-on-surface-variant border-none bg-transparent cursor-pointer shrink-0"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              onClick={() => alert("Stylist Support Center. Contact milan-concierge@vistra.ai")}
              className="p-2 hover:bg-surface-container-low rounded-full transition-all text-on-surface-variant border-none bg-transparent cursor-pointer shrink-0"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
          <div className="h-8 w-px bg-secondary-container mx-sm"></div> */}
          
          <Link
            href="/admin/inventory/create"
            className="bg-primary hover:bg-primary-dark text-white px-lg py-2.5 rounded-xl text-xs font-bold hover:shadow-lg transition-all active:scale-[0.98] border-none cursor-pointer tracking-wider flex items-center justify-center no-underline"
          >
            Create Item
          </Link>
        </div>
      </header>

      {/* Canvas Area container */}
      <div className="flex-grow overflow-y-auto p-xl bg-background w-full select-none">
        <div className="max-w-7xl mx-auto space-y-xl">
          
          {/* Section Header */}
          <div className="flex flex-col gap-xs mb-lg select-none">
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Product Inventory</h2>
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider mt-1">
                Manage your luxury product catalog and stock levels.
              </p>
            </div>

            <div className="flex flex-wrap gap-sm">
              {/* Category Filter dropdown */}
              <Select
                options={categoryOptions}
                value={categoryFilter}
                onChange={(val) => updateQueryParams({ category: val })}
                className="w-48 text-xs font-bold border-secondary-container text-charcoal hover:border-primary"
              />

              {/* Status Filter dropdown */}
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(val) => updateQueryParams({ status: val })}
                className="w-40 text-xs font-bold border-secondary-container text-charcoal hover:border-primary"
              />

              {/* Sort selector */}
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={(val) => updateQueryParams({ sort: val })}
                className="w-44 text-xs font-bold border-secondary-container text-charcoal hover:border-primary"
              />
            </div>

          {/* Table Container Card */}
          <div className="bg-white border border-secondary-container rounded-2xl overflow-hidden shadow-sm select-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse select-none min-w-[800px]">
                <thead>
                  <tr className="border-b border-secondary-container bg-surface-container-low select-none">
                    <th className="px-xl py-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant w-1/3">
                      Product Detail
                    </th>
                    <th className="px-lg py-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Category
                    </th>
                    <th className="px-lg py-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">
                      Retail Price
                    </th>
                    <th className="px-lg py-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Stock Level
                    </th>
                    <th className="px-xl py-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors duration-150 group">
                      <td className="px-xl py-lg">
                        <div className="flex items-center gap-md">
                          <Link
                            href={`/product/${item.id}`}
                            className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shadow-sm border border-secondary-container/50 shrink-0 select-none hover:opacity-80 transition-opacity block"
                            title="View Detail Page"
                          >
                            <Image
                              alt={item.title}
                              className="w-full h-full object-cover pointer-events-none"
                              src={item.image}
                              width={56}
                              height={56}
                              unoptimized
                            />
                          </Link>
                          <div className="min-w-0">
                            <Link
                              href={`/product/${item.id}`}
                              className="text-sm font-bold text-charcoal truncate hover:text-primary hover:underline transition-colors block"
                              title="View Detail Page"
                            >
                              {item.title}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-lg">
                        <Chip label={item.category} />
                      </td>
                      <td className="px-lg py-lg text-right">
                        <span className="text-xs font-bold text-charcoal">₹{item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                      </td>
                      <td className="px-lg py-lg">
                        {item.status === "In Stock" ? (
                          <Chip
                            label={`In Stock (${item.quantity})`}
                            icon={<span className="w-2 h-2 rounded-full bg-success-green" />}
                            color="success"
                          />
                        ) : item.status === "Low Stock" ? (
                          <Chip
                            label={`Low Stock (${item.quantity})`}
                            icon={<span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                            color="primary"
                          />
                        ) : (
                          <Chip
                            label={`Out of Stock (${item.quantity})`}
                            icon={<span className="w-2.5 h-2.5 flex items-center justify-center text-on-surface-variant font-black">✕</span>}
                            color="default"
                          />
                        )}
                      </td>
                      <td className="px-xl py-lg text-right">
                        <div className="flex items-center justify-end gap-sm select-none">
                          <Link
                            href={`/admin/inventory/create?edit=${item.id}`}
                            className="p-1.5 hover:bg-surface-container hover:text-primary text-on-surface-variant rounded-lg transition-colors border-none bg-transparent cursor-pointer shrink-0"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(item.id, item.title)}
                            className="p-1.5 hover:bg-surface-container hover:text-primary text-on-surface-variant rounded-lg transition-colors border-none bg-transparent cursor-pointer shrink-0"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-xxl font-semibold text-secondary text-xs select-none">
                        No products matching active queries were found in stock inventory.
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

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedDeleteProduct?.title}
        isLoading={isDeleting}
        title="Delete Product"
        description="Are you sure you want to permanently delete this product? This action cannot be undone."
      />
    </div>
  );
}
