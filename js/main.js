// js/main.js
import { Game } from './Game.js';

// --- BIẾN QUẢN LÝ SETUP ---
let totalPlayers = 0;
let playersData = [];
let currentSetupIndex = 0;
const colors = ['red', 'blue', 'green', 'yellow'];

// --- DOM ELEMENTS ---
const screenSetup = document.getElementById('setup-screen');
const screenAvatar = document.getElementById('avatar-screen');
const screenGame = document.getElementById('game-screen');

const btnToAvatar = document.getElementById('btn-to-avatar');
const btnConfirmAvatar = document.getElementById('btn-confirm-avatar');
const avatarOptions = document.querySelectorAll('.avatar-option');
const avatarPlayerName = document.getElementById('avatar-player-name');

// Khởi tạo đối tượng Game
const game = new Game();

// Thêm biến global để lưu chế độ (Mặc định là PC)
let selectedViewMode = 'pc'; 

// --- 1. SỰ KIỆN: TỪ SETUP SANG CHỌN AVATAR ---
btnToAvatar.addEventListener('click', () => {
    totalPlayers = parseInt(document.getElementById('player-count').value);
    
    // LẤY GIÁ TRỊ CHẾ ĐỘ TỪ HTML (Nếu có element này)
    const viewModeEl = document.getElementById('view-mode');
    if (viewModeEl) {
        selectedViewMode = viewModeEl.value;
    }

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
    
    // CẬP NHẬT QUAN TRỌNG: Truyền selectedViewMode vào hàm init
    console.log("-> Bắt đầu game với chế độ:", selectedViewMode);
    game.init(playersData, selectedViewMode);
}

function switchScreen(from, to) {
    from.classList.remove('active');
    setTimeout(() => {
        from.classList.add('hidden');
        to.classList.remove('hidden');
        to.classList.add('active');
    }, 100);
}

// --- 4. CÁC SỰ KIỆN TRONG GAME (NÚT BẤM) ---

// Nút Kết thúc lượt
document.getElementById('btn-end-turn').addEventListener('click', () => {
    if (game.isProcessing) return; // Chặn nếu đang xử lý animation
    console.log("-> Bấm nút Kết Thúc Lượt");
    game.nextTurn();
});

// Nút Di chuyển
document.getElementById('btn-move').addEventListener('click', () => {
    if (game.isProcessing) return;
    game.startMovePhase();
});

// Nút Tấn công
document.getElementById('btn-attack').addEventListener('click', () => {
    if (game.isProcessing) return;
    game.startAttackPhase();
});

// Nút Túi đồ
const modalInv = document.getElementById('modal-inventory');
const btnInv = document.getElementById('btn-inventory');
const closeInv = document.getElementById('close-inventory');

btnInv.addEventListener('click', () => {
    modalInv.classList.remove('hidden');
    game.openInventory();
});
closeInv.addEventListener('click', () => modalInv.classList.add('hidden'));

// --- SỰ KIỆN NÚT KỸ NĂNG (ACTIVE SKILL) ---
const btnSkill = document.getElementById('btn-skill');
if(btnSkill) {
    btnSkill.addEventListener('click', () => {
        if (game.isProcessing) return; // Chặn nếu đang xử lý

        // Lấy thông tin người chơi hiện tại
        const player = game.players[game.currentPlayerIndex];
        const effects = player.weapon.effects || [];
        
        // Tìm skill Active (Dựa trên thuộc tính isActive trong data.js)
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