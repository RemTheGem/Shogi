const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const boardSize = Math.min(canvas.width, canvas.height) * 0.9;
const cellSize = boardSize / 9;
const offsetX = (canvas.width - boardSize) / 2;
const offsetY = (canvas.height - boardSize) / 2;
const captured = {
    player1: [],
    player2: []
};
const pieces = {
    'P': { image: 'pawn.png' },
    'L': { image: 'lance.png'},
    'N': { image: 'knight.png' },
    'Q': { image: 'silver.png'},
    'G': { image: 'gold.png' },
    'B': { image: 'bishop.png' },
    'R': { image: 'rook.png' },
    'K': { image: 'king.png' },
    'PS': { image: 'pawn2.png' },
    'LS': { image: 'lance2.png' },
    'NS': { image: 'knight2.png' },
    'SS': { image: 'silver2.png' },
    'GS': { image: 'gold2.png' },
    'BS': { image: 'bishop2.png' },
    'RS': { image: 'rook2.png' },
    'KS': { image: 'king2.png' }
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
    pieces['GB'] = { image: 'gold.png', x: 5, y: 8 };
    pieces['QB'] = { image: 'silver.png', x: 6, y: 8 };
    pieces['NB'] = { image: 'knight.png', x: 7, y: 8 };
    pieces['LB'] = { image: 'lance.png', x: 8, y: 8 };
    for (let col = 0; col < 9; col++) {
        pieces[`PS${col}S`] = { image: 'pawn2.png', x: col, y: 2 };
    }
    pieces['KS'] = { image: 'king2.png', x: 4, y: 0 };
    pieces['RS'] = { image: 'rook2.png', x: 7, y: 1 };
    pieces['BS'] = { image: 'bishop2.png', x: 1, y: 1 };
    pieces['GS'] = { image: 'gold2.png', x: 3, y: 0 };
    pieces['SS'] = { image: 'silver2.png', x: 2, y: 0 };
    pieces['NS'] = { image: 'knight2.png', x: 1, y: 0 };
    pieces['LS'] = { image: 'lance2.png', x: 0, y: 0 };
    pieces['GBS'] = { image: 'gold2.png', x: 5, y: 0 };
    pieces['SBS'] = { image: 'silver2.png', x: 6, y: 0 };
    pieces['NBS'] = { image: 'knight2.png', x: 7, y: 0 };
    pieces['LBS'] = { image: 'lance2.png', x: 8, y: 0 };
}
function drawPieces() {
    const cellSize = boardSize / 9;
    for (const key in pieces) {
        const piece = pieces[key];
        if (key.includes('S')) {
            img = pieceImages[key[0]+ 'S'];
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
}

let selectedPieceKey = null;

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor((x - offsetX) / cellSize);
    const row = Math.floor((y - offsetY) / cellSize);
    if (col < 0 || col >= 9 || row < 0 || row >= 9) return;
    if (selectedPieceKey === null) {
        for (const key in pieces) {
            const p = pieces[key];
            if (p.x === col && p.y === row) {
                selectedPieceKey = key;
                highlightCell(row, col, boardSize, offsetX, offsetY);
                console.log(`Selected piece: ${key} at (${col}, ${row})`);
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
        if (selectedPieceKey.startsWith('P') || selectedPieceKey.startsWith('PS')) {
            isValidMove = isLegalPawnMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('L') || selectedPieceKey.startsWith('LS')) {
            isValidMove = isLegalLanceMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('N') || selectedPieceKey.startsWith('NS')) {
            isValidMove = isLegalKnightMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('Q') || selectedPieceKey.startsWith('QS')) {
            isValidMove = isLegalSilverMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('G') || selectedPieceKey.startsWith('GS')) {
            isValidMove = isLegalGoldMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('K') || selectedPieceKey.startsWith('KS')) {
            isValidMove = isLegalKingMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('B') || selectedPieceKey.startsWith('BS')) {
            isValidMove = isLegalBishopMove(selectedPieceKey, piece.x, piece.y, col, row);
        } else if (selectedPieceKey.startsWith('R') || selectedPieceKey.startsWith('RS')) {
            isValidMove = isLegalRookMove(selectedPieceKey, piece.x, piece.y, col, row);
        }
        if (!isValidMove) {
            console.log(`Invalid move for ${selectedPieceKey} to (${col}, ${row})`);
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
    const owner = pieceKey.endsWith('S') ? 'player2' : 'player1';
    if (dx === 0 && dy === direction) {
        for (const key in pieces) {
            const p = pieces[key];
            if (p.x === toX && p.y === toY) {
                const targetOwner = key.endsWith('S') ? 'player2' : 'player1';
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
    const direction = pieceKey.startsWith('LS') ? 1 : -1;
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
            const owner = pieceKey.endsWith('S') ? 'player2' : 'player1';
            const targetOwner = key.endsWith('S') ? 'player2' : 'player1';
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

    const direction = pieceKey.endsWith('S') ? 1 : -1;

    if (!((Math.abs(dx) === 1) && (dy === 2 * direction))) {
        return false;
    }

    for (const key in pieces) {
        const p = pieces[key];
        if (p.x === toX && p.y === toY) {
            const owner = pieceKey.endsWith('S') ? 'player2' : 'player1';
            const targetOwner = key.endsWith('S') ? 'player2' : 'player1';
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
    const direction = pieceKey.endsWith('S') ? 1 : -1;
    const owner = pieceKey.endsWith('S') ? 'player2' : 'player1';
    if ((dx === 1 && dy === 1 * direction) || (dx === 0 && dy === 1* direction) || (dx === 1 && dy === 1 * -direction)) {
        for (const key in pieces) {
            const p = pieces[key];
            if (p.x === toX && p.y === toY) {
                const targetOwner = key.endsWith('S') ? 'player2' : 'player1';
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
    const owner = pieceKey.endsWith('S') ? 'player2' : 'player1';
    const direction = pieceKey.endsWith('S') ? 1 : -1;
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
                const targetOwner = key.endsWith('S') ? 'player2' : 'player1';
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
    const owner = pieceKey.endsWith('S') ? 'player2' : 'player1';
    if ((dx === 1 && dy === 1) || (dx === 0 && dy === 1) || (dx === 1 && dy === 0) || (dx === 0 && dy === -1)) {
        for (const key in pieces) {
            const p = pieces[key];
            if (p.x === toX && p.y === toY) {
                const targetOwner = key.endsWith('S') ? 'player2' : 'player1';
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

function isOccupied(x, y) {
    for (const key in pieces) {
        const p = pieces[key];
        if (p.x === x && p.y === y) return true;
    }
    return false;
}
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

        if (key.startsWith('P')) isLegal = isLegalPawnMove(key, piece.x, piece.y, king.x, king.y);
        else if (key.startsWith('L')) isLegal = isLegalLanceMove(key, piece.x, piece.y, king.x, king.y);
        else if (key.startsWith('N')) isLegal = isLegalKnightMove(key, piece.x, piece.y, king.x, king.y);
        else if (key.startsWith('S')) isLegal = isLegalSilverMove(key, piece.x, piece.y, king.x, king.y);
        else if (key.startsWith('G')) isLegal = isLegalGoldMove(key, piece.x, piece.y, king.x, king.y);
        else if (key.startsWith('K')) isLegal = isLegalKingMove(key, piece.x, piece.y, king.x, king.y);
        else if (key.startsWith('B')) isLegal = isLegalBishopMove(key, piece.x, piece.y, king.x, king.y);
        else if (key.startsWith('R')) isLegal = isLegalRookMove(key, piece.x, piece.y, king.x, king.y);

        if (isLegal) {
            console.log(`${player} King in check by ${key}`);
            return true;
        }

    }
    return false;
}
function getOwner(key) {
    return key.endsWith('S') ? 'player2' : 'player1';
}

loadAllImages(() => {
    spawnInitialPieces();
    updateGame();
});




