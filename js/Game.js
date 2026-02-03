// js/Game.js
import { Board } from './Board.js';
import { Player } from './Player.js';
import { WEAPON_EFFECTS, DEBUFFS } from './data.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class Game {
    constructor() {
        this.players = [];
        this.board = new Board(12, 12);
        this.currentPlayerIndex = 0;
        this.state = 'IDLE'; 
        this.validMoves = []; 
        this.isProcessing = false; 
        this.selectedThrowItemIndex = null;
        this.validThrowCells = [];
    }

    // Cập nhật tham số nhận vào: thêm viewMode
    init(playersData, viewMode = 'pc') {
        this.players = playersData.map(data => {
            // ... (Code tạo player giữ nguyên)
            const p = new Player(data.id, data.name, data.color);
            p.avatar = data.avatar;
            return p;
        });

        // --- XỬ LÝ CHẾ ĐỘ HIỂN THỊ ---
        this.applyViewMode(viewMode);

        this.board.generateMap();
        this.board.spawnPlayers(this.players);

        setTimeout(() => {
            this.render(); 
            this.setupBoardClicks();
            this.updateHUD(); 
        }, 100);
    }

    // --- HÀM MỚI: ÁP DỤNG CSS ---
    applyViewMode(mode) {
        const gameScreen = document.getElementById('game-screen');
        const boardEl = document.getElementById('game-board');

        // Xóa class cũ nếu có
        gameScreen.classList.remove('mode-mobile', 'mode-pc');
        boardEl.classList.remove('board-mobile');

        if (mode === 'mobile') {
            // Thêm class mobile
            gameScreen.classList.add('mode-mobile');
            boardEl.classList.add('board-mobile');
            console.log("-> Đã kích hoạt chế độ Mobile");
        } else {
            gameScreen.classList.add('mode-pc');
        }
    }

    init(playersData) {
        this.players = playersData.map(data => {
            const p = new Player(data.id, data.name, data.color);
            p.avatar = data.avatar;
            return p;
        });
        this.board.generateMap();
        this.board.spawnPlayers(this.players);
        setTimeout(() => {
            this.render(); this.setupBoardClicks(); this.updateHUD(); 
        }, 100);
    }

    setupBoardClicks() {
        const boardEl = document.getElementById('game-board');
        const newBoardEl = boardEl.cloneNode(true); 
        boardEl.parentNode.replaceChild(newBoardEl, boardEl);
        newBoardEl.addEventListener('click', (e) => {
            if (this.isProcessing) return;
            const cell = e.target.closest('.grid-cell'); 
            if (!cell) return;
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            this.handleCellClick(x, y);
        });
    }

    async handleCellClick(x, y) {
        if (this.state === 'MOVING') {
            const isValid = this.validMoves.some(m => m.x === x && m.y === y);
            if (isValid) {
                const p = this.getCurrentPlayer();
                const path = this.findPath({x: p.x, y: p.y}, {x: x, y: y});
                if (path.length > 0) {
                    this.isProcessing = true; 
                    this.board.clearHighlights(); 
                    await this.animateMovement(p, path);
                    this.checkItemPickup(p, x, y); // Kiểm tra nhặt đồ
                    p.hasMoved = true; 
                    this.state = 'IDLE';
                    this.isProcessing = false; 
                    this.updateHUD(); 
                }
            } else {
                this.exitThrowMode();
            }
        }
        else if (this.state === 'ATTACK_SELECT_DIR') {
            const p = this.getCurrentPlayer();
            const dx = x - p.x; const dy = y - p.y;
            const isDiagonal = Math.abs(dx) > 0 && Math.abs(dy) > 0;
            const hasDiagonalEffect = p.hasEffect(WEAPON_EFFECTS.DIAGONAL?.code);

            if (!(dx === 0 && dy === 0)) {
                if (isDiagonal && !hasDiagonalEffect) {
                    this.board.showFloatingText(p.x, p.y, "Không thể bắn chéo!", "miss");
                    this.exitThrowMode();
                } else {
                    const dirX = dx === 0 ? 0 : (dx > 0 ? 1 : -1);
                    const dirY = dy === 0 ? 0 : (dy > 0 ? 1 : -1);
                    await this.fireInDirection(p, dirX, dirY);
                }
            } else { this.exitThrowMode(); }
        }
        else if (this.state === 'SKILL_DASH_SELECT') {
            // ... (Giữ nguyên logic Dash) ...
            const cellEl = document.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
            if (cellEl && cellEl.classList.contains('highlight-move')) {
                const p = this.getCurrentPlayer();
                this.isProcessing = true;
                this.board.clearHighlights();
                this.board.showFloatingText(p.x, p.y, "Lướt...", "info");
                await sleep(200);
                p.x = x; p.y = y;
                p.hasMoved = true; 
                this.checkItemPickup(p, x, y);
                this.render();
                this.updateHUD();
                this.state = 'IDLE';
                this.isProcessing = false;
            } else {
                this.exitThrowMode();
                this.board.showFloatingText(this.getCurrentPlayer().x, this.getCurrentPlayer().y, "Hủy lướt", "miss");
            }
        }
        else if (this.state === 'THROWING_SELECT_TARGET') {
            const isValid = this.validThrowCells.some(c => c.x === x && c.y === y);
            if (isValid) {
                await this.executeThrow(x, y);
            } else {
                this.exitThrowMode();
                this.board.showFloatingText(this.getCurrentPlayer().x, this.getCurrentPlayer().y, "Hủy ném", "miss");
            }
        }
    }

    // --- SỬA LẠI: LOGIC NHẶT ĐỒ (CHỈ HÒM) ---
    checkItemPickup(player, x, y) {
        const cell = this.board.grid[y][x];

        // Chỉ kiểm tra hòm (INTERACT)
        if (cell.item && cell.item.type === 'INTERACT') {
            // Truyền ID của hòm vào hàm openCrate
            const result = player.openCrate(cell.item.id);
            
            if (result.success) {
                const rarityType = result.loot.rarity ? `rarity-${result.loot.rarity.toLowerCase()}` : 'rarity-common';
                cell.item = null;
                // Board sẽ tự động sinh hòm mới khi render gọi refillCrates
                this.render();
                this.board.showFloatingText(player.x, player.y, `+${result.loot.name}`, rarityType);
            } else {
                this.board.showFloatingText(player.x, player.y, result.msg, "miss");
            }
        }
    }

    // --- CÁC HÀM NÉM (Giữ nguyên từ code trước) ---
    exitThrowMode() {
        this.state = 'IDLE';
        this.selectedThrowItemIndex = null;
        this.validThrowCells = [];
        this.board.clearHighlights();
        this.updateHUD();
    }

    enterThrowMode(itemIndex) {
        const p = this.getCurrentPlayer();
        const item = p.inventory[itemIndex];
        if (!item || item.type !== 'THROWABLE') return;

        this.state = 'THROWING_SELECT_TARGET';
        this.selectedThrowItemIndex = itemIndex;
        this.validThrowCells = [];
        const range = item.throwRange;
        for(let cy = 0; cy < this.board.rows; cy++) {
            for(let cx = 0; cx < this.board.cols; cx++) {
                const dist = Math.sqrt(Math.pow(cx - p.x, 2) + Math.pow(cy - p.y, 2));
                if (dist <= range) this.validThrowCells.push({x: cx, y: cy});
            }
        }
        this.board.highlightCells(this.validThrowCells, 'throw');
        this.board.showFloatingText(p.x, p.y, `Chọn mục tiêu (${range} ô)`, "info");
    }

    async executeThrow(targetX, targetY) {
        const p = this.getCurrentPlayer();
        const item = p.inventory[this.selectedThrowItemIndex];
        
        this.isProcessing = true;
        this.board.clearHighlights();
        p.inventory.splice(this.selectedThrowItemIndex, 1);
        this.updateHUD(); 
        
        const roll = Math.random();
        let finalTargetX = targetX; let finalTargetY = targetY;

        this.board.drawBullet(p.x, p.y, targetX, targetY);
        
        if (roll > item.accuracy) {
            const scatter = [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}];
            const offset = scatter[Math.floor(Math.random() * scatter.length)];
            finalTargetX = Math.max(0, Math.min(11, finalTargetX + offset.x));
            finalTargetY = Math.max(0, Math.min(11, finalTargetY + offset.y));
            this.board.showFloatingText(targetX, targetY, "LỆCH!", "miss");
        } else {
            this.board.showFloatingText(p.x, p.y, "Ném trúng!", "info");
        }
        await sleep(500);

        const aoeCells = [];
        const radius = item.aoeRadius;
        for(let cy = 0; cy < this.board.rows; cy++) {
            for(let cx = 0; cx < this.board.cols; cx++) {
                const dist = Math.sqrt(Math.pow(cx - finalTargetX, 2) + Math.pow(cy - finalTargetY, 2));
                if (dist <= radius + 0.1) aoeCells.push({x: cx, y: cy});
            }
        }

        if (aoeCells.length > 0) {
            this.board.showExplosion(aoeCells, item.explosionColor || 'rgba(231, 76, 60, 0.6)');
            await sleep(300); 
        }

        for (const cell of aoeCells) {
            const targetPlayer = this.players.find(pl => pl.x === cell.x && pl.y === cell.y && pl.isAlive);
            if (targetPlayer) {
                if (item.damage > 0) {
                    const result = targetPlayer.takeDamage(item.damage, false, true); 
                    this.board.showFloatingText(targetPlayer.x, targetPlayer.y, `-${result.taken}`, "damage");
                }
                if (item.debuff && Math.random() <= item.debuff.chance) {
                    const debuffResultMsg = targetPlayer.applyDebuff(item.debuff);
                    setTimeout(() => {
                        this.board.showFloatingText(targetPlayer.x, targetPlayer.y, debuffResultMsg, 'crit');
                    }, 400);
                }
                if (!targetPlayer.isAlive) {
                    setTimeout(() => {
                        this.board.showFloatingText(targetPlayer.x, targetPlayer.y, "HẠ GỤC!", "crit");
                    }, 800);
                }
            }
        }
        this.render(); 
        await sleep(1000); 
        this.exitThrowMode();
        this.isProcessing = false;
        this.state = 'IDLE'; 
    }


    // --- LOGIC DI CHUYỂN (Giữ nguyên) ---
    startMovePhase() {
        const p = this.getCurrentPlayer();
        
        if (p.activeEffects && p.activeEffects.some(e => e.type === 'STUN')) {
            this.board.showFloatingText(p.x, p.y, "Đang bị choáng!", "miss");
            return;
        }

        if (p.hasMoved) {
            this.board.showFloatingText(p.x, p.y, "Đã di chuyển!", "miss");
            return;
        }

        if (this.state === 'MOVING') {
            this.exitThrowMode();
            return;
        }

        this.state = 'MOVING';
        this.validMoves = this.calculateValidMoves(p);
        this.board.highlightCells(this.validMoves, 'move');
    }

    // ... (Giữ nguyên calculateValidMoves, findPath, animateMovement) ...
    calculateValidMoves(player) {
        const startNode = { x: player.x, y: player.y, dist: 0 };
        const queue = [startNode];
        const visited = new Set();
        visited.add(`${player.x},${player.y}`);
        
        const validCells = [];
        
        let range;
        if (player.tempMobilityBonus > 0) {
            range = player.tempMobilityBonus;
        } else {
            range = player.getMobility(); 
        }

        const directions = [{dx:0, dy:-1}, {dx:0, dy:1}, {dx:-1, dy:0}, {dx:1, dy:0}];

        while (queue.length > 0) {
            const current = queue.shift();
            if (current.dist >= range) continue;

            for (const dir of directions) {
                const nx = current.x + dir.dx;
                const ny = current.y + dir.dy;
                const key = `${nx},${ny}`;

                if (nx < 0 || nx >= this.board.cols || ny < 0 || ny >= this.board.rows) continue;

                const cell = this.board.grid[ny][nx];
                if (cell.type === 'wall') continue;
                
                const isOccupied = this.players.some(p => p.x === nx && p.y === ny && p.isAlive);
                if (isOccupied) continue;

                if (!visited.has(key)) {
                    visited.add(key);
                    queue.push({ x: nx, y: ny, dist: current.dist + 1 });
                    validCells.push({ x: nx, y: ny });
                }
            }
        }
        return validCells;
    }

    findPath(start, end) {
        let queue = [start];
        let cameFrom = {}; 
        let startKey = `${start.x},${start.y}`;
        cameFrom[startKey] = null;

        const directions = [{dx:0, dy:-1}, {dx:0, dy:1}, {dx:-1, dy:0}, {dx:1, dy:0}];

        while (queue.length > 0) {
            let current = queue.shift();
            if (current.x === end.x && current.y === end.y) break;

            for (let dir of directions) {
                let nx = current.x + dir.dx;
                let ny = current.y + dir.dy;
                let key = `${nx},${ny}`;

                if (nx >= 0 && nx < 12 && ny >= 0 && ny < 12 && !cameFrom.hasOwnProperty(key)) {
                    const cell = this.board.grid[ny][nx];
                    const isOccupied = this.players.some(p => p.x === nx && p.y === ny && p.isAlive);
                    
                    if (cell.type !== 'wall') {
                         if (!isOccupied || (nx === end.x && ny === end.y)) {
                            queue.push({x: nx, y: ny});
                            cameFrom[key] = current;
                         }
                    }
                }
            }
        }

        let path = [];
        let curr = end;
        let currKey = `${end.x},${end.y}`;
        if (!cameFrom.hasOwnProperty(currKey)) return [];

        while (curr) {
            path.push(curr);
            let key = `${curr.x},${curr.y}`;
            curr = cameFrom[key];
            if (curr && curr.x === start.x && curr.y === start.y) break;
        }
        return path.reverse();
    }

    async animateMovement(player, path) {
        for (let step of path) {
            player.x = step.x;
            player.y = step.y;
            this.render(); 
            await sleep(200); 
        }
    }

    // --- LOGIC TẤN CÔNG (Giữ nguyên) ---
    startAttackPhase() {
        const p = this.getCurrentPlayer();
        if (this.isProcessing) return;

        if (p.activeEffects && p.activeEffects.some(e => e.type === 'STUN')) {
            this.board.showFloatingText(p.x, p.y, "Đang bị choáng!", "miss");
            return;
        }

        if (p.weapon.id2 === 'knife') {
            if (p.meleeAttacksLeft <= 0) {
                this.board.showFloatingText(p.x, p.y, "Hết thể lực!", "miss");
                return;
            }
        } else {
            if (p.weapon.mag < p.weapon.cost) {
                this.board.showFloatingText(p.x, p.y, "Hết đạn!", "miss");
                return;
            }
        }

        if (this.state === 'ATTACK_SELECT_DIR') {
            this.exitThrowMode();
            return;
        }

        this.state = 'ATTACK_SELECT_DIR';
        let directions = [{x: p.x, y: p.y - 1}, {x: p.x, y: p.y + 1}, {x: p.x - 1, y: p.y}, {x: p.x + 1, y: p.y}];
        
        if (p.hasEffect(WEAPON_EFFECTS.DIAGONAL?.code)) {
            directions.push(
                {x: p.x - 1, y: p.y - 1}, {x: p.x + 1, y: p.y - 1},
                {x: p.x - 1, y: p.y + 1}, {x: p.x + 1, y: p.y + 1}
            );
        }

        const validDirs = directions.filter(d => d.x >= 0 && d.x < 12 && d.y >= 0 && d.y < 12);
        this.board.highlightCells(validDirs, 'attack-dir'); 
    }

    // ... (Giữ nguyên fireInDirection, applyKnockback) ...
    async fireInDirection(attacker, dx, dy) {
        this.isProcessing = true;
        this.board.clearHighlights();
        attacker.hasAttacked = true;
        
        if (attacker.weapon.id2 === 'knife') {
            attacker.meleeAttacksLeft--;
        } else {
            attacker.weapon.mag -= attacker.weapon.cost;
        }
        this.updateHUD();

        const range = attacker.weapon.range;
        const canWallbang = attacker.hasEffect(WEAPON_EFFECTS.WALLBANG?.code);
        
        let target = null;
        let bulletEndX = attacker.x;
        let bulletEndY = attacker.y;

        for (let i = 1; i <= range; i++) {
            const cx = attacker.x + (dx * i);
            const cy = attacker.y + (dy * i);

            if (cx < 0 || cx >= 12 || cy < 0 || cy >= 12) break;
            
            const cell = this.board.grid[cy][cx];
            bulletEndX = cx;
            bulletEndY = cy;

            if (cell.type === 'wall') {
                if (!canWallbang) break; 
            }

            const enemy = this.players.find(p => p.x === cx && p.y === cy && p.isAlive);
            if (enemy && enemy.id !== attacker.id) {
                target = enemy;
                break;
            }
        }

        this.board.drawBullet(attacker.x, attacker.y, bulletEndX, bulletEndY);
        await sleep(500); 

        if (target) {
            const w = attacker.weapon;
            const roll = Math.random();
            const hitThreshold = w.id2 === 'knife' ? 1.0 : attacker.getAccuracy();

            if (roll <= hitThreshold) {
                let damage = w.damage;
                let isCrit = false;
                
                if (attacker.hasEffect(WEAPON_EFFECTS.CRIT?.code) && Math.random() < 0.3) {
                    damage *= 2;
                    isCrit = true;
                }

                const hasPierceEffect = attacker.hasEffect(WEAPON_EFFECTS.PIERCE?.code);
                const isPierceTriggered = hasPierceEffect && Math.random() < 0.3;

                const result = target.takeDamage(damage, isPierceTriggered, false);
                
                let dmgText = `-${result.taken}`;
                if (isPierceTriggered && result.remainingArmor > 0) dmgText += " (Xuyên)";
                if (isCrit) dmgText += " CRIT!";
                this.board.showFloatingText(target.x, target.y, dmgText, isCrit ? "crit" : "damage");
                
                if (attacker.hasEffect(WEAPON_EFFECTS.LIFESTEAL?.code)) {
                    if (Math.random() < 0.3) {
                        if (attacker.hp < attacker.maxHp) {
                            attacker.hp = Math.min(attacker.hp + 5, attacker.maxHp);
                            this.board.showFloatingText(attacker.x, attacker.y, `+5 HP`, 'heal');
                        }
                    }
                }

                if (attacker.hasEffect(WEAPON_EFFECTS.LUCKY?.code) && Math.random() < 0.3) {
                    if (w.mag < w.maxMag) {
                        w.mag++;
                        this.board.showFloatingText(attacker.x, attacker.y, "+1 Đạn", 'info');
                    }
                }

                if (attacker.hasEffect(WEAPON_EFFECTS.KNOCKBACK?.code) && Math.random() < 0.3) {
                    this.applyKnockback(attacker, target);
                }

                if (w.debuff) {
                    if (Math.random() < w.debuff.chance) {
                        const debuffName = target.applyDebuff(w.debuff);
                        setTimeout(() => this.board.showFloatingText(target.x, target.y, debuffName, 'crit'), 600);
                    }
                }

                if (!target.isAlive) {
                    setTimeout(() => {
                        this.board.showFloatingText(target.x, target.y, "HẠ GỤC!", "crit");
                    }, 500);
                }
            } else {
                this.board.showFloatingText(target.x, target.y, "Trượt!", "miss");
            }
            this.render(); 
        }

        this.isProcessing = false;
        
        const canAttackMore = (attacker.weapon.id2 === 'knife' && attacker.meleeAttacksLeft > 0) || 
                              (attacker.weapon.id2 !== 'knife' && attacker.weapon.mag >= attacker.weapon.cost);
        
        if (canAttackMore) {
            this.startAttackPhase(); 
        } else {
            this.state = 'IDLE';
        }
    }

    applyKnockback(attacker, target) {
        let dx = 0, dy = 0;
        if (target.x > attacker.x) dx = 1; else if (target.x < attacker.x) dx = -1;
        if (target.y > attacker.y) dy = 1; else if (target.y < attacker.y) dy = -1;
        if (Math.abs(target.x - attacker.x) > Math.abs(target.y - attacker.y)) dy = 0; else dx = 0;

        const newX = target.x + dx;
        const newY = target.y + dy;

        if (newX >= 0 && newX < 12 && newY >= 0 && newY < 12) {
            const cell = this.board.grid[newY][newX];
            const hasPlayer = this.players.some(p => p.x === newX && p.y === newY && p.isAlive);
            if (cell.type !== 'wall' && !hasPlayer) {
                target.x = newX; target.y = newY;
                this.board.showFloatingText(target.x, target.y, "Đẩy lùi!", 'info');
            }
        }
    }

    // --- (Giữ nguyên activateSkill, highlightDashTargets) ---
    activateSkill(skillCode) {
        const p = this.getCurrentPlayer();
        
        if (skillCode === 'TELEPORT') {
            let emptyCells = [];
            for(let y=0; y<12; y++) {
                for(let x=0; x<12; x++) {
                    const hasP = this.players.some(pl => pl.x===x && pl.y===y && pl.isAlive);
                    if(this.board.grid[y][x].type !== 'wall' && !hasP) emptyCells.push({x,y});
                }
            }
            if(emptyCells.length > 0) {
                const randCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                this.board.showFloatingText(p.x, p.y, "Biến mất...", "info");
                p.x = randCell.x;
                p.y = randCell.y;
                p.hasMoved = true;
                
                this.render();
                this.updateHUD();
                this.board.showFloatingText(p.x, p.y, "Xuất hiện!", "info");
                this.checkItemPickup(p, p.x, p.y);
            } else {
                this.board.showFloatingText(p.x, p.y, "Không có chỗ đáp!", "miss");
            }
        }
        else if (skillCode === 'DASH') {
            if (this.state === 'SKILL_DASH_SELECT') {
                this.exitThrowMode();
                return;
            }
            this.state = 'SKILL_DASH_SELECT';
            this.highlightDashTargets(p);
        }
    }

    highlightDashTargets(player) {
        this.board.clearHighlights();
        const dist = 4;
        const dirs = [{dx:0, dy:-dist}, {dx:0, dy:dist}, {dx:-dist, dy:0}, {dx:dist, dy:0}];
        
        const validDashCells = [];
        dirs.forEach(d => {
            const tx = player.x + d.dx;
            const ty = player.y + d.dy;
            
            if(tx >=0 && tx < 12 && ty >=0 && ty < 12) {
                const cell = this.board.grid[ty][tx];
                const hasP = this.players.some(pl => pl.x===tx && pl.y===ty && pl.isAlive);
                if(cell.type !== 'wall' && !hasP) {
                     validDashCells.push({x: tx, y: ty});
                }
            }
        });
        
        if (validDashCells.length > 0) {
            this.board.highlightCells(validDashCells, 'move');
            this.board.showFloatingText(player.x, player.y, "Chọn ô lướt tới", "info");
        } else {
            this.exitThrowMode();
            this.board.showFloatingText(player.x, player.y, "Bị chặn đường!", "miss");
        }
    }

    // --- HÀM XỬ LÝ NHẶT VẬT PHẨM (Giữ nguyên) ---
    checkItemPickup(player, x, y) {
        const cell = this.board.grid[y][x];

        // Kiểm tra xem ô có ITEM không (Các loại hòm đều là type INTERACT trong item)
        if (cell.item && cell.item.type === 'INTERACT') {
            // Gọi hàm mở hòm với ID của hòm (crate_weapon, crate_ammo, crate_supply)
            const result = player.openCrate(cell.item.id);
            
            if (result.success) {
                const rarityType = result.loot.rarity 
                    ? `rarity-${result.loot.rarity.toLowerCase()}` 
                    : 'rarity-common';

                // Xóa hòm khỏi bản đồ
                cell.item = null;
                
                // Vẽ lại để thấy hòm biến mất và hiện thông báo
                this.render();

                this.board.showFloatingText(
                    player.x, player.y, 
                    `+${result.loot.name}`, rarityType
                );
            } else {
                this.board.showFloatingText(player.x, player.y, result.msg, "miss");
            }
        }
        
        // Đã xóa hoàn toàn logic check cell.powerup
    }

    // ... (Giữ nguyên getCurrentPlayer, nextTurn, render) ...
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    async nextTurn() {
        this.getCurrentPlayer().resetTurn();
        
        let nextIndex = (this.currentPlayerIndex + 1) % this.players.length;
        let loops = 0;
        while (!this.players[nextIndex].isAlive && loops < this.players.length) {
            nextIndex = (nextIndex + 1) % this.players.length;
            loops++;
        }
        
        this.currentPlayerIndex = nextIndex;
        const nextPlayer = this.getCurrentPlayer();
        nextPlayer.resetTurn(); 
        
        this.exitThrowMode(); // Reset trạng thái khi qua lượt
        
        const effectResult = nextPlayer.processStartTurnEffects(); 

        if (effectResult.messages.length > 0) {
            for (let msg of effectResult.messages) {
                this.board.showFloatingText(nextPlayer.x, nextPlayer.y, msg.text, msg.type);
                this.updateHUD();
                await sleep(800);
            }
        }

        if (!nextPlayer.isAlive) {
            this.nextTurn();
            return;
        }

        if (effectResult.skipTurn) {
            this.board.showFloatingText(nextPlayer.x, nextPlayer.y, "MẤT LƯỢT!", "miss");
            this.updateHUD(); 
            await sleep(1000);
            this.nextTurn();
            return;
        }

        this.updateHUD();
        this.board.showFloatingText(nextPlayer.x, nextPlayer.y, "Lượt của bạn!", "info");
    }

    render() {
        const boardElement = document.getElementById('game-board');
        this.board.render(boardElement, this.players);
    }

    // ... (Giữ nguyên updateHUD) ...
    updateHUD() {
        const p = this.getCurrentPlayer();
        const w = p.weapon;
        
        document.getElementById('hud-player-name').innerText = p.name;
        document.getElementById('hud-player-name').style.color = p.color;
        document.getElementById('hud-turn-text').innerText = `Lượt của ${p.name}`;
        document.getElementById('hud-avatar-img').src = p.avatar;
        document.querySelector('.hud-avatar-frame').style.borderColor = p.color;

        const hpPercent = (p.hp / p.maxHp) * 100;
        const hpBar = document.getElementById('hud-hp-bar');
        hpBar.style.width = `${hpPercent}%`;
        hpBar.style.backgroundColor = hpPercent > 50 ? '#2ecc71' : (hpPercent > 25 ? '#f1c40f' : '#e74c3c');
        document.getElementById('hud-hp-text').innerText = `${p.hp}/${p.maxHp}`;

        const armorBar = document.getElementById('hud-armor-bar');
        const armorText = document.getElementById('hud-armor-text');
        if (armorBar && armorText) {
            const maxArmor = p.maxArmor || 20; 
            const currentArmor = p.armor || 0;
            const armorPercent = (currentArmor / maxArmor) * 100;
            armorBar.style.width = `${armorPercent}%`;
            armorText.innerText = `${currentArmor}/${maxArmor}`;
        }

        const statusArea = document.getElementById('hud-status-area');
        if (statusArea) {
            statusArea.innerHTML = '';
            if (p.activeEffects && p.activeEffects.length > 0) {
                p.activeEffects.forEach(eff => {
                    const debuffInfo = DEBUFFS[eff.type];
                    if (debuffInfo) {
                        const span = document.createElement('span');
                        span.innerText = `${debuffInfo.name} (${eff.duration})`;
                        span.style.color = '#e74c3c';
                        span.style.marginRight = '8px';
                        span.style.backgroundColor = 'rgba(0,0,0,0.5)';
                        span.style.padding = '2px 5px';
                        span.style.borderRadius = '4px';
                        statusArea.appendChild(span);
                    }
                });
            }
        }

        const weaponNameEl = document.getElementById('hud-weapon-name');
        weaponNameEl.innerText = w.name;
        weaponNameEl.className = w.rarity ? `rarity-${w.rarity.toLowerCase()}` : 'rarity-common';
        document.getElementById('hud-weapon-img').src = w.img;
        
        const ammoEl = document.getElementById('hud-weapon-ammo');
        if (w.id2 === 'knife') {
             ammoEl.innerText = `${p.meleeAttacksLeft} Lượt`;
             ammoEl.parentElement.style.color = '#f39c12';
        } else {
             ammoEl.innerText = `${w.mag}/${w.maxMag}`;
             ammoEl.parentElement.style.color = w.mag === 0 ? '#e74c3c' : '#2ecc71';
        }

        const btnMove = document.getElementById('btn-move');
        if (p.hasMoved) {
            btnMove.disabled = true; btnMove.style.opacity = '0.5';
        } else {
            btnMove.disabled = false; btnMove.style.opacity = '1';
        }

        const skillArea = document.getElementById('skill-area');
        const skillName = document.getElementById('skill-name');
        
        if(skillArea && skillName) {
            let hasActive = false;
            if (p.weapon.effects) {
                const activeEffect = p.weapon.effects.find(eff => eff.isActive === true);
                if (activeEffect) {
                    hasActive = true; 
                    skillName.innerText = activeEffect.name; 
                }
            }
            if (hasActive && !p.hasMoved) { 
                skillArea.style.display = 'block';
            } else {
                skillArea.style.display = 'none';
            }
        }
    }

    // --- CẬP NHẬT LOGIC MỞ TÚI ĐỒ ĐỂ XỬ LÝ NÉM ---
    openInventory() {
        const p = this.getCurrentPlayer();
        const listEl = document.getElementById('inventory-list');
        listEl.innerHTML = '';

        if (p.inventory.length === 0) {
            listEl.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #777;">Túi đồ trống rỗng.</p>';
            return;
        }

        p.inventory.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'inv-item';
            let displayIcon = item.icon || `<img src="${item.img}">`;
            const rarityClass = item.rarity ? `rarity-${item.rarity.toLowerCase()}` : 'rarity-common';
    
            // Xác định tên nút bấm dựa trên loại vật phẩm
            let actionBtnLabel = 'Dùng';
            if (item.type === 'WEAPON') actionBtnLabel = 'Trang bị';
            if (item.type === 'THROWABLE') actionBtnLabel = 'Ném';

            div.innerHTML = `
                <div class="icon">${displayIcon}</div>
                <h4 class="${rarityClass}">${item.name}</h4>
                <div class="inv-btn-group">
                    <button class="btn-mini btn-use" data-idx="${index}">${actionBtnLabel}</button> 
                    <button class="btn-mini btn-drop" data-idx="${index}">Xóa</button>
                </div>
            `;
            listEl.appendChild(div);
        });

        document.querySelectorAll('.btn-use').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                const result = p.useOrEquipItem(idx); 
        
                if (result.success) {
                    // --- TRƯỜNG HỢP ĐẶC BIỆT: CHUYỂN CHẾ ĐỘ NÉM ---
                    if (result.type === 'THROW_MODE_INIT') {
                        document.getElementById('modal-inventory').classList.add('hidden'); // Đóng túi đồ
                        this.enterThrowMode(result.itemIndex); // Kích hoạt chế độ ném trong Game controller
                    } 
                    // Trường hợp dùng item thường (máu, giáp, trang bị súng)
                    else {
                        let type = result.type || 'info';
                        if(type === 'armor') type = 'info'; 
                        this.board.showFloatingText(p.x, p.y, result.msg, type);
                        this.updateHUD();
                        this.openInventory(); 
                        this.render(); 
                    }
                } else {
                    this.board.showFloatingText(p.x, p.y, result.msg, "miss");
                }
            });
        });

        // (Giữ nguyên logic nút xóa)
        document.querySelectorAll('.btn-drop').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                if(confirm("Bạn muốn vứt bỏ vật phẩm này?")) {
                    p.dropItem(idx);
                    this.openInventory();
                }
            });
        });
    }

    // ... (Giữ nguyên showWeaponDetails) ...
    showWeaponDetails() {
        const p = this.getCurrentPlayer();
        const w = p.weapon;
        
        const nameEl = document.getElementById('info-weapon-name');
        nameEl.innerText = w.name;
        nameEl.className = w.rarity ? `rarity-${w.rarity.toLowerCase()}` : 'rarity-common';

        document.getElementById('info-dmg').innerText = w.damage;
        document.getElementById('info-range').innerText = `${w.range} ô`;
        document.getElementById('info-mag').innerText = w.id2 === 'knife' ? "Vô hạn" : `${w.mag} / ${w.maxMag}`;
        document.getElementById('info-acc').innerText = w.id2 === 'knife' ? "100%" : `${Math.round(p.getAccuracy() * 100)}%`;
        document.getElementById('info-cost').innerText = w.id2 === 'knife' ? "0" : `${w.cost} viên`;
        document.getElementById('info-mob').innerText = p.getMobility();

        const effectsEl = document.getElementById('info-effects');
        if (effectsEl) {
            effectsEl.innerHTML = ''; 
            let content = '';
            
            if (w.effects && w.effects.length > 0) {
                w.effects.forEach(eff => {
                    content += `<div style="margin-bottom: 4px;">
                        <strong style="color: #3498db;">• ${eff.name}:</strong> 
                        <span style="color: #ccc;">${eff.desc}</span>
                    </div>`;
                });
            }

            if (w.debuff) {
                const debuffInfo = DEBUFFS[w.debuff.type];
                if (debuffInfo) {
                    content += `<div style="margin-bottom: 4px;">
                        <strong style="color: #e74c3c;">• Gây ${debuffInfo.name}:</strong> 
                        <span style="color: #ccc;">Tỉ lệ ${Math.round(w.debuff.chance * 100)}%. ${debuffInfo.desc} trong ${w.debuff.duration} lượt.</span>
                    </div>`;
                }
            }

            if (content === '') content = '<span style="color: #777; font-style: italic;">Không có hiệu ứng đặc biệt.</span>';
            effectsEl.innerHTML = content;
        }

        document.getElementById('modal-weapon-info').classList.remove('hidden');
    }
}