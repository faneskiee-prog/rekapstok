// Form configurations and fields data
const GOOGLE_FORM_BASE_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf_wZY8xrUX31P_G1YcpIHXriRGgfFT-VVr4kyrz-3dNafNkA/viewform";

const META_FIELDS = [
  {
    "id": 1701275633,
    "title": "Tanggal",
    "type": 9
  },
  {
    "id": 468249070,
    "title": "Nama Toko",
    "type": 0
  },
  {
    "id": 440897246,
    "title": "Nama Crew",
    "type": 0
  }
];

const STORES = [
  "Momoyo Sukalarang (Sukabumi)",
  "Momoyo Mangun Jaya Tambun Selatan Bekasi",
  "Momoyo Dukuh Zamrud Bekasi",
  "Momoyo Luwuk Sulawesi"
];

const ITEM_FIELDS = [
  {
    "num": 1,
    "id": 1717727795,
    "title": "1. Fructosa (4jrg/dus)",
    "type": 0,
    "category": "Bahan Baku Cair & Sirup"
  },
  {
    "num": 2,
    "id": 609714904,
    "title": "2. NDC (20kantong/dus)",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 3,
    "id": 431792272,
    "title": "3. Brown Sugar Syrup (12botol/dus)",
    "type": 0,
    "category": "Bahan Baku Cair & Sirup"
  },
  {
    "num": 4,
    "id": 157608077,
    "title": "4. Boba (20kantong/dus)",
    "type": 0,
    "category": "Topping & Cone"
  },
  {
    "num": 5,
    "id": 1806239635,
    "title": "5. Nata De Coco (20 Kantong/dus)",
    "type": 0,
    "category": "Topping & Cone"
  },
  {
    "num": 6,
    "id": 976420477,
    "title": "6. Red Bean (12kaleng/dus)",
    "type": 0,
    "category": "Topping & Cone"
  },
  {
    "num": 7,
    "id": 2123647376,
    "title": "7. Taro (kaleng/dus)",
    "type": 0,
    "category": "Topping & Cone"
  },
  {
    "num": 8,
    "id": 898055818,
    "title": "8. Passion Fruit Jam (12kaleng/dus)",
    "type": 0,
    "category": "Bahan Baku Cair & Sirup"
  },
  {
    "num": 9,
    "id": 1008250126,
    "title": "9. Ice Cream Powder Original(20kantong/dus)",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 10,
    "id": 384010395,
    "title": "10. Icecream Powder Strawberry(20katng/dus)",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 11,
    "id": 1965919223,
    "title": "11. Strawberry Jam (12lkaleng/dus)",
    "type": 0,
    "category": "Bahan Baku Cair & Sirup"
  },
  {
    "num": 12,
    "id": 260480054,
    "title": "12. Manggo Jam (12kaleng/dus)",
    "type": 0,
    "category": "Bahan Baku Cair & Sirup"
  },
  {
    "num": 13,
    "id": 1162240840,
    "title": "13. Santan (20kantong/dus)",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 14,
    "id": 698020171,
    "title": "14. Coklat Saus (12botol/dus)",
    "type": 0,
    "category": "Bahan Baku Cair & Sirup"
  },
  {
    "num": 15,
    "id": 769232501,
    "title": "15. Nectar (4 galon/dus)",
    "type": 0,
    "category": "Bahan Baku Cair & Sirup"
  },
  {
    "num": 16,
    "id": 1022330738,
    "title": "16. Sago",
    "type": 0,
    "category": "Topping & Cone"
  },
  {
    "num": 17,
    "id": 2091315353,
    "title": "17. Ore Crumb (12kg/dus)",
    "type": 0,
    "category": "Topping & Cone"
  },
  {
    "num": 18,
    "id": 1236303883,
    "title": "18. Icecream Powder Macha (20kantong/dus)",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 19,
    "id": 700913108,
    "title": "19. Icecream Powder Coklat (20kantong/dus)",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 20,
    "id": 552236212,
    "title": "20. Red Pamelo (12kaleng/dus)",
    "type": 0,
    "category": "Bahan Baku Cair & Sirup"
  },
  {
    "num": 21,
    "id": 510172418,
    "title": "21. Coffe Bean/Biji Kopi (10kantong/dus)",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 22,
    "id": 1289551776,
    "title": "22. Green Tea (14kantong/dus)",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 23,
    "id": 1700831103,
    "title": "23. Black Tea (14kantong/dus)",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 24,
    "id": 1946427795,
    "title": "24. Cone Icecream (25pcs/kantong, 400pcs/dus)",
    "type": 0,
    "category": "Topping & Cone"
  },
  {
    "num": 25,
    "id": 1925318971,
    "title": "25. Jelly Powder (10kantong/dus)",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 26,
    "id": 1781346733,
    "title": "26. Manggo Fruit Jam (12kaleng/dus)",
    "type": 0,
    "category": "Bahan Baku Cair & Sirup"
  },
  {
    "num": 27,
    "id": 313786140,
    "title": "27. Peach Jam (12kaleng/dus)",
    "type": 0,
    "category": "Bahan Baku Cair & Sirup"
  },
  {
    "num": 28,
    "id": 434740988,
    "title": "28. Cup 420U (1000pcs/dus, 50pcs/kantong)",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 29,
    "id": 667179596,
    "title": "29. Cup 500A (1000pcs/dus, 50pcs/kantong)",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 30,
    "id": 2129638276,
    "title": "30. Cup 700A (1000pcs/dus, 50pcs/kantong",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 31,
    "id": 585637505,
    "title": "31. Cup Jumbo, Fruit Barrel (200pcs/dus, 25pcs/kantong)",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 32,
    "id": 338909308,
    "title": "32. Spherical Lid/tutup sundae (1000pcs/dus, 50pcs/kantong, ada yg 100pcs/kantong)",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 33,
    "id": 790422037,
    "title": "33. Sedotan Besar (5000pcs/dus, 100pcs/kantong)",
    "type": 0,
    "category": "Sedotan, Sendok & Plastik"
  },
  {
    "num": 34,
    "id": 213835835,
    "title": "34. Sedotan Kecil(5000pcs/dus, 100pcs/kantong)",
    "type": 0,
    "category": "Sedotan, Sendok & Plastik"
  },
  {
    "num": 35,
    "id": 746746452,
    "title": "35. Single Cup Bag (6000pcs/dus, 200pcs/ikat)",
    "type": 0,
    "category": "Sedotan, Sendok & Plastik"
  },
  {
    "num": 36,
    "id": 317288664,
    "title": "36. Double Cup Bag (4000pcs/dus, 200pcs/ikat)",
    "type": 0,
    "category": "Sedotan, Sendok & Plastik"
  },
  {
    "num": 37,
    "id": 1827417907,
    "title": "37. Four Cup Bag (3000pcs/dus, 200pcs/ikat)",
    "type": 0,
    "category": "Sedotan, Sendok & Plastik"
  },
  {
    "num": 38,
    "id": 335548551,
    "title": "38. Sundae Spoon, sendok (1000pcs/dus, 50pcs/dus)",
    "type": 0,
    "category": "Sedotan, Sendok & Plastik"
  },
  {
    "num": 39,
    "id": 1421265924,
    "title": "39. Cone Paper Holder/kertas Cone (10.000pcs/dus)",
    "type": 0,
    "category": "Sedotan, Sendok & Plastik"
  },
  {
    "num": 40,
    "id": 1106696600,
    "title": "40. Parafilm/Plastik Seal (6pcs/dus)",
    "type": 0,
    "category": "Sedotan, Sendok & Plastik"
  },
  {
    "num": 41,
    "id": 1372078972,
    "title": "41. Crystal Jelly (16kantong/dus)",
    "type": 0,
    "category": "Topping & Cone"
  },
  {
    "num": 42,
    "id": 1378963644,
    "title": "42. Cup 700 MTB01 (500pcs/dus, 25pcs/kantong)",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 43,
    "id": 2065133940,
    "title": "43. Gula Aren (8jrg/dus)",
    "type": 0,
    "category": "Bahan Baku Cair & Sirup"
  },
  {
    "num": 44,
    "id": 1391237335,
    "title": "44. Egg Powder (20kantong/dus)",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 45,
    "id": 1834820750,
    "title": "45. Pop Corn (4kantong/dus)",
    "type": 0,
    "category": "Topping & Cone"
  },
  {
    "num": 46,
    "id": 427988617,
    "title": "46. French Fries Cup (Cup egg Waffle) (1000pcs/dus, 50pcs/kantong)",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 47,
    "id": 545225970,
    "title": "47. Egg Waffle Cup u ori (500pcs/dus, 50pcs/ikat)",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 48,
    "id": 1637974579,
    "title": "48. Minyak Goreng (18kg/dus)",
    "type": 0,
    "category": "Bahan Baku Cair & Sirup"
  },
  {
    "num": 49,
    "id": 1005160912,
    "title": "49. Blizard Cup/Batik/Yoflip (1000pcs/dus, 50pcs/kantong)",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 50,
    "id": 1559802140,
    "title": "50. tutup Blizard Cup (1000pcs/dus)",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 51,
    "id": 231258309,
    "title": "51. Inner Cup (500cs/dus, 50pcs/kantong)",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 52,
    "id": 322432566,
    "title": "52. Outer Cup (500pcs/dus, 50pcs/kantong",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 53,
    "id": 1491936394,
    "title": "53. tutup Inner Outer Cup (500pcs/dus)",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 54,
    "id": 446597873,
    "title": "54. Tablet Cleaner (100pcs/botol)",
    "type": 0,
    "category": "Kebersihan & Merchandise"
  },
  {
    "num": 55,
    "id": 81993651,
    "title": "55. Serbuk Cleaner Coffe (12pcs/pak)",
    "type": 0,
    "category": "Kebersihan & Merchandise"
  },
  {
    "num": 56,
    "id": 1617041823,
    "title": "56. Puding Powder (20kantong/dus)",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 57,
    "id": 385521896,
    "title": "57. Slap Band, Boneka Tangan (50pcs/dus)",
    "type": 0,
    "category": "Kebersihan & Merchandise"
  },
  {
    "num": 58,
    "id": 383656196,
    "title": "58. Capybarra Bottle (100pcs/dus)",
    "type": 0,
    "category": "Kebersihan & Merchandise"
  },
  {
    "num": 59,
    "id": 576999786,
    "title": "59. Kraft Paper Bag (500pcs/dus)",
    "type": 0,
    "category": "Sedotan, Sendok & Plastik"
  },
  {
    "num": 60,
    "id": 1463159642,
    "title": "60. Scanted Card(500pcs/dus)",
    "type": 0,
    "category": "Kebersihan & Merchandise"
  },
  {
    "num": 61,
    "id": 1718573585,
    "title": "61. Folding Fan (100pcs/dus)",
    "type": 0,
    "category": "Kebersihan & Merchandise"
  },
  {
    "num": 62,
    "id": 897349110,
    "title": "62. Badge Pin (30pcs/dus)",
    "type": 0,
    "category": "Kebersihan & Merchandise"
  },
  {
    "num": 63,
    "id": 1952931843,
    "title": "63. Fabric Bucket Bag/tas kain (200pcs/dus)",
    "type": 0,
    "category": "Sedotan, Sendok & Plastik"
  },
  {
    "num": 64,
    "id": 2023295565,
    "title": "64. Paper Cup A8(baby Yoflip) (1000pcs/dus, 50pcs/kantong)",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 65,
    "id": 131171872,
    "title": "65. Tutup Paper up A8 (1000pcs/dus)",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 66,
    "id": 2062541480,
    "title": "66. Milo Powder (7 kantong/dus)",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 67,
    "id": 1680149157,
    "title": "67. Paper Cup A16 u Milo",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 68,
    "id": 2032324725,
    "title": "68.  Cone Hitam, 400pcs/dus",
    "type": 1,
    "category": "Topping & Cone"
  },
  {
    "num": 69,
    "id": 383076470,
    "title": "69. Macha Powder",
    "type": 0,
    "category": "Bahan Baku Bubuk & Teh"
  },
  {
    "num": 70,
    "id": 2063046414,
    "title": "70. Cup Plastik PET, Macha series",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 71,
    "id": 212048186,
    "title": "71. Lid Cup PET, macha series",
    "type": 0,
    "category": "Gelas & Tutup (Cups & Lids)"
  },
  {
    "num": 72,
    "id": 851097648,
    "title": "72. Thermal Paper Bag 500pcs/dus",
    "type": 0,
    "category": "Sedotan, Sendok & Plastik"
  },
  {
    "num": 73,
    "id": 1869018306,
    "title": "73. Thermal Food Pouch",
    "type": 0,
    "category": "Sedotan, Sendok & Plastik"
  }
];

// Expose definitions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GOOGLE_FORM_BASE_URL, META_FIELDS, STORES, ITEM_FIELDS };
}
