"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Bell, HelpCircle, Filter, ChevronDown, ChevronRight, ChevronLeft, Plus, Edit, Archive, MoreVertical, X, Check, Loader2, Sparkles } from "lucide-react";

interface InventoryItem {
  id: string;
  title: string;
  sku: string;
  category: string;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  image: string;
}

const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: "m-1",
    title: "Midnight Silk Gown",
    sku: "VIST-29384-BL",
    category: "Evening Wear",
    price: 2450,
    status: "In Stock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCr1TUU79xoI0_LXD664wn0uvTe6JTH8K-uXBk4vDBLg-Eho4XwtOwgomxPh4DklcdkK6Bh5MA4MvUt7Wj_LbP7Cv5kXT7Q6GLDkLg0ZYjN_cOQG7YfKlCmq6v2bzhBg1G5Th_YrWN6s7iEWq5R1oK_-D7iwLbkEph30T8kmIuDmxPy5I_flD78NIS5TjztOsS6VSJFuZF16p6KFsVJ1xT-MSeTeXsc1zH3hYQ0Fqy_2jBpeTZJVra9a3ulRvCRCu5jJFlol-O5zH-E",
  },
  {
    id: "m-2",
    title: "Artisan Leather Tote",
    sku: "VIST-11029-BR",
    category: "Accessories",
    price: 1200,
    status: "Low Stock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuATRwT3qKv6AXZp7rRxFqG2hV0_oX3P3s03SHnm0jCgopxreYKDTsyV0r5Hdc_mmmT66sEbMWjXNiCn0jdTcj9pMkcNpgZDgEB3z5vO2cQLTUkmNSJvDw5QxYUW6QJFf3TlM97RcQytmFKn6Hr-bsHc1yT4LvHDX1sMK3yflvNKtISVVw1kxDPERlyjCJbMjYi3AVBLi7egTBLZfRx9yaAlTvh27qAcv72ozxfS2VYCMyMleti1m-KyPzyuuaIUujyZYi9ndobT6idc",
  },
  {
    id: "m-3",
    title: "Classic Camel Coat",
    sku: "VIST-55421-CM",
    category: "Outerwear",
    price: 3800,
    status: "In Stock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5DTZFEu-io3P1eWQlOShCSRp0Z82UXXm0oIm-RPT_mW6Fp6aX8jMAlgUuz9hd5FH4_Wyo7lk04fwsUrgCT37LV0HsG3Xcv7MIsp7ZWQK49C04nLjwfLRPM37ptDhzjaCws_i9pcdw_n21ZhmMOvaPfRP_jp3wX5rAVCToGwrIUpuisfW6bQgXQ1q2BR1waH4TV8OJ1AAxHPAybuO3b_VDrz3TEij_2Iaa86uYHJotYpjpp5R9meO0zPr0AwbP20GlOX3Fuouw9_SM",
  },
  {
    id: "m-4",
    title: "Crystal Stilettos",
    sku: "VIST-88741-SV",
    category: "Footwear",
    price: 1550,
    status: "Low Stock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZcY-1t6F5K7tqGXE1xGSy3mBITf2Cv-EwVWtWpDUy5BoyitG1aBNfgE0k6puzTTwJRzuUh4oseQendKK9G11yhi21Pa1QGdw2JFHfhbWfKDAesKwcpWlve3Zg9_FjluYnGyw5d4o1WIJ6KcBybZQFcHDo14HYrBLI-c5YEyPPzNLCajVuB4blt0QyrMAclXck_WQGaqH76LxRie7PUA46tti7c69iy1mDsSuIzwwY61-tJsOhT8_b0_g0lqQFwexuEITZxUvehS9B",
  },
  {
    id: "p-1",
    title: "Relaxed Linen Shirt",
    sku: "VIST-01098-LN",
    category: "Tops",
    price: 98,
    status: "In Stock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaAN2V-vXoiEKBduVTos9cZE_1rMPdf_b1wHoMugjj1PDZhe0pSGR51uB_nURS7H-3ujmnikg8C09Q2GwV0Fi5gxB7YwCrG4q2a91pUial8xGuN2286yjT5ZxaakdAkTOx18z34l_UUB5dXArhurVZFgHZWrtcYNcw11y9cmU8LSwJWyn_FR_zEGLGLh45PPPaRorAI2twUg4eEipSFrU6Dx31NoCDFp_mLwcM-UuJpErU6Yz0isdHMZ8zwJlW6QU8SDcTThjEL1H-",
  },
  {
    id: "p-2",
    title: "Classic Cotton Chinos",
    sku: "VIST-02120-CN",
    category: "Pants",
    price: 120,
    status: "In Stock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANrKH3C5GQG-9QIHEPRVd60ZZdTumcSIpD_heRUMeXnmz9ySPh5AFW_aTlW8g9LJJ8rzA2oH7_PQkNF0i46OVx3nOKPYBtiGSlSS3TXitXXmLYflCb8xqEZxr-FDyDSVg7hIwM-dHuF_mi3BuU5lGBT2VONNZPH4JvBqsI_3PT5SmzVnoDVg_pN2Rde0T5RJJ3c_83p3fY0yLXbIH_QzHi9ERzh9GyVhZwVZlXsfR2LL5fSO3sZKrVRKQxCdF9lDkjdMCmt799fi8D",
  },
  {
    id: "p-3",
    title: "Cashmere V-Neck",
    sku: "VIST-03245-CM",
    category: "Knitwear",
    price: 245,
    status: "In Stock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeEJwc7gbakHHTVGxYvf_NNhL5ZL5Ja4xuxOy2Jv9LIoZMJdv9qf3tmIkFzOfvF1SVVloXnFNlTCXccqbpuLropuxSw3ym5lXn0GnQwA56znE3TqshgBdP62pEu9xqOU8OY4-CZdzlRixeUDW43YRPar0vzN3o0v9GLWCfx8QihYway6kd8j95kN2L2ggZ4bRX0l9dSuFVfGGx5SrvCrO5qmGjGWondaTN_n9y6EDKUi2z7n-TwuVa1ANbZkXC_wV98b-l0kvDxN0a",
  },
  {
    id: "p-6",
    title: "Structured Blazer",
    sku: "VIST-06420-WL",
    category: "Suiting",
    price: 420,
    status: "Low Stock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf7MeQJy7rqBKyOE-Y0GbUt1igVaI2k1eSXpLjBjUp1Qlq-ZTIG9L0bHcvpT1Oh4z_1wD7AwTuSCcUtRzLvOcGd3hS6UTNWI81fhpxFQPAKkN5z0BSrC7V023FvGYuybZ-taEkSwl06meaU9GgyI4f7ndx2VlY4u5aza76qhLc5BlxVlpMruuo_Zj8CU46Ve1ty_FZXENEix2FHNPX9qOJ47wZWJWoGzdPI95Zyc3bEZKLJplZcw_QIDpDwB64ln064DCv4FCCBknY",
  }
];

export function InventoryClient() {
  const router = useRouter();
  const [items, setItems] = React.useState<InventoryItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vistra_inventory_items");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse local Vistra inventory:", e);
        }
      }
    }
    return INITIAL_ITEMS;
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vistra_inventory_items", JSON.stringify(items));
    }
  }, [items]);

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<string>("Newest");

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const itemsPerPage = 5;

  // Add / Edit modals states
  const [isAddOpen, setIsAddOpen] = React.useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = React.useState<boolean>(false);
  const [editingItem, setEditingItem] = React.useState<InventoryItem | null>(null);

  // Form input states
  const [newItemTitle, setNewItemTitle] = React.useState("");
  const [newItemCategory, setNewItemCategory] = React.useState("Evening Wear");
  const [newItemPrice, setNewItemPrice] = React.useState("");
  const [newItemStatus, setNewItemStatus] = React.useState<"In Stock" | "Low Stock" | "Out of Stock">("In Stock");
  const [newItemImage, setNewItemImage] = React.useState("");

  // Replenishment alert card states
  const [alertDismissed, setAlertDismissed] = React.useState<boolean>(false);

  // Search input focus border tracking
  const [isSearchFocused, setIsSearchFocused] = React.useState<boolean>(false);

  // Dynamic values calculation
  const totalValue = React.useMemo(() => {
    // Arbitrary inventory multipliers simulating dynamic stockpile calculations
    return items.reduce((acc, curr) => acc + curr.price * (curr.status === "In Stock" ? 18 : 3), 0);
  }, [items]);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle || !newItemPrice) return;

    const skuSuffix = Math.floor(10000 + Math.random() * 90000);
    const customItem: InventoryItem = {
      id: `custom-${Date.now()}`,
      title: newItemTitle,
      sku: `VIST-${skuSuffix}-AD`,
      category: newItemCategory,
      price: parseFloat(newItemPrice) || 100,
      status: newItemStatus,
      image: newItemImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150"
    };

    setItems((prev) => [customItem, ...prev]);
    setIsAddOpen(false);
    resetForm();
    alert(`Success! "${newItemTitle}" was added to the inventory catalog.`);
  };

  const handleEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setItems((prev) =>
      prev.map((item) => (item.id === editingItem.id ? editingItem : item))
    );
    setIsEditOpen(false);
    setEditingItem(null);
    alert(`Success! Product details for "${editingItem.title}" have been updated.`);
  };

  const handleArchive = (id: string, title: string) => {
    if (confirm(`Are you sure you want to archive "${title}"?`)) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      alert(`Garment "${title}" has been safely archived.`);
    }
  };

  const resetForm = () => {
    setNewItemTitle("");
    setNewItemCategory("Evening Wear");
    setNewItemPrice("");
    setNewItemStatus("In Stock");
    setNewItemImage("");
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  // Searching, Filtering & Sorting logic
  const processedItems = React.useMemo(() => {
    let result = [...items];

    // Search query query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter !== "All") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Sorting
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Newest") {
      // Default initial or ID sorting
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [items, searchQuery, categoryFilter, statusFilter, sortBy]);

  // Paginated items
  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [processedItems, currentPage]);

  const totalPages = Math.ceil(processedItems.length / itemsPerPage) || 1;

  const handleRestockAlert = () => {
    alert("Milan workshop restock courier scheduled. ETA: 48 Hours.");
    setAlertDismissed(true);
  };

  return (
    <div className="flex flex-col flex-grow select-none w-full min-h-screen">
      
      {/* TopAppBar Navigation (Horizontal) */}
      <header className="flex justify-between items-center w-full px-margin-desktop py-md bg-white border-b border-[#e2dfde] z-40 select-none">
        <div className="flex items-center flex-1">
          <div
            className={`relative w-96 flex items-center bg-[#f4f3f3] rounded-xl px-md transition-all duration-200 border ${
              isSearchFocused ? "border-[#ba0036] ring-2 ring-[#ba0036]/10 bg-white" : "border-transparent"
            }`}
          >
            <Search className="h-4 w-4 text-[#5c3f41] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="flex-1 min-w-0 pl-sm pr-md bg-transparent border-none text-xs font-semibold text-charcoal focus:outline-none focus:ring-0 placeholder:text-[#5c3f41]/50 h-10"
              placeholder="Search product collection or SKU..."
            />
          </div>
        </div>

        <div className="flex items-center gap-md select-none">
          <div className="flex items-center gap-sm shrink-0">
            <button
              onClick={() => alert("Notification log represents clean system states.")}
              className="p-2 hover:bg-[#f4f3f3] rounded-full transition-all text-[#5c3f41] border-none bg-transparent cursor-pointer shrink-0"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              onClick={() => alert("Concierge Help Portal. Contact milan-admin@vistra.ai")}
              className="p-2 hover:bg-[#f4f3f3] rounded-full transition-all text-[#5c3f41] border-none bg-transparent cursor-pointer shrink-0"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
          <div className="h-8 w-px bg-[#e2dfde] mx-sm"></div>
          
          <a
            href="/admin/inventory/create"
            className="bg-[#ba0036] hover:bg-[#a0002e] text-white px-lg py-2.5 rounded-xl text-xs font-bold hover:shadow-lg transition-all active:scale-[0.98] border-none cursor-pointer tracking-wider flex items-center justify-center no-underline"
          >
            Create Item
          </a>
        </div>
      </header>

      {/* Canvas Area container */}
      <div className="flex-grow overflow-y-auto p-xl bg-[#f9f9f9] w-full select-none">
        <div className="max-w-7xl mx-auto space-y-xl">
          
          {/* Header page titles and filter configurations */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg select-none">
            <div>
              <h2 className="text-3xl font-extrabold text-[#1a1c1c] tracking-tight">Product Inventory</h2>
              <p className="text-xs font-semibold text-[#5f5e5e] uppercase tracking-wider mt-1">
                Manage your luxury product catalog and stock levels.
              </p>
            </div>

            <div className="flex flex-wrap gap-sm">
              {/* Category Filter dropdown */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none pr-8 pl-md py-2.5 bg-white border border-[#e2dfde] rounded-xl text-xs font-bold text-charcoal hover:border-[#ba0036] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#ba0036]"
                >
                  <option value="All">Category: All</option>
                  <option value="Evening Wear">Evening Wear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Tops">Tops</option>
                  <option value="Pants">Pants</option>
                  <option value="Knitwear">Knitwear</option>
                  <option value="Suiting">Suiting</option>
                </select>
              </div>

              {/* Status Filter dropdown */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pr-8 pl-md py-2.5 bg-white border border-[#e2dfde] rounded-xl text-xs font-bold text-charcoal hover:border-[#ba0036] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#ba0036]"
                >
                  <option value="All">Stock: All</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              {/* Sort selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pr-8 pl-md py-2.5 bg-white border border-[#e2dfde] rounded-xl text-xs font-bold text-charcoal hover:border-[#ba0036] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#ba0036]"
                >
                  <option value="Newest">Sort: Newest</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Container Card */}
          <div className="bg-white border border-[#e2dfde] rounded-2xl overflow-hidden shadow-sm select-none">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#e2dfde] bg-[#f4f3f3] select-none">
                  <th className="px-xl py-lg text-xs font-bold uppercase tracking-wider text-[#5c3f41] w-1/3">
                    Product Details
                  </th>
                  <th className="px-lg py-lg text-xs font-bold uppercase tracking-wider text-[#5c3f41]">
                    Category
                  </th>
                  <th className="px-lg py-lg text-xs font-bold uppercase tracking-wider text-[#5c3f41] text-right">
                    Price
                  </th>
                  <th className="px-lg py-lg text-xs font-bold uppercase tracking-wider text-[#5c3f41]">
                    Status
                  </th>
                  <th className="px-xl py-lg text-xs font-bold uppercase tracking-wider text-[#5c3f41] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeeeee]">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f4f3f3]/50 transition-colors duration-150 group">
                    <td className="px-xl py-lg">
                      <div className="flex items-center gap-md">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shadow-sm border border-[#e2dfde]/50 shrink-0 select-none">
                          <Image
                            alt={item.title}
                            className="w-full h-full object-cover pointer-events-none"
                            src={item.image}
                            width={56}
                            height={56}
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-charcoal truncate">{item.title}</p>
                          <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-0.5 select-none">
                            SKU: {item.sku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-lg">
                      <span className="px-sm py-1 bg-[#eeeeee] rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#5c3f41] select-none">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-lg py-lg text-right">
                      <span className="text-xs font-bold text-charcoal">${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td className="px-lg py-lg">
                      <div className="flex items-center gap-sm select-none">
                        {item.status === "In Stock" ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-[#008545]"></span>
                            <span className="text-xs font-bold text-[#008545]">In Stock</span>
                          </>
                        ) : item.status === "Low Stock" ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-[#ba0036] animate-pulse"></span>
                            <span className="text-xs font-bold text-[#ba0036]">Low Stock</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                            <span className="text-xs font-bold text-[#5c3f41]">Out of Stock</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-xl py-lg text-right">
                      <div className="flex items-center justify-end gap-sm select-none">
                        <button
                          onClick={() => router.push(`/admin/inventory/create?edit=${item.id}`)}
                          className="p-1.5 hover:bg-[#eeeeee] hover:text-[#ba0036] text-[#5c3f41] rounded-lg transition-colors border-none bg-transparent cursor-pointer shrink-0"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleArchive(item.id, item.title)}
                          className="p-1.5 hover:bg-[#eeeeee] hover:text-[#ba0036] text-[#5c3f41] rounded-lg transition-colors border-none bg-transparent cursor-pointer shrink-0"
                          title="Archive Product"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {processedItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-xxl font-semibold text-secondary text-xs select-none">
                      No products matching active queries were found in stock inventory.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="px-xl py-md bg-[#f4f3f3] border-t border-[#e2dfde] flex items-center justify-between select-none">
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                Showing {Math.min(processedItems.length, (currentPage - 1) * itemsPerPage + 1)} to{" "}
                {Math.min(processedItems.length, currentPage * itemsPerPage)} of {processedItems.length} items
              </p>
              <div className="flex items-center gap-sm">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 bg-white border border-[#e2dfde] hover:border-charcoal disabled:opacity-40 disabled:hover:border-[#e2dfde] rounded-lg transition-all cursor-pointer flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 text-charcoal" />
                </button>
                <div className="flex items-center gap-xs">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        currentPage === page
                          ? "bg-[#ba0036] text-white shadow-sm"
                          : "bg-white border border-[#e2dfde] hover:border-charcoal text-charcoal"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 bg-white border border-[#e2dfde] hover:border-charcoal disabled:opacity-40 disabled:hover:border-[#e2dfde] rounded-lg transition-all cursor-pointer flex items-center"
                >
                  <ChevronRight className="h-4 w-4 text-charcoal" />
                </button>
              </div>
            </div>
          </div>

          {/* Asymmetric Bottom Metrics Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl select-none">
            
            {/* Concierge Recommendation Panel */}
            {!alertDismissed ? (
              <div className="lg:col-span-2 bg-gradient-to-br from-white to-[#fff5f6] border border-[#ffdad6] rounded-2xl p-xl relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[160px]">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ba0036]"></div>
                <div>
                  <div className="flex items-center gap-sm text-[#ba0036] mb-sm select-none">
                    <Sparkles className="h-5 w-5 fill-[#ba0036]/15 text-[#ba0036] shrink-0" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest">
                      Concierge Recommendation
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-charcoal tracking-tight mb-2">Replenishment Alert</h3>
                  <p className="text-xs leading-relaxed text-secondary font-medium max-w-2xl">
                    Based on current styling trends for the <span className="font-bold text-charcoal">"Autumn Gala"</span> season, your stock of <span className="font-bold text-charcoal">Structured Blazers</span> is projected to deplete in 4 days. Consider a restock order from the Milan workshop.
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleRestockAlert}
                    className="bg-[#e21e4a] hover:bg-[#ba0036] text-white px-lg py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    Action Restock
                  </button>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-2 bg-[#f4f3f3] border border-[#e2dfde] rounded-2xl p-xl flex items-center justify-center min-h-[160px] shadow-sm select-none">
                <div className="text-center font-bold text-secondary text-xs">
                  ✓ Replenishment restocking task dispatched to Milan administrative center.
                </div>
              </div>
            )}

            {/* Total Inventory Stock Value */}
            <div className="bg-white border border-[#e2dfde] rounded-2xl p-xl flex flex-col justify-center items-center text-center shadow-sm select-none">
              <span className="material-symbols-outlined text-[#ba0036] text-[48px] mb-md select-none">
                inventory
              </span>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#5c3f41]">
                Inventory Value
              </h4>
              <p className="text-3xl font-extrabold text-charcoal mt-sm">${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              <p className="text-[10px] font-bold text-[#008545] mt-2 flex items-center gap-xs select-none">
                <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                +12.4% from last month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Modal: EDIT PRODUCT MODAL */}
      {isEditOpen && editingItem && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-[#1a1c1c]/45 backdrop-blur-sm transition-opacity" onClick={() => setIsEditOpen(false)} />
          <form
            onSubmit={handleEditItem}
            className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl flex flex-col border-l border-[#e2dfde] p-xl overflow-y-auto select-none"
          >
            <div className="flex justify-between items-center pb-md border-b border-[#e2dfde] mb-xl select-none">
              <div>
                <h3 className="text-lg font-bold text-charcoal">Edit Product Information</h3>
                <span className="text-[9px] text-[#717171] font-bold uppercase tracking-widest block">{editingItem.sku}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center border-none text-charcoal cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-md flex-1">
              {/* Product Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">Garment Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Garment title"
                  className="w-full px-md py-3 rounded-xl border border-[#e2dfde] text-xs font-semibold focus:outline-none focus:border-[#ba0036] input-focus-ring bg-[#f9f9f9]"
                />
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">Price (USD)</label>
                <input
                  type="number"
                  required
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                  placeholder="Price"
                  className="w-full px-md py-3 rounded-xl border border-[#e2dfde] text-xs font-semibold focus:outline-none focus:border-[#ba0036] input-focus-ring bg-[#f9f9f9]"
                />
              </div>

              {/* Stock Status Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">Stock Status</label>
                <select
                  value={editingItem.status}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                  className="w-full px-md py-3 rounded-xl border border-[#e2dfde] text-xs font-semibold focus:outline-none focus:border-[#ba0036] bg-[#f9f9f9] cursor-pointer"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-auto bg-[#ba0036] text-white rounded-xl text-xs font-bold hover:brightness-110 active:scale-[0.98] transition-all border-none cursor-pointer tracking-wider"
            >
              Save Product Details
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
