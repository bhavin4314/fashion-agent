"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Loader2 
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Form } from "@/components/forms/Form";
import { productWizardSchema, type ProductWizardFormValues } from "../schema";
import { Stepper } from "./Stepper";
import { Step1Media } from "./Step1Media";
import { Step2Garment } from "./Step2Garment";
import { Step3Metadata } from "./Step3Metadata";

const DEFAULT_COVER_IMAGE = "https://lh3.googleusercontent.com/aida/AP1WRLvLL6pm-reCPtRqMuprVJq4uYIgYkhYYLqHWsE0UA6esWCrdw_zH-fh_LniYZdGk-ouobVfNHzV74tZoBdHtBSKqh4OCjfxz9QNJAhvkuxHhxyv3VIigNXUqpF6ojbWql1J8BEF3oz1BK7luzIchjg4Gfw4jDd7wZ1M3OVo5RtsfB4UC2FpEyv22L67TslEsiK9VeXGf8hDTYZU_hS2ru9gopffwK26WF6J955O-XdvsR83YvANEwRPTg";

export function CreateProductWizardClient() {
  const defaultValues: ProductWizardFormValues = {
    images: [
      DEFAULT_COVER_IMAGE,
      "https://lh3.googleusercontent.com/aida/AP1WRLsQghMlatk0qLvdifNv-eRmUT7jPcKw8zlG2CNyMmEbSlCP1JPOdRX5Q_yODT-sD4iLahd7mrEnO-Z6XnGI9JXulqZtlYwuD_PCLuriQKR2kfblt-_4bvdHGRtb-FduRu71BJyndpMDL2TkI-LKpg3u3aJcJEF5t6916UBMnmwq1O9JugihwIpg3gue-Ujh9wwKbG2y1_7ohC_hXGC93BEnwLoxzQ1r6XpsEXMjew5Z8GGgda7eLF86AS4",
      "https://lh3.googleusercontent.com/aida/AP1WRLsreLbgcSyWouFKHuiglA9tn94pmUeeLgotdRjogVghL9b_FL-5_cBHd3aVlFA7I8F0dq_fUTQLsXKv7ZjtMmksRexoxW43TOFt4YUR3-CE04oFucNYgILnLtuZCQh_bbNiFMeCjPQxXWaIL7_cE3-zMAGtL2YhCeKvIu8cAH9bSlI4HcNge-MENdrGqUZqMIqUISUyIqBt5ZrxziEb7SA0kVMXWZ769t4u2wu-JGt8aEjDpIZkxgNDDg"
    ],
    title: "Loro Piana Summer Walk Loafers",
    description: "Crafted with the signature refined elegance of Loro Piana, these Summer Walk Loafers feature a streamlined silhouette tailored for sophisticated casual wear. Constructed from premium water-repellent suede, the unlined design provides exceptional breathability and a glove-like fit. The iconic white rubber soles, inspired by nautical heritage, ensure maximum comfort and grip for deck-to-city versatility. Hand-stitched detailing at the apron exemplifies the brand's commitment to artisanal excellence and timeless luxury.",
    sku: "VST-2024-XP-01",
    price: 850.00,
    stock: 12,
    gender: "Unisex",
    season: "Summer",
    sizes: ["41", "42"],
    aesthetic: "Quiet Luxury",
    occasion: "Everyday",
    materials: ["Suede", "Leather", "Cashmere"],
    fit: "Regular"
  };

  const handleFinalSubmit = async (values: ProductWizardFormValues) => {
    console.log("Submitting wizard model to database:", values);
  };

  return (
    <Form
      schema={productWizardSchema}
      defaultValues={defaultValues}
      onSubmit={handleFinalSubmit}
      className="flex flex-col flex-grow select-none w-full min-h-screen gap-0"
    >
      <WizardContent />
    </Form>
  );
}

function WizardContent() {
  const { trigger, watch, setValue, reset } = useFormContext<ProductWizardFormValues>();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3>(1);
  const [aiProgress, setAiProgress] = React.useState<number>(75);
  const [isAiProcessing, setIsAiProcessing] = React.useState<boolean>(true);
  
  // Submit state triggers
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [submitStep, setSubmitStep] = React.useState<number>(0);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  // Custom material input trigger
  const [customMaterial, setCustomMaterial] = React.useState<string>("");
  const [showAddMaterialInput, setShowAddMaterialInput] = React.useState<boolean>(false);

  // Watching values for real-time summary display
  const images = watch("images") || [];
  const title = watch("title") || "";
  const price = watch("price");
  const stock = watch("stock");
  const sizes = watch("sizes") || [];
  const materials = watch("materials") || [];

  // Load editing item details on mount if present
  React.useEffect(() => {
    if (typeof window !== "undefined" && editId) {
      const saved = localStorage.getItem("vistra_inventory_items");
      if (saved) {
        try {
          const currentItems = JSON.parse(saved);
          const item = currentItems.find((itm: any) => itm.id === editId);
          if (item) {
            reset({
              images: item.image ? [item.image] : [DEFAULT_COVER_IMAGE],
              title: item.title,
              description: `This exquisite item represents the signature craftsmanship of the Vistra Concierge collection. Designed with a timeless silhouette tailored for sophisticated everyday luxury, it is constructed from premium materials. Hand-finished detailing exemplifies Vistra's commitment to artisanal excellence.`,
              sku: item.sku,
              price: Number(item.price),
              stock: item.status === "In Stock" ? 24 : item.status === "Low Stock" ? 3 : 0,
              gender: item.category === "Evening Wear" ? "Women" : item.category === "Outerwear" ? "Unisex" : "Men",
              season: "Summer",
              sizes: ["40", "41", "42"],
              aesthetic: item.category || "Quiet Luxury",
              occasion: "Everyday",
              materials: ["Suede", "Leather"],
              fit: "Regular"
            });
            setIsAiProcessing(false);
            setAiProgress(100);
          }
        } catch (e) {
          console.error("Failed to parse edit item:", e);
        }
      }
    }
  }, [editId, reset]);

  // Step 1: Simulate AI Extraction Engine completion
  React.useEffect(() => {
    // Only simulate if not in edit mode
    if (currentStep === 1 && isAiProcessing && !editId) {
      const interval = setInterval(() => {
        setAiProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsAiProcessing(false);
            return 100;
          }
          return prev + 5;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [currentStep, isAiProcessing, editId]);

  // Navigate forward after step validation
  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger("images");
      if (isValid) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      const isValid = await trigger(["title", "description", "sku", "price", "stock"]);
      if (isValid) {
        setCurrentStep(3);
      }
    }
  };

  // Navigate backward
  const handlePrevStep = () => {
    if (currentStep === 2) setCurrentStep(1);
    if (currentStep === 3) setCurrentStep(2);
  };

  // Dynamic file upload mock addition
  const handleMockAddFile = () => {
    const mockImages = [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCr1TUU79xoI0_LXD664wn0uvTe6JTH8K-uXBk4vDBLg-Eho4XwtOwgomxPh4DklcdkK6Bh5MA4MvUt7Wj_LbP7Cv5kXT7Q6GLDkLg0ZYjN_cOQG7YfKlCmq6v2bzhBg1G5Th_YrWN6s7iEWq5R1oK_-D7iwLbkEph30T8kmIuDmxPy5I_flD78NIS5TjztOsS6VSJFuZF16p6KFsVJ1xT-MSeTeXsc1zH3hYQ0Fqy_2jBpeTZJVra9a3ulRvCRCu5jJFlol-O5zH-E",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATRwT3qKv6AXZp7rRxFqG2hV0_oX3P3s03SHnm0jCgopxreYKDTsyV0r5Hdc_mmmT66sEbMWjXNiCn0jdTcj9pMkcNpgZDgEB3z5vO2cQLTUkmNSJvDw5QxYUW6QJFf3TlM97RcQytmFKn6Hr-bsHc1yT4LvHDX1sMK3yflvNKtISVVw1kxDPERlyjCJbMjYi3AVBLi7egTBLZfRx9yaAlTvh27qAcv72ozxfS2VYCMyMleti1m-KyPzyuuaIUujyZYi9ndobT6idc",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5DTZFEu-io3P1eWQlOShCSRp0Z82UXXm0oIm-RPT_mW6Fp6aX8jMAlgUuz9hd5FH4_Wyo7lk04fwsUrgCT37LV0HsG3Xcv7MIsp7ZWQK49C04nLjwfLRPM37ptDhzjaCws_i9pcdw_n21ZhmMOvaPfRP_jp3wX5rAVCToGwrIUpuisfW6bQgXQ1q2BR1waH4TV8OJ1AAxHPAybuO3b_VDrz3TEij_2Iaa86uYHJotYpjpp5R9meO0zPr0AwbP20GlOX3Fuouw9_SM"
    ];
    const nextImg = mockImages[Math.floor(Math.random() * mockImages.length)];
    if (nextImg) {
      setValue("images", [...images, nextImg], { shouldValidate: true });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setValue("images", updated, { shouldValidate: true });
  };

  // Toggle selection functions for Step 3 bento
  const toggleSize = (sz: string) => {
    if (sizes.includes(sz)) {
      setValue("sizes", sizes.filter((s) => s !== sz), { shouldValidate: true });
    } else {
      setValue("sizes", [...sizes, sz], { shouldValidate: true });
    }
  };

  const toggleMaterial = (m: string) => {
    if (materials.includes(m)) {
      setValue("materials", materials.filter((mat) => mat !== m), { shouldValidate: true });
    } else {
      setValue("materials", [...materials, m], { shouldValidate: true });
    }
  };

  const handleAddNewMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMaterial.trim() && !materials.includes(customMaterial.trim())) {
      setValue("materials", [...materials, customMaterial.trim()], { shouldValidate: true });
      setCustomMaterial("");
      setShowAddMaterialInput(false);
    }
  };

  // Final submit simulation
  const handleFinalSubmitTrigger = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    setSubmitStep(1);

    setTimeout(() => setSubmitStep(2), 1000);
    setTimeout(() => setSubmitStep(3), 2000);
    setTimeout(() => setSubmitStep(4), 3000);
    setTimeout(() => {
      // Construct the item profile
      const skuSuffix = Math.floor(10000 + Math.random() * 90000);
      const newProductItem = {
        id: editId || `custom-${Date.now()}`,
        title: title || "Loro Piana Summer Walk Loafers",
        sku: watch("sku") || `VIST-${skuSuffix}-AD`,
        category: watch("aesthetic") || "Quiet Luxury",
        price: Number(price) || 850.00,
        status: Number(stock) > 0 ? "In Stock" : Number(stock) === 0 ? "Out of Stock" : "Low Stock",
        image: images[0] || DEFAULT_COVER_IMAGE
      };

      // Write to localStorage
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("vistra_inventory_items");
        let currentItems = [
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
        if (saved) {
          try {
            currentItems = JSON.parse(saved);
          } catch (e) {
            console.error("Failed to read local Vistra items:", e);
          }
        }
        
        let updated;
        if (editId) {
          updated = currentItems.map((item: any) => {
            if (item.id === editId) {
              return {
                ...item,
                title: title || item.title,
                sku: watch("sku") || item.sku,
                category: watch("aesthetic") || item.category,
                price: Number(price) || item.price,
                status: Number(stock) > 0 ? "In Stock" : Number(stock) === 0 ? "Out of Stock" : "Low Stock",
                image: images[0] || item.image
              };
            }
            return item;
          });
        } else {
          updated = [newProductItem, ...currentItems];
        }
        
        localStorage.setItem("vistra_inventory_items", JSON.stringify(updated));
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 4000);
  };

  return (
    <div className="flex flex-col flex-grow select-none w-full min-h-screen bg-[#f9f9f9] relative">
      
      {/* Top bar */}
      <header className="sticky top-0 right-0 z-30 flex items-center justify-between px-margin-desktop bg-white border-b border-[#e2dfde] h-16 shadow-sm w-full">
        <div className="flex items-center gap-md">
          <span className="text-[#ba0036] font-extrabold font-headline-md text-headline-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>
            Concierge Admin
          </span>
          <div className="h-6 w-[1px] bg-[#e5bdbe] mx-md" />
          <span className="text-[#5f5e5e] font-label-md">
            {editId ? "Product Modification Wizard" : "Product Creation Wizard"}
          </span>
        </div>
        <div className="flex items-center gap-md">
          <a
            href="/admin/inventory"
            className="text-xs font-bold uppercase tracking-wider text-[#ba0036] hover:text-[#a0002e] transition-colors"
          >
            Cancel Wizard
          </a>
        </div>
      </header>

      {/* Main stepper and central bento canvas */}
      <main className="flex-grow p-xxl max-w-[1120px] mx-auto w-full flex flex-col items-center">
        
        <h2 className="text-[32px] md:text-[40px] font-bold text-center text-on-surface mb-lg tracking-tight">
          {editId ? "Edit Product" : "Add New Product"}
        </h2>

        {/* Visual Stepper Indicators Component */}
        <Stepper 
          currentStep={currentStep} 
          onStepClick={(step) => {
            // Allow clicking completed steps back for quick refinement
            if (step < currentStep) {
              setCurrentStep(step);
            }
          }} 
        />

        {/* Central Content Box */}
        <div className="w-full bg-[#ffffff] border border-[#e5bdbe] rounded-xl p-xxl shadow-sm min-h-[460px] flex flex-col justify-between select-none">
          
          {/* STEP 1 CONTENT PAGE */}
          {currentStep === 1 && (
            <Step1Media
              aiProgress={aiProgress}
              handleMockAddFile={handleMockAddFile}
              handleRemoveImage={handleRemoveImage}
              setValue={setValue}
            />
          )}

          {/* STEP 2 CONTENT PAGE */}
          {currentStep === 2 && (
            <Step2Garment />
          )}

          {/* STEP 3 CONTENT PAGE */}
          {currentStep === 3 && (
            <Step3Metadata
              toggleSize={toggleSize}
              toggleMaterial={toggleMaterial}
              handleAddNewMaterial={handleAddNewMaterial}
              customMaterial={customMaterial}
              setCustomMaterial={setCustomMaterial}
              showAddMaterialInput={showAddMaterialInput}
              setShowAddMaterialInput={setShowAddMaterialInput}
              handleFinalSubmitTrigger={handleFinalSubmitTrigger}
            />
          )}

          {/* Navigation Footer */}
          <div className="mt-xl pt-lg border-t border-[#e2dfde] flex items-center justify-between select-none">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-xl py-2.5 bg-white border border-[#ba0036] text-[#ba0036] hover:bg-[#fff5f6] rounded-xl text-xs font-bold transition-all flex items-center gap-xs cursor-pointer active:scale-95 duration-150"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <a
                href="/admin/inventory"
                className="px-xl py-2.5 text-[#5f5e5e] hover:bg-[#f4f3f3] rounded-xl text-xs font-bold transition-all flex items-center justify-center no-underline cursor-pointer"
              >
                Cancel
              </a>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                disabled={currentStep === 1 && isAiProcessing}
                onClick={handleNextStep}
                className={`px-xl py-2.5 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-xs border-none select-none ${
                  currentStep === 1 && isAiProcessing
                    ? "bg-[#ba0036]/50 cursor-not-allowed"
                    : "bg-[#ba0036] hover:brightness-105 active:scale-95 cursor-pointer"
                }`}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmitTrigger}
                className="px-xxl py-2.5 bg-[#ba0036] hover:brightness-105 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-xs shadow-md border-none cursor-pointer active:scale-95"
              >
                {editId ? "Update Product" : "Create Product"}
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Footer info lock badge */}
        <div className="mt-md flex justify-center">
          <p className="text-[10px] font-bold text-[#5f5e5e] uppercase tracking-widest flex items-center gap-1 select-none">
            <Lock className="w-3.5 h-3.5 text-[#ba0036]" />
            System drafts autosaved securely in real-time
          </p>
        </div>
      </main>

      {/* Decorative gradient backdrops */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-[#ffdada] rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-[#e2dfde] rounded-full blur-[100px]" />
      </div>

      {/* OVERLAY 1: PROCESSING LOADING STATE */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-[#1a1c1c]/45 backdrop-blur-xs flex items-center justify-center p-xl">
          <div className="bg-white p-xl rounded-2xl max-w-sm w-full shadow-2xl text-center space-y-lg border border-[#e2dfde]">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-[#f4f3f3] rounded-full" />
              <div className="absolute inset-0 border-4 border-[#ba0036] border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px] text-[#ba0036] animate-pulse">cloud_upload</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-charcoal mb-md">
                {editId ? "Saving Modifications" : "Finalizing Creation"}
              </h3>
              <div className="space-y-sm text-left max-w-[210px] mx-auto text-xs font-bold uppercase tracking-wider text-[#5f5e5e]">
                <div className={`flex items-center gap-sm transition-all duration-200 ${submitStep >= 1 ? "text-charcoal" : "opacity-40"}`}>
                  {submitStep >= 1 ? (
                    <span className="material-symbols-outlined text-[20px] text-[#ba0036]">check_circle</span>
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin text-[#ba0036]" />
                  )}
                  <span>Saving Product...</span>
                </div>
                <div className={`flex items-center gap-sm transition-all duration-200 ${submitStep >= 2 ? "text-charcoal" : "opacity-40"}`}>
                  {submitStep >= 2 ? (
                    <span className="material-symbols-outlined text-[20px] text-[#ba0036]">check_circle</span>
                  ) : submitStep === 1 ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#ba0036]" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-dashed border-[#e2dfde]" />
                  )}
                  <span>Generating Catalog...</span>
                </div>
                <div className={`flex items-center gap-sm transition-all duration-200 ${submitStep >= 3 ? "text-charcoal" : "opacity-40"}`}>
                  {submitStep >= 3 ? (
                    <span className="material-symbols-outlined text-[20px] text-[#ba0036]">check_circle</span>
                  ) : submitStep === 2 ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#ba0036]" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-dashed border-[#e2dfde]" />
                  )}
                  <span>Syncing Vector DB...</span>
                </div>
                <div className={`flex items-center gap-sm transition-all duration-200 ${submitStep >= 4 ? "text-charcoal" : "opacity-40"}`}>
                  {submitStep >= 4 ? (
                    <span className="material-symbols-outlined text-[20px] text-[#ba0036]">check_circle</span>
                  ) : submitStep === 3 ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#ba0036]" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-dashed border-[#e2dfde]" />
                  )}
                  <span>Indexing Search...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 2: SUCCESS COMPLETED STATE */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-[#1a1c1c]/45 backdrop-blur-xs flex items-center justify-center p-xl">
          <div className="bg-white p-xl rounded-2xl max-w-md w-full shadow-2xl text-center space-y-xl border border-[#e2dfde] animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto bg-[#ba0036] rounded-full flex items-center justify-center shadow-lg shadow-[#ba0036]/35 text-white">
              <span className="material-symbols-outlined text-[40px] text-white">check</span>
            </div>
            
            <div className="space-y-sm">
              <h3 className="text-2xl font-extrabold text-charcoal">
                {editId ? "Product Updated Successfully" : "Product Added Successfully"}
              </h3>
              <p className="text-xs font-semibold text-[#5f5e5e] uppercase tracking-wider">
                "{title || "Loro Piana Loafers"}" has been safely {editId ? "updated in" : "indexed in"} your boutique catalog.
              </p>
            </div>

            <a
              href="/admin/inventory"
              className="w-full bg-[#ba0036] hover:bg-[#a0002e] text-white py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase shadow-md flex items-center justify-center gap-sm border-none cursor-pointer no-underline transition-all active:scale-[0.98]"
            >
              View Product Catalog
            </a>
          </div>
        </div>
      )}

      {/* Load Material Symbols Outlined stylesheet globally */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />
    </div>
  );
}
