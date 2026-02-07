// js/data.js

// 1. TỶ LỆ RƠI ĐỒ (WEIGHTED CHANCE)
export const LOOT_RATES = {
    COMMON: 70,         
    RARE: 20,       
    EPIC: 8,       
    LEGENDARY: 2    
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
        range: 5, damage: 10, mag: 0, maxMag: 6, cost: 1, accuracy: 0.8, mobility: 4,
        img: 'https://i.ibb.co/FbP0MPNJ/Pistol-Phyton.png',
    },
    USP: { 
        id: 'usp', name: "USP", type: 'WEAPON', rarity: 'COMMON',
        range: 4, damage: 10, mag: 0, maxMag: 12, cost: 1, accuracy: 0.75, mobility: 5,
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
        range: 6, damage: 20, mag: 0, maxMag: 30, cost: 3, accuracy: 0.7, mobility: 4,
        img: 'https://i.ibb.co/LzWZjtvj/Rifle-M4-A1.png',
    },
    AK47: { 
        id: 'ak47', name: "AK-47", type: 'WEAPON', rarity: 'COMMON',
        range: 7, damage: 25, mag: 0, maxMag: 30, cost: 3, accuracy: 0.55, mobility: 3, // Giật mạnh
        img: 'https://i.ibb.co/wNHrY14f/Rifle-AK47.png',
    },
    SCAR: { 
        id: 'scar', name: "SCAR Heavy", type: 'WEAPON', rarity: 'COMMON',
        range: 7, damage: 15, mag: 0, maxMag: 20, cost: 2, accuracy: 0.75, mobility: 3,
        img: 'https://i.ibb.co/5hZ0F5pz/Rifle-SCAR-Heavy.png',
    },
    GALIL: { 
        id: 'galil', name: "Galil ACE", type: 'WEAPON', rarity: 'COMMON',
        range: 6, damage: 20, mag: 0, maxMag: 35, cost: 3, accuracy: 0.65, mobility: 4,
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
        range: 4, damage: 15, mag: 0, maxMag: 30, cost: 2, accuracy: 0.5, mobility: 4, // Rất nhanh
        img: 'https://i.ibb.co/5hSJMddp/SMG-MP5.png',
    },

    // --- MG (Súng máy: Nặng, Đạn nhiều) ---
    GATLING: { 
        id: 'gatling', name: "Gatling Gun", type: 'WEAPON', rarity: 'COMMON',
        range: 5, damage: 15, mag: 0, maxMag: 150, cost: 4, accuracy: 0.4, mobility: 1, // Đi siêu chậm
        img: 'https://i.ibb.co/RpgJDCqJ/GATLINGGUN.png',
    },

    // --- SNIPER ---
    AWM: { 
        id: 'awm', name: "AWM", type: 'WEAPON', rarity: 'COMMON',
        range: 10, damage: 60, mag: 0, maxMag: 5, cost: 2, accuracy: 0.8, mobility: 2,
        img: 'https://i.ibb.co/Lht66xvx/Sniper-AWM.png',
    },

    // --- SHOTGUN ---
    XM1014: { 
        id: 'xm1014', name: "XM1014", type: 'WEAPON', rarity: 'COMMON',
        range: 2, damage: 40, mag: 0, maxMag: 6, cost: 2, accuracy: 0.7, mobility: 4,
        img: 'https://i.ibb.co/20b9c1rC/Shotgun-XM1014.png',
    },

    // --- MELEE ---
    KNIFE: { 
        id: 'knife', id2: 'knife', name: "Knife", type: 'WEAPON', rarity: 'COMMON',
        range: 1, damage: 25, mag: 0, maxMag: 0, cost: 0, accuracy: 0.8, mobility: 5,
        attacksPerTurn: 2, 
        img: 'https://i.ibb.co/931hRGSh/Melee-Knife.png'
    },
    SHOVEL: { 
        id: 'shovel', id2: 'knife', name: "Shovel", type: 'WEAPON', rarity: 'COMMON',
        range: 1, damage: 30, mag: 0, maxMag: 0, cost: 0, accuracy: 0.7, mobility: 4,
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
        range: 7, damage: 25, mag: 0, maxMag: 30, cost: 3, accuracy: 0.55, mobility: 3,
        img: 'https://i.ibb.co/3YhcYhS1/RIFLE-AK-47-Gold.png',
        effects: [ WEAPON_EFFECTS.PIERCE ] // Xuyên giáp mạnh
    },
    M4A1_GOLD: { 
        id: 'm4a1_gold', name: "M4A1-Gold", type: 'WEAPON', rarity: 'RARE',
        range: 6, damage: 20, mag: 0, maxMag: 30, cost: 3, accuracy: 0.7, mobility: 4,
        img: 'https://i.ibb.co/mCc2zFLH/M4-A1-GOLD.png',
        effects: [ WEAPON_EFFECTS.LUCKY ] // Tỉ lệ hồi đạn cao
    },
    GATLING_GOLD: { 
        id: 'gatling_gold', name: "Gatling Gold", type: 'WEAPON', rarity: 'RARE',
        range: 5, damage: 15, mag: 0, maxMag: 150, cost: 4, accuracy: 0.4, mobility: 1,
        img: 'https://i.ibb.co/ZR7w5mZs/MG-Gatling-Gun-Gold.png',
        debuff: { type: 'CRIPPLE', chance: 0.3, duration: 1, val: 0 }
    },
    BARRET_M82A1: { 
        id: 'barret', name: "Barrett M82A1", type: 'WEAPON', rarity: 'RARE',
        range: 12, damage: 90, mag: 0, maxMag: 5, cost: 3, accuracy: 0.85, mobility: 1, // Bắn tốn 2 đạn/lượt
        img: 'https://i.ibb.co/nskm1K5b/BARRETT-M82-A1.png',
        effects: [ WEAPON_EFFECTS.WALLBANG ]
    },
    HUNTING_KNIFE: { 
        id: 'hunting_knife', id2: 'knife', name: "Hunting Knife", type: 'WEAPON', rarity: 'RARE',
        range: 1, damage: 25, mag: 0, maxMag: 0, cost: 0, accuracy: 0.9, mobility: 5,
        attacksPerTurn: 2,
        img: 'https://i.ibb.co/XZQRbF5H/Melee-Hunting-Knife.png',
        debuff: { type: 'BLEED', chance: 1.0, duration: 3, val: 3 } // Chém là chảy máu
    },

    // ================= EPIC (Vũ khí Vip/Beast - Hiệu ứng mạnh, tốn kém) =================

    SCAR_RED: { 
        id: 'scar_red', name: "SCAR Red Dragon", type: 'WEAPON', rarity: 'EPIC',
        range: 8, damage: 15, mag: 0, maxMag: 20, cost: 2, accuracy: 0.75, mobility: 3,
        img: 'https://i.ibb.co/VWL4Gk6Q/SCAR-HEAVY-RED-DRAGON-BI.png', 
        debuff: { type: 'PANIC', chance: 0.3, duration: 2, val: 3 } // Tầm bắn xa hơn
    },
    BARRET_BORN: { 
        id: 'barret_born', name: "Barrett Born Beast", type: 'WEAPON', rarity: 'EPIC',
        range: 12, damage: 120, mag: 0, maxMag: 5, cost: 3, accuracy: 0.8, mobility: 1, // One shot one kill nhưng tốn 3 đạn
        img: 'https://i.ibb.co/b5kd9Lj6/Sniper-Barrett-M82-A1-Born-Beast.png',
        effects: [ WEAPON_EFFECTS.WALLBANG ]
    },
    KUKRI_TRANS: { 
        id: 'Kukri_Trans', id2: 'knife', name: "Kukri Transformer", type: 'WEAPON', rarity: 'EPIC',
        range: 1, damage: 40, mag: 0, maxMag: 0, cost: 0, accuracy: 0.6, mobility: 5,
        attacksPerTurn: 1,
        img: 'https://i.ibb.co/1yjdtqJ/KUKRI-TRANS-2.png',
        effects: [ WEAPON_EFFECTS.DASH ] // Kích hoạt lướt tới chém
    },
    RPK_RUSSIA: { 
        id: 'rpk_russia', name: "RPK Russia", type: 'WEAPON', rarity: 'EPIC',
        range: 6, damage: 15, mag: 0, maxMag: 100, cost: 5, accuracy: 0.6, mobility: 2,
        img: 'https://i.ibb.co/vCyTNVjW/MG-RPK-Russia.png',
        effects: [ WEAPON_EFFECTS.LIFESTEAL ] // Bắn hồi máu
    },

    // ================= LEGENDARY (Vũ khí tối thượng - Game Breaker nhưng khó nuôi) =================

    M4A1_PRISM: { 
        id: 'm4a1_prism', name: "M4A1-S Prism", type: 'WEAPON', rarity: 'LEGENDARY',
        range: 6, damage: 25, mag: 0, maxMag: 30, cost: 3, accuracy: 0.8, mobility: 4,
        img: 'https://i.ibb.co/fdyWY5p5/M4-A1-S-Prism-Beast-Noble-Gold.png',
        effects: [ WEAPON_EFFECTS.TELEPORT ] // Kích hoạt: Dịch chuyển tức thời!
    },
    BARRET_IRON: { 
        id: 'barret_iron', name: "Barrett Iron Shark", type: 'WEAPON', rarity: 'LEGENDARY',
        range: 12, damage: 150, mag: 0, maxMag: 5, cost: 5, accuracy: 0.9, mobility: 1, // Không thể di chuyển!
        img: 'https://i.ibb.co/k2PtVHVy/M82-A1-Iron-Shark-Noble-Gold.png',
        effects: [ WEAPON_EFFECTS.TELEPORT ]
    },

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
        valType: 'armor', val: 100, desc: "Tăng 100 Giáp", 
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
        val: 50, // Giá trị 
        isPercent: true, // <--- Kích hoạt tính theo %
        desc: "Hồi 50% băng đạn tối đa", 
        img: 'https://i.ibb.co/hJZYtZcg/Th-ng-n.png', // Dùng tạm ảnh hòm hoặc ảnh khác
        rarity: 'RARE' // Đồ hiếm hơn
    },
    FRAG_GRENADE: {
        id: 'frag_grenade', name: "Lựu Đạn Nổ", type: 'THROWABLE', category: 'AMMO',
        throwRange: 4, aoeRadius: 1.8, damage: 35, accuracy: 0.85,    
        explosionColor: 'rgba(231, 76, 60, 0.6)',
        desc: "Nổ gây 35 dmg", img: 'https://i.ibb.co/xKBRTt5h/THROWN-Grenade.png', rarity: 'EPIC',
    },
    BUG_GRENADE: {
        id: 'bug_grenade', name: "Lựu Đạn Côn Trùng", type: 'THROWABLE', category: 'AMMO',
        throwRange: 4, aoeRadius: 1.8, damage: 5, accuracy: 0.85,    
        explosionColor: 'rgba(5, 63, 38, 0.6)',
        desc: "Gây hoảng loạn", img: 'https://i.ibb.co/TxD3SbkH/BI-Grenade-Animal.png', rarity: 'EPIC',
        debuff: { type: 'PANIC', chance: 1.0, duration: 2, val: 5 } 
    },
    BIO_GRENADE: {
        id: 'bio_grenade', name: "Lựu Đạn Sinh Học", type: 'THROWABLE', category: 'AMMO',
        throwRange: 4, aoeRadius: 1.8, damage: 5, accuracy: 0.85,    
        explosionColor: 'rgba(10, 198, 116, 0.6)',
        desc: "Gây trúng độc", img: 'https://i.ibb.co/wNZ4W8s7/NANOGRENADE.png', rarity: 'EPIC',
        debuff: { type: 'POISON', chance: 1.0, duration: 2, val: 5 } 
    },
    BLIND_GRENADE: {
        id: 'blind_grenade', name: "Lựu Đạn Bạc", type: 'THROWABLE', category: 'AMMO',
        throwRange: 4, aoeRadius: 1.8, damage: 5, accuracy: 0.85,    
        explosionColor: 'rgba(92, 156, 220, 0.6)',
        desc: "Gây mù", img: 'https://i.ibb.co/G340Fv1j/GRENADE-TH-BI.png', rarity: 'EPIC',
        debuff: { type: 'BLIND', chance: 1.0, duration: 2, val: 5 } 
    },
    RED_GRENADE: {
        id: 'red_grenade', name: "Lựu Đạn Sao Đỏ", type: 'THROWABLE', category: 'AMMO',
        throwRange: 4, aoeRadius: 1.8, damage: 5, accuracy: 0.85,    
        explosionColor: 'rgba(207, 12, 12, 0.6)',
        desc: "Gây hoảng loạn", img: 'https://i.ibb.co/5XTCwvsV/BI-Grenade-GSRF.png', rarity: 'EPIC',
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

export const MAP_CONFIG = {
    'training': { // Map Khu Huấn Luyện
        // Giới hạn số lượng quái xuất hiện cùng lúc trên màn hình
        // Nếu bạn muốn cả 7 con (5 quái + 2 boss) ra cùng lúc thì chỉnh số này lên 7 hoặc 8
        max_on_map: 6, 
        
        waves: [
            // --- ĐỢT 1: Quái ít và yếu ---
            { 
                id: 1, 
                enemies: [
                    { type: 'ZOMBIE', count: 4 },          // 5 con Zombie
                    { type: 'SPRINTER', count: 2 }    // 2 con Boss
                ] 
            }, 

            // --- ĐỢT 2: Quái nhiều và nguy hiểm ---
            { 
                id: 2, 
                enemies: [
                    { type: 'ZOMBIE', count: 6 },
                    { type: 'SPRINTER', count: 4 }
                ] 
            }, 

            // --- ĐỢT 3 (Cuối): 1 Siêu Boss + rất nhiều quái con ---
            { 
                id: 3, 
                enemies: [
                    { type: 'ZOMBIE', count: 6 },
                    { type: 'SPRINTER', count: 6 },
                    { type: 'BOSS_TRAINING', count: 1 }
                ] 
            } 
        ]
    },

    'abyss': { // Map Vực Tử Thần (Cấu hình tương tự)
        max_on_map: 5,
        waves: [
            { id: 1, enemies: [{ type: 'ASSASSIN', count: 3 }] },
            { id: 2, enemies: [{ type: 'ASSASSIN', count: 5 }, { type: 'BOSS_ABYSS', count: 1 }] }
        ]
    }
};

// 2. CẬP NHẬT THÔNG SỐ QUÁI (THÊM LOOT TABLE)
// type: 'ITEM' (lấy từ ITEMS) hoặc 'WEAPON' (lấy từ WEAPONS người chơi)
export const ENEMIES = {
    // --- MAP 1 ---
    ZOMBIE: { 
        name: "Zombie", hp: 40, enemy_weapon: 'ZOMBIE_HAND', avatar: 'https://i.ibb.co/qMqWBsP8/317-3179252-undead-crossfire.png',
        // Tỉ lệ rơi đồ: 30% ra máu, 5% ra súng lục
        loot_table: [
            { code: 'MEDKIT', type: 'ITEM', chance: 0.3 },
            { code: 'USP', type: 'WEAPON', chance: 0.05 } 
        ]
    },
    SPRINTER: { 
        name: "Zombie Phóng Xạ", hp: 40, enemy_weapon: 'ZOMBIE_HAND2', avatar: 'https://i.ibb.co/C3gF6N29/Sprinter.png',
        // Tỉ lệ rơi đồ: 30% ra máu, 5% ra súng lục
        loot_table: [
            { code: 'MEDKIT', type: 'ITEM', chance: 0.3 },
            { code: 'USP', type: 'WEAPON', chance: 0.05 } 
        ]
    },
    BOSS_TRAINING: { 
        name: "BIẾN THỂ X", hp: 300, enemy_weapon: 'BOSS_HAMMER', avatar: 'https://i.ibb.co/jZwwPTWL/Goliath.png',
        loot_table: [
            { code: 'KEVLAR', type: 'ITEM', chance: 1.0 }, // 100% rơi giáp
            { code: 'AK47', type: 'WEAPON', chance: 0.5 }   // 50% rơi AK47
        ]
    },
    
    // --- MAP 2 ---
    ASSASSIN: { 
        name: "Sát Thủ", hp: 30, enemy_weapon: 'ASSASSIN_DAGGER', avatar: 'https://i.ibb.co/vz4rn3k/assassin.png',
        loot_table: [
            { code: 'GRENADE', type: 'ITEM', chance: 0.25 },
            { code: 'MP5', type: 'WEAPON', chance: 0.1 }
        ]
    },
    BOSS_ABYSS: { 
        name: "TỬ THẦN", hp: 250, enemy_weapon: 'BOSS_SNIPER', avatar: 'https://i.ibb.co/5XHMNbd/Minigun.png',
        loot_table: [
            { code: 'AWP', type: 'WEAPON', chance: 1.0 } // Boss xịn rơi AWP
        ]
    }
};

// 2. VŨ KHÍ CỦA QUÁI & BOSS (RIÊNG BIỆT - KHÔNG RƠI RA)
export const ENEMY_WEAPONS = {
    // -- MAP 1 --
    ZOMBIE_HAND: { 
        id: 'zombie_hand', name: "Cào Cấu", range: 1, damage: 15, 
        mobility: 3, accuracy: 0.8, mag: 999, cost: 0, img: 'https://i.ibb.co/YF78HTSm/OMOH-BL-zombie-vukhi.png' 
    },
    ZOMBIE_HAND2: { 
        id: 'zombie_hand2', name: "Cào Cấu", range: 1, damage: 25, 
        mobility: 5, accuracy: 0.8, mag: 999, cost: 0, img: 'https://i.ibb.co/YF78HTSm/OMOH-BL-zombie-vukhi.png',
        debuff: { type: 'BLEED', chance: 0.3, duration: 2, val: 3 } 
    },
    BOSS_HAMMER: { 
        id: 'boss_hammer', name: "BÚA TẠ", range: 2, damage: 35, 
        mobility: 4, accuracy: 0.9, mag: 999, cost: 0, img: 'https://i.ibb.co/fGpMt3KC/Goliath-vukhi.png', rarity: 'LEGENDARY',
        debuff: { type: 'CRIPPLE', chance: 1.0, duration: 3 } 
    },

    // -- MAP 2 --
    ASSASSIN_DAGGER: { 
        id: 'assassin_dagger', name: "Dao Độc", range: 1, damage: 20, 
        mobility: 5, accuracy: 0.95, mag: 999, cost: 0, img: '' 
    },
    BOSS_SNIPER: { 
        id: 'boss_sniper', name: "TỬ THẦN", range: 8, damage: 40, 
        mobility: 4, accuracy: 1.0, mag: 999, cost: 0, rarity: 'LEGENDARY',
        effects: [{ code: 'WALLBANG', name: 'Xuyên Tường' }]
    }
};