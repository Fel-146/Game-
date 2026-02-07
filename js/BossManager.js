// js/BossManager.js
import { Player } from './Player.js';
import { ENEMIES, ENEMY_WEAPONS, ITEMS, WEAPONS, MAP_CONFIG } from './data.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class BossManager {
    static initMatch(game) {
        this.game = game;
        this.mapId = game.mapId;
        
        // 1. Cấu hình Wave
        this.currentConfig = MAP_CONFIG[this.mapId];
        this.currentWaveIndex = 0; 
        this.spawnQueue = [];      
        this.turnCounter = 0;      
        this.activeEnemiesCount = 0; // Theo dõi số lượng thực tế
        
        // Setup vị trí người chơi
        const humans = game.players.filter(p => !p.isAI);
        const starts = [{x:0,y:11}, {x:1,y:11}, {x:11,y:11}, {x:10,y:11}];
        humans.forEach((p, i) => {
            if(starts[i]) { p.x = starts[i].x; p.y = starts[i].y; }
        });

        // BẮT ĐẦU ĐỢT 1
        this.game.board.showFloatingText(6, 6, "ĐỢT 1 BẮT ĐẦU!", "info");
        this.loadWave(0);
    }

    // --- QUẢN LÝ WAVE & SPAWN ---

    static loadWave(waveIndex) {
        if (waveIndex >= this.currentConfig.waves.length) {
            this.game.board.showFloatingText(6, 6, "CHIẾN THẮNG!!!", "crit");
            return; 
        }

        console.log(`--- TẢI ĐỢT ${waveIndex + 1} ---`);
        // --- FIX QUAN TRỌNG: RESET TRẠNG THÁI BOSS KHI VÀO ĐỢT MỚI ---
        this.bossSpawned = false; 
        // -------------------------------------------------------------

        const waveData = this.currentConfig.waves[waveIndex];
        this.spawnQueue = [];

        // Nạp quái vào hàng chờ
        waveData.enemies.forEach(entry => {
            for (let i = 0; i < entry.count; i++) {
                this.spawnQueue.push(entry.type);
            }
        });

        console.log(`-> Loaded Wave ${waveIndex + 1}: ${this.spawnQueue.length} enemies.`);
        
        // Sinh ngay 1 con khi bắt đầu đợt
        const initialSpawnCount = 1; 
        this.game.board.showFloatingText(6, 6, `ĐỢT ${waveIndex + 1}: TẤN CÔNG!`, "crit");
        
        this.processSpawnQueue(initialSpawnCount);
    }

    static handleTurnStart() {
        this.turnCounter++;
        
        // Giữ nguyên logic % 1 (mỗi lượt) theo ý bạn
        // Lưu ý: Nếu map đầy (max_on_map) thì hàm processSpawnQueue sẽ tự chặn lại, không lo lỗi
        if (this.turnCounter % 1 === 0 && !this.bossSpawned) {
             this.processSpawnQueue(1);
        }
    }

    static processSpawnQueue(amount = 1) {
        const maxOnMap = this.currentConfig.max_on_map;
        let spawnedCount = 0;

        while (spawnedCount < amount && this.spawnQueue.length > 0) {
            const aliveEnemies = this.game.players.filter(p => p.isAI && p.isAlive).length;
            if (aliveEnemies >= maxOnMap) break; // Map đầy thì dừng

            const enemyTypeKey = this.spawnQueue.shift(); 
            this.spawnEnemy(enemyTypeKey);
            spawnedCount++;
        }
    }

    static spawnEnemy(typeKey) {
        const data = ENEMIES[typeKey];
        if (!data) return;

        const isBoss = typeKey.includes('BOSS');
        // Nếu là Boss thì đánh dấu để ngưng sinh quái thường
        if (isBoss) this.bossSpawned = true;

        const id = isBoss ? 99 : (100 + Math.floor(Math.random() * 9000));
        const enemy = new Player(id, data.name, isBoss ? "#8e44ad" : "red");
        enemy.avatar = data.avatar;
        
        if (isBoss) {
            const playerCount = this.game.players.filter(p => !p.isAI).length;
            enemy.maxHp = data.hp + (playerCount * 100);
            enemy.armor = 50;
        } else {
            enemy.maxHp = data.hp;
        }
        enemy.hp = enemy.maxHp;

        // Vũ khí
        enemy.weapon = { ...ENEMY_WEAPONS[data.enemy_weapon] };
        enemy.isAI = true;
        enemy.lootTable = data.loot_table || [];

        if (isBoss) {
            enemy.x = 6; enemy.y = 1;
            this.game.board.showFloatingText(6, 1, "BOSS XUẤT HIỆN!", "crit");
        } else {
            this.placeEntityRandomly(enemy, 0, 6);
            this.game.board.showFloatingText(enemy.x, enemy.y, "Quái xuất hiện", "crit");
        }

        this.game.players.push(enemy);
        this.game.render();
    }

    // --- XỬ LÝ CHẾT & RƠI ĐỒ ---

    static checkEnemyDeath(deadPlayer, killer) {
        if (!deadPlayer.isAI) return;

        // 1. Auto Loot
        if (killer && !killer.isAI) {
            this.handleLootDrop(deadPlayer, killer);
        }

        // 2. Kiểm tra tiến độ Wave (Đã xóa logic Kill Count cũ gây xung đột)
        const aliveEnemiesCount = this.game.players.filter(p => p.isAI && p.isAlive && p.id !== deadPlayer.id).length;
        const queueCount = this.spawnQueue.length;

        // Nếu bản đồ trống và hàng chờ cũng trống -> Qua đợt mới
        if (aliveEnemiesCount === 0 && queueCount === 0) {
            this.currentWaveIndex++;
            setTimeout(() => {
                this.game.board.showFloatingText(6, 6, `ĐỢT ${this.currentWaveIndex + 1} SẮP TỚI...`, "info");
                // Nghỉ 2s rồi load đợt sau
                setTimeout(() => this.loadWave(this.currentWaveIndex), 2000);
            }, 1000);
        } else {
            // Nếu vẫn còn trong đợt, thử sinh thêm quái lấp chỗ trống ngay
            setTimeout(() => this.processSpawnQueue(1), 1000);
        }
    }

    static handleLootDrop(deadEnemy, killer) {
        if (!deadEnemy.lootTable) return;

        deadEnemy.lootTable.forEach(entry => {
            const roll = Math.random();
            if (roll <= entry.chance) {
                let itemToAdd = null;
                if (entry.type === 'ITEM') itemToAdd = { ...ITEMS[entry.code] };
                else if (entry.type === 'WEAPON') itemToAdd = { ...WEAPONS[entry.code], type: 'WEAPON' };

                if (itemToAdd) {
                    if (killer.inventory.length < killer.maxInventorySize) {
                        killer.inventory.push(itemToAdd);
                        this.game.board.showFloatingText(killer.x, killer.y, `Nhặt: ${itemToAdd.name}`, "heal");
                        if (this.game.getCurrentPlayer().id === killer.id) this.game.updateHUD();
                    } else {
                        this.game.board.showFloatingText(killer.x, killer.y, "Túi đầy!", "miss");
                    }
                }
            }
        });
    }

    // --- AI LOGIC (Không đổi) ---
    static async runAI(actor) {
        this.game.isProcessing = true;
        const g = this.game;
        let target = null;
        let minDesc = 999;
        const humans = g.players.filter(p => !p.isAI && p.isAlive);
        
        if (humans.length === 0) {
            g.isProcessing = false; g.nextTurn(); return; 
        }

        humans.forEach(h => {
            const d = Math.sqrt(Math.pow(h.x - actor.x, 2) + Math.pow(h.y - actor.y, 2));
            if (d < minDesc) { minDesc = d; target = h; }
        });

        if (this.mapId === 'training') {
            if (minDesc > actor.weapon.range) await this.moveTowards(actor, target);
            await this.tryAttack(actor, target);
        }
        else if (this.mapId === 'abyss') {
            if (actor.id === 99) { 
                if (minDesc <= 3) {
                    g.board.showFloatingText(actor.x, actor.y, "Dịch chuyển!", "info");
                    await sleep(500);
                    this.placeEntityRandomly(actor, 0, 11);
                    g.render();
                    await sleep(500);
                }
                await this.tryAttack(actor, target);
            } else { 
                if (minDesc > actor.weapon.range) await this.moveTowards(actor, target);
                await this.tryAttack(actor, target);
            }
        }

        await sleep(500);
        g.isProcessing = false;
        g.nextTurn();
    }

    static async moveTowards(actor, target) {
        const path = this.game.findPath({x: actor.x, y: actor.y}, {x: target.x, y: target.y});
        if (path.length > 0) {
            const lastStep = path[path.length - 1];
            if (lastStep.x === target.x && lastStep.y === target.y) path.pop();
        }
        if (path.length > 0) {
            const steps = path.slice(0, actor.getMobility());
            await this.game.animateMovement(actor, steps);
        }
        await sleep(200);
    }

    static async tryAttack(actor, target) {
        const dist = Math.sqrt(Math.pow(target.x - actor.x, 2) + Math.pow(target.y - actor.y, 2));
        if (dist <= actor.weapon.range) {
            let dx = 0, dy = 0;
            if (target.x > actor.x) dx = 1; else if (target.x < actor.x) dx = -1;
            if (target.y > actor.y) dy = 1; else if (target.y < actor.y) dy = -1;
            
            if (actor.id === 99) this.game.board.showFloatingText(actor.x, actor.y, "HỦY DIỆT!", "damage");
            await this.game.fireInDirection(actor, dx, dy);
        }
    }

    static placeEntityRandomly(entity, minY, maxY) {
        let placed = false;
        let attempts = 0;
        while(!placed && attempts < 50) {
            attempts++;
            const rx = Math.floor(Math.random() * 12);
            const ry = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
            const cell = this.game.board.grid[ry][rx];
            const hasPlayer = this.game.players.some(p => p.x === rx && p.y === ry && p.isAlive);
            if (!hasPlayer && cell.type !== 'wall') {
                entity.x = rx; entity.y = ry;
                placed = true;
            }
        }
    }
}

