// js/main.js
import { Game } from './Game.js';

// --- BIẾN QUẢN LÝ SETUP ---
let totalPlayers = 0;
let playersData = [];
let currentSetupIndex = 0;
const colors = ['red', 'blue', 'green', 'yellow'];

// Khởi tạo đối tượng Game
const game = new Game();

// --- BIẾN LƯU CẤU HÌNH ---
let selectedViewMode = 'pc'; 
let selectedGameMode = 'pvp'; 
let selectedMap = 'training'; 

// --- BIẾN QUẢN LÝ COOLDOWN & KHÓA NÚT (MỚI) ---
let isButtonCooldown = false; // Cờ đánh dấu đang chờ 0.2s

/**
 * Hàm kiểm tra xem người chơi có được phép bấm nút không
 * @returns {boolean} True nếu được phép bấm, False nếu bị chặn
 */
function canInteract() {
    // 1. Nếu game chưa bắt đầu hoặc đang xử lý hiệu ứng
    if (!game || game.isProcessing) return false;

    // 2. Nếu đang trong thời gian chờ 0.2s (tránh spam nút)
    if (isButtonCooldown) return false;

    // 3. Nếu là lượt của AI (Quái/Boss) -> CHẶN TUYỆT ĐỐI
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (currentPlayer && currentPlayer.isAI) {
        console.log("🚫 Đang là lượt của AI, không được bấm!");
        return false;
    }

    // --- NẾU QUA ĐƯỢC HẾT CÁC BƯỚC TRÊN -> CHO PHÉP ---
    
    // Kích hoạt cooldown ngay lập tức
    isButtonCooldown = true;
    setTimeout(() => {
        isButtonCooldown = false;
    }, 200); // 0.2 giây (200ms)

    return true;
}

// Cập nhật giao diện khi đổi lượt (Game.js sẽ gọi hàm này)
function updateControlVisuals() {
    // Tìm container chứa các nút bấm (giả sử là .right-panel hoặc body nếu mobile)
    const controls = document.querySelector('.right-panel') || document.querySelector('.controls-container');
    const currentPlayer = game.players[game.currentPlayerIndex];
    
    if (controls && currentPlayer) {
        if (currentPlayer.isAI) {
            controls.classList.add('ai-turn-locked'); // Thêm class làm mờ (cần CSS)
        } else {
            controls.classList.remove('ai-turn-locked');
        }
    }
}
// Gán vào window để Game.js có thể gọi
window.updateControlVisuals = updateControlVisuals;


// --- DOM ELEMENTS ---
const screenSetup = document.getElementById('setup-screen');
const screenAvatar = document.getElementById('avatar-screen');
const screenGame = document.getElementById('game-screen');

const btnToAvatar = document.getElementById('btn-to-avatar');
const btnConfirmAvatar = document.getElementById('btn-confirm-avatar');
const avatarOptions = document.querySelectorAll('.avatar-option');
const avatarPlayerName = document.getElementById('avatar-player-name');


// --- 1. SỰ KIỆN: TỪ SETUP SANG CHỌN AVATAR ---
btnToAvatar.addEventListener('click', () => {
    totalPlayers = parseInt(document.getElementById('player-count').value);
    
    // A. LẤY CHẾ ĐỘ HIỂN THỊ
    const viewModeEl = document.getElementById('view-mode');
    if (viewModeEl) selectedViewMode = viewModeEl.value;

    // B. LẤY CHẾ ĐỘ CHƠI (PvP / BOSS)
    const gameModeEl = document.getElementById('game-mode');
    if (gameModeEl) selectedGameMode = gameModeEl.value;

    // C. LẤY BẢN ĐỒ (Nếu chọn Boss mode)
    const mapSelectEl = document.getElementById('map-select');
    if (mapSelectEl) selectedMap = mapSelectEl.value;

    // Reset dữ liệu cũ
    playersData = [];
    currentSetupIndex = 0;

    updateAvatarHeader();
    switchScreen(screenSetup, screenAvatar);
});

// --- 2. SỰ KIỆN: CHỌN AVATAR ---
avatarOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
        avatarOptions.forEach(el => el.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        btnConfirmAvatar.disabled = false;
    });
});

btnConfirmAvatar.addEventListener('click', () => {
    const selected = document.querySelector('.avatar-option.selected');
    if (!selected) return;

    playersData.push({
        id: currentSetupIndex,
        name: `Player ${currentSetupIndex + 1}`,
        color: colors[currentSetupIndex],
        avatar: selected.dataset.img
    });

    selected.classList.remove('selected');
    btnConfirmAvatar.disabled = true;
    currentSetupIndex++;

    if (currentSetupIndex < totalPlayers) {
        updateAvatarHeader();
    } else {
        startGame();
    }
});

function updateAvatarHeader() {
    avatarPlayerName.innerText = `Player ${currentSetupIndex + 1}`;
    avatarPlayerName.style.color = colors[currentSetupIndex];
}

// --- 3. LOGIC VÀO GAME ---
function startGame() {
    switchScreen(screenAvatar, screenGame);
    
    // Gán class cho body để CSS nhận diện Mobile/PC
    document.body.classList.remove('mode-pc', 'mode-mobile');
    if (selectedViewMode === 'mobile') {
        document.body.classList.add('mode-mobile');
    } else {
        document.body.classList.add('mode-pc');
    }
    
    console.log(`-> START GAME: Mode=${selectedGameMode}, Map=${selectedMap}, View=${selectedViewMode}`);

    // Gọi hàm init
    game.init(playersData, selectedViewMode, selectedGameMode, selectedMap);
    
    // Cập nhật trạng thái nút bấm ngay khi vào game
    updateControlVisuals();
}

function switchScreen(from, to) {
    from.classList.remove('active');
    setTimeout(() => {
        from.classList.add('hidden');
        to.classList.remove('hidden');
        to.classList.add('active');
    }, 100);
}

// --- 4. CÁC SỰ KIỆN TRONG GAME (ĐÃ ÁP DỤNG KHÓA NÚT) ---

// Nút Kết thúc lượt
const btnEndTurn = document.getElementById('btn-end-turn');
if (btnEndTurn) {
    btnEndTurn.addEventListener('click', () => {
        if (!canInteract()) return; // <--- KIỂM TRA ĐIỀU KIỆN
        console.log("-> Bấm nút Kết Thúc Lượt");
        
        // Ưu tiên dùng endTurn nếu có (để reset các trạng thái UI), nếu không thì dùng nextTurn
        if (typeof game.endTurn === 'function') {
            game.endTurn();
        } else {
            game.nextTurn();
        }
    });
}

// Nút Di chuyển
const btnMove = document.getElementById('btn-move');
if (btnMove) {
    btnMove.addEventListener('click', () => {
        if (!canInteract()) return; // <--- KIỂM TRA ĐIỀU KIỆN
        game.startMovePhase();
    });
}

// Nút Tấn công
const btnAttack = document.getElementById('btn-attack');
if (btnAttack) {
    btnAttack.addEventListener('click', () => {
        if (!canInteract()) return; // <--- KIỂM TRA ĐIỀU KIỆN
        game.startAttackPhase();
    });
}

// Nút Nạp đạn (Nếu có)
const btnReload = document.getElementById('btn-reload');
if (btnReload) {
    btnReload.addEventListener('click', () => {
        if (!canInteract()) return;
        game.reloadWeapon();
    });
}

// Nút Túi đồ
const modalInv = document.getElementById('modal-inventory');
const btnInv = document.getElementById('btn-inventory');
const closeInv = document.getElementById('close-inventory');

if (btnInv && modalInv) {
    btnInv.addEventListener('click', () => {
        if (!canInteract()) return; // <--- KIỂM TRA ĐIỀU KIỆN
        modalInv.classList.remove('hidden');
        game.openInventory();
    });
    closeInv.addEventListener('click', () => modalInv.classList.add('hidden'));
}

// --- SỰ KIỆN NÚT KỸ NĂNG (ACTIVE SKILL) ---
const btnSkill = document.getElementById('btn-skill');
if(btnSkill) {
    btnSkill.addEventListener('click', () => {
        if (!canInteract()) return; // <--- KIỂM TRA ĐIỀU KIỆN

        const player = game.players[game.currentPlayerIndex];
        const effects = player.weapon.effects || [];
        
        const activeEffect = effects.find(eff => eff.isActive === true);
        
        if (activeEffect) {
            console.log("-> Kích hoạt kỹ năng:", activeEffect.code);
            game.activateSkill(activeEffect.code); 
        }
    });
}

// Modal chi tiết súng
const weaponDisplay = document.getElementById('weapon-display-area');
const modalWeapon = document.getElementById('modal-weapon-info');
const closeWeapon = document.getElementById('close-weapon');

if (weaponDisplay) {
    weaponDisplay.addEventListener('click', () => game.showWeaponDetails());
}
if (closeWeapon) {
    closeWeapon.addEventListener('click', () => modalWeapon.classList.add('hidden'));
}

// Đóng modal khi click ra ngoài
window.addEventListener('click', (e) => {
    if (e.target == modalInv) modalInv.classList.add('hidden');
    if (e.target == modalWeapon) modalWeapon.classList.add('hidden');
});

// --- HÀM CẬP NHẬT GIAO DIỆN NÚT (Được gọi từ Game.js) ---
window.updateControlVisuals = function() {
    // 1. Lấy thông tin người chơi hiện tại
    const player = game.getCurrentPlayer();
    if (!player) return;

    const isAI = player.isAI;
    
    // 2. Danh sách các nút cần khóa/mở
    const buttons = [
        document.getElementById('btn-move'),
        document.getElementById('btn-attack'),
        document.getElementById('btn-end-turn'),
        document.getElementById('btn-skill'),
        document.getElementById('btn-inventory')
    ];

    // 3. Duyệt qua từng nút để đổi màu/khóa
    buttons.forEach(btn => {
        if (!btn) return; // Bỏ qua nếu không tìm thấy nút

        if (isAI) {
            // Nếu là lượt AI: Thêm class disabled, bỏ sự kiện click (visual)
            btn.classList.add('disabled');
            btn.style.opacity = '0.5';
            btn.style.pointerEvents = 'none';
        } else {
            // Nếu là lượt Người: Khôi phục lại
            btn.classList.remove('disabled');
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        }
    });

    // Cập nhật text thông báo lượt
    const turnInfo = document.getElementById('turn-info'); // Nếu có thẻ này
    if (turnInfo) {
        turnInfo.innerText = isAI ? `Lượt của: ${player.name} (Đang nghĩ...)` : `Lượt của bạn: ${player.name}`;
        turnInfo.style.color = player.color;
    }
};