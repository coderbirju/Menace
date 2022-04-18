export function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    for(let i = 0; i<lines.length; i++){
        const [a,b,c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
}

export function getPositionString(board) {
    let freePositions = "[";
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8]
    ];
    for(let i = 0; i<lines.length; i++){
        const [a,b,c] = lines[i];
        if(board[a] === null) {
            let pos = `(${i},  ${(a % 3)}),`;
            freePositions = freePositions + pos;
        } 
        if(board[b] === null) {
            let pos = `(${i},  ${(b % 3)}),`;
            freePositions = freePositions + pos;
        } 
        if(board[c] === null) {
            let pos = `(${i},  ${(c % 3)}),`;
            freePositions = freePositions + pos;
        }
    }
    freePositions.slice(0, -1);
    freePositions = freePositions + "]";
    return freePositions;
}

export function getCurrentBoardStateString(board) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8]
    ];
    let boardState = [];
    for(let i = 0; i<lines.length; i++){
        const [a,b,c] = lines[i];
        let row = [0,0,0];
        if(board[a] === "X") {
            row[0] = 1;
        } else if(board[a] === "O"){
            row[0] = -1;
        }

        if(board[b] === "X") {
            row[1] = 1;
        } else if(board[b] === "O"){
            row[1] = -1;
        }

        if(board[c] === "X") {
            row[2] = 1;
        } else if(board[c] === "O"){
            row[2] = -1;
        }
        boardState.push(row);
    }
    return boardState;
}

export function getIforBoard(responseData) {
    let x = responseData.split("");
    let row = x[1];
    let column = x[4];
    let res = null;
    if(row === "0"){
        switch(column){
            case "0": res = 0;
            break;
            case "1": res = 1;
            break;
            case "2": res = 2;
            break;
            default: return null;
        }
    }
    if(row === "1"){
        switch(column){
            case "0": res = 3;
            break;
            case "1": res = 4;
            break;
            case "2": res = 5;
            break;
            default: return null;
        }
    }
    if(row === "2"){
        switch(column){
            case "0": res = 6;
            break;
            case "1": res = 7;
            break;
            case "2": res = 8;
            break;
            default: return null;
        }
    }
    return res;
}