// js/Player.js
import { WEAPONS, ITEMS, DEBUFFS, LOOT_RATES } from './data.js';

export class Player {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.avatar = '';
        
        // Chỉ số
        this.maxHp = 100;    
        this.hp = 100;
        this.maxArmor = 100;  
        this.armor = 0; 
        
        // Khởi đầu
        this.weapon = { ...WEAPONS.USP }; 
        //this.weapon.mag = this.weapon.maxMag; 
        this.mobility = this.weapon.mobility;

        this.maxInventorySize = 6;
        this.inventory = [ { ...ITEMS.MEDKIT}, {...ITEMS.KEVLAR } ]; // Tặng 1 bình máu khởi đầu
        
        this.x = 0; this.y = 0;
        this.hasMoved = false;
        this.hasAttacked = false;
        this.isAlive = true;
        this.meleeAttacksLeft = 0;
        this.activeEffects = []; 
        this.resetTurn(); 
    }

    // --- LOGIC MỞ HÒM THÔNG MINH ---
    openCrate(crateId) {
        if (this.inventory.length >= this.maxInventorySize) {
            return { success: false, msg: "Túi đầy!" };
        }

        let possibleLoot = [];

        // 1. Lọc danh sách vật phẩm khả thi
        if (crateId === 'crate_weapon') {
            possibleLoot = Object.values(WEAPONS);
        } 
        else if (crateId === 'crate_ammo') {
            possibleLoot = Object.values(ITEMS).filter(i => i.category === 'AMMO');
        } 
        else if (crateId === 'crate_supply') {
            possibleLoot = Object.values(ITEMS).filter(i => i.category === 'SUPPLY');
        }

        if (possibleLoot.length === 0) return { success: false, msg: "Hòm rỗng!" };

        // 2. Quay xổ số dựa trên phẩm chất
        const selectedItem = this.pickItemByRarity(possibleLoot);

        // 3. Thêm vào túi
        const newItem = { ...selectedItem };
        if (newItem.type === 'WEAPON') {
            newItem.mag = 0; // Ép súng vừa nhặt luôn có 0 viên đạn
        }
        this.inventory.push(newItem);

        return { success: true, loot: newItem };
    }

    pickItemByRarity(pool) {
        let totalWeight = 0;
        const weightedPool = pool.map(item => {
            const weight = LOOT_RATES[item.rarity] || 10;
            totalWeight += weight;
            return { item, weight };
        });

        let randomNum = Math.random() * totalWeight;
        for (const entry of weightedPool) {
            if (randomNum < entry.weight) return entry.item;
            randomNum -= entry.weight;
        }
        return pool[0];
    }

    // --- LOGIC DÙNG ITEM ---
    useOrEquipItem(index) {
        const item = this.inventory[index];
        if (!item) return { success: false, msg: "Lỗi!" };

        // 1. Vũ khí
        if (item.type === 'WEAPON') {
            this.weapon = item;
            //this.weapon.mag = this.weapon.maxMag; // Nạp đạn đầy luôn khi trang bị
            if (this.weapon.id2 === 'knife') {
                this.meleeAttacksLeft = this.weapon.attacksPerTurn || 2;
            } else {
                this.meleeAttacksLeft = 0;
            }
            this.inventory.splice(index, 1); 
            return { success: true, msg: `Đã trang bị ${this.weapon.name}.` };
        }

        // 2. Vật phẩm ném (Gọi chế độ ném bên Game.js)
        if (item.type === 'THROWABLE') {
            return { 
                success: true, 
                type: 'THROW_MODE_INIT', 
                msg: `Chọn mục tiêu ${item.name}`,
                itemIndex: index 
            };
        }

        // 3. Tiêu hao
        if (item.type === 'CONSUMABLE') {
            if (item.valType === 'heal') {
                if (this.activeEffects.some(e => e.type === 'POISON')) return { success: false, msg: "Đang bị Độc!" };
                if (this.hp >= this.maxHp) return { success: false, msg: "Máu đầy!" };
                const oldHp = this.hp;
                this.hp = Math.min(this.hp + item.val, this.maxHp);
                this.inventory.splice(index, 1);
                return { success: true, msg: `Hồi ${this.hp - oldHp} HP.`, type: 'heal' };
            }
            else if (item.valType === 'ammo') {
                // 1. Kiểm tra trạng thái Hoảng Loạn (Cũ)
                if (this.activeEffects.some(e => e.type === 'PANIC')) {
                    return { success: false, msg: "Đang Hoảng Loạn!" };
                }

                // 2. --- KIỂM TRA MỚI: ĐÃ TẤN CÔNG CHƯA? ---
                if (this.hasAttacked) {
                    return { success: false, msg: "Đã bắn! Chờ lượt sau nạp." };
                }

                // 3. Các kiểm tra cơ bản khác
                if (this.weapon.id2 === 'knife') return { success: false, msg: "Dao không dùng đạn!" };
                if (this.weapon.mag >= this.weapon.maxMag) return { success: false, msg: "Đạn đầy!" };
                
                // 4. Tính toán lượng đạn (Giữ nguyên logic % ở câu trả lời trước)
                let amountToRestore = item.val;
                if (item.isPercent) {
                    amountToRestore = Math.ceil(this.weapon.maxMag * (item.val / 100));
                }

                const added = Math.min(amountToRestore, this.weapon.maxMag - this.weapon.mag); 
                this.weapon.mag += added;

                // Xử lý trừ số lần dùng (như đã bàn ở câu trước)
                return this.handleItemUsage(index, `+${added} Đạn.`);
            }
            else if (item.valType === 'armor') {
                if (this.armor >= this.maxArmor) return { success: false, msg: "Giáp đầy!" };
                const old = this.armor;
                this.armor = Math.min(this.armor + item.val, this.maxArmor);
                this.inventory.splice(index, 1);
                return { success: true, msg: `+${this.armor - old} Giáp.`, type: 'armor' }; 
            }
            else if (item.valType === 'CLEANSE') {
                this.activeEffects = []; // Xóa sạch hiệu ứng xấu
                this.inventory.splice(index, 1);
                return { success: true, msg: "Đã giải độc!", type: 'heal' };
            }
        }
        return { success: false, msg: "Không thể sử dụng" };
    }

    // --- SỬA 4: THÊM HÀM XỬ LÝ SỐ LẦN DÙNG (QUAN TRỌNG) ---
    handleItemUsage(index, successMsg) {
        const item = this.inventory[index];
        
        // Kiểm tra xem vật phẩm có thuộc tính 'uses' không
        if (item.uses !== undefined) {
            item.uses -= 1; // Trừ 1 lần dùng
            
            if (item.uses > 0) {
                // Nếu còn lượt dùng -> Không xóa, chỉ thông báo
                return { success: true, msg: `${successMsg} (Còn ${item.uses} lần)`, type: 'consumable' };
            }
        }
        
        // Nếu item không có 'uses' HOẶC uses đã về 0 -> Xóa khỏi túi
        this.inventory.splice(index, 1);
        return { success: true, msg: successMsg, type: 'consumable' };
    }

    applyDebuff(debuffConfig) {
        const debuffType = debuffConfig.type;
        const debuffData = DEBUFFS[debuffType];
        if (!debuffData) return "";
        
        const existing = this.activeEffects.find(e => e.type === debuffType);
        if (existing) {
            existing.duration = debuffConfig.duration;
            return `Gia hạn ${debuffData.name}!`;
        } else {
            this.activeEffects.push({ 
                type: debuffType,
                duration: debuffConfig.duration,
                val: debuffConfig.val || 0 
            });
            return `Bị ${debuffData.name}!`;
        }
    }

    processStartTurnEffects() {
        let messages = [];
        let skipTurn = false;
        
        this.activeEffects = this.activeEffects.filter(eff => {
            if (eff.type === 'BLEED') {
                const dmg = eff.val || 1;
                this.hp -= dmg;
                messages.push({ text: `🩸 Chảy máu: -${dmg}`, type: 'damage' });
            }
            if (eff.type === 'STUN') {
                skipTurn = true;
                messages.push({ text: `😵 Đang bị choáng!`, type: 'miss' });
            }
            eff.duration--;
            return eff.duration > 0;
        });

        if (this.hp <= 0) { this.hp = 0; this.isAlive = false; }
        return { messages, skipTurn };
    }

    takeDamage(dmg, isPierce = false, isExplosion = false) {
        let actualDmg = dmg;
        if (isExplosion && this.hasEffect('BLAST_RESIST')) actualDmg *= 0.5; // Kháng nổ
        
        if (!isPierce && this.armor > 0) {
            if (this.armor >= actualDmg) {
                this.armor -= actualDmg; actualDmg = 0;
            } else {
                actualDmg -= this.armor; this.armor = 0;
            }
        }
        
        this.hp -= actualDmg;
        if (this.hp <= 0) { this.hp = 0; this.isAlive = false; }
        
        return { taken: dmg, remainingHp: this.hp, isDead: !this.isAlive };
    }

    dropItem(index) { this.inventory.splice(index, 1); }
    
    resetTurn() {
        this.hasMoved = false; this.hasAttacked = false;
        if (this.weapon && this.weapon.id2 === 'knife') {
            this.meleeAttacksLeft = this.weapon.attacksPerTurn || 2;
        } else { this.meleeAttacksLeft = 0; }
    }

    hasEffect(effectCode) {
        if (!this.weapon.effects) return false;
        return this.weapon.effects.some(e => e.code === effectCode);
    }
    
    getMobility() {
        let mob = this.weapon.mobility;
        if (this.activeEffects.some(e => e.type === 'CRIPPLE')) mob -= 2; 
        return Math.max(1, mob);
    }
    
    getAccuracy() {
        let acc = this.weapon.accuracy;
        if (this.activeEffects.some(e => e.type === 'BLIND')) acc -= 0.2; 
        return Math.max(0.1, acc);
    }
}