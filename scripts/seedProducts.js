import mongoose from "mongoose";
import dotenv from "dotenv";

import Category from "../src/database/model/category.model.js";
import Product from "../src/database/model/product.model.js";
import Subcategory from "../src/database/model/subcategory.model.js";

dotenv.config({ path: "./config/.env" });

const productsData = [
  {
    name: "FRANKEL COLLECTION 25ML",
    description: "كل عطر 25 مل (51 reviews). A complete set: Frankel Aventus, Frankel Imagination, Frankel Silver.",
    price: 75,
    stock: "Out of Stock",
    category: "Perfumes",
    subcategory: "Frankel",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775567145/images02_vv3p3a.png"],
    sku: "PKG-FRNK-ON-48000"
  },
  {
    name: "FRANKEL AVENTUS 200ML",
    description: "FRANKEL AVENTUS perfume. A masculine fragrance that expresses boldness and self-confidence.",
    price: 149,
    stock: "In Stock",
    category: "Perfumes",
    subcategory: "Frankel",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775567145/images03_yobjlc.png"],
    sku: "FBKX-200-ON-00650"
  },
  {
    name: "FRANKEL SILVER 200ML",
    description: "Fresh and strong fragrance with notes of orange, green tea, black raisins, petit grain, jasmine, sandalwood, and musk.",
    price: 129,
    stock: "In Stock",
    category: "Perfumes",
    subcategory: "Frankel",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775567145/images04_zqmgsa.png"],
    sku: "FSX-200-ON-00660"
  },
  {
    name: "Frankel Collection - 6 Perfumes 100ML",
    description: "Complete 6-perfume set (100ml each). Includes Frankel Aventus, Frankel Battle, Frankel Silver, Frankl Aftenon, Frankel Imagination Intense.",
    price: 295,
    stock: "Out of Stock",
    category: "Perfumes",
    subcategory: "Frankel",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775567146/images05_fhoowz.jpg"],
    sku: "PKG-FRC-ON-0056"
  },
  {
    name: "FRANKEL IMAGINATION ELIXER 200ML",
    description: "Extra 30% concentration. Invites imagination with orange, lemon, lavender, nutmeg, cinnamon, patchouli, guaiac wood.",
    price: 159,
    stock: "In Stock",
    category: "Perfumes",
    subcategory: "Frankel",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775567146/images06_kfix1p.png"],
    sku: "FBUX-200-ON-00649"
  },
  {
    name: "FRANKEL CHILL 200ML",
    description: "Fresh and energizing summer fragrance inspired by the legendary horse Frankel, with notes of blackcurrant, citrus, mint, basil, coriander, amber.",
    price: 139,
    stock: "In Stock",
    category: "Perfumes",
    subcategory: "Frankel",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775567146/images07_n6xov6.png"],
    sku: "FCH-ON-200-13000"
  },
  {
    name: "FRANKEL BEACH AFTERNOON 200ML",
    description: "Warm and coastal scent with bergamot, citrus, jasmine, amber, sandalwood, and musk.",
    price: 125,
    stock: "In Stock",
    category: "Perfumes",
    subcategory: "Frankel",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775567146/images08_rrjm1u.png"],
    sku: "FRNK-200-ON-0004"
  },
  {
    name: "Frankel Aventus Intense 100ML",
    description: "Higher concentration. Sophisticated masculine fragrance with iris, lemon, violet, basil, vetiver, amber, vanilla, cedarwood, and musk.",
    price: 115,
    stock: "Out of Stock",
    category: "Perfumes",
    subcategory: "Frankel",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775567146/images09_mpwnfu.png"],
    sku: "FRNK-100-ON-0003"
  },
  {
    name: "FRANKEL IMAGINATION INTENSE 200ML",
    description: "Extra strong fragrance with orange, lemon, pink pepper, mandarin, black tea, black raisins, lavender, nutmeg, cinnamon, patchouli, and guaiac wood.",
    price: 129,
    stock: "In Stock",
    category: "Perfumes",
    subcategory: "Frankel",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775567146/images10_ilkbuz.png"],
    sku: "IMG-200-08000"
  },
  {
    name: "FRANKEL GREEN IRISH 100ML",
    description: "Luxurious fragrance with violet flower, mint, sandalwood, and musk.",
    price: 95,
    stock: "In Stock",
    category: "Perfumes",
    subcategory: "Frankel",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775567146/images11_f3z0zd.jpg"],
    sku: "FGR-100-04500"
  },
  {
    name: "FRANKEL IMAGINATION 100ML",
    description: "Higher concentration. Citrus top notes with black tea, black currant, lavender, nutmeg, cinnamon, patchouli, and guaiac wood base.",
    price: 82.61,
    stock: "In Stock",
    category: "Perfumes",
    subcategory: "Frankel",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775567146/images12_y9lx67.jpg"],
    sku: "FRNK-100-ON-0001"
  },
  {
    name: "Frankel Absolu 100ML",
    description: "Unforgettable fragrance with bergamot, pink pepper, apple, patchouli, jasmine, amber, musk, and subtle woody notes.",
    price: 96,
    stock: "Out of Stock",
    category: "Perfumes",
    subcategory: "Frankel",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775567145/images13_y2qbgu.jpg"],
    sku: "FBS-100-03000"
  },
  {
    name: "Frankel Silver 100ML",
    description: "Higher concentration, fresh citrus top notes with creamy herbal base of petit grain, guaiacium, sandalwood, and musk.",
    price: 84,
    stock: "Out of Stock",
    category: "Perfumes",
    subcategory: "Frankel",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775567145/images14_kkrrwi.jpg"],
    sku: "FRNK-100-ON-0002"
  },
  {
    name: "اروقيت ادكت الكسير",
    price: 129,
    stock: 20,
    size: 150,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569508/images01_gwb5iu.png"],
    sku: "ARAD-150-ON-10028",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "Arrogate Collection 25 ML",
    price: 75,
    stock: 15,
    size: 25,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569508/images02_tkm8bg.jpg"],
    sku: "PKG-ARCMP-ON-0051",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "ARROGATE PINK 200 ML",
    price: 149,
    stock: 18,
    size: 200,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569509/images03_nba1gl.png"],
    sku: "PKG-ARP-ON-55000",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "Risk Comete",
    price: 129,
    stock: 17,
    size: 150,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569509/images05_i5daad.jpg"],
    sku: "RSK-150-ON-38000",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "ARROGATE COMETE 200ml",
    price: 149,
    stock: 19,
    size: 200,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569510/images06_pzjyrf.jpg"],
    sku: "ARC-ON-200-0005",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "Attacks 150ml",
    price: 149,
    stock: 16,
    size: 150,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569511/images07_ad2v63.png"],
    sku: "ATK-150-05200",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "Arrogate Pink Rose 150ml",
    price: 129,
    stock: 14,
    size: 150,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569511/images08_sxmjzp.jpg"],
    sku: "ARPR-ON-150-0008",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "MISS ARROGATE 200 ml",
    price: 129,
    stock: 12,
    size: 200,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569512/images09_oz9z2u.jpg"],
    sku: "MRG-200-09400",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "ARROGATE COLLECTION 10ML",
    price: 75,
    stock: 10,
    size: 10,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569513/images10_mdkjqj.jpg"],
    sku: "PKG-EIDA-ON-0020",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "Glitch 150ml",
    price: 165,
    stock: 9,
    size: 150,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569514/images12_efb8j8.png"],
    sku: "GLT-150-ON-37000",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "ARROGATE BLUE EXCLUSIVE 200ml",
    price: 119,
    stock: 8,
    size: 200,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569515/images13_usuezh.jpg"],
    sku: "ARG-200-09200",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "Miss Gris Dance 150ml",
    price: 139,
    stock: 7,
    size: 150,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569515/images14_kh0iuc.jpg"],
    sku: "MGD-150-31000",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "ARROGATE ADDICT 200ML",
    price: 149,
    stock: 6,
    size: 200,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569516/images15_zvgdyg.jpg"],
    sku: "ARD-ON-200-16000",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "ARROGATE EUPHORIA 150ML",
    price: 199,
    stock: 5,
    size: 150,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569517/images16_wx5spn.jpg"],
    sku: "ARU-ON-17000",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "ARROGATE MILLION CELEBRATION",
    price: 199,
    stock: 0,
    size: 200,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569518/images17_xbyziz.jpg"],
    sku: "PKG-CCD-ON-0016",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "ARROGATE GIRL 200ml",
    price: 119,
    stock: 0,
    size: 200,
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775569519/images19_kcb801.jpg"],
    sku: "ARG-200-11700",
    category: "Perfumes",
    subcategory: "Arrogate"
  },
  {
    name: "فرانكل ايماجنيشن 25 مل",
    description: "فرانكل ايماجنيشن 25 مل",
    price: 39,
    stock: 10,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570869/images01_b7srwo.png"],
    sku: "FKIM-ON-53000"
  },
  {
    name: "المجموعة الخاصة للنساء",
    description: "اروقيت قيرل ومس أروقيت وفيرست نايت + بودرة الجسم",
    price: 195,
    stock: 0,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570870/images03_qvmw9b.png"],
    sku: "PKG-FMG-ON-7500"
  },
  {
    name: "ساعة بيقاسوس بلو + نظارة بيقاسوس 10",
    description: "ساعة بيقاسوس بلو + نظارة بيقاسوس 10",
    price: 199,
    stock: 10,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570869/images02_xqtcpz.png"],
    sku: "PKG-WSG-ON-10012"
  },
  {
    name: "مجموعة الهجوم - اتاكز 150 مل - دينجرس 200 مل",
    description: "مجموعة الهجوم الخطير - تحتوي على عطر اتاكس وعطر دينجرس، تأتي بتقديم مناسب للإهداء",
    price: 199,
    stock: 10,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570872/images05_qlpkuq.png"],
    sku: "PKG-ADA-ON-7700"
  },
  {
    name: "مجموعة فرانكل + ساعة فرانكل",
    description: "مجموعة فرانكل + ساعة فرانكل",
    price: 249,
    stock: 0,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570873/images06_kndjmh.png"],
    sku: "PKG-FR49-ON-5900"
  },
  {
    name: "مجموعة بخور عيد عساف - 340 مل",
    description: "المجموعة البخورية من عساف بمناسبة شهر رمضان، بتقديم مناسب للإهداء",
    price: 197,
    stock: 10,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570874/images07_i2pjwq.png"],
    sku: "PKG-WBRC-ON-56000"
  },
  {
    name: "مجموعة ليدي 6 عطور + بودرة الجسم",
    description: "عرض خاص مجموعة ليدي + بودرة الجسم.. لفترة محدودة",
    price: 259,
    stock: 10,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570877/images10_a317ic.png"],
    sku: "PKG-LDPWA-8200"
  },
  {
    name: "Assaf Powder Set",
    description: "Contains two body powders.. Bloom and Oasis",
    price: 79,
    stock: 0,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570878/images11_zol94r.png"],
    sku: "PKG-PWOB-ON-56000"
  },
  {
    name: "GRIS ERIK 200 ML",
    description: "200ml - Best Seller",
    price: 149,
    stock: 10,
    size: 200,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570879/images12_vc0vwa.jpg"],
    sku: "GRS-200-001100"
  },
  {
    name: "NOBLE",
    description: "200 ml",
    price: 125,
    stock: 10,
    size: 200,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570880/images13_bkawe0.jpg"],
    sku: "NBL-200-ON-02100"
  },
  {
    name: "LADY COLLECTION",
    description: "100 مل كل عطر",
    price: 245,
    stock: 10,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570881/images14_nkdbez.png"],
    sku: "PKG-LDC-ON-0057"
  },
  {
    name: "REBEL ENABLE",
    description: "100 ml",
    price: 125,
    stock: 10,
    size: 150,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570882/images15_ziozxj.jpg"],
    sku: "RBL-150-ON-33000"
  },
  {
    name: "AURA 35",
    description: "150 مل - ٣٥٪",
    price: 125,
    stock: 0,
    size: 150,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570883/images16_ujsmgg.png"],
    sku: "ARA-ON-53000"
  },
  {
    name: "First night",
    description: "100 ml",
    price: 195,
    stock: 10,
    size: 100,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570884/images17_slb9d3.jpg"],
    sku: "FNT-ON-21000"
  },
  {
    name: "LIP STICK 150ML",
    description: "150 مل",
    price: 129,
    stock: 10,
    size: 150,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570884/images18_pxp9tj.jpg"],
    sku: "LPS-ON-19000"
  },
  {
    name: "MUSK ASSAF COLLECTION",
    description: "MUSK ASSAF COLLECTION",
    price: 199,
    stock: 10,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570885/images19_petdc0.jpg"],
    sku: "PKG-MSK-ON-46000"
  },
  {
    name: "Frankel Collection - 6 Perfumes",
    description: "100 مل كل عطر",
    price: 295,
    stock: 0,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570888/images21_wusbff.jpg"],
    sku: "PKG-FRC-ON-0056"
  },
  {
    name: "مجموعة التوباكو",
    description: "عطرين 200 مل ، بتقديم مناسب للإهداء",
    price: 179,
    stock: 0,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570889/images22_uxz2io.png"],
    sku: "PKG-WCN-ON-9400"
  },
  {
    name: "مجموعة ساعة سايبر يلو ونظارة أروقيت 25",
    description: "عرض حصري لأول 100 عميل ، ساعة سايبر يلو ونظارة أروقيت 25 يلو",
    price: 229,
    stock: 0,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570893/images26_uc7atc.png"],
    sku: "PKG-WSG-ON-10014"
  },
  {
    name: "مجموعة ساعة سايبر اورنج و نظارة اروقيت 30",
    description: "عرض حصري لأول 100 عميل فقط، نظارة وساعة في مجموعة واحدة لفترة محدودة",
    price: 229,
    stock: 0,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570894/images27_iazndo.png"],
    sku: "PKG-WSG-ON-10015"
  },
  {
    name: "مجموعة ساعة سايبر اويل ونظارة أروقيت 65",
    description: "عرض حصري لأول 100 عميل فقط، ساعة سايبر أويل ونظارة أروقيت 65",
    price: 229,
    stock: 0,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570895/images28_iqvrm9.png"],
    sku: "PKG-WSG-ON-10016"
  },
  {
    name: "توزيعات عيد عساف",
    description: "مجموعة توزيعات العيد - 8 عطور من مجموعة ليدي النسائية بتقديم مناسب للإهداء",
    price: 199,
    stock: 0,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570894/images24_cqoss8.png"],
    sku: "PKG-SM25-ON-10019"
  },
  {
    name: "ساعة ميدنايت تويست ونظارة أروقيت 30",
    description: "ساعة ميدنايت تويست ونظارة أروقيت 30",
    price: 185,
    stock: 10,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570896/images29_exwbpu.png"],
    sku: "PKG-WSG-ON-10013"
  },
  {
    name: "ساعة سيقنتشر سيلفر + نظارة بيقاسوس 10",
    description: "ساعة سقنتشر وايت + نظارة بيقاسوس 10 في مجموعة وحدة",
    price: 199,
    stock: 10,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570896/images30_l9yp3a.png"],
    sku: "PKG-WSG-ON-10011"
  },
  {
    name: "ساعة فرانكل بلو + نظارة أروقيت 25",
    description: "أقوى عروض رمضان! ساعة ونظارة في مجموعة واحدة",
    price: 199,
    stock: 10,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570906/images32_cvqy4c.png"],
    sku: "PKG-WSG-ON-8900"
  },
  {
    name: "مجموعة الرجل الخاصة",
    description: "عرض حصري - مجموعة الرجل الخاصة، اربع عطور 800 مل + نظارة عساف",
    price: 299,
    stock: 0,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570907/images33_vlqmlp.png"],
    sku: "PKG-GFNFB-ON-7100"
  },
  {
    name: "مجموعة فرانكل + ساعة فرانكل",
    description: "مجموعة فرانكل + ساعة فرانكل",
    price: 229,
    stock: 0,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570909/images35_tkrn20.png"],
    sku: "PKG-FR53-ON-6100"
  },
  {
    name: "مجموعة",
    description: "",
    price: 229,
    stock: 0,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775570909/images34_qshlvr.png"],
    sku: "PKG-FR51-ON-6000"
  },
  {
    name: "مجموعة فرانكل+ ساعة فرانكل",
    description: "مجموعة فرانكل+ ساعة فرانكل",
    price: 229,
    stock: 0,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775571022/images36_pnzse2.png"],
    sku: "PKG-FR52-ON-6200"
  },
  {
    name: "مجموعة فرانكل وخطير",
    description: "عطرين 400 مل",
    price: 199,
    stock: 10,
    category: "Assaf Discounts",
    subcategory: "Assaf Discouns",
    images: ["https://res.cloudinary.com/dysok9nqv/image/upload/v1775571023/images37_bowcf8.png"],
    sku: "PKG-FBE-ON-10027"
  }
];

const normalizeStock = (value) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "out of stock") {
      return 0;
    }

    if (normalized === "in stock") {
      return 10;
    }

    const parsedNumber = Number(normalized);
    if (!Number.isNaN(parsedNumber)) {
      return parsedNumber;
    }
  }

  return 0;
};

const seed = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from config/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });

  console.log(`MongoDB connected to ${mongoose.connection.name}`);

  try {
    const categoriesByName = new Map();
    const subcategoriesByKey = new Map();

    for (const productData of productsData) {
      if (!categoriesByName.has(productData.category)) {
        const category = await Category.findOne({ name: productData.category, isDeleted: false });
        if (!category) {
          throw new Error(`Category not found: ${productData.category}. Seed categories first.`);
        }

        categoriesByName.set(productData.category, category);
      }

      const category = categoriesByName.get(productData.category);
      const subcategoryKey = `${category._id}:${productData.subcategory}`;

      if (!subcategoriesByKey.has(subcategoryKey)) {
        const subcategory = await Subcategory.findOneAndUpdate(
          { name: productData.subcategory, category: category._id },
          {
            $setOnInsert: {
              name: productData.subcategory,
              description: productData.subcategory,
              category: category._id
            }
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        subcategoriesByKey.set(subcategoryKey, subcategory);
      }
    }

    let upsertedCount = 0;

    for (const productData of productsData) {
      const category = categoriesByName.get(productData.category);
      const subcategory = subcategoriesByKey.get(`${category._id}:${productData.subcategory}`);
      const stock = normalizeStock(productData.stock);
      const isDeleted = stock === 0;

      await Product.findOneAndUpdate(
        { sku: productData.sku || productData.name },
        {
          $set: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            stock,
            size: productData.size ?? null,
            category: category._id,
            subcategory: subcategory._id,
            images: productData.images,
            sku: productData.sku,
            isDeleted,
            deletedAt: isDeleted ? new Date() : null,
            autoDeletedAt: isDeleted ? new Date() : null
          }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      upsertedCount += 1;
    }

    console.log(`Products upserted: ${upsertedCount}`);
    console.log("Product seeding completed successfully");
  } finally {
    await mongoose.connection.close();
  }
};

seed().catch((error) => {
  console.error("Product seeding failed");
  console.error(error);
  process.exit(1);
});
