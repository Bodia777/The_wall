const express = require('express');
const path = require('path');

let app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    try{
    res.status(200).sendFile(path.join(__dirname, 'pages', 'index.html'));
} catch (e) {
    console.log(e.message);
}
});

app.post('/', (req, res) => {
    try{
        const result = wallConstructionChecker(req.body);
        res.status(201).json({result: `${result}`});
    } catch (e) {
        console.log(e.message);
    }
})



app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status=404;
    console.log('error 404');
    error.message = 'wrong href';
    next(error);
});

app.use((error, req, res, next) => {
    console.log(error, 'ERROR<<<<<');
 res.status(error.status || 500);
 res.json({
     error: {message: error.message}
    })
});

app.listen(3000, () => {
console.log(`
    ================Server=================
      host : localhost
      port : 3000
    =======================================
    `);
});

let bricksArrContainer = [];
let wallsShapeMatrixContainer = [];
let bricksArrCountCountainer = [];
function wallConstructionChecker ({wallsShapeMatrix, listOfBricks} = result) {
    let wallsShapeMatrixResult = 0;
    for (let i = 0; i < wallsShapeMatrix.length; i++){
            for (let j=0; j < wallsShapeMatrix[i].length; j++) {
                wallsShapeMatrixResult += +wallsShapeMatrix[i].charAt(j);
            }
    }
    let bricksCountResult = 0;
    for (let i = 0; i < listOfBricks.length; i++) {
        bricksCountResult += listOfBricks[i][0]*listOfBricks[i][1]*listOfBricks[i][2];
    }
    if (wallsShapeMatrixResult > bricksCountResult) {
        return false
    };
    const bricksArr = [];
    for (let i = 0; i < listOfBricks.length; i++){
        let countOfOneTypeBricks = +listOfBricks[i].pop();
        for (let j = 1; j <= countOfOneTypeBricks; j++) {
            bricksArr.push(listOfBricks[i]);
        }
    }
    const answer = checkMutchBetweenBrickAndPartOfWall(bricksArr, wallsShapeMatrix);
    bricksArrContainer = [];
    wallsShapeMatrixContainer = [];
    bricksArrCountCountainer = [];
    return answer;
}



function checkMutchBetweenBrickAndPartOfWall(bricksArr, wallsShapeMatrix, previousFunctionResult = false) {
    let result = null;

    if (!previousFunctionResult) {
        [...bricksArrArg] = bricksArr;
        [...wallsShapeMatrixArg] = wallsShapeMatrix;
        bricksArrContainer.push(bricksArrArg);
        wallsShapeMatrixContainer.push(wallsShapeMatrixArg);
    };
    let moreCheck = true;
    [...arguments] = wallsShapeMatrix;
    let newWallsShapeMatrix = arguments;
    for (let i = 0; (i < wallsShapeMatrix.length && moreCheck); i++){
        for(let j=0; (j<wallsShapeMatrix[i].length && moreCheck); j++) {
            if (wallsShapeMatrix[i].charAt(j)==='1') {
                let cycleChecker = true;
                let bricksArrCount = 0;
                if (previousFunctionResult) {
                    bricksArrCount = (bricksArrCountCountainer.pop() + 1);
                    if (bricksArrCount >= bricksArr.length) {
                        wallsShapeMatrixContainer.pop();
                        bricksArrContainer.pop();
                        if (bricksArrContainer.length) {
                           result = checkMutchBetweenBrickAndPartOfWall(bricksArrContainer[bricksArrContainer.length - 1], wallsShapeMatrixContainer[wallsShapeMatrixContainer.length - 1], true);
                        } else {
                            return false;
                        }
                    }
                }
                while (cycleChecker) {
                    if (bricksArrCount >= bricksArr.length) {
                        wallsShapeMatrixContainer.pop();
                        bricksArrContainer.pop();
                        if (bricksArrContainer.length) {
                           result = checkMutchBetweenBrickAndPartOfWall(bricksArrContainer[bricksArrContainer.length - 1], wallsShapeMatrixContainer[wallsShapeMatrixContainer.length - 1], true);
                        } else {
                            return false;
                        }
                    }
                    let brickWidth = +bricksArr[bricksArrCount][0];
                    let brickHeight = +bricksArr[bricksArrCount][1];
                    let checkWithAndHeightCount = true;
                    for (let brickHeightCount = 0; (brickHeightCount < brickHeight && checkWithAndHeightCount); brickHeightCount++ ) {
                        
                        for (let brickWithCount = 0; (brickWithCount < brickWidth && checkWithAndHeightCount); brickWithCount++) {
                            
                            if (wallsShapeMatrix[i+brickHeightCount].charAt(j+brickWithCount) === '1') {
                                let newString = newWallsShapeMatrix[i+brickHeightCount].slice(0, (j + brickWithCount)) + '2' + newWallsShapeMatrix[i+brickHeightCount].slice((j + brickWithCount + 1)); 
                                newWallsShapeMatrix[i + brickHeightCount] = newString;
                            } else {
                                newWallsShapeMatrix = arguments;
                                bricksArrCount++;
                                newWallsShapeMatrix = arguments;
                                checkWithAndHeightCount = false;
                                if (bricksArrCount === bricksArr.length) {
                                    cycleChecker = false;
                                    wallsShapeMatrixContainer.pop();
                                    bricksArrContainer.pop();
                                    if (bricksArrContainer.length) {
                                       result = checkMutchBetweenBrickAndPartOfWall(bricksArrContainer[bricksArrContainer.length - 1], wallsShapeMatrixContainer[wallsShapeMatrixContainer.length - 1], true);
                                    } else {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                    if (checkWithAndHeightCount) {
                        bricksArr.splice(bricksArrCount, 1);
                        cycleChecker = false;
                        if (newWallsShapeMatrix.filter((elem) => elem.match('1')).length) {
                            bricksArrCountCountainer.push(bricksArrCount);
                            result = checkMutchBetweenBrickAndPartOfWall(bricksArr, newWallsShapeMatrix);
                        } 
                        if(!newWallsShapeMatrix.filter((elem) => elem.match('1')).length) {
                            return true;
                        }
                    }                    
                }
                moreCheck = false;
                }
            }
        }
        return result;
    }