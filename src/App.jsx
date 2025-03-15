import "./App.css";
import { useEffect, useState } from "react";
import RawData from "./dataSet.json";

function App() {
    
    let Board = RawData[0].board;
    const [select,setSelect] = useState("b00");
    const [isFinish,setIsFinish] = useState(false);
    let isCloseToFinish = false;
    const [showAnswer,setShowAnswer] = useState(false);
    
    if(showAnswer) {
        Board = RawData[0].answer;
    }
    useEffect(() => {
        if(showAnswer) {
            setTimeout(()=> {
                document.querySelector(".btns").style.display = "flex"
                document.querySelector(".answer").style.display = "flex"
                setShowAnswer(false);
            },5000)
            document.querySelector(".btns").style.display = "none"
            document.querySelector(".answer").style.display = "none"
        }
    },[showAnswer])
    // var count = 0;
    // let select = "b00"
    // let boxToFill = RawData[0].boxToFill;
    // const [count,setCount] = useState(boxToFill);
    

    // const [isCloseToFinish,setIsCloseToFinish] = useState(false);
    // const [Board, setBoard] = useState(structuredClone(RawData[0].board));
    function checkSudoku(x, y, val) {
        //Check Inside Box
        for(var i = 0 ; i < 9 ; i++)  if(Board[x][i] == val) {
            return [false, x, i];
        }
        
        //Check Column 
        var row = x % 3
        var col = y - (y % 3);
        for(var i = row ; i < 9 ; i += 3)
            for(var j = 0 ; j < 3 ; j++)
        if(Board[i][col + j] == val)  return [false, i, col + j];
        
        //Check Row 
        var row = x - (x % 3)
        var col = y % 3
        for(var i = col ; i < 9 ; i += 3)
            for(var j = 0 ; j < 3 ; j++) 
                if(Board[row + j][i] == val) return [false, row + j, i]

        return [true];
    }

    useEffect(() => {
        document.getElementById(select).classList.add("selected");
        return() => document.getElementById(select).classList.remove("selected");
    },[select]);
    
    function setValue(val) {
        document.getElementById(select).textContent = val;
        var x = select.charAt(1) - 1;
        var y = select.charAt(2) - 1;
        Board[x][y] = " ";
        var check = checkSudoku(x, y, val);
        // document.getElementById(select).classList = "cell selected " + (check[0] ? "correct" : "wrong");
        if(check[0]) {
            document.getElementById(select).classList = "cell selected correct"
            if(isCloseToFinish)  {
                setIsFinish(true);
                document.querySelector(".container").classList = "hide";
                // console.log("Hi");
            }
        }
        else {
            document.getElementById(select).classList = "cell selected wrong"
            // count++;
            // console.log(document.getElementById(`b${check[1] + 1}${check[2] + 1}`).classList);
            // var eleClass = document.getElementById(`b${check[1] + 1}${check[2] + 1}`).classList;
            // if(eleClass.contains('block'))  document.getElementById(`b${check[1] + 1}${check[2] + 1}`).classList.add("wrongBlock")
            // else  document.getElementById(`b${check[1] + 1}${check[2] + 1}`).classList.add("wrong")
        }
        Board[x][y] = val - 0;
        // setBoard(prevBoard => {
        //     const newBoard = prevBoard.map(row => [...row]);
        //     const x = select.charAt(1) - 1;
        //     const y = select.charAt(2) - 1;
        //     newBoard[x][y] = " ";
        //     document.getElementById(select).classList.add(checkSudoku(x, y, val));
        //     newBoard[x][y] = Number(val);
        //     return newBoard;
        // });
    }

    const handleSelect = e => setSelect(e.target.id);
    const setByClick = e => setValue(e.target.textContent);
    const setByButton = e => {
        if(select != "b00" && '1' <= e.key && e.key <= '9') 
            setValue(e.key);
    }
    // console.log(document.querySelector(".container").style.display = "none");
    
    useEffect(() => {
        window.addEventListener("keydown", setByButton);
        return () => {
            if(document.getElementById(select).classList.contains("wrong")) {
                document.getElementById(select).textContent = " ";
                document.getElementById(select).classList.remove("wrong")
            }
            window.removeEventListener("keydown", setByButton);
        }
    })

    function ShowAnswer() {
        setShowAnswer(true);
    }

    let cnt = 0;
    let LoadBoard = [];
    let BoxNumber = 1;
    for(var i = 0 ; i < 3 ; i++ ) {
        let table = [];
        for(var j = 1 ; j <= 3 ; j++) {
            let tr = [];
            let CellNumber = 0;
            let idRowNumber = 0;
            for(var k = 1 ; k <= 3 ; k++) {
                let td = []
                let idColNumber = ++idRowNumber;
                for(var l = 1 ; l <= 3 ; l++) {
                    var val = Board[BoxNumber-1][++CellNumber-1]
                    if(val == " " )  {
                        td.push(<div className="cell" onClick={ handleSelect } key={`div${i}${j}${k}${l}`} id={`b${BoxNumber}${CellNumber}`} > </div>); 
                        cnt++;
                    }

                    else if((typeof val) == "string")
                        td.push(<div className="cell block" key={`div${i}${j}${k}${l}`} id={`b${BoxNumber}${CellNumber}`} > { val } </div>);
                    
                    else
                        td.push(<div className="cell" onClick={ handleSelect } key={`div${i}${j}${k}${l}`} id={`b${BoxNumber}${CellNumber}`} > { val } </div>);
                    
                    idColNumber += 3;
                }
                tr.push(<td key={`td${i}${j}${k}`}>{ td }</td>);
            }
            table.push(<tr key={`tr${i}${j}`}>{ tr }</tr>);
            ++BoxNumber;
        }
        LoadBoard.push(<table key={`table${i}`}>{ table }</table>);
    }
    // console.log(cnt);
    if(cnt == 1) isCloseToFinish = true;
    
    return (
        <>
            {/* <h1 className="title">Sudoku</h1> */}
            <h1 className="title">{isFinish ? "Game Over" : "Sudoku"}</h1>

            { isFinish ? <img className="gameOver" src="congratulations.gif" alt="congratulations" /> : "" }

            <div className="container">
                { LoadBoard }
            </div>
            <span id="b00"></span>
            
            { isFinish ? "" :
                <div className="btns">
                    { [1,2,3,4,5,6,7,8,9].map((e,i) => <div onClick={setByClick} className="btn" key={`btn${i}`}>{i+1}</div>) }
                </div>
            }
            <div className="answer">
                <button id="answer" onClick={ShowAnswer}>Show Answer</button>
            </div>
        </>        
    );
}

export default App;
