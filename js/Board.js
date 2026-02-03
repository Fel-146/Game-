// js/Board.js
import { ITEMS } from './data.js';

export class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
    }

    // 1. TẠO MAP
    generateMap() {
        this.grid = [];
        for (let y = 0; y < this.rows; y++) {
            const row = [];
            for (let x = 0; x < this.cols; x++) {
                let cell = { x, y, type: 'empty', item: null }; // Đã xóa powerup
                const rand = Math.random();
                if (rand < 0.15) cell.type = 'wall';
                row.push(cell);
            }
            this.grid.push(row);
        }

        // Sinh 2 hòm mỗi loại
        this.spawnSpecificCrate(ITEMS.CRATE_WEAPON, 2, []);
        this.spawnSpecificCrate(ITEMS.CRATE_AMMO, 2, []);
        this.spawnSpecificCrate(ITEMS.CRATE_SUPPLY, 2, []);
    }

    // 2. SINH HÒM CỤ THỂ
    spawnSpecificCrate(crateData, count, players) {
        for(let i=0; i<count; i++) {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 50) {
                const rx = Math.floor(Math.random() * this.cols);
                const ry = Math.floor(Math.random() * this.rows);
                const cell = this.grid[ry][rx];

                const isOccupied = players.some(p => p.x === rx && p.y === ry && p.isAlive);
                if (cell.type !== 'wall' && !cell.item && !isOccupied) {
                    cell.item = { ...crateData }; 
                    placed = true;
                }
                attempts++;
            }
        }
    }

    // 3. KIỂM TRA VÀ BÙ ĐẮP HÒM (Gọi khi render)
    refillCrates(players) {
        const limits = [
            { data: ITEMS.CRATE_WEAPON, max: 2 },
            { data: ITEMS.CRATE_AMMO, max: 2 },
            { data: ITEMS.CRATE_SUPPLY, max: 2 }
        ];

        limits.forEach(type => {
            let currentCount = 0;
            for(let y=0; y<this.rows; y++) {
                for(let x=0; x<this.cols; x++) {
                    if (this.grid[y][x].item && this.grid[y][x].item.id === type.data.id) {
                        currentCount++;
                    }
                }
            }
            if (currentCount < type.max) {
                this.spawnSpecificCrate(type.data, type.max - currentCount, players);
            }
        });
    }

    spawnPlayers(players) {
        players.forEach(p => { p.x = -1; p.y = -1; });
        players.forEach(player => {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 200) {
                const rx = Math.floor(Math.random() * this.cols);
                const ry = Math.floor(Math.random() * this.rows);
                const cell = this.grid[ry][rx];
                if (cell.type !== 'wall' && !cell.item) {
                    const isOccupied = players.some(p => p.x === rx && p.y === ry);
                    if (!isOccupied) {
                        player.x = rx; player.y = ry; placed = true;
                    }
                }
                attempts++;
            }
        });
    }

    render(container, players) {
        this.refillCrates(players); // Luôn đảm bảo đủ hòm

        container.innerHTML = ''; 
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cellData = this.grid[y][x];
                const cellDiv = document.createElement('div');
                cellDiv.className = 'grid-cell';
                cellDiv.dataset.x = x;
                cellDiv.dataset.y = y;

                if (cellData.type === 'wall') cellDiv.classList.add('cell-wall');

                // Vẽ Hòm
                if (cellData.item) {
                    const itemImg = document.createElement('img');
                    itemImg.src = cellData.item.img;
                    itemImg.className = 'item-img-on-map crate-glow';
                    cellDiv.appendChild(itemImg);
                }

                // Vẽ Người chơi
                const player = players.find(p => p.x === x && p.y === y && p.isAlive);
                if (player) {
                    const statContainer = document.createElement('div');
                    statContainer.className = 'token-stat-container';
                    
                    const hpPercent = (player.hp / player.maxHp) * 100;
                    const hpBg = document.createElement('div');
                    hpBg.className = 'mini-bar-bg';
                    const hpFill = document.createElement('div');
                    hpFill.className = 'mini-bar-fill fill-hp';
                    if(hpPercent<30) hpFill.classList.add('low');
                    hpFill.style.width = `${hpPercent}%`;
                    hpBg.appendChild(hpFill);
                    statContainer.appendChild(hpBg);

                    if (player.maxArmor > 0) {
                        const armorPercent = (player.armor / player.maxArmor) * 100;
                        const armorBg = document.createElement('div');
                        armorBg.className = 'mini-bar-bg';
                        const armorFill = document.createElement('div');
                        armorFill.className = 'mini-bar-fill fill-armor';
                        armorFill.style.width = `${armorPercent}%`;
                        armorBg.appendChild(armorFill);
                        statContainer.appendChild(armorBg);
                    }

                    const pToken = document.createElement('div');
                    pToken.className = 'player-token';
                    pToken.style.borderColor = player.color;
                    const pImg = document.createElement('img');
                    pImg.src = player.avatar;
                    pToken.appendChild(pImg);

                    cellDiv.appendChild(statContainer);
                    cellDiv.appendChild(pToken);
                }
                container.appendChild(cellDiv);
            }
        }
    }

    // Các hàm phụ trợ
    highlightCells(cells, type) {
        cells.forEach(c => {
            const cellDiv = document.querySelector(`.grid-cell[data-x="${c.x}"][data-y="${c.y}"]`);
            if (cellDiv) {
                if (type === 'move') cellDiv.classList.add('highlight-move');
                if (type === 'attack-dir') cellDiv.classList.add('highlight-attack-dir');
                if (type === 'throw') cellDiv.classList.add('highlight-throw');
            }
        });
    }
    
    clearHighlights() {
        document.querySelectorAll('.highlight-move, .highlight-attack-dir, .highlight-throw').forEach(el => {
            el.classList.remove('highlight-move');
            el.classList.remove('highlight-attack-dir');
            el.classList.remove('highlight-throw');
        });
    }

    showFloatingText(x, y, msg, type = 'info') {
        const cell = document.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
        if (!cell) return;
        const rect = cell.getBoundingClientRect();
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);
        const textEl = document.createElement('div');
        textEl.className = `floating-text text-${type}`;
        textEl.innerHTML = msg;
        textEl.style.left = `${centerX}px`;
        textEl.style.top = `${centerY}px`;
        document.body.appendChild(textEl);
        setTimeout(() => { textEl.remove(); }, 1500);
    }

    drawBullet(x1, y1, x2, y2) {
       const boardEl = document.getElementById('game-board');
       const cell1 = document.querySelector(`.grid-cell[data-x="${x1}"][data-y="${y1}"]`);
       const cell2 = document.querySelector(`.grid-cell[data-x="${x2}"][data-y="${y2}"]`);
       if (!cell1 || !cell2) return;
       const startX = cell1.offsetLeft + cell1.offsetWidth / 2;
       const startY = cell1.offsetTop + cell1.offsetHeight / 2;
       const endX = cell2.offsetLeft + cell2.offsetWidth / 2;
       const endY = cell2.offsetTop + cell2.offsetHeight / 2;
       const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
       const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
       const bullet = document.createElement('div');
       bullet.className = 'bullet-trail';
       bullet.style.width = `${length}px`;
       bullet.style.left = `${startX}px`;
       bullet.style.top = `${startY}px`;
       bullet.style.transform = `rotate(${angle}deg)`;
       boardEl.appendChild(bullet);
       setTimeout(() => { bullet.style.opacity = '0'; setTimeout(() => bullet.remove(), 500); }, 100);
    }

    showExplosion(cells, colorRgba) {
        cells.forEach(c => {
            const cellDiv = document.querySelector(`.grid-cell[data-x="${c.x}"][data-y="${c.y}"]`);
            if (cellDiv) {
                const overlay = document.createElement('div');
                overlay.className = 'explosion-flash'; 
                overlay.style.backgroundColor = colorRgba; 
                overlay.style.position = 'absolute'; overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100%'; overlay.style.height = '100%'; overlay.style.zIndex = '5';
                cellDiv.appendChild(overlay);
                setTimeout(() => { overlay.remove(); }, 500);
            }
        });
    }
}