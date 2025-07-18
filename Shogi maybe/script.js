const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const promoteButton = document.getElementById('promoteButton');
const dropSelect = document.getElementById('dropSelect');
const dropButton = document.getElementById('dropButton');
const boardSize = Math.min(canvas.width, canvas.height) * 0.9;
const cellSize = boardSize / 9;
const offsetX = (canvas.width - boardSize) / 2;
const offsetY = (canvas.height - boardSize) / 2;
const captured = {
    player1: [],
    player2: []
};
let turn = 0;
let playerTurn = 'player1';
let gameOver = false;
let canPromote = false;
let pieceReadyForPromotion = null;
const pieces = {
    'P': { image: 'pawn.png' },
    'L': { image: 'lance.png'},
    'N': { image: 'knight.png' },
    'Q': { image: 'silver.png'},
    'G': { image: 'gold.png' },
    'LX': { image: 'lance.png' },
    'NX': { image: 'knight.png' },
    'QX': { image: 'silver.png' },
    'GX': { image: 'gold.png' },
    'B': { image: 'bishop.png' },
    'R': { image: 'rook.png' },
    'K': { image: 'king.png' },
    'PS': { image: 'pawn2.png' },
    'LS': { image: 'lance2.png' },
    'NS': { image: 'knight2.png' },
    'QS': { image: 'silver2.png' },
    'GS': { image: 'gold2.png' },
    'LXS': { image: 'lance2.png' },
    'NXS': { image: 'knight2.png' },
    'QXS': { image: 'silver2.png' },
    'GXS': { image: 'gold2.png' },
    'BS': { image: 'bishop2.png' },
    'RS': { image: 'rook2.png' },
    'KS': { image: 'king2.png' },
    'P+': { image: 'pawn_prom.png' },
    'L+': { image: 'lance_prom.png' },
    'N+': { image: 'knight_prom.png' },
    'Q+': { image: 'silver_prom.png' },
    'B+': { image: 'bishop_prom.png' },
    'R+': { image: 'rook_prom.png' },
    'PS+': {image: 'pawn_prom2.png' },
    'LS+': { image: 'lance_prom2.png' },
    'NS+': { image: 'knight_prom2.png' },
    'QS+': { image: 'silver_prom2.png' },
    'BS+': { image: 'bishop_prom2.png' },
    'RS+': { image: 'rook_prom2.png' }
};

const pieceImages = {};
for (const key in pieces) {
    pieceImages[key] = new Image();
    pieceImages[key].src = pieces[key].image;
}
function drawBoard() {
    ctx.fillStyle = '#f4e2b8'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const boardSize = Math.min(canvas.width, canvas.height) * 0.9; 
    const cellSize = boardSize / 9;
    const offsetX = (canvas.width - boardSize) / 2;
    const offsetY = (canvas.height - boardSize) / 2;

    ctx.fillStyle = '#f4e2b8';
    ctx.fillRect(offsetX, offsetY, boardSize, boardSize);

    ctx.strokeStyle = '#000';

    for (let i = 0; i <= 9; i++) {
        ctx.beginPath();
        ctx.moveTo(offsetX + i * cellSize, offsetY);
        ctx.lineTo(offsetX + i * cellSize, offsetY + boardSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY + i * cellSize);
        ctx.lineTo(offsetX + boardSize, offsetY + i * cellSize);
        ctx.stroke();
    }
}
function highlightCell(row, col, boardSize, offsetX, offsetY) {
    const cellSize = boardSize / 9;

    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; 
    ctx.fillRect(
        offsetX + col * cellSize,
        offsetY + row * cellSize,
        cellSize,
        cellSize
    );
}


function spawnInitialPieces() {
    for (let col = 0; col < 9; col++) {
        pieces[`P${col}`] = { image: 'pawn.png', x: col, y: 6 };
    }
    pieces['K'] = { image: 'king.png', x: 4, y: 8 };
    pieces['R'] = { image: 'rook.png', x: 7, y: 7 };
    pieces['B'] = { image: 'bishop.png', x: 1, y: 7 };
    pieces['G'] = { image: 'gold.png', x: 3, y: 8 };
    pieces['Q'] = { image: 'silver.png', x: 2, y: 8 };
    pieces['N'] = { image: 'knight.png', x: 1, y: 8 };
    pieces['L'] = { image: 'lance.png', x: 0, y: 8 };
    pieces['GX'] = { image: 'gold.png', x: 5, y: 8 };
    pieces['QX'] = { image: 'silver.png', x: 6, y: 8 };
    pieces['NX'] = { image: 'knight.png', x: 7, y: 8 };
    pieces['LX'] = { image: 'lance.png', x: 8, y: 8 };
    for (let col = 0; col < 9; col++) {
        pieces[`PS${col}S`] = { image: 'pawn2.png', x: col, y: 2 };
    }
    pieces['KS'] = { image: 'king2.png', x: 4, y: 0 };
    pieces['RS'] = { image: 'rook2.png', x: 7, y: 1 };
    pieces['BS'] = { image: 'bishop2.png', x: 1, y: 1 };
    pieces['GS'] = { image: 'gold2.png', x: 3, y: 0 };
    pieces['QS'] = { image: 'silver2.png', x: 2, y: 0 };
    pieces['NS'] = { image: 'knight2.png', x: 1, y: 0 };
    pieces['LS'] = { image: 'lance2.png', x: 0, y: 0 };
    pieces['GXS'] = { image: 'gold2.png', x: 5, y: 0 };
    pieces['QXS'] = { image: 'silver2.png', x: 6, y: 0 };
    pieces['NXS'] = { image: 'knight2.png', x: 7, y: 0 };
    pieces['LXS'] = { image: 'lance2.png', x: 8, y: 0 };
}
function drawPieces() {
    const cellSize = boardSize / 9;
    for (const key in pieces) {
        const piece = pieces[key];
        if (key.includes('S+')) {
            img = pieceImages[key[0] + 'S+'];
        } else if (key.includes('+')) {
            img = pieceImages[key[0] + '+'];
        } else if (key.includes('S')) {
            img = pieceImages[key[0] + 'S'];
        } else {
            img = pieceImages[key[0]];
        }

                if (img && img.complete) {
            ctx.drawImage(
                img,
                offsetX + piece.x * cellSize,
                offsetY + piece.y * cellSize,
                cellSize,
                cellSize
            );
        }
    }
}

function loadAllImages(callback) {
    let loadedCount = 0;
    const totalImages = Object.keys(pieceImages).length;

    for (const key in pieceImages) {
        pieceImages[key].onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                callback();
            }
        };
        pieceImages[key].onerror = () => {
            console.error(`Failed to load image: ${pieceImages[key].src}`);
        };
    }
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPieces();
    checkmate('player1');
    checkmate('player2');
    updateDropOptions();
}

let selectedPieceKey = null;
promoteButton.addEventListener('click', () => {
    if(!canPromote) {
        console.log("Promotion not allowed at this time.");
        return;
    }
    if (selectedPieceKey === null) {
        console.log("No piece selected for promotion.");
        return;
    }
    if (selectedPieceKey.includes('+')) {
        console.log(`Can't promote ${selectedPieceKey} as it's already promoted.`);
        return;
    }
    if (checkPromotion(selectedPieceKey) && canPromote) {
        const newKey = promotePiece(selectedPieceKey);
        pieceReadyForPromotion = newKey;
        canPromote = false;
        selectedPieceKey = null;
        updateGame();
    } else {
        console.log(`Piece ${selectedPieceKey} cannot be promoted.`);
        console.log("Piece cannot be promoted here.");
    }
});
let isDropping = false;
let pieceToDrop = null;

dropButton.addEventListener('click', () => {
    const selectedPiece = dropSelect.value;
    if (!selectedPiece) {
        console.log("No piece selected for dropping.");
        return;
    }
    isDropping = true;
    pieceToDrop = selectedPiece;
    console.log(`Ready to drop ${selectedPiece}. Click on the board.`);
});
canvas.addEventListener('click', (event) => {
    if (gameOver) {
        console.log("Game over! No more moves allowed.");
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor((x - offsetX) / cellSize);
    const row = Math.floor((y - offsetY) / cellSize);
    if (col < 0 || col >= 9 || row < 0 || row >= 9) return;
    if (isDropping) {
        let tempPieceToDrop = pieceToDrop;
        let owner = getOwner(pieceToDrop);
        if (playerTurn === 'player2' && !tempPieceToDrop.includes('S')) {
            console.log('Before:', tempPieceToDrop);
            tempPieceToDrop += 'S';
            console.log('After:', tempPieceToDrop);

        } else if (playerTurn === 'player1' && tempPieceToDrop.includes('S')) {
            console.log('Before:', tempPieceToDrop);
            tempPieceToDrop = tempPieceToDrop.replace(/S/g, '');
            console.log('After:', tempPieceToDrop);
        }
        if (noNifu(owner, col) === false && tempPieceToDrop.startsWith('P')) {
            console.log(`Cannot drop pawn at column ${col} due to nifu rule`);
            return false;
        }
        if(!legalDrop(pieceToDrop, col, row)) {
            console.log(`Illegal drop for ${pieceToDrop} at (${col}, ${row})`);
            return;
        }
        else {
            const baseKey = getBaseKey(pieceToDrop); 
            let suffix = pieceToDrop.slice(baseKey.length); 
            let newKey = baseKey;

            if (playerTurn === 'player2' && !newKey.includes('S')) {
                console.log('Before:', newKey);
                newKey += 'S';
                console.log('After:', newKey);

            } else if (playerTurn === 'player1' && newKey.includes('S')) {
                console.log('Before:', newKey);
                newKey = newKey.replace(/S/g, '');
                console.log('After:', newKey);
            }

            const fullKey = newKey;

            if (!pieceImages[newKey]) {
                console.error(`No image for ${newKey}`);
                return;
            }

            const uniqueId = fullKey + '_' + Date.now();
            pieces[uniqueId] = { x: col, y: row, image: pieceImages[newKey].src };

            captured[playerTurn] = captured[playerTurn].filter(p => p !== pieceToDrop);

            console.log(`Dropped ${fullKey} at (${col}, ${row})`);
            isDropping = false;
            pieceToDrop = null;
            turn++;
            playerTurn = makeTurn();
            updateGame();
            return;
        }
    }
    if (selectedPieceKey === null) {
        for (const key in pieces) {
            const p = pieces[key];
            if (p.x === col && p.y === row) {
                selectedPieceKey = key;
                highlightCell(row, col, boardSize, offsetX, offsetY);
                console.log(`Selected piece: ${key} at (${col}, ${row}) owned by ${getOwner(key)}`);
                break;
            }}
    } else {
        const piece = pieces[selectedPieceKey];
        if (piece.x === col && piece.y === row) { 
            selectedPieceKey = null; 
            updateGame();
            console.log(`Deselected piece: ${selectedPieceKey}`);
            return;
        }
        let isValidMove = false;

        if (selectedPieceKey.startsWith('R+') || selectedPieceKey.startsWith('RS+')) {
            isValidMove = isLegalRookPromoMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('B+') || selectedPieceKey.startsWith('BS+')) {
            isValidMove = isLegalBishopPromoMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.includes('+') && !selectedPieceKey.includes('R') && !selectedPieceKey.includes('B')) {
            isValidMove = isLegalPromoMove(selectedPieceKey, piece.x, piece.y, col, row);}
        else if (selectedPieceKey.startsWith('P') || selectedPieceKey.startsWith('PS')) {
            isValidMove = isLegalPawnMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('L') || selectedPieceKey.startsWith('LS') ) {
            isValidMove = isLegalLanceMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('N') || selectedPieceKey.startsWith('NS')) {
            isValidMove = isLegalKnightMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('Q') || selectedPieceKey.startsWith('QS')) {
            isValidMove = isLegalSilverMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('G') || selectedPieceKey.startsWith('GS')) {
            isValidMove = isLegalGoldMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('K') || selectedPieceKey.startsWith('KS')) {
            if (wouldBeInCheckAfterMove(selectedPieceKey, col, row)) {
                console.log("Can't move into check, King would be in danger!");
                isValidMove = false;
            }else{
            isValidMove = isLegalKingMove(selectedPieceKey, piece.x, piece.y, col, row);
            }
        } else if (selectedPieceKey.startsWith('B') || selectedPieceKey.startsWith('BS')) {
            isValidMove = isLegalBishopMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('R') || selectedPieceKey.startsWith('RS')) {
            isValidMove = isLegalRookMove(selectedPieceKey, piece.x, piece.y, col, row);
        }

        if (!isValidMove) {
            console.log(`Invalid move for ${selectedPieceKey} to (${col}, ${row})`);
            return;
        }

        if (playerTurn !== getOwner(selectedPieceKey)) {
            console.log(`It's not your turn! Current turn: ${playerTurn}`);
            return;
        }
        if (isOccupied(col, row)) {
            for (const key in pieces) {
                const p = pieces[key];
                if (p.x === col && p.y === row) {
                    if (key.startsWith('K')) {
                        console.log("Cant capture the king");
                        return; 
                    }
                    const movingPieceOwner = getOwner(selectedPieceKey);
                    const targetPieceOwner = getOwner(key);
                    console.log('Moving:', selectedPieceKey, 'Owner:', movingPieceOwner);
                    console.log('Target:', key, 'Owner:', targetPieceOwner);

                    if (movingPieceOwner === targetPieceOwner) {
                        console.log("Can't capture your own piece!");
                        return;
                    }

                    captured[movingPieceOwner].push(key);
                    delete pieces[key];
                    console.log(`Captured ${key} at (${col}, ${row})`);
                    break;
                }
            }
        }
        piece.x = col;
        piece.y = row;
        canPromote = checkPromotion(selectedPieceKey);
        turn++;
        playerTurn = makeTurn();
        forcePromotion(selectedPieceKey, piece.x, piece.y, col, row);
        selectedPieceKey = null;
        updateGame();
        inCheck('player1');
        inCheck('player2');
        console.log(`Moved piece to (${col}, ${row})`);
    }
});
function isLegalPawnMove(pieceKey, fromX, fromY, toX, toY) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const direction = pieceKey.startsWith('PS') ? 1 : -1;
    const owner = pieceKey.includes('S') ? 'player2' : 'player1';
    if (dx === 0 && dy === direction) {
        for (const key in pieces) {
            const p = pieces[key];
            if (p.x === toX && p.y === toY) {
                const targetOwner = key.includes('S') ? 'player2' : 'player1';
                if (targetOwner === owner) {
                    console.log(`Can't move — your own piece at (${toX}, ${toY})`); 
                    return false;
                } else {
                    console.log(`Capturing enemy at (${toX}, ${toY})`);
                    return true;
                }
            }
        }
        return true;
    }
    return false;
}

function isLegalLanceMove(pieceKey, fromX, fromY, toX, toY) {
    if (fromX !== toX) return false;
    const direction = pieceKey.startsWith('LS') || pieceKey.startsWith('LXS') ? 1 : -1;
    const dy = toY - fromY;
    if (direction * dy <= 0) return false;
    const stepY = direction;
    for (let y = fromY + stepY; y !== toY; y += stepY) {
        if (isOccupied(fromX, y)) {
            console.log(`Blocked at (${fromX}, ${y})`);
            return false;
        }
    }
    for (const key in pieces) {
        const p = pieces[key];
        if (p.x === toX && p.y === toY) {
            const owner = pieceKey.includes('S') ? 'player2' : 'player1';
            const targetOwner = key.includes('S') ? 'player2' : 'player1';
            if (owner === targetOwner) {
                console.log(`Can't capture own piece at (${toX}, ${toY})`);
                return false;
            } else {
                console.log(`Capturing enemy at (${toX}, ${toY})`);
                return true;
            }
        }
    }
    return true;
}

function isLegalKnightMove(pieceKey, fromX, fromY, toX, toY) {
    const dx = toX - fromX;
    const dy = toY - fromY;

    const direction = pieceKey.includes('S') ? 1 : -1;

    if (!((Math.abs(dx) === 1) && (dy === 2 * direction))) {
        return false;
    }

    for (const key in pieces) {
        const p = pieces[key];
        if (p.x === toX && p.y === toY) {
            const owner = pieceKey.includes('S') ? 'player2' : 'player1';
            const targetOwner = key.includes('S') ? 'player2' : 'player1';
            if (owner === targetOwner) {
                console.log(`Can't capture own piece at (${toX}, ${toY})`);
                return false;
            } else {
                console.log(`Capturing enemy at (${toX}, ${toY})`);
                return true;
            }
        }
    }

    return true;
}
function isLegalSilverMove(pieceKey, fromX, fromY, toX, toY) {
    const dx = Math.abs(toX - fromX);
    const dy = toY - fromY;
    const direction = pieceKey.includes('S') ? 1 : -1;
    const owner = pieceKey.includes('S') ? 'player2' : 'player1';
    if ((dx === 1 && dy === 1 * direction) || (dx === 0 && dy === 1* direction) || (dx === 1 && dy === 1 * -direction)) {
        for (const key in pieces) {
            const p = pieces[key];
            if (p.x === toX && p.y === toY) {
                const targetOwner = key.includes('S') ? 'player2' : 'player1';
                if (targetOwner === owner) {
                    console.log(`Can't move — your own piece at (${toX}, ${toY})`);
                    return false;
                } else {
                    console.log(`Capturing enemy at (${toX}, ${toY})`);
                    return true;
                }
            }
        }
        return true;
    }
    return false;
}
function isLegalGoldMove(pieceKey, fromX, fromY, toX, toY) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const owner = pieceKey.includes('S') ? 'player2' : 'player1';
    const direction = pieceKey.includes('S') ? 1 : -1;
    if (dx === 0 && dy === 0) return false;
    if (dy === -direction && Math.abs(dx) === 1) return false;
    if (
        (dx === 0 && Math.abs(dy) === 1) ||       
        (Math.abs(dx) === 1 && dy === 0) ||       
        (Math.abs(dx) === 1 && dy === direction)  
    ) {
        for (const key in pieces) {
            const p = pieces[key];
            if (p.x === toX && p.y === toY) {
                const targetOwner = key.includes('S') ? 'player2' : 'player1';
                if (targetOwner === owner) {
                    console.log(`Can't move — your own piece at (${toX}, ${toY})`);
                    return false;
                } else {
                    console.log(`Capturing enemy at (${toX}, ${toY})`);
                    return true;
                }
            }
        }
        return true;
    }
    return false;
}

function isLegalKingMove(pieceKey, fromX, fromY, toX, toY) {
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    const owner = pieceKey.includes('S') ? 'player2' : 'player1';
    
    if ((dx === 1 && dy === 1) || (dx === 0 && dy === 1) || (dx === 1 && dy === 0) || (dx === 0 && dy === -1)) {
        for (const key in pieces) {
            const p = pieces[key];
            if (p.x === toX && p.y === toY) {
                const targetOwner = key.includes('S') ? 'player2' : 'player1';
                if (targetOwner === owner) {
                    console.log(`Can't move — your own piece at (${toX}, ${toY})`);
                    return false;
                } else {
                    console.log(`Capturing enemy at (${toX}, ${toY})`);
                    return true;
                }
            }
        }
        return true;
    }
    return false;
}
function isLegalBishopMove(pieceKey, fromX, fromY, toX, toY){
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    if (dx !== dy) return false;
    const stepX = (toX - fromX) / dx;
    const stepY = (toY - fromY) / dy;
    for (let i = 1; i < dx; i++) {
        const x = fromX + i * stepX;
        const y = fromY + i * stepY;
        if (isOccupied(x, y)) {
            console.log(`Blocked at (${x}, ${y})`);
            return false;
        }
    }
    return true;
}
function isLegalRookMove(pieceKey, fromX, fromY, toX, toY){
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    if (dx !== 0 && dy !== 0) return false;
    const stepX = dx === 0 ? 0 : (toX - fromX) / dx;
    const stepY = dy === 0 ? 0 : (toY - fromY) / dy;
    for (let i = 1; i < Math.max(dx, dy); i++) {
        const x = fromX + i * stepX;
        const y = fromY + i * stepY;
        if (isOccupied(x, y)) {
            console.log(`Blocked at (${x}, ${y})`);
            return false;
        }
    }
    return true;
}
function isLegalPromoMove(pieceKey, fromX, fromY, toX, toY) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const owner = pieceKey.includes('S') ? 'player2' : 'player1';
    const direction = pieceKey.includes('S') ? 1 : -1;
    if (dx === 0 && dy === 0) return false;
    if (dy === -direction && Math.abs(dx) === 1) return false;
    if (
        (dx === 0 && Math.abs(dy) === 1) ||
        (Math.abs(dx) === 1 && dy === 0) ||
        (Math.abs(dx) === 1 && dy === direction)
    ) {
        for (const key in pieces) {
            const p = pieces[key];
            if (p.x === toX && p.y === toY) {
                const targetOwner = key.includes('S') ? 'player2' : 'player1';
                if (targetOwner === owner) {
                    console.log(`Can't move — your own piece at (${toX}, ${toY})`);
                    return false;
                } else {
                    console.log(`Capturing enemy at (${toX}, ${toY})`);
                    return true;
                }
            }
        }
        return true;
    }
    return false;
}
function isLegalRookPromoMove(pieceKey, fromX, fromY, toX, toY) {
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    const owner = pieceKey.includes('S') ? 'player2' : 'player1';
    if (dx === 0 || dy === 0) {
        const stepX = dx === 0 ? 0 : (toX - fromX) / dx;
        const stepY = dy === 0 ? 0 : (toY - fromY) / dy;
        for (let i = 1; i < Math.max(dx, dy); i++) {
            if (isOccupied(fromX + i * stepX, fromY + i * stepY)) {
                return false;
            }
        }
        return !isOwnPieceAt(toX, toY, owner);
    }
    if (dx === 1 && dy === 1) {
        return !isOwnPieceAt(toX, toY, owner);
    }
    return false;
}
function isLegalBishopPromoMove(pieceKey, fromX, fromY, toX, toY) {
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    const owner = pieceKey.includes('S') ? 'player2' : 'player1';
    if (dx === dy && dx !== 0) {
        const stepX = (toX - fromX) / dx;
        const stepY = (toY - fromY) / dy;
        for (let i = 1; i < dx; i++) {
            if (isOccupied(fromX + i * stepX, fromY + i * stepY)) {
                return false;
            }
        }
        return !isOwnPieceAt(toX, toY, owner);
    }
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        return !isOwnPieceAt(toX, toY, owner);
    }

    return false;
}

function isOwnPieceAt(x, y, owner) {
    for (const key in pieces) {
        const p = pieces[key];
        if (p.x === x && p.y === y) {
            const targetOwner = key.includes('S') ? 'player2' : 'player1';
            if (targetOwner === owner) return true;
        }
    }
    return false;
}


function isOccupied(x, y) {
    for (const key in pieces) {
        const p = pieces[key];
        if (p.x === x && p.y === y) return true;
    }
    return false;
}
/*
function inCheck(player) {
    // kingkey nice
    const kingKey = player === 'player1' ? 'K' : 'KS';
    const king = pieces[kingKey];
    if (!king) return false; 

    for (const key in pieces) {
        if (key === kingKey) continue; 
        const piece = pieces[key];
        if (piece.x === king.x && piece.y === king.y) continue; 
        if (getOwner(key) === player) {
            continue;
        }
        let isLegal = false;
        isLegal = isLegalMove(key, piece.x, piece.y, king.x, king.y);

        if (isLegal) {
            console.log(`${player} King in check by ${key}`);
            return true;
        }

    }
    return false;
}
    */
function inCheck(player, boardPieces = pieces) {
    // Find king position
    let kingPos = null;
    for (const key in boardPieces) {
        if (getOwner(key) === player && (key.startsWith('K') || key.startsWith('KS'))) {
            kingPos = { x: boardPieces[key].x, y: boardPieces[key].y };
            break;
        }
    }
    if (!kingPos) {
        console.error(`King for ${player} not found!`);
        return false;
    }

    // Check if any enemy piece attacks king's pos
    for (const key in boardPieces) {
        if (getOwner(key) !== player) {
            const p = boardPieces[key];
            if (isLegalMove(key, p.x, p.y, kingPos.x, kingPos.y, boardPieces)) {
                return true; // King is under attack
            }
        }
    }
    return false; // King safe
}
function wouldBeInCheckAfterMove(pieceKey, toX, toY) {
    const tempPieces = {};
    for (const key in pieces) {
        tempPieces[key] = { ...pieces[key] };
    }
    tempPieces[pieceKey].x = toX;
    tempPieces[pieceKey].y = toY;
    return inCheck(getOwner(pieceKey), tempPieces);
}

function checkmate(player) {
    if (!inCheck(player)) return false;

    for (const key in pieces) {
        if (ownedBy(key, player)) {
            const piece = pieces[key];
            for (let x = 0; x < 9; x++) {
                for (let y = 0; y < 9; y++) {
                    if (isLegalMove(key, piece.x, piece.y, x, y)) {
                        const originalX = piece.x;
                        const originalY = piece.y;
                        piece.x = x;
                        piece.y = y;

                        if (!inCheck(player)) {
                            piece.x = originalX;
                            piece.y = originalY;
                            return false; 
                        }

                        piece.x = originalX;
                        piece.y = originalY;
                    }
                }
            }
        }
    }

    console.log(`${player} is checkmated!`);
    gameOver = true;
    return true;
}
function promotePiece(key) {
    const piece = pieces[key];
    if (!piece) {
        console.log(`No piece at key ${key}`);
        return;
    }
    let newKey;
    if (!key.includes('+')) {
        if (key.startsWith('P')) {
        const type = key[0];  
        const rest = key.slice(1); 
        newKey = `${type}+${rest}`;}
        else {
            newKey = key + '+';
        }
    } else {
        console.log(`${key} is already promoted`);
        return;
    }
    if (!pieceImages[newKey[0] + '+']) {
        console.log(`No promoted image for ${newKey}`);
        return;
    }

    piece.image = pieceImages[newKey[0] + '+'].src;

    delete pieces[key];
    pieces[newKey] = piece;

    console.log(`${key} promoted to ${newKey}`);
    return newKey;
}
function forcePromotion(pieceKey, fromX, fromY, toX, toY) {
    if (pieceKey.startsWith('P') || pieceKey.startsWith('PS')) {
        if (toY === 0 || toY === 8) {
            promotePiece(pieceKey);
            return true;
        }
    }
    if (pieceKey.startsWith('L') || pieceKey.startsWith('LS')) {
        if (toY === 0 || toY === 8) {
            promotePiece(pieceKey);
            return true;
        }
    }
    if (pieceKey.startsWith('N') || pieceKey.startsWith('NS')) {
        if (toY === 0 || toY === 8) {
            promotePiece(pieceKey);
            return true;
        }
    }
}
function getOwner(key) {
    return key.includes('S') ? 'player2' : 'player1';
}
function checkPromotion(pieceKey) {
    const piece = pieces[pieceKey];
    if (!piece) return false;

    const row = piece.y; 

    if (!pieceKey.includes('S')) {
        return row === 0 || row === 1 || row === 2;
    } else {
        return row === 6 || row === 7 || row === 8;
    }
}

// another one cuz why not
function ownedBy(key, player) {
    return (player === 'player1' && !key.includes('S')) || (player === 'player2' && key.includes('S'));
}
function isLegalMove(pieceKey, fromX, fromY, toX, toY) {
    if (pieceKey.includes('+')) {
        if (pieceKey.startsWith('R')) return isLegalRookPromoMove(pieceKey, fromX, fromY, toX, toY);
        if (pieceKey.startsWith('B')) return isLegalBishopPromoMove(pieceKey, fromX, fromY, toX, toY);
        return isLegalPromoMove(pieceKey, fromX, fromY, toX, toY); 
    }
    if (pieceKey.startsWith('P')) return isLegalPawnMove(pieceKey, fromX, fromY, toX, toY);
    if (pieceKey.startsWith('L')) return isLegalLanceMove(pieceKey, fromX, fromY, toX, toY);
    if (pieceKey.startsWith('N')) return isLegalKnightMove(pieceKey, fromX, fromY, toX, toY);
    if (pieceKey.startsWith('Q')) return isLegalSilverMove(pieceKey, fromX, fromY, toX, toY);
    if (pieceKey.startsWith('G')) return isLegalGoldMove(pieceKey, fromX, fromY, toX, toY);
    if (pieceKey.startsWith('K')) return isLegalKingMove(pieceKey, fromX, fromY, toX, toY);
    if (pieceKey.startsWith('B')) return isLegalBishopMove(pieceKey, fromX, fromY, toX, toY);
    if (pieceKey.startsWith('R')) return isLegalRookMove(pieceKey, fromX, fromY, toX, toY);
    return false;
}
function makeTurn(){
    if (turn % 2 === 0) {
        console.log("Player 1's turn");
        return 'player1';
    }
    else {
        console.log("Player 2's turn");
        return 'player2';
    }
}
function canDrop(pieceKey, x, y){
    if (captured[playerTurn].includes(pieceKey)) {
        return true;
    }
        return false;
}
function legalDrop(pieceKey, x, y) {
    const owner = getOwner(pieceKey);
    if (!pieceKey.includes('+')) {
    if (!canDrop(pieceKey, x, y)) {
        console.log(`Cannot drop ${pieceKey} at (${x}, ${y})`);
        return false;
    }
    if (isOccupied(x, y)) {
        console.log(`Cell (${x}, ${y}) is already occupied`);
        return false;
    }
    if (pieceKey.includes('P')) {
        if (owner === 'player1' && y === 8) {
            console.log(`Cannot drop pawn at row ${y}`);
            return false;
        }
        if( owner === 'player2' && y === 0) {
            console.log(`Cannot drop pawn at row ${y}`);
            return false;
        }
    }
    
    if (pieceKey.includes('L')) {
        if (owner === 'player1' && y === 8) {
            console.log(`Cannot drop lance at row ${y}`);
            return false;
        }
        if (owner === 'player2' && y === 0) {
            console.log(`Cannot drop lance at row ${y}`);
            return false;
        }
    }
    if (pieceKey.startsWith('N') || pieceKey.startsWith('NS')) {
        if (owner === 'player1' && y === 7) {
            console.log(`Cannot drop knight at row ${y}`);
            return false;
        }
        if (owner === 'player2' && y === 1) {
            console.log(`Cannot drop knight at row ${y}`);
            return false;
        }
    }
    return true;}
    return false;
}

function noNifu(player, col) {
    for (const key in pieces) {
        if (!key.includes('P') || key.includes('+')) continue;

        if (player === 'player1' && pieces[key].x === col && key.includes('S')) {
            console.log(`Nifu violated by ${key} at column ${col}`);
            return false;
        }
        if (player === 'player2' && pieces[key].x === col && !key.includes('S')) {
            console.log(`Nifu violated by ${key} at column ${col}`);
            return false;
        }
    }
    return true;
}
/*


function noNifu(player, col) {
    for (const key in pieces) {
        if (getOwner(key) === player && !key.includes('+')) {
            // make sure it’s a pawn
            const baseKey = getBaseKey(key);
            if (baseKey === 'P' || baseKey === 'PS') {
                if (pieces[key].x === col) {
                    console.log(`Nifu violated by ${key} at column ${col}`);
                    return false;
                }
            }
        }
    }
    console.log(`No nifu violation for ${player} at column ${col}`);
    return true;
}
*/

function updateDropOptions() {
    dropSelect.innerHTML = '';
    const capturedPieces = captured[playerTurn];
    capturedPieces.forEach(pieceKey => {
        const option = document.createElement('option');
        option.value = pieceKey;
        option.textContent = getName(pieceKey);  
        dropSelect.appendChild(option);
    });
    if (capturedPieces.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'No pieces to drop';
        option.disabled = true;
        dropSelect.appendChild(option);
    }
}
function getName(pieceKey){
    if (pieceKey.includes('P')) return 'Pawn';
    if (pieceKey.includes('L')) return 'Lance';
    if (pieceKey.includes('N')) return 'Knight';
    if (pieceKey.includes('Q')) return 'Silver General';
    if (pieceKey.includes('G')) return 'Gold General';
    if (pieceKey.includes('B')) return 'Bishop';
    if (pieceKey.includes('R')) return 'Rook';
}
function generateUniqueKey(base, x, y) {
    let key = base;
    let i = 0;
    while (pieces.hasOwnProperty(key)) {
        key = base + '_' + i++;
    }
    return key;
}
function getBaseKey(key) {
    return key.replace(/[0-9_]/g, '').replace('S', '');
}

loadAllImages(() => {
    spawnInitialPieces();
    updateGame();
});




