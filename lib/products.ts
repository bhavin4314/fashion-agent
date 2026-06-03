export interface Product {
  id: number;
  title: string;
  price: number;
  material: string;
  category: string;
  subcategory?: string;
  occasion: "Formal" | "Casual" | "Workwear";
  color: "white" | "black" | "grey" | "tan";
  image: string;
  galleryImages: string[]; // Bento images [Hero, Detail, Lifestyle]
  rating: number;
  reviewsCount: number;
  description: string;
  aiRecommendation: string;
  completeTheLook: Array<{
    title: string;
    price: number;
    image: string;
  }>;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Relaxed Linen Shirt",
    price: 98,
    material: "100% Organic Linen",
    category: "New Arrivals",
    subcategory: "Tops",
    occasion: "Casual",
    color: "white",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaAN2V-vXoiEKBduVTos9cZE_1rMPdf_b1wHoMugjj1PDZhe0pSGR51uB_nURS7H-3ujmnikg8C09Q2GwV0Fi5gxB7YwCrG4q2a91pUial8xGuN2286yjT5ZxaakdAkTOx18z34l_UUB5dXArhurVZFgHZWrtcYNcw11y9cmU8LSwJWyn_FR_zEGLGLh45PPPaRorAI2twUg4eEipSFrU6Dx31NoCDFp_mLwcM-UuJpErU6Yz0isdHMZ8zwJlW6QU8SDcTThjEL1H-",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9o41VzJ2DlfyOXv71GmNtWYrH5Z7unYsunyFHUoG0CpmK6BvC_rtbNxlj9r1VJH2sO5ZRchtM2519C3C4C-pKy4fzrXa7iN_f9B8D52KbvNcDpW7HZbCXip5F7uAlq51tFd-kHZQsmjl5ADymoCTPP7TffRoALDyGDAJST08YBWN5Y1z-ufpZV7Q28ZrOlqIGK0g0UvZ1XqXuI5Ipqtm9vRVjXav1Ysq97sxDm-h8n05qtCT_xDMMYBTlhx6tAo0bXflc0v5qQmBe",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIc07_0n1fMSVkBV96j4M_nDBkUI4Zpqimq66n4J9-V0g4YVwL0pff0vzpeswKacRVudUNMZVJSsgJopN2pdF8OTh7B4F5wYLz5NQI_vXSTKNIBMMzF4icKDkTwyHGw-TwK1GqVRPasjuUqawpndwesKMJKSebzgV0agxl18CDoN3jb2C3b3465mEdZzOROmsScNRepOEuMer-WVAyfWJZXmgTURvQsYPENU6FhNnrU6x93ZGqMezA1wBuHdgJObfRJqA1qzA3tpCz",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUw9OHAxoG8C2hdGZL9Yo3bVna8-Ewi2FPS0Raw03u-lNJxDEYsy_Jj-ChbG8n_KsfSdW680ngKEBar9GdwHZ1FBUonMn0myFXPO-AcXzKHevEQISdYSt3-xpYVdfVP5Cv2cNXEroXexPSv-Y_VS9kFCbLGFD9OKKQWZtGcMJpLhzxgwKWLHOcjWWH6P4OyU_z2QK-su4CGYX7jTs0-uIiqYdXqckOipf4DEcrP0bgqJp0GHji3vXjdx1V3hHsIIWqcr71n0jO1Nrd"
    ],
    rating: 4.9,
    reviewsCount: 128,
    description: "Crafted from premium 100% organic linen for a breathable, relaxed fit. Designed for ultimate versatility, this piece transitions seamlessly from seaside lounging to refined evening socials.",
    aiRecommendation: "This shirt pairs perfectly with our Sand Tailored Trousers for a coastal look.",
    completeTheLook: [
      {
        title: "Sand Tailored Trousers",
        price: 145,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvkbuFhAYJG0pTxPDAeF8XV_bYsKHtyi4lO7wOHiUTCdMppKbjwHK9pLD5SQxW0zZjAS6GP0cicBxHmpBhr0yzzQBwYvdlu__GrUzMUsGcExbENyO6CugRs1N0g6oH2-koJLp8GZQ5-yXRaS44etVjuwuQYdLNvI_0O71w6v3DEBiZxfYI4Wx_mqKDchVqov-PleIfn82MHbhkv2UT7LW7nul_Pmlwl4kxsrtLBqNdRYPmOHEdIHdnJA8xFsRZ6ZihKUfBIAbeVa-B"
      },
      {
        title: "Minimalist Leather Slides",
        price: 85,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi79D8mutafCfmPNIJrGldLzuhVp11JQ7-GNtUpLXLNBHlTkxLuohR9ivI47OzMDVqG__Xu7XWgpwe8UrRsv0fnoFm9EJaIvov0Vg6vLz06oA4tvAdkNr-ra_4jHSNMXeOUIML4_kMcdQ_hRuJQxr6vC1K6_ElDSUC06p9-NwzLpCZXNJM5CXF9jEkWWmQ961diN2mH6RpimEced7dn0uFKf-RH-GGW24ULW29eB2nuCT5ZrcbTDnFvO9rKqtzvs2mHzDXAgyNeZuR"
      },
      {
        title: "Artisan Straw Tote",
        price: 120,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFECZboBReVMjEfmcZf8yJCA6zGGtEluFOfMpvmQxF4A05Pnepjpvp0uLmcrrCA8Zh7zuxoJ9kK91sdQTXqTTPsdipGHlkqUtm-EZWLe3tSNTUgXAiGV7aJCd-kR47CMMTPO4Q65n05M9WvtWNKCFuls0VKWKLK-0BdFw_3Fa1hpntyOIhThqAKa-apC3Fq7F2tWNzv8gLsv7IbXGz7HzCbGYNZ4OB4TSdFUmqIyG7wRZtMHxYr4ljjOWSlbS16aefKIfl8Cw1-fYy"
      },
      {
        title: "Aurelia Link Necklace",
        price: 210,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyHYLX9c3uWDeYwC39RRH_1TpDaeSMqU3HFxGSfWRNsA6oAsk5kzg8KGq1BqE0XPsDhyQ_PoVCs9G3bPO5VLqoD_5QRela1cERHR0vn5u1p70lz2XXFk3Pvhhdf-kTWQA111IXRRMTTcpQn-wXP2f87AgOQVaeK9yKy1NywRsjP49BNIKKBejrlVsgwrz2qynC04rOrCInlXqVds1al218hQlKypCDAelEfF7ztSh_nRGhkcCGvzD7w8jQNQZ6i7HPioTtpFAdrv5w"
      }
    ]
  },
  {
    id: 2,
    title: "Classic Cotton Chinos",
    price: 120,
    material: "Organic Cotton Twill",
    category: "Menswear",
    subcategory: "Pants",
    occasion: "Casual",
    color: "tan",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANrKH3C5GQG-9QIHEPRVd60ZZdTumcSIpD_heRUMeXnmz9ySPh5AFW_aTlW8g9LJJ8rzA2oH7_PQkNF0i46OVx3nOKPYBtiGSlSS3TXitXXmLYflCb8xqEZxr-FDyDSVg7hIwM-dHuF_mi3BuU5lGBT2VONNZPH4JvBqsI_3PT5SmzVnoDVg_pN2Rde0T5RJJ3c_83p3fY0yLXbIH_QzHi9ERzh9GyVhZwVZlXsfR2LL5fSO3sZKrVRKQxCdF9lDkjdMCmt799fi8D",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANrKH3C5GQG-9QIHEPRVd60ZZdTumcSIpD_heRUMeXnmz9ySPh5AFW_aTlW8g9LJJ8rzA2oH7_PQkNF0i46OVx3nOKPYBtiGSlSS3TXitXXmLYflCb8xqEZxr-FDyDSVg7hIwM-dHuF_mi3BuU5lGBT2VONNZPH4JvBqsI_3PT5SmzVnoDVg_pN2Rde0T5RJJ3c_83p3fY0yLXbIH_QzHi9ERzh9GyVhZwVZlXsfR2LL5fSO3sZKrVRKQxCdF9lDkjdMCmt799fi8D",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9o41VzJ2DlfyOXv71GmNtWYrH5Z7unYsunyFHUoG0CpmK6BvC_rtbNxlj9r1VJH2sO5ZRchtM2519C3C4C-pKy4fzrXa7iN_f9B8D52KbvNcDpW7HZbCXip5F7uAlq51tFd-kHZQsmjl5ADymoCTPP7TffRoALDyGDAJST08YBWN5Y1z-ufpZV7Q28ZrOlqIGK0g0UvZ1XqXuI5Ipqtm9vRVjXav1Ysq97sxDm-h8n05qtCT_xDMMYBTlhx6tAo0bXflc0v5qQmBe",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUw9OHAxoG8C2hdGZL9Yo3bVna8-Ewi2FPS0Raw03u-lNJxDEYsy_Jj-ChbG8n_KsfSdW680ngKEBar9GdwHZ1FBUonMn0myFXPO-AcXzKHevEQISdYSt3-xpYVdfVP5Cv2cNXEroXexPSv-Y_VS9kFCbLGFD9OKKQWZtGcMJpLhzxgwKWLHOcjWWH6P4OyU_z2QK-su4CGYX7jTs0-uIiqYdXqckOipf4DEcrP0bgqJp0GHji3vXjdx1V3hHsIIWqcr71n0jO1Nrd"
    ],
    rating: 4.8,
    reviewsCount: 94,
    description: "Classic straight-leg chinos tailored from mid-weight organic cotton twill with a touch of stretch for day-long comfort. An absolute essential for polished off-duty dress codes.",
    aiRecommendation: "Wear with a tucked-in knitted polo and white minimalist sneakers.",
    completeTheLook: [
      {
        title: "Knitted Polo",
        price: 145,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCs5mYBXIJfpD5U3xktHlwp9p1R6QbUFg4tFfY4jvPU8NL5hbH2F4pJJwq6apiEYDeXPwsfwBkqmdNeofg6oqJk5c8GmluSVHPsdnLF3Xga1BV6DjXWpugWj8Xl7UD7HF_x-grI_sPEUY9nrJtJYs_FzPX7Fb0cPEZRBD-e3eVXZnEmm4W2pk4BKM_eV9D0U2AmxOFhZ05E-Rz52EU5ETM2MPzJGUlq4yteCSaGCNbN2xuAVjGeWA7d88_OHp5BSiseeo61ZXiqHIu"
      },
      {
        title: "Minimalist Leather Slides",
        price: 85,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi79D8mutafCfmPNIJrGldLzuhVp11JQ7-GNtUpLXLNBHlTkxLuohR9ivI47OzMDVqG__Xu7XWgpwe8UrRsv0fnoFm9EJaIvov0Vg6vLz06oA4tvAdkNr-ra_4jHSNMXeOUIML4_kMcdQ_hRuJQxr6vC1K6_ElDSUC06p9-NwzLpCZXNJM5CXF9jEkWWmQ961diN2mH6RpimEced7dn0uFKf-RH-GGW24ULW29eB2nuCT5ZrcbTDnFvO9rKqtzvs2mHzDXAgyNeZuR"
      }
    ]
  },
  {
    id: 3,
    title: "Cashmere V-Neck",
    price: 245,
    material: "100% Grade-A Cashmere",
    category: "Knitwear",
    subcategory: "Sweaters",
    occasion: "Casual",
    color: "grey",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeEJwc7gbakHHTVGxYvf_NNhL5ZL5Ja4xuxOy2Jv9LIoZMJdv9qf3tmIkFzOfvF1SVVloXnFNlTCXccqbpuLropuxSw3ym5lXn0GnQwA56znE3TqshgBdP62pEu9xqOU8OY4-CZdzlRixeUDW43YRPar0vzN3o0v9GLWCfx8QihYway6kd8j95kN2L2ggZ4bRX0l9dSuFVfGGx5SrvCrO5qmGjGWondaTN_n9y6EDKUi2z7n-TwuVa1ANbZkXC_wV98b-l0kvDxN0a",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeEJwc7gbakHHTVGxYvf_NNhL5ZL5Ja4xuxOy2Jv9LIoZMJdv9qf3tmIkFzOfvF1SVVloXnFNlTCXccqbpuLropuxSw3ym5lXn0GnQwA56znE3TqshgBdP62pEu9xqOU8OY4-CZdzlRixeUDW43YRPar0vzN3o0v9GLWCfx8QihYway6kd8j95kN2L2ggZ4bRX0l9dSuFVfGGx5SrvCrO5qmGjGWondaTN_n9y6EDKUi2z7n-TwuVa1ANbZkXC_wV98b-l0kvDxN0a",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9o41VzJ2DlfyOXv71GmNtWYrH5Z7unYsunyFHUoG0CpmK6BvC_rtbNxlj9r1VJH2sO5ZRchtM2519C3C4C-pKy4fzrXa7iN_f9B8D52KbvNcDpW7HZbCXip5F7uAlq51tFd-kHZQsmjl5ADymoCTPP7TffRoALDyGDAJST08YBWN5Y1z-ufpZV7Q28ZrOlqIGK0g0UvZ1XqXuI5Ipqtm9vRVjXav1Ysq97sxDm-h8n05qtCT_xDMMYBTlhx6tAo0bXflc0v5qQmBe",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUw9OHAxoG8C2hdGZL9Yo3bVna8-Ewi2FPS0Raw03u-lNJxDEYsy_Jj-ChbG8n_KsfSdW680ngKEBar9GdwHZ1FBUonMn0myFXPO-AcXzKHevEQISdYSt3-xpYVdfVP5Cv2cNXEroXexPSv-Y_VS9kFCbLGFD9OKKQWZtGcMJpLhzxgwKWLHOcjWWH6P4OyU_z2QK-su4CGYX7jTs0-uIiqYdXqckOipf4DEcrP0bgqJp0GHji3vXjdx1V3hHsIIWqcr71n0jO1Nrd"
    ],
    rating: 4.95,
    reviewsCount: 82,
    description: "Spun from the finest Inner Mongolian cashmere fibers, this exceptionally soft V-neck sweater offers cloud-like warmth with an elegant drape. A luxurious year-round layer.",
    aiRecommendation: "Drape loosely over your shoulders when pairing with linen shirts for structured warmth.",
    completeTheLook: [
      {
        title: "Relaxed Linen Shirt",
        price: 98,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaAN2V-vXoiEKBduVTos9cZE_1rMPdf_b1wHoMugjj1PDZhe0pSGR51uB_nURS7H-3ujmnikg8C09Q2GwV0Fi5gxB7YwCrG4q2a91pUial8xGuN2286yjT5ZxaakdAkTOx18z34l_UUB5dXArhurVZFgHZWrtcYNcw11y9cmU8LSwJWyn_FR_zEGLGLh45PPPaRorAI2twUg4eEipSFrU6Dx31NoCDFp_mLwcM-UuJpErU6Yz0isdHMZ8zwJlW6QU8SDcTThjEL1H-"
      },
      {
        title: "Sand Tailored Trousers",
        price: 145,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvkbuFhAYJG0pTxPDAeF8XV_bYsKHtyi4lO7wOHiUTCdMppKbjwHK9pLD5SQxW0zZjAS6GP0cicBxHmpBhr0yzzQBwYvdlu__GrUzMUsGcExbENyO6CugRs1N0g6oH2-koJLp8GZQ5-yXRaS44etVjuwuQYdLNvI_0O71w6v3DEBiZxfYI4Wx_mqKDchVqov-PleIfn82MHbhkv2UT7LW7nul_Pmlwl4kxsrtLBqNdRYPmOHEdIHdnJA8xFsRZ6ZihKUfBIAbeVa-B"
      }
    ]
  },
  {
    id: 4,
    title: "Overcoat Wool Mix",
    price: 380,
    material: "90% Virgin Wool, 10% Mulberry Silk",
    category: "Outerwear",
    subcategory: "Coats",
    occasion: "Formal",
    color: "black",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV18M-e9qAhMJj84WfXeVAZ-4k2wQWo9UwD1H_kMEKxzS8E-KeESWLcQOhLa3r_lv3oCL4za30jQuA4PfyMHZT0eiikUJ9wAW36gJCLFqORCZchWTa-0fYcWkV11sSDqCRQcK2mRfMZwWH3oGrTxUh9rarh-xs0LuT44ayGUIX06uYumlxvj2o4kez6_ZgXT_JHQa2DSc-9Xofzkh0ThQzIAPywhJ7vbP4Rcn677tu1jnYj8LPq5FJyzCSkHzWL-8ZE1iizxYa7SGQ",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBV18M-e9qAhMJj84WfXeVAZ-4k2wQWo9UwD1H_kMEKxzS8E-KeESWLcQOhLa3r_lv3oCL4za30jQuA4PfyMHZT0eiikUJ9wAW36gJCLFqORCZchWTa-0fYcWkV11sSDqCRQcK2mRfMZwWH3oGrTxUh9rarh-xs0LuT44ayGUIX06uYumlxvj2o4kez6_ZgXT_JHQa2DSc-9Xofzkh0ThQzIAPywhJ7vbP4Rcn677tu1jnYj8LPq5FJyzCSkHzWL-8ZE1iizxYa7SGQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9o41VzJ2DlfyOXv71GmNtWYrH5Z7unYsunyFHUoG0CpmK6BvC_rtbNxlj9r1VJH2sO5ZRchtM2519C3C4C-pKy4fzrXa7iN_f9B8D52KbvNcDpW7HZbCXip5F7uAlq51tFd-kHZQsmjl5ADymoCTPP7TffRoALDyGDAJST08YBWN5Y1z-ufpZV7Q28ZrOlqIGK0g0UvZ1XqXuI5Ipqtm9vRVjXav1Ysq97sxDm-h8n05qtCT_xDMMYBTlhx6tAo0bXflc0v5qQmBe",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUw9OHAxoG8C2hdGZL9Yo3bVna8-Ewi2FPS0Raw03u-lNJxDEYsy_Jj-ChbG8n_KsfSdW680ngKEBar9GdwHZ1FBUonMn0myFXPO-AcXzKHevEQISdYSt3-xpYVdfVP5Cv2cNXEroXexPSv-Y_VS9kFCbLGFD9OKKQWZtGcMJpLhzxgwKWLHOcjWWH6P4OyU_z2QK-su4CGYX7jTs0-uIiqYdXqckOipf4DEcrP0bgqJp0GHji3vXjdx1V3hHsIIWqcr71n0jO1Nrd"
    ],
    rating: 4.9,
    reviewsCount: 46,
    description: "An elegant, structured double-breasted overcoat tailored from high-density virgin wool enhanced with mulberry silk for a premium tactile finish and sophisticated sheen.",
    aiRecommendation: "Layer over our Structured Blazer with Pleated Trousers for the ultimate cold-weather power look.",
    completeTheLook: [
      {
        title: "Structured Blazer",
        price: 420,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf7MeQJy7rqBKyOE-Y0GbUt1igVaI2k1eSXpLjBjUp1Qlq-ZTIG9L0bHcvpT1Oh4z_1wD7AwTuSCcUtRzLvOcGd3hS6UTNWI81fhpxFQPAKkN5z0BSrC7V023FvGYuybZ-taEkSwl06meaU9GgyI4f7ndx2VlY4u5aza76qhLc5BlxVlpMruuo_Zj8CU46Ve1ty_FZXENEix2FHNPX9qOJ47wZWJWoGzdPI95Zyc3bEZKLJplZcw_QIDpDwB64ln064DCv4FCCBknY"
      },
      {
        title: "Pleated Trousers",
        price: 165,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAAYiOpBw8h8EYrqOjPhulpt3Uj2Bt6TugbM9iThsxKWU7jhxyHvUDDxXqt3sdKDy7CGQ461ttznFSMWMgXlMBtJIIexkHxIqY-fvpw2qUQe-VQQJEuv7LzhuVggc7nUwvG0htufFa66XCyo7fFvoOceiNbd_Jd80GTW_oN6ftXYcPFwShYZKzv1bb1W_Azls4yuf7H270FLniJRxBYZbIl-vloaJyFv7WR3RgGYxX5B6da8Ai3TOXMbapOKkC6_cKDjb8bT8quiow"
      }
    ]
  },
  {
    id: 5,
    title: "Silk Midi Dress",
    price: 285,
    material: "100% Mulberry Silk",
    category: "Dresses",
    subcategory: "Midi",
    occasion: "Formal",
    color: "white",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFAmgSplGo3RXoD3bLaQx4fNmtW1GxIciTT1sfcvP4eUGi0g2hveC8UPpdf5Z4E-UOuTdZCmnIrBTp1RlkVD5HzeBWRu9K2F5As3ofbH8OQMViEIQl0VA2dSUPXoazI23XZvzSmJ3gS7ddcKVxLaCRaOaL4XdsPMKcZhZTHIBxBef4-5QTFZZIPM3nSYw7vDmCIr6G37WLC8avY7EkOwiY1vtY_iOOrShWzwSruLgcRYikKk45pUozneYxYY87zPfebRRgVegLBabp",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFAmgSplGo3RXoD3bLaQx4fNmtW1GxIciTT1sfcvP4eUGi0g2hveC8UPpdf5Z4E-UOuTdZCmnIrBTp1RlkVD5HzeBWRu9K2F5As3ofbH8OQMViEIQl0VA2dSUPXoazI23XZvzSmJ3gS7ddcKVxLaCRaOaL4XdsPMKcZhZTHIBxBef4-5QTFZZIPM3nSYw7vDmCIr6G37WLC8avY7EkOwiY1vtY_iOOrShWzwSruLgcRYikKk45pUozneYxYY87zPfebRRgVegLBabp",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9o41VzJ2DlfyOXv71GmNtWYrH5Z7unYsunyFHUoG0CpmK6BvC_rtbNxlj9r1VJH2sO5ZRchtM2519C3C4C-pKy4fzrXa7iN_f9B8D52KbvNcDpW7HZbCXip5F7uAlq51tFd-kHZQsmjl5ADymoCTPP7TffRoALDyGDAJST08YBWN5Y1z-ufpZV7Q28ZrOlqIGK0g0UvZ1XqXuI5Ipqtm9vRVjXav1Ysq97sxDm-h8n05qtCT_xDMMYBTlhx6tAo0bXflc0v5qQmBe",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUw9OHAxoG8C2hdGZL9Yo3bVna8-Ewi2FPS0Raw03u-lNJxDEYsy_Jj-ChbG8n_KsfSdW680ngKEBar9GdwHZ1FBUonMn0myFXPO-AcXzKHevEQISdYSt3-xpYVdfVP5Cv2cNXEroXexPSv-Y_VS9kFCbLGFD9OKKQWZtGcMJpLhzxgwKWLHOcjWWH6P4OyU_z2QK-su4CGYX7jTs0-uIiqYdXqckOipf4DEcrP0bgqJp0GHji3vXjdx1V3hHsIIWqcr71n0jO1Nrd"
    ],
    rating: 4.87,
    reviewsCount: 79,
    description: "Flowing midi silhouette draped in liquid-like 100% mulberry silk. Features a subtle cowl neck and dynamic bias-cut silhouette that floats elegantly with every step.",
    aiRecommendation: "Complement the silk drape with minimalist leather slides and gold link necklaces.",
    completeTheLook: [
      {
        title: "Minimalist Leather Slides",
        price: 85,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi79D8mutafCfmPNIJrGldLzuhVp11JQ7-GNtUpLXLNBHlTkxLuohR9ivI47OzMDVqG__Xu7XWgpwe8UrRsv0fnoFm9EJaIvov0Vg6vLz06oA4tvAdkNr-ra_4jHSNMXeOUIML4_kMcdQ_hRuJQxr6vC1K6_ElDSUC06p9-NwzLpCZXNJM5CXF9jEkWWmQ961diN2mH6RpimEced7dn0uFKf-RH-GGW24ULW29eB2nuCT5ZrcbTDnFvO9rKqtzvs2mHzDXAgyNeZuR"
      },
      {
        title: "Aurelia Link Necklace",
        price: 210,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyHYLX9c3uWDeYwC39RRH_1TpDaeSMqU3HFxGSfWRNsA6oAsk5kzg8KGq1BqE0XPsDhyQ_PoVCs9G3bPO5VLqoD_5QRela1cERHR0vn5u1p70lz2XXFk3Pvhhdf-kTWQA111IXRRMTTcpQn-wXP2f87AgOQVaeK9yKy1NywRsjP49BNIKKBejrlVsgwrz2qynC04rOrCInlXqVds1al218hQlKypCDAelEfF7ztSh_nRGhkcCGvzD7w8jQNQZ6i7HPioTtpFAdrv5w"
      }
    ]
  },
  {
    id: 6,
    title: "Structured Blazer",
    price: 420,
    material: "100% Fine Italian Wool",
    category: "Suits",
    subcategory: "Blazers",
    occasion: "Workwear",
    color: "black",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf7MeQJy7rqBKyOE-Y0GbUt1igVaI2k1eSXpLjBjUp1Qlq-ZTIG9L0bHcvpT1Oh4z_1wD7AwTuSCcUtRzLvOcGd3hS6UTNWI81fhpxFQPAKkN5z0BSrC7V023FvGYuybZ-taEkSwl06meaU9GgyI4f7ndx2VlY4u5aza76qhLc5BlxVlpMruuo_Zj8CU46Ve1ty_FZXENEix2FHNPX9qOJ47wZWJWoGzdPI95Zyc3bEZKLJplZcw_QIDpDwB64ln064DCv4FCCBknY",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCf7MeQJy7rqBKyOE-Y0GbUt1igVaI2k1eSXpLjBjUp1Qlq-ZTIG9L0bHcvpT1Oh4z_1wD7AwTuSCcUtRzLvOcGd3hS6UTNWI81fhpxFQPAKkN5z0BSrC7V023FvGYuybZ-taEkSwl06meaU9GgyI4f7ndx2VlY4u5aza76qhLc5BlxVlpMruuo_Zj8CU46Ve1ty_FZXENEix2FHNPX9qOJ47wZWJWoGzdPI95Zyc3bEZKLJplZcw_QIDpDwB64ln064DCv4FCCBknY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9o41VzJ2DlfyOXv71GmNtWYrH5Z7unYsunyFHUoG0CpmK6BvC_rtbNxlj9r1VJH2sO5ZRchtM2519C3C4C-pKy4fzrXa7iN_f9B8D52KbvNcDpW7HZbCXip5F7uAlq51tFd-kHZQsmjl5ADymoCTPP7TffRoALDyGDAJST08YBWN5Y1z-ufpZV7Q28ZrOlqIGK0g0UvZ1XqXuI5Ipqtm9vRVjXav1Ysq97sxDm-h8n05qtCT_xDMMYBTlhx6tAo0bXflc0v5qQmBe",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUw9OHAxoG8C2hdGZL9Yo3bVna8-Ewi2FPS0Raw03u-lNJxDEYsy_Jj-ChbG8n_KsfSdW680ngKEBar9GdwHZ1FBUonMn0myFXPO-AcXzKHevEQISdYSt3-xpYVdfVP5Cv2cNXEroXexPSv-Y_VS9kFCbLGFD9OKKQWZtGcMJpLhzxgwKWLHOcjWWH6P4OyU_z2QK-su4CGYX7jTs0-uIiqYdXqckOipf4DEcrP0bgqJp0GHji3vXjdx1V3hHsIIWqcr71n0jO1Nrd"
    ],
    rating: 4.92,
    reviewsCount: 112,
    description: "Impeccably tailored double-breasted blazer featuring padded shoulders, sharp peak lapels, and custom tortoiseshell buttons. Crafted from premium Italian wool.",
    aiRecommendation: "Looks commanding when worn with Pleated Trousers and smooth leather footwear.",
    completeTheLook: [
      {
        title: "Pleated Trousers",
        price: 165,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAAYiOpBw8h8EYrqOjPhulpt3Uj2Bt6TugbM9iThsxKWU7jhxyHvUDDxXqt3sdKDy7CGQ461ttznFSMWMgXlMBtJIIexkHxIqY-fvpw2qUQe-VQQJEuv7LzhuVggc7nUwvG0htufFa66XCyo7fFvoOceiNbd_Jd80GTW_oN6ftXYcPFwShYZKzv1bb1W_Azls4yuf7H270FLniJRxBYZbIl-vloaJyFv7WR3RgGYxX5B6da8Ai3TOXMbapOKkC6_cKDjb8bT8quiow"
      }
    ]
  },
  {
    id: 7,
    title: "Pleated Trousers",
    price: 165,
    material: "Lightweight Wool Crepe",
    category: "Suits",
    subcategory: "Pants",
    occasion: "Workwear",
    color: "grey",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAAYiOpBw8h8EYrqOjPhulpt3Uj2Bt6TugbM9iThsxKWU7jhxyHvUDDxXqt3sdKDy7CGQ461ttznFSMWMgXlMBtJIIexkHxIqY-fvpw2qUQe-VQQJEuv7LzhuVggc7nUwvG0htufFa66XCyo7fFvoOceiNbd_Jd80GTW_oN6ftXYcPFwShYZKzv1bb1W_Azls4yuf7H270FLniJRxBYZbIl-vloaJyFv7WR3RgGYxX5B6da8Ai3TOXMbapOKkC6_cKDjb8bT8quiow",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCAAYiOpBw8h8EYrqOjPhulpt3Uj2Bt6TugbM9iThsxKWU7jhxyHvUDDxXqt3sdKDy7CGQ461ttznFSMWMgXlMBtJIIexkHxIqY-fvpw2qUQe-VQQJEuv7LzhuVggc7nUwvG0htufFa66XCyo7fFvoOceiNbd_Jd80GTW_oN6ftXYcPFwShYZKzv1bb1W_Azls4yuf7H270FLniJRxBYZbIl-vloaJyFv7WR3RgGYxX5B6da8Ai3TOXMbapOKkC6_cKDjb8bT8quiow",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9o41VzJ2DlfyOXv71GmNtWYrH5Z7unYsunyFHUoG0CpmK6BvC_rtbNxlj9r1VJH2sO5ZRchtM2519C3C4C-pKy4fzrXa7iN_f9B8D52KbvNcDpW7HZbCXip5F7uAlq51tFd-kHZQsmjl5ADymoCTPP7TffRoALDyGDAJST08YBWN5Y1z-ufpZV7Q28ZrOlqIGK0g0UvZ1XqXuI5Ipqtm9vRVjXav1Ysq97sxDm-h8n05qtCT_xDMMYBTlhx6tAo0bXflc0v5qQmBe",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUw9OHAxoG8C2hdGZL9Yo3bVna8-Ewi2FPS0Raw03u-lNJxDEYsy_Jj-ChbG8n_KsfSdW680ngKEBar9GdwHZ1FBUonMn0myFXPO-AcXzKHevEQISdYSt3-xpYVdfVP5Cv2cNXEroXexPSv-Y_VS9kFCbLGFD9OKKQWZtGcMJpLhzxgwKWLHOcjWWH6P4OyU_z2QK-su4CGYX7jTs0-uIiqYdXqckOipf4DEcrP0bgqJp0GHji3vXjdx1V3hHsIIWqcr71n0jO1Nrd"
    ],
    rating: 4.85,
    reviewsCount: 62,
    description: "Flattering high-rise pleated pants cut in wool crepe. Features pressed creases along the front and back for an exceptionally crisp vertical aesthetic.",
    aiRecommendation: "Matches beautifully with the Structured Blazer for corporate elegance.",
    completeTheLook: [
      {
        title: "Structured Blazer",
        price: 420,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf7MeQJy7rqBKyOE-Y0GbUt1igVaI2k1eSXpLjBjUp1Qlq-ZTIG9L0bHcvpT1Oh4z_1wD7AwTuSCcUtRzLvOcGd3hS6UTNWI81fhpxFQPAKkN5z0BSrC7V023FvGYuybZ-taEkSwl06meaU9GgyI4f7ndx2VlY4u5aza76qhLc5BlxVlpMruuo_Zj8CU46Ve1ty_FZXENEix2FHNPX9qOJ47wZWJWoGzdPI95Zyc3bEZKLJplZcw_QIDpDwB64ln064DCv4FCCBknY"
      }
    ]
  },
  {
    id: 8,
    title: "Suede Loafers",
    price: 210,
    material: "Calf Suede Leather",
    category: "Footwear",
    subcategory: "Loafers",
    occasion: "Casual",
    color: "tan",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdtXVOUSZBITxze8gIgXZCGr08qsgPYpJ-ht8sT8TG40dTWSRb8uopts-2himFgt5XKs2g_uw9GTQ_J67i7wr1Y_NfOuLyRktvblS05y7pZf8SSiPFYQlw01kNwtoGmYEZkIXLyMWGa5pD7qJc8GzZNIAaysMnEOK4N_ghSfa4VqP3CEQY5r9k5SYKlkYemENn1xzki7FdPfa1PWQclMHM5ajm-aEtQBiLIuzF6gYD0QKWvTrlAo8WYqLpTV3bMyrDycq1sNiCTj-r",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdtXVOUSZBITxze8gIgXZCGr08qsgPYpJ-ht8sT8TG40dTWSRb8uopts-2himFgt5XKs2g_uw9GTQ_J67i7wr1Y_NfOuLyRktvblS05y7pZf8SSiPFYQlw01kNwtoGmYEZkIXLyMWGa5pD7qJc8GzZNIAaysMnEOK4N_ghSfa4VqP3CEQY5r9k5SYKlkYemENn1xzki7FdPfa1PWQclMHM5ajm-aEtQBiLIuzF6gYD0QKWvTrlAo8WYqLpTV3bMyrDycq1sNiCTj-r",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9o41VzJ2DlfyOXv71GmNtWYrH5Z7unYsunyFHUoG0CpmK6BvC_rtbNxlj9r1VJH2sO5ZRchtM2519C3C4C-pKy4fzrXa7iN_f9B8D52KbvNcDpW7HZbCXip5F7uAlq51tFd-kHZQsmjl5ADymoCTPP7TffRoALDyGDAJST08YBWN5Y1z-ufpZV7Q28ZrOlqIGK0g0UvZ1XqXuI5Ipqtm9vRVjXav1Ysq97sxDm-h8n05qtCT_xDMMYBTlhx6tAo0bXflc0v5qQmBe",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUw9OHAxoG8C2hdGZL9Yo3bVna8-Ewi2FPS0Raw03u-lNJxDEYsy_Jj-ChbG8n_KsfSdW680ngKEBar9GdwHZ1FBUonMn0myFXPO-AcXzKHevEQISdYSt3-xpYVdfVP5Cv2cNXEroXexPSv-Y_VS9kFCbLGFD9OKKQWZtGcMJpLhzxgwKWLHOcjWWH6P4OyU_z2QK-su4CGYX7jTs0-uIiqYdXqckOipf4DEcrP0bgqJp0GHji3vXjdx1V3hHsIIWqcr71n0jO1Nrd"
    ],
    rating: 4.78,
    reviewsCount: 53,
    description: "Premium handcrafted calf suede loaders boasting a soft leather lining and durable stacked wooden heel. Engineered for flexible comfort and unmatched summer style.",
    aiRecommendation: "Complements relaxed linen clothing styles perfectly.",
    completeTheLook: [
      {
        title: "Relaxed Linen Shirt",
        price: 98,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaAN2V-vXoiEKBduVTos9cZE_1rMPdf_b1wHoMugjj1PDZhe0pSGR51uB_nURS7H-3ujmnikg8C09Q2GwV0Fi5gxB7YwCrG4q2a91pUial8xGuN2286yjT5ZxaakdAkTOx18z34l_UUB5dXArhurVZFgHZWrtcYNcw11y9cmU8LSwJWyn_FR_zEGLGLh45PPPaRorAI2twUg4eEipSFrU6Dx31NoCDFp_mLwcM-UuJpErU6Yz0isdHMZ8zwJlW6QU8SDcTThjEL1H-"
      }
    ]
  },
  {
    id: 9,
    title: "Knitted Polo",
    price: 145,
    material: "Extra Fine Merino Wool",
    category: "Knitwear",
    subcategory: "Polos",
    occasion: "Casual",
    color: "white",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCs5mYBXIJfpD5U3xktHlwp9p1R6QbUFg4tFfY4jvPU8NL5hbH2F4pJJwq6apiEYDeXPwsfwBkqmdNeofg6oqJk5c8GmluSVHPsdnLF3Xga1BV6DjXWpugWj8Xl7UD7HF_x-grI_sPEUY9nrJtJYs_FzPX7Fb0cPEZRBD-e3eVXZnEmm4W2pk4BKM_eV9D0U2AmxOFhZ05E-Rz52EU5ETM2MPzJGUlq4yteCSaGCNbN2xuAVjGeWA7d88_OHp5BSiseeo61ZXiqHIu",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBCs5mYBXIJfpD5U3xktHlwp9p1R6QbUFg4tFfY4jvPU8NL5hbH2F4pJJwq6apiEYDeXPwsfwBkqmdNeofg6oqJk5c8GmluSVHPsdnLF3Xga1BV6DjXWpugWj8Xl7UD7HF_x-grI_sPEUY9nrJtJYs_FzPX7Fb0cPEZRBD-e3eVXZnEmm4W2pk4BKM_eV9D0U2AmxOFhZ05E-Rz52EU5ETM2MPzJGUlq4yteCSaGCNbN2xuAVjGeWA7d88_OHp5BSiseeo61ZXiqHIu",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9o41VzJ2DlfyOXv71GmNtWYrH5Z7unYsunyFHUoG0CpmK6BvC_rtbNxlj9r1VJH2sO5ZRchtM2519C3C4C-pKy4fzrXa7iN_f9B8D52KbvNcDpW7HZbCXip5F7uAlq51tFd-kHZQsmjl5ADymoCTPP7TffRoALDyGDAJST08YBWN5Y1z-ufpZV7Q28ZrOlqIGK0g0UvZ1XqXuI5Ipqtm9vRVjXav1Ysq97sxDm-h8n05qtCT_xDMMYBTlhx6tAo0bXflc0v5qQmBe",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUw9OHAxoG8C2hdGZL9Yo3bVna8-Ewi2FPS0Raw03u-lNJxDEYsy_Jj-ChbG8n_KsfSdW680ngKEBar9GdwHZ1FBUonMn0myFXPO-AcXzKHevEQISdYSt3-xpYVdfVP5Cv2cNXEroXexPSv-Y_VS9kFCbLGFD9OKKQWZtGcMJpLhzxgwKWLHOcjWWH6P4OyU_z2QK-su4CGYX7jTs0-uIiqYdXqckOipf4DEcrP0bgqJp0GHji3vXjdx1V3hHsIIWqcr71n0jO1Nrd"
    ],
    rating: 4.88,
    reviewsCount: 67,
    description: "Knit polo shirt spun from premium extra-fine merino wool fibers, showcasing a dynamic ribbed collar and textured stitch detailing for a refined look.",
    aiRecommendation: "Pairs beautifully with our Sand Tailored Trousers or Classic Cotton Chinos.",
    completeTheLook: [
      {
        title: "Sand Tailored Trousers",
        price: 145,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvkbuFhAYJG0pTxPDAeF8XV_bYsKHtyi4lO7wOHiUTCdMppKbjwHK9pLD5SQxW0zZjAS6GP0cicBxHmpBhr0yzzQBwYvdlu__GrUzMUsGcExbENyO6CugRs1N0g6oH2-koJLp8GZQ5-yXRaS44etVjuwuQYdLNvI_0O71w6v3DEBiZxfYI4Wx_mqKDchVqov-PleIfn82MHbhkv2UT7LW7nul_Pmlwl4kxsrtLBqNdRYPmOHEdIHdnJA8xFsRZ6ZihKUfBIAbeVa-B"
      }
    ]
  },
  {
    id: 10,
    title: "Belted Coat",
    price: 550,
    material: "Cashmere & Virgin Wool Blend",
    category: "Outerwear",
    subcategory: "Coats",
    occasion: "Formal",
    color: "tan",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCx47hUYeFd34Hzqr-rK-3PSNhic4HOfFpduntyWZVOYrC6iY25wjhvb8jOGxx6TXjO5PzbAiAw7fEPC419g0Ef9AxKV2-nI5BpgnNtvxaUFpGWU2jKTG9cta_6_XMIVBz5rnyn-OI5ZATsUblMhzTJCzCZC5nBfm-_WZYyFGEQcQGooCB__7DOLdosE4Cr90hQzDkO8-oJSPJEPhXR5Z0dqqvb7IQNVIrKmA0e8JpaWzHUt8bTxMwZA5SrWnazEoAKqHJx0VLrMD0c",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCx47hUYeFd34Hzqr-rK-3PSNhic4HOfFpduntyWZVOYrC6iY25wjhvb8jOGxx6TXjO5PzbAiAw7fEPC419g0Ef9AxKV2-nI5BpgnNtvxaUFpGWU2jKTG9cta_6_XMIVBz5rnyn-OI5ZATsUblMhzTJCzCZC5nBfm-_WZYyFGEQcQGooCB__7DOLdosE4Cr90hQzDkO8-oJSPJEPhXR5Z0dqqvb7IQNVIrKmA0e8JpaWzHUt8bTxMwZA5SrWnazEoAKqHJx0VLrMD0c",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9o41VzJ2DlfyOXv71GmNtWYrH5Z7unYsunyFHUoG0CpmK6BvC_rtbNxlj9r1VJH2sO5ZRchtM2519C3C4C-pKy4fzrXa7iN_f9B8D52KbvNcDpW7HZbCXip5F7uAlq51tFd-kHZQsmjl5ADymoCTPP7TffRoALDyGDAJST08YBWN5Y1z-ufpZV7Q28ZrOlqIGK0g0UvZ1XqXuI5Ipqtm9vRVjXav1Ysq97sxDm-h8n05qtCT_xDMMYBTlhx6tAo0bXflc0v5qQmBe",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUw9OHAxoG8C2hdGZL9Yo3bVna8-Ewi2FPS0Raw03u-lNJxDEYsy_Jj-ChbG8n_KsfSdW680ngKEBar9GdwHZ1FBUonMn0myFXPO-AcXzKHevEQISdYSt3-xpYVdfVP5Cv2cNXEroXexPSv-Y_VS9kFCbLGFD9OKKQWZtGcMJpLhzxgwKWLHOcjWWH6P4OyU_z2QK-su4CGYX7jTs0-uIiqYdXqckOipf4DEcrP0bgqJp0GHji3vXjdx1V3hHsIIWqcr71n0jO1Nrd"
    ],
    rating: 4.96,
    reviewsCount: 38,
    description: "An iconic, oversized silhouette constructed in cashmere and virgin wool blend. Features a self-tie waist belt, broad collar lapels, and premium structural tailoring.",
    aiRecommendation: "Tie snugly over formal evening dresses or drape casually over luxury knitwear.",
    completeTheLook: [
      {
        title: "Silk Midi Dress",
        price: 285,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFAmgSplGo3RXoD3bLaQx4fNmtW1GxIciTT1sfcvP4eUGi0g2hveC8UPpdf5Z4E-UOuTdZCmnIrBTp1RlkVD5HzeBWRu9K2F5As3ofbH8OQMViEIQl0VA2dSUPXoazI23XZvzSmJ3gS7ddcKVxLaCRaOaL4XdsPMKcZhZTHIBxBef4-5QTFZZIPM3nSYw7vDmCIr6G37WLC8avY7EkOwiY1vtY_iOOrShWzwSruLgcRYikKk45pUozneYxYY87zPfebRRgVegLBabp"
      }
    ]
  },
  {
    id: 11,
    title: "Silk Scarf",
    price: 125,
    material: "100% Fine Mulberry Silk",
    category: "Accessories",
    subcategory: "Scarves",
    occasion: "Formal",
    color: "tan",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFzNGVRA1fZSvbJb1bFhRQUOhA_FaMCf4ERV7ZX3XZ_lfhAEj3KCNH0_JmVMzYd6nkf0LpFKN5rpKVfF_oa5c2NX1ZKNZDAu4h7TjPQSSCS9yh0basQLObQfejz35l-G-PSBvApkV8AhxhN3sd08SzN2mmQVrBZU_emJ9wbHJAT3kHBY6JrXcMy1cis5ZJ7aLve4eXkGa-h7yntV0ZB8ZZ0W-kFwX2OREq9ccKvGX-k7XBs6s0OOaLxqz5XPmIUgM688w7ENxFkBwJ",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFzNGVRA1fZSvbJb1bFhRQUOhA_FaMCf4ERV7ZX3XZ_lfhAEj3KCNH0_JmVMzYd6nkf0LpFKN5rpKVfF_oa5c2NX1ZKNZDAu4h7TjPQSSCS9yh0basQLObQfejz35l-G-PSBvApkV8AhxhN3sd08SzN2mmQVrBZU_emJ9wbHJAT3kHBY6JrXcMy1cis5ZJ7aLve4eXkGa-h7yntV0ZB8ZZ0W-kFwX2OREq9ccKvGX-k7XBs6s0OOaLxqz5XPmIUgM688w7ENxFkBwJ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9o41VzJ2DlfyOXv71GmNtWYrH5Z7unYsunyFHUoG0CpmK6BvC_rtbNxlj9r1VJH2sO5ZRchtM2519C3C4C-pKy4fzrXa7iN_f9B8D52KbvNcDpW7HZbCXip5F7uAlq51tFd-kHZQsmjl5ADymoCTPP7TffRoALDyGDAJST08YBWN5Y1z-ufpZV7Q28ZrOlqIGK0g0UvZ1XqXuI5Ipqtm9vRVjXav1Ysq97sxDm-h8n05qtCT_xDMMYBTlhx6tAo0bXflc0v5qQmBe",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUw9OHAxoG8C2hdGZL9Yo3bVna8-Ewi2FPS0Raw03u-lNJxDEYsy_Jj-ChbG8n_KsfSdW680ngKEBar9GdwHZ1FBUonMn0myFXPO-AcXzKHevEQISdYSt3-xpYVdfVP5Cv2cNXEroXexPSv-Y_VS9kFCbLGFD9OKKQWZtGcMJpLhzxgwKWLHOcjWWH6P4OyU_z2QK-su4CGYX7jTs0-uIiqYdXqckOipf4DEcrP0bgqJp0GHji3vXjdx1V3hHsIIWqcr71n0jO1Nrd"
    ],
    rating: 4.82,
    reviewsCount: 41,
    description: "Drawn and rolled by hand, this square mulberry silk scarf highlights a traditional micro-pattern print. Adds an elegant pop of style to neutrals.",
    aiRecommendation: "Knot gently around the neck when wearing our Silk Midi Dress for an ultra-chic touch.",
    completeTheLook: [
      {
        title: "Silk Midi Dress",
        price: 285,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFAmgSplGo3RXoD3bLaQx4fNmtW1GxIciTT1sfcvP4eUGi0g2hveC8UPpdf5Z4E-UOuTdZCmnIrBTp1RlkVD5HzeBWRu9K2F5As3ofbH8OQMViEIQl0VA2dSUPXoazI23XZvzSmJ3gS7ddcKVxLaCRaOaL4XdsPMKcZhZTHIBxBef4-5QTFZZIPM3nSYw7vDmCIr6G37WLC8avY7EkOwiY1vtY_iOOrShWzwSruLgcRYikKk45pUozneYxYY87zPfebRRgVegLBabp"
      }
    ]
  },
  {
    id: 12,
    title: "Leather Tote",
    price: 395,
    material: "Full-Grain Pebbled Leather",
    category: "Accessories",
    subcategory: "Bags",
    occasion: "Workwear",
    color: "black",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmoL3TsSKiQ9_N0iB-jpKSufi0ZJOXrCDlW-kW7tCX9i7BudjGc1Qh3M3KnXTQfF-QQ1A9bYiGC6SJb5ZU9BF_NjIuEsdA-QYX9vsOdxrzPED13auFZuVGo_fCJypDC67Npif-zubIX5_Mi_3uM9Am2pdBGSRZFUkQlWTb5GS7oavl3jy1hjSWJihiRcXzp0kI4FDLL7muvZnA1LsT7bFALJcxXZSW2NjctOR7Ma_TgFA3NVLLTUDVyPX9a1pN2sctSHGbEg-qB_3_",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCmoL3TsSKiQ9_N0iB-jpKSufi0ZJOXrCDlW-kW7tCX9i7BudjGc1Qh3M3KnXTQfF-QQ1A9bYiGC6SJb5ZU9BF_NjIuEsdA-QYX9vsOdxrzPED13auFZuVGo_fCJypDC67Npif-zubIX5_Mi_3uM9Am2pdBGSRZFUkQlWTb5GS7oavl3jy1hjSWJihiRcXzp0kI4FDLL7muvZnA1LsT7bFALJcxXZSW2NjctOR7Ma_TgFA3NVLLTUDVyPX9a1pN2sctSHGbEg-qB_3_",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9o41VzJ2DlfyOXv71GmNtWYrH5Z7unYsunyFHUoG0CpmK6BvC_rtbNxlj9r1VJH2sO5ZRchtM2519C3C4C-pKy4fzrXa7iN_f9B8D52KbvNcDpW7HZbCXip5F7uAlq51tFd-kHZQsmjl5ADymoCTPP7TffRoALDyGDAJST08YBWN5Y1z-ufpZV7Q28ZrOlqIGK0g0UvZ1XqXuI5Ipqtm9vRVjXav1Ysq97sxDm-h8n05qtCT_xDMMYBTlhx6tAo0bXflc0v5qQmBe",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUw9OHAxoG8C2hdGZL9Yo3bVna8-Ewi2FPS0Raw03u-lNJxDEYsy_Jj-ChbG8n_KsfSdW680ngKEBar9GdwHZ1FBUonMn0myFXPO-AcXzKHevEQISdYSt3-xpYVdfVP5Cv2cNXEroXexPSv-Y_VS9kFCbLGFD9OKKQWZtGcMJpLhzxgwKWLHOcjWWH6P4OyU_z2QK-su4CGYX7jTs0-uIiqYdXqckOipf4DEcrP0bgqJp0GHji3vXjdx1V3hHsIIWqcr71n0jO1Nrd"
    ],
    rating: 4.9,
    reviewsCount: 104,
    description: "Spacious daily companion meticulously crafted from durable full-grain pebbled leather. Features polished gold-tone hardware and an organized internal zipper compartment.",
    aiRecommendation: "A perfect companion alongside commanding office suits.",
    completeTheLook: [
      {
        title: "Structured Blazer",
        price: 420,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf7MeQJy7rqBKyOE-Y0GbUt1igVaI2k1eSXpLjBjUp1Qlq-ZTIG9L0bHcvpT1Oh4z_1wD7AwTuSCcUtRzLvOcGd3hS6UTNWI81fhpxFQPAKkN5z0BSrC7V023FvGYuybZ-taEkSwl06meaU9GgyI4f7ndx2VlY4u5aza76qhLc5BlxVlpMruuo_Zj8CU46Ve1ty_FZXENEix2FHNPX9qOJ47wZWJWoGzdPI95Zyc3bEZKLJplZcw_QIDpDwB64ln064DCv4FCCBknY"
      },
      {
        title: "Pleated Trousers",
        price: 165,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAAYiOpBw8h8EYrqOjPhulpt3Uj2Bt6TugbM9iThsxKWU7jhxyHvUDDxXqt3sdKDy7CGQ461ttznFSMWMgXlMBtJIIexkHxIqY-fvpw2qUQe-VQQJEuv7LzhuVggc7nUwvG0htufFa66XCyo7fFvoOceiNbd_Jd80GTW_oN6ftXYcPFwShYZKzv1bb1W_Azls4yuf7H270FLniJRxBYZbIl-vloaJyFv7WR3RgGYxX5B6da8Ai3TOXMbapOKkC6_cKDjb8bT8quiow"
      }
    ]
  }
];
