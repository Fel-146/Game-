// js/data.js

// 1. TỶ LỆ RƠI ĐỒ (WEIGHTED CHANCE)
export const LOOT_RATES = {
    COMMON: 40,         
    RARE: 30,       
    EPIC: 20,       
    LEGENDARY: 10    
};

// 2. HIỆU ỨNG VŨ KHÍ
export const WEAPON_EFFECTS = {
    DIAGONAL:   { code: 'DIAGONAL', name: 'Bắn Chéo', desc: 'Có thể tấn công theo đường chéo' },
    WALLBANG:   { code: 'WALLBANG', name: 'Xuyên Tường', desc: 'Bắn xuyên qua vật cản' },
    PIERCE:     { code: 'PIERCE', name: 'Xuyên Giáp', desc: '30% Bỏ qua giáp đối phương' },
    CRIT:       { code: 'CRIT', name: 'Chí Mạng', desc: '30% Gây gấp đôi sát thương' },
    LIFESTEAL:  { code: 'LIFESTEAL', name: 'Hấp Huyết', desc: 'Hồi 30% sát thương gây ra thành HP' },
    KNOCKBACK:  { code: 'KNOCKBACK', name: 'Đẩy Lùi', desc: '30% Đẩy lùi kẻ địch 1 ô' },
    LUCKY:      { code: 'LUCKY', name: 'May Mắn', desc: '30% Hồi 1 viên đạn khi bắn trúng' },
    BLAST_RESIST:{ code: 'BLAST_RESIST', name: 'Bất Khuất', desc: 'Giảm 50% sát thương nổ' },
    
    TELEPORT:   { code: 'TELEPORT', name: 'Dịch Chuyển', desc: 'Kích hoạt: Bay đến ô ngẫu nhiên', isActive: true },
    DASH:       { code: 'DASH', name: 'Lướt', desc: 'Kích hoạt: Lướt nhanh 4 ô', isActive: true }
};

// 3. DEBUFF
export const DEBUFFS = {
    STUN:    { id: 'STUN', name: 'Choáng', desc: 'Mất lượt hành động' },
    BLIND:   { id: 'BLIND', name: 'Mù', desc: 'Giảm 20% chính xác' },
    CRIPPLE: { id: 'CRIPPLE', name: 'Thương Tật', desc: 'Giảm 2 ô di chuyển' },
    BLEED:   { id: 'BLEED', name: 'Chảy Máu', desc: 'Mất máu mỗi đầu lượt' },
    POISON:  { id: 'POISON', name: 'Trúng Độc', desc: 'Không thể hồi máu' },
    PANIC:   { id: 'PANIC', name: 'Hoảng Loạn', desc: 'Không thể nạp đạn' }
};

// 4. DANH SÁCH VŨ KHÍ
export const WEAPONS = {
    // ================= COMMON (Cơ bản, Dễ dùng, Nhẹ) =================

    // --- PISTOL ---
    GLOCK18: { 
        id: 'glock18', name: "Glock 18C", type: 'WEAPON', rarity: 'COMMON',
        range: 4, damage: 20, mag: 0, maxMag: 20, cost: 3, accuracy: 0.7, mobility: 5, // Bắn nhanh, đi nhanh
        img: 'https://i.ibb.co/Pv1f5GVL/BAG-Glock18-C.png',
    },
    PYTHON: { 
        id: 'python', name: "Colt Python", type: 'WEAPON', rarity: 'COMMON',
        range: 5, damage: 10, mag: 0, maxMag: 6, cost: 1, accuracy: 0.9, mobility: 4,
        img: 'https://i.ibb.co/FbP0MPNJ/Pistol-Phyton.png',
    },
    USP: { 
        id: 'usp', name: "USP", type: 'WEAPON', rarity: 'COMMON',
        range: 4, damage: 10, mag: 0, maxMag: 12, cost: 1, accuracy: 0.85, mobility: 5,
        img: 'https://i.ibb.co/ynJhGh1X/Pistol-USP.png',
    },
    DEAGLE: { 
        id: 'deagle', name: "Desert Eagle", type: 'WEAPON', rarity: 'COMMON',
        range: 5, damage: 25, mag: 0, maxMag: 7, cost: 2, accuracy: 0.6, mobility: 3, // Nặng tay
        img: 'https://i.ibb.co/x82cz205/Pistol-Desert-Eagle.png',
    },

    // --- RIFLE ---
    M4A1: { 
        id: 'm4a1', name: "M4A1", type: 'WEAPON', rarity: 'COMMON',
        range: 6, damage: 20, mag: 0, maxMag: 30, cost: 3, accuracy: 0.8, mobility: 4,
        img: 'https://i.ibb.co/LzWZjtvj/Rifle-M4-A1.png',
    },
    AK47: { 
        id: 'ak47', name: "AK-47", type: 'WEAPON', rarity: 'COMMON',
        range: 7, damage: 25, mag: 0, maxMag: 30, cost: 3, accuracy: 0.65, mobility: 3, // Giật mạnh
        img: 'https://i.ibb.co/wNHrY14f/Rifle-AK47.png',
    },
    SCAR: { 
        id: 'scar', name: "SCAR Heavy", type: 'WEAPON', rarity: 'COMMON',
        range: 7, damage: 15, mag: 0, maxMag: 20, cost: 2, accuracy: 0.85, mobility: 3,
        img: 'https://i.ibb.co/5hZ0F5pz/Rifle-SCAR-Heavy.png',
    },
    GALIL: { 
        id: 'galil', name: "Galil ACE", type: 'WEAPON', rarity: 'COMMON',
        range: 6, damage: 20, mag: 0, maxMag: 35, cost: 3, accuracy: 0.75, mobility: 4,
        img: 'https://i.ibb.co/Sw16X2Gz/Galil-ACE.png',
    },

    // --- SMG (Tầm gần, đi nhanh) ---
    THOMPSON: { 
        id: 'thompson', name: "Thompson", type: 'WEAPON', rarity: 'COMMON',
        range: 3, damage: 20, mag: 0, maxMag: 60, cost: 3, accuracy: 0.6, mobility: 4,
        img: 'https://i.ibb.co/FqmFbGv6/THOMPSON-BI.png',
    },
    MP5: { 
        id: 'mp5', name: "MP5", type: 'WEAPON', rarity: 'COMMON',
        range: 4, damage: 15, mag: 0, maxMag: 30, cost: 2, accuracy: 0.7, mobility: 4, // Rất nhanh
        img: 'https://i.ibb.co/5hSJMddp/SMG-MP5.png',
    },

    // --- MG (Súng máy: Nặng, Đạn nhiều) ---
    GATLING: { 
        id: 'gatling', name: "Gatling Gun", type: 'WEAPON', rarity: 'COMMON',
        range: 5, damage: 15, mag: 0, maxMag: 150, cost: 4, accuracy: 0.5, mobility: 1, // Đi siêu chậm
        img: 'https://i.ibb.co/RpgJDCqJ/GATLINGGUN.png',
    },

    // --- SNIPER ---
    AWM: { 
        id: 'awm', name: "AWM", type: 'WEAPON', rarity: 'COMMON',
        range: 10, damage: 60, mag: 0, maxMag: 5, cost: 2, accuracy: 0.9, mobility: 2,
        img: 'https://i.ibb.co/Lht66xvx/Sniper-AWM.png',
    },

    // --- SHOTGUN ---
    XM1014: { 
        id: 'xm1014', name: "XM1014", type: 'WEAPON', rarity: 'COMMON',
        range: 2, damage: 40, mag: 0, maxMag: 6, cost: 2, accuracy: 0.8, mobility: 4,
        img: 'https://i.ibb.co/20b9c1rC/Shotgun-XM1014.png',
    },

    // --- MELEE ---
    KNIFE: { 
        id: 'knife', id2: 'knife', name: "Knife", type: 'WEAPON', rarity: 'COMMON',
        range: 1, damage: 25, mag: 0, maxMag: 0, cost: 0, accuracy: 1.0, mobility: 5,
        attacksPerTurn: 2, 
        img: 'https://i.ibb.co/931hRGSh/Melee-Knife.png'
    },
    SHOVEL: { 
        id: 'shovel', id2: 'knife', name: "Shovel", type: 'WEAPON', rarity: 'COMMON',
        range: 1, damage: 30, mag: 0, maxMag: 0, cost: 0, accuracy: 0.9, mobility: 4,
        attacksPerTurn: 1, img: 'https://i.ibb.co/DPLBZn1r/SHOVEL-BI.png',
        effects: [ WEAPON_EFFECTS.KNOCKBACK ]
    },

    // ================= RARE (Tốt hơn, bắt đầu có hiệu ứng lạ) =================

    DE_GOLD: { 
        id: 'de_gold', name: "DE-Gold", type: 'WEAPON', rarity: 'RARE',
        range: 5, damage: 25, mag: 0, maxMag: 7, cost: 2, accuracy: 0.6, mobility: 3,
        img: 'https://i.ibb.co/jPJdw0d5/DE-GOLD.png',
        effects: [ WEAPON_EFFECTS.CRIT ] // Dễ chí mạng hơn thường
    },
    AK47_GOLD: { 
        id: 'ak47_gold', name: "AK-47 Gold", type: 'WEAPON', rarity: 'RARE',
        range: 7, damage: 25, mag: 0, maxMag: 30, cost: 3, accuracy: 0.65, mobility: 3,
        img: 'https://i.ibb.co/3YhcYhS1/RIFLE-AK-47-Gold.png',
        effects: [ WEAPON_EFFECTS.PIERCE ] // Xuyên giáp mạnh
    },
    M4A1_GOLD: { 
        id: 'm4a1_gold', name: "M4A1-Gold", type: 'WEAPON', rarity: 'RARE',
        range: 6, damage: 20, mag: 0, maxMag: 30, cost: 3, accuracy: 0.8, mobility: 4,
        img: 'https://i.ibb.co/mCc2zFLH/M4-A1-GOLD.png',
        effects: [ WEAPON_EFFECTS.LUCKY ] // Tỉ lệ hồi đạn cao
    },
    GATLING_GOLD: { 
        id: 'gatling_gold', name: "Gatling Gold", type: 'WEAPON', rarity: 'RARE',
        range: 5, damage: 15, mag: 0, maxMag: 150, cost: 4, accuracy: 0.5, mobility: 1,
        img: 'https://i.ibb.co/ZR7w5mZs/MG-Gatling-Gun-Gold.png',
        debuff: { type: 'CRIPPLE', chance: 0.3, duration: 1, val: 0 }
    },
    BARRET_M82A1: { 
        id: 'barret', name: "Barrett M82A1", type: 'WEAPON', rarity: 'RARE',
        range: 12, damage: 90, mag: 0, maxMag: 5, cost: 3, accuracy: 0.95, mobility: 1, // Bắn tốn 2 đạn/lượt
        img: 'https://i.ibb.co/nskm1K5b/BARRETT-M82-A1.png',
        effects: [ WEAPON_EFFECTS.WALLBANG ]
    },
    HUNTING_KNIFE: { 
        id: 'hunting_knife', id2: 'knife', name: "Hunting Knife", type: 'WEAPON', rarity: 'RARE',
        range: 1, damage: 25, mag: 0, maxMag: 0, cost: 0, accuracy: 1.0, mobility: 5,
        attacksPerTurn: 2,
        img: 'https://i.ibb.co/XZQRbF5H/Melee-Hunting-Knife.png',
        debuff: { type: 'BLEED', chance: 1.0, duration: 3, val: 3 } // Chém là chảy máu
    },

    // ================= EPIC (Vũ khí Vip/Beast - Hiệu ứng mạnh, tốn kém) =================

    SCAR_RED: { 
        id: 'scar_red', name: "SCAR Red Dragon", type: 'WEAPON', rarity: 'EPIC',
        range: 8, damage: 15, mag: 0, maxMag: 20, cost: 2, accuracy: 0.85, mobility: 3,
        img: 'https://i.ibb.co/VWL4Gk6Q/SCAR-HEAVY-RED-DRAGON-BI.png', 
        debuff: { type: 'PANIC', chance: 0.3, duration: 2, val: 3 } // Tầm bắn xa hơn
    },
    BARRET_BORN: { 
        id: 'barret_born', name: "Barrett Born Beast", type: 'WEAPON', rarity: 'EPIC',
        range: 12, damage: 120, mag: 0, maxMag: 5, cost: 3, accuracy: 0.9, mobility: 1, // One shot one kill nhưng tốn 3 đạn
        img: 'https://i.ibb.co/b5kd9Lj6/Sniper-Barrett-M82-A1-Born-Beast.png',
        effects: [ WEAPON_EFFECTS.WALLBANG ]
    },
    KUKRI_TRANS: { 
        id: 'Kukri_Trans', id2: 'knife', name: "Kukri Transformer", type: 'WEAPON', rarity: 'EPIC',
        range: 1, damage: 40, mag: 0, maxMag: 0, cost: 0, accuracy: 0.7, mobility: 5,
        attacksPerTurn: 1,
        img: 'https://i.ibb.co/1yjdtqJ/KUKRI-TRANS-2.png',
        effects: [ WEAPON_EFFECTS.DASH ] // Kích hoạt lướt tới chém
    },
    RPK_RUSSIA: { 
        id: 'rpk_russia', name: "RPK Russia", type: 'WEAPON', rarity: 'EPIC',
        range: 6, damage: 15, mag: 0, maxMag: 100, cost: 5, accuracy: 0.7, mobility: 2,
        img: 'https://i.ibb.co/vCyTNVjW/MG-RPK-Russia.png',
        effects: [ WEAPON_EFFECTS.LIFESTEAL ] // Bắn hồi máu
    },

    // ================= LEGENDARY (Vũ khí tối thượng - Game Breaker nhưng khó nuôi) =================

    M4A1_PRISM: { 
        id: 'm4a1_prism', name: "M4A1-S Prism", type: 'WEAPON', rarity: 'LEGENDARY',
        range: 6, damage: 25, mag: 0, maxMag: 30, cost: 3, accuracy: 0.9, mobility: 4,
        img: 'https://i.ibb.co/fdyWY5p5/M4-A1-S-Prism-Beast-Noble-Gold.png',
        effects: [ WEAPON_EFFECTS.TELEPORT ] // Kích hoạt: Dịch chuyển tức thời!
    },
    BARRET_IRON: { 
        id: 'barret_iron', name: "Barrett Iron Shark", type: 'WEAPON', rarity: 'LEGENDARY',
        range: 12, damage: 150, mag: 0, maxMag: 5, cost: 5, accuracy: 1.0, mobility: 1, // Không thể di chuyển!
        img: 'https://i.ibb.co/k2PtVHVy/M82-A1-Iron-Shark-Noble-Gold.png',
        effects: [ WEAPON_EFFECTS.TELEPORT ]
    }
};

// 5. DANH SÁCH VẬT PHẨM (ĐÃ PHÂN LOẠI CATEGORY)
export const ITEMS = {
    // --- NHU YẾU PHẨM (SUPPLY) ---
    BANDAGE: { 
        id: 'bandage', name: "Băng gạc", type: 'CONSUMABLE', category: 'SUPPLY',
        valType: 'heal', val: 50, desc: "Hồi 50 HP", 
        img: 'https://i.ibb.co/GfFr2Hyv/bandage.png', rarity: 'COMMON'
    },
    MEDKIT: { 
        id: 'medkit', name: "Túi Cứu Thương", type: 'CONSUMABLE', category: 'SUPPLY',
        valType: 'heal', val: 50, desc: "Hồi 100 HP", 
        img: 'https://i.ibb.co/dNMWJ54/first-aid-kit.png', rarity: 'RARE'
    },
    FULLHEAL: {
        id: 'fullheal_cleanse', name: "Kháng Sinh", type: 'CONSUMABLE', category: 'SUPPLY',
        valType: 'CLEANSE', desc: "Hóa giải mọi hiệu ứng xấu", 
        img: 'https://i.ibb.co/9kQWXL9H/1fc34f7d5e5d4c8c0df1d12d619fb306.png', rarity: 'RARE'
    },
    KEVLAR: { 
        id: 'kevlar', name: "Giáp Chống Đạn", type: 'CONSUMABLE', category: 'SUPPLY',
        valType: 'armor', val: 50, desc: "Tăng 50 Giáp", 
        img: 'https://i.ibb.co/6ccj2FrC/pngwing-com-1.png', rarity: 'RARE'
    },
    ELITE_ARMOR: { 
        id: 'Elite_Amor', name: "Giáp Tinh Nhuệ", type: 'CONSUMABLE', category: 'SUPPLY',
        valType: 'armor', val: 50, desc: "Tăng 50 Giáp", 
        img: 'https://i.ibb.co/r2203MGT/pngwing-com.png', rarity: 'EPIC'
    },

    // --- ĐẠN DƯỢC & LỰU ĐẠN (AMMO) ---
    AMMO_PACK: { 
        id: 'ammo_pack', name: "Túi Đạn Nhỏ", type: 'CONSUMABLE', category: 'AMMO',
        valType: 'ammo', val: 30, isPercent: true, desc: "Hồi 30% đạn", 
        img: 'https://i.ibb.co/W4WQDQSK/danduoc.png', rarity: 'COMMON'
    },
    AMMO_BOX: { 
        id: 'ammo_box', name: "Thùng đạn", type: 'CONSUMABLE', category: 'AMMO',
        valType: 'ammo', 
        val: 70, // Giá trị 
        isPercent: true, // <--- Kích hoạt tính theo %
        desc: "Hồi 70% băng đạn tối đa", 
        img: 'https://i.ibb.co/hJZYtZcg/Th-ng-n.png', // Dùng tạm ảnh hòm hoặc ảnh khác
        rarity: 'RARE' // Đồ hiếm hơn
    },
    FRAG_GRENADE: {
        id: 'frag_grenade', name: "Lựu Đạn Nổ", type: 'THROWABLE', category: 'AMMO',
        throwRange: 4, aoeRadius: 1.8, damage: 35, accuracy: 0.85,    
        explosionColor: 'rgba(231, 76, 60, 0.6)',
        desc: "Nổ gây 35 dmg + Chảy máu", img: 'https://i.ibb.co/xKBRTt5h/THROWN-Grenade.png', rarity: 'EPIC',
        debuff: { type: 'BLEED', chance: 1.0, duration: 2, val: 5 } 
    },
    FLASHBANG: {
        id: 'flashbang', name: "Bom Choáng", type: 'THROWABLE', category: 'AMMO',
        throwRange: 4, aoeRadius: 2.2, damage: 0, accuracy: 0.9,
        explosionColor: 'rgba(255, 255, 255, 0.8)',
        desc: "Gây Choáng diện rộng", img: 'https://i.ibb.co/7xSzwH7v/THROWN-Flashbang.png', rarity: 'EPIC',
        debuff: { type: 'STUN', chance: 1.0, duration: 1 }
    },

    // --- CÁC LOẠI HÒM ---
    CRATE_WEAPON: { id: 'crate_weapon', name: "Hòm Vũ Khí", type: 'INTERACT', img: 'https://i.ibb.co/RG4yWZ05/ITEM-MXC-Crate1.png' },
    CRATE_AMMO:   { id: 'crate_ammo', name: "Hòm Đạn Dược", type: 'INTERACT', img: 'https://i.ibb.co/ymmpNJM4/ITEM-MXC-Crate.png' },
    CRATE_SUPPLY: { id: 'crate_supply', name: "Hòm Nhu Yếu Phẩm", type: 'INTERACT', img: 'https://i.ibb.co/9HfhTP6G/ITEM-MXC-Crate2.png' }
};