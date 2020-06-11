import React, { useState,useEffect } from "react"
import "./styles.css"
import { SIZE } from "../../constants"
import Xarrow from "react-xarrows";
import Settings from "./components/settings.jsx";
import Notification from "./components/Notification";
//all component
const tiles = [
  "empty",
  "board",
    "Window",
    "Door",
    "audio",
    "Led",
  "room-3x3",
  "room-4x4",
  "room-5x5",
  "room-6x6",
  "light-detector",
  "enter-sensor"
];
const sensor=[
  "audio",
    "Led",
    "light-detector",
    "enter-sensor"
];
const walls=[
  "Window",
  "Door",
  "room-3x3",
  "room-4x4",
  "room-5x5",
  "room-6x6"
];
const MAP_SIZE = {
  width: SIZE * 20,
  height: SIZE * 14
};
var defaultTiles = [];
for (let i = 0; i < MAP_SIZE.height / SIZE; i++) {
  for (let j = 0; j < MAP_SIZE.width / SIZE; j++) {
    defaultTiles.push({
      tile: "empty",
      x: j * SIZE,
      y: i * SIZE
    })
  }
}

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}

export default function AdminMapBuilder() {
  const [placedTiles, setPlacedTiles] = useState(defaultTiles);
  const [compButton,setCompButton] = useState("all");
  const [lines,setLines]= useState([]);
  const [roomLines,setRoomLines]=useState([]);
  const [icons,setIcon]=useState([]);
  const [result,setResult]=useState([]);
  const [openResult,setOpenResult]=useState(false);
  const [count,setCount]=useState(0);
  const forceUpdate = useForceUpdate();
  useEffect(()=>{
    if(JSON.parse(localStorage.getItem("position")) === null) {
      localStorage.setItem("lines",JSON.stringify(lines));
      localStorage.setItem("position",JSON.stringify(placedTiles));
      localStorage.setItem("room",JSON.stringify(roomLines))
    }
    setPlacedTiles(JSON.parse(localStorage.getItem("position")));
    let x=lines;
    let line=JSON.parse(localStorage.getItem("lines"));
    for(let i in line){
      let y=[line[i][0],line[i][1],<Xarrow
          start={line[i][0]}//can be react ref
          end={line[i][1]} //or an id
          headSize={1}
      />];
      x.push(y)
    }

    setLines(x);
    let room=JSON.parse(localStorage.getItem("room"));
    for(let i in room){
      buildRoom((room[i]["size"]+1).toString(),room[i]["start"])      //first paramter must to be string
    }


  },[]);
  useEffect(()=>{
    console.log(roomLines)
  },[roomLines]);
  function sensorToBoard(afterSubmit) {
    let flag=false;
    for (const square in afterSubmit){
      let temp=0;
      let limit=parseInt(JSON.parse(localStorage.getItem("limitSensors")));
      if(!limit){
        limit=10
      }
      if(afterSubmit[square]==="board"){
        for(let x in lines){
          if(lines[x][0]===square || lines[x][1]===square){
            temp++
          }
        }
        if(temp>=limit){
          flag=true;
          // alert("to many components  connected to board in x= "+square.split("_")[0]+ "and  y= "+square.split("_")[1])
          if(localStorage.getItem("checkOne")==="false"){
            return;
          }
          else{
            let i=icons;
            i.push("x");
            setIcon(i);
            i=result;
            i.push("Too many components  connected to board");
            setResult(i);
            return
          }
        }
      }
      }

  }
  function boardNotConnected(afterSubmit) {   //check if has board without connection
    for(const square in afterSubmit){
      let temp=true;
      if(afterSubmit[square]==="board"){
        for (const x in lines){
          if(lines[x][0]===square || lines[x][1]===square){
            temp=false
          }
        }
        if(temp && localStorage.getItem("checkedTen")==="true"){
          setIcon(oldArray => [...oldArray, "x"]);
          setResult(oldArray => [...oldArray, "board is Connectionless"]);
        }
      }
    }
  }
  function sensorConnectToSensor(twoDarray){
    let notificationPosition=[],notificationName=[];
    for (const square in twoDarray){
      if(sensor.includes(twoDarray[square])){     //this square is sensor
        for(const x in lines){
          if(lines[x][0]===square || lines[x][1]===square){       //found the square
            if(sensor.includes(twoDarray[lines[x][0]]) && sensor.includes(twoDarray[lines[x][1]])){
              if(!notificationPosition.includes(lines[x][0])){
                notificationPosition.push(lines[x][0]);
                notificationName.push(twoDarray[lines[x][0]])
              }
              if(!notificationPosition.includes(lines[x][1])){
                notificationPosition.push(lines[x][1]);
                notificationName.push(twoDarray[lines[x][1]])
              }
            }
          }
        }
      }

    }
    // for(const x in notificationPosition){
    //   alert(notificationName[x]+" in position x: "+notificationPosition[x].split("_")[0]+" and y: "+ notificationPosition[x].split("_")[1]+" is connected to another sensor")
    // }
    if(notificationPosition.length>0){
      if(localStorage.getItem("checkedTwo")==="false"){
        return
      }
      else {
        setIcon(oldArray => [...oldArray, "x"])
        setResult(oldArray => [...oldArray, "board is connected to other board"])
        return;
      }
    }
  }
  function sensorNotConnected(afterSubmit) {
    for (const square in afterSubmit ){
      let temp=false;
      if(sensor.includes(afterSubmit[square])){
        for(let x in lines){
          if((lines[x][0]===square || lines[x][1]===square) &&
              (afterSubmit[lines[x][1]]==="board" || afterSubmit[lines[x][0]]==="board")){
            temp=true
          }
        }
        if(!temp){
            if(localStorage.getItem("checkedThree")==="false"){
              return
            }
            else {
              setIcon(oldArray => [...oldArray, "x"])
              setResult(oldArray => [...oldArray, "you have sensor not connected to board"])
              return;
            }

        }

      }


    }
  }
  function buildRoom(roomSize,startPoint) {     //build room in the board
    const size=parseInt(roomSize[0])-1;
    const xStart=parseInt(startPoint.split("_")[0]);    //get  x_y example 12_14
    const yStart=parseInt(startPoint.split("_")[1]);
    if(xStart+size>19 || yStart+size>14){     //the board is 19*14 -check if the room exceed out of board
      alert("the room exceed the board");
      return -1;
    }
    let y={};
    y["size"]=size;
    y["start"]=startPoint;
    let right=[`${xStart+size}_${yStart}`,`${xStart+size}_${yStart+size}`,<Xarrow
        consoleWarning={false}
        start={`${xStart+size}_${yStart}`}//can be react ref
        end={`${xStart+size}_${yStart+size}`} //or an id
        headSize={1}
    />];
    let left=[`${xStart}_${yStart}`,`${xStart}_${yStart+size}`,<Xarrow
        consoleWarning={false}
        start={`${xStart}_${yStart}`}//can be react ref
        end={`${xStart}_${yStart+size}`} //or an id
        headSize={1}
    />];
    let top=[`${xStart}_${yStart}`,`${xStart+size}_${yStart+size}`,<Xarrow
        consoleWarning={false}
        start={`${xStart}_${yStart}`}//can be react ref
        end={`${xStart+size}_${yStart-size+size}`} //or an id
        headSize={1}
    />];
    let bottom=[`${xStart}_${yStart+size}`,`${xStart+size}_${yStart+size}`,<Xarrow
        consoleWarning={false}
        start={`${xStart}_${yStart+size}`}//can be react ref
        end={`${xStart+size}_${yStart+size}`} //or an id
        headSize={1}
    />];
    y["right"]=right;
    y["top"]=top;
    y["bottom"]=bottom;
    y["left"]=left;
    let x=roomLines;
    x.push(y);
    setRoomLines(x)
  }
  function destroyRoom(start,size=0) {        //remove room from board-when tap twice on the start square
    console.log(size);
    let room=[];
    let flag=false;
    console.log("1- ",room,roomLines);
    if(size===0){         //if drop component doesnt room
      room=roomLines.filter(x=>x["start"]!==start)
    }
    else{         //remove old room
      roomLines.forEach(elem=>{
        if(elem["start"]===start){
          if(elem["size"]!==size-1){
            if(flag){
              room.push(elem)
            }

          }
          if(elem["size"]===size-1){
            if(flag){
              room.push(elem)
            }
            flag=true
          }
        }
        else{
          room.push(elem)
        }
      });
      console.log("2- ",room,roomLines)
    }
    setRoomLines(room);

    console.log("3- ",room,roomLines)
  }
  function handleDrag(e) {
    e.dataTransfer.setData("text", e.target.id)
  }
  function handleDrop(e) {
    e.preventDefault();

    const tile = e.dataTransfer.getData("text").split("_")[0];    //what drag
    if(e.dataTransfer.getData("text").match(/^\d/)===null){
      let one=e.target.className.split(" ")[2];   //e.target is where to drop
      //when drag and drop component
      if(tile==="empty" ){     //drop empty square
        if(one.slice(0,4)==="room"){      //remove all line connected
          destroyRoom(e.target.id)
        }

        let x=lines.filter(x =>{
          if(x[0]!==e.target.id && x[1]!== e.target.id ){
            return x                //if has line connected
          }
        });
        setLines(x);

      }

      placeTile(tile, e.clientX, e.clientY);
      if(tile.slice(0,4)==="room"){
        buildRoom(tile.slice(5,6),e.target.id)
      }
      if(e.target.classList[2].slice(0,4)==="room"){      //when try to drop on exist room-need to remove all lines
        if(tile.slice(0,4)==="room"){
          destroyRoom(e.target.id,parseInt(one.slice(5,6)))
        }
        else{
          destroyRoom(e.target.id)
        }
        console.log(roomLines)

      }
    }
    else{
      //when draw a line
      let one=e.target.className.split(" ")[2];
      if(one.slice(0,4)==="room"){      //if drop on start we remove the room
        return
      }
      let temp=document.getElementById(e.dataTransfer.getData("text")).classList[2];
      if(e.target.classList[2]!=="empty" && temp!=="empty" && !walls.includes(temp) && !walls.includes(e.target.classList[2]) ){
        if(e.target.id===e.dataTransfer.getData("text")){
          return
        }//check if drag and drop to his own
        let x=lines;
        let y=[e.dataTransfer.getData("text"),e.target.id,<Xarrow
            start={e.dataTransfer.getData("text")}//can be react ref
            end={e.target.id} //or an id
            headSize={1}
            consoleWarning={false}
        />];
        x.push(y);
        setLines(x);
        forceUpdate()
      }
      }


  }
  function placeTile(tile, x, y) {
    const snappedX = Math.ceil(x / 32) * 32 - 32;
    const snappedY = Math.ceil((y-42) / 32) * 32 - 32;

    setPlacedTiles(prevState => [
      ...prevState.filter(
        prev => !(prev.x === snappedX && prev.y === snappedY)
      ),
      {
        tile,
        x: snappedX,
        y: snappedY
      }
    ])
  }
  return <div className="map-builder" style={{marginTop: "46px"}}>
    <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className="map"
        style={{
          width: MAP_SIZE.width + 1,
          height: MAP_SIZE.height + 1
        }}
    >
      {placedTiles.map((placed) => <div
          className={`placed tile ${placed.tile} ${placed.tile==="empty"?"v":"f"} ${placed.x / SIZE}_${placed.y / SIZE}`}
          id={`${placed.x / SIZE}_${placed.y / SIZE}`}
          draggable={true}
          onDragStart={handleDrag}
          onDoubleClick={(e) => {
            let one=e.target.className.split(" ")[2];
            if(one.slice(0,4)==="room"){      //if double press on start of room-we remove him
              return
            }
            let temp = e.target.id;
            let x = lines.filter(x => {
              if (x[0] !== temp && x[1] !== temp) {
                return x
              }
            });
            setLines(x)
          }}
          style={{
            left: placed.x,
            top: placed.y
          }}
      >
        <span className="tooltiptext">{placed.tile}</span>
      </div>)}
    </div>
    <div className="tiles">
      <h1 className="title">Smart connect planner</h1>
      <div className="navBar">
        <button className="button" onClick={() => {
          setCompButton("all");
        }}>all
        </button>
        <button className="button" onClick={() => {
          setCompButton("sensor")
        }}>sensors
        </button>
        <button className="button" onClick={() => {
          setCompButton("home")
        }}>home object
        </button>
        <button className="button" onClick={() => {
          setPlacedTiles(defaultTiles);
          setLines([]);
          setRoomLines([])
        }}>reset board
        </button>

      </div>
      <div className="components">
        {compButton === "all" && tiles.map((tile) => <div style={{display: "inline-block"}}>
          <div
              className={`tile ${tile} frame`}
              style={tile==="empty"?{borderStyle:"solid"}:{}}
              id={`${tile}_i`}
              draggable={true}
              onDragStart={handleDrag}
          />
          <div style={{margin: "10px"}}><h3>{tile}</h3></div>
        </div>)}
        {compButton === "sensor" && sensor.map((tile) => <div style={{display: "inline-block"}}>
          <div
              className={`tile ${tile} frame`}
              id={`${tile}_i`}
              draggable={true}
              onDragStart={handleDrag}
          />
          <div style={{margin: "10px"}}><h3>{tile}</h3></div>
        </div>)}
        {compButton === "home" &&
        walls.map((tile) => <div style={{display: "inline-block"}}>
          <div
              className={`tile ${tile} frame`}
              id={`${tile}_i`}
              draggable={true}
              onDragStart={handleDrag}
          />
          <div style={{margin: "10px"}}><h3>{tile}</h3></div>
        </div>)
        }
      </div>
      <div>
        <button className="submit" onClick={async () => {
          setIcon([])
          setResult([])
          let twoDarray = {};
          for (let x = 0; x < 20; x++) {
            for (let y = 0; y < 14; y++) {
              let comp = document.getElementById(`${x}_${y}`);
              if (comp.classList[2] !== "empty") {
                twoDarray[`${x}_${y}`] = comp.classList[2]
              }

            }
          }
          sensorToBoard(twoDarray);    //rules number 1
          sensorConnectToSensor(twoDarray);  //rules number 2
          sensorNotConnected(twoDarray); //rules number 3
          boardNotConnected(twoDarray); //rules number 12
          let room=[];     //room is array of array of room-all square
          let roomFrame=[];    //roomframe is array of array of all frame of array
          roomLines.forEach((elem)=>{
            let arr=[];
            let square=elem["start"];
            let x=parseInt(square.split("_")[0]),y=parseInt(square.split("_")[1]);
            let size=parseInt(elem["size"])+1;
            console.log(x,y,square,size);
            let sizeIn=0,sizeOut=0;
            while(sizeIn<size){
              sizeOut=0;
              while(sizeOut<size){
                arr.push(`${x+sizeOut}_${y}`);
                sizeOut++
              }
              sizeIn++;
              y++
            }
            room.push(arr)      //room -each item is room squares  in the planner
          });

          //rule number 7-door in frame
          roomLines.forEach((elem)=>{
            let arr=[];
            let square=elem["start"];
            let x=parseInt(square.split("_")[0]),y=parseInt(square.split("_")[1]);
            let size=parseInt(elem["size"])+1;
            console.log(x,y,square,size);
            let sizeOut=0;
            while(sizeOut<size){        //the top line
              arr.push(`${x+sizeOut}_${y}`);
              sizeOut++
            }
            sizeOut=0;
            while(sizeOut<size){        //the bottom line
              arr.push(`${x+sizeOut}_${y+size-1}`);
              sizeOut++
            }
            sizeOut=1;
            while(sizeOut<size-1){
              arr.push(`${x}_${y+sizeOut}`);
              arr.push(`${x+size-1}_${y+sizeOut}`);
              sizeOut++
            }
            roomFrame.push(arr)      //room -each item is room squares  in the planner
          });

          let flag=true;
          roomFrame.forEach((elem)=> {
            if(flag){
              flag=false
              let range = document.getElementsByClassName("Door").length
              for (range--; range >= 0; range--) {
                if (elem.includes(document.getElementsByClassName("Door")[range].id)) {
                  flag = true
                }
              }
            }
          })

          if(!flag && localStorage.getItem("checkedSeven")==="true"){    //rule number 7-door on frame
            setIcon(oldArray => [...oldArray, "x"]);
            setResult(oldArray => [...oldArray, "you have room without door in frame"]);
          }

          let roomInRoom=false;
          if(room.length>0){
            room.reduce((a,b)=>{        //room in room
              a.forEach((elem)=>{
                if(b.indexOf(elem)>-1){
                  roomInRoom=true
                }
              });
              return b
            })
          }

          if(roomInRoom && localStorage.getItem("checkedEleven")==="true"){
            setIcon(oldArray => [...oldArray, "x"]);
            setResult(oldArray => [...oldArray, "you have room on room"]);
          }
          //rule number 4 -board per sensors
          let sensorPerRoom=[];      //array of array-index 0 is number of board in room index 1 is number of sensor in room
          room.forEach((elem)=>{
            let x=[],sen=0,boa=0,sensorArray=[],sensorPlace=[],ledInRoom=0,windowOnRoom=[],lightInRoom=[],DoorInRoom=[],enterSensor=[];
            elem.forEach((squre)=>{
              let y=document.getElementById(squre).classList[2];
              if(sensor.includes(y)){
                sen++;
                sensorPlace.push(squre);
                sensorArray.push(y);
                if(y==="Led"){
                  ledInRoom++
                }
              }
              if(y==="Window"){
                windowOnRoom.push(squre)
              }
              if(y==="light-detector"){
                lightInRoom.push(squre)
              }
              if(y==="enter-sensor"){
                enterSensor.push(squre)
              }
              if(y==="Door"){
                DoorInRoom.push(squre)
              }
              if(y==="board"){
                boa++
              }
            });
            x.push(boa);
            x.push(sen);
            x.push(sensorArray);
            x.push(ledInRoom);
            x.push(windowOnRoom);
            x.push(lightInRoom);
            x.push(enterSensor);
            x.push(DoorInRoom);
            x.push(sensorPlace);
            sensorPerRoom.push(x)
          });
          let flag4=false;
          sensorPerRoom.forEach((elem)=>{
            if(!flag4){
              if(elem[0]>1){
                let num=localStorage.getItem("numOfConnectFour")
              if(elem[1]/elem[0]<num){
                flag4=true;
                if(localStorage.getItem("checkedFour")==="true"){
                  setIcon(oldArray => [...oldArray, "x"]);
                  setResult(oldArray => [...oldArray, "Too many boards per sensor ratio in room"]);
                }
              }
            }
            }
          });
          console.log(sensorPerRoom);
          //rule number 5-Too little led
          let flag5=false;
          sensorPerRoom.forEach((elem,index)=>{
            let num=localStorage.getItem("numOfLedFive")
            console.log(elem);
            if(!flag5){
            if(elem[3]>0){
              if(elem[3]/room[index].length<1/num**2){
                flag5=true
                if(localStorage.getItem("setCheckedFive")==="true"){
                  setIcon(oldArray => [...oldArray, "x"]);
                  setResult(oldArray => [...oldArray, "you dont enough led inside the room"]);
                }
              }
            }}
          });
          //rule number 12-window must be in frame
          console.log(roomFrame);
          sensorPerRoom.forEach((elem,index)=>{
            console.log(elem);
            let flag=true;
            if(elem[4].length>0){
              elem[4].forEach((square)=>{
                if(!roomFrame[index].includes(square)){
                  flag=false
                }
              })
            }
            let doorFlag=true;
            if(elem[6].length>0){     //door not in frame
              console.log(elem[6]);
              elem[6].forEach((square)=>{
                if(!roomFrame[index].includes(square)){
                  doorFlag=false
                }
              })
            }
            if(elem[0]===0 && localStorage.getItem("checked13")==="true"){
              setIcon(oldArray => [...oldArray, "x"]);
              setResult(oldArray => [...oldArray, "you have room without board"]);
            }
            if(elem[1]===0 && localStorage.getItem("checked14")==="true"){
              setIcon(oldArray => [...oldArray, "x"]);
              setResult(oldArray => [...oldArray, "you have room without sensors"]);
            }
            if(!flag && localStorage.getItem("checkedTwelve")==="true"){
              setIcon(oldArray => [...oldArray, "x"]);
              setResult(oldArray => [...oldArray, "you have window not in frame"]);
            }
            if(!doorFlag && localStorage.getItem("checked15")==="true"){
              setIcon(oldArray => [...oldArray, "x"]);
              setResult(oldArray => [...oldArray, "you have Door not in frame"]);
            }
          });

          //rule number 6-light detector must me near window
          sensorPerRoom.forEach((elem,)=>{
            if(elem[5].length>0){       //have light-detector in room
              elem[5].forEach((element)=>{
                let flag=false,x=parseInt(element.split("_")[0]),y=parseInt(element.split("_")[1]);
                if(x+1<=19
                    && document.getElementById(`${x+1}_${y}`).classList[2]==="Window"
                    && elem[4].includes(`${x+1}_${y}`)){
                  flag=true
                }
                if(x-1>=0
                    && document.getElementById(`${x-1}_${y}`).classList[2]==="Window"
                    && elem[4].includes(`${x-1}_${y}`)){
                  flag=true
                }
                if(y+1<14
                    && document.getElementById(`${x}_${y+1}`).classList[2]==="Window"
                    && elem[4].includes(`${x}_${y+1}`)){
                  flag=true
                }
                if(y-1>=0
                    && document.getElementById(`${x}_${y-1}`).classList[2]==="Window"
                    && elem[4].includes(`${x}_${y-1}`)){
                  flag=true
                }
                if(localStorage.getItem("checkedSix")==="true"&&!flag){
                  setIcon(oldArray => [...oldArray, "x"]);
                  setResult(oldArray => [...oldArray, "the light sensor must be near the window"]);
                }
              })
            }
          });
          //rule number 9- enter-sensor must me near door
          sensorPerRoom.forEach((elem)=>{
            if(elem[6].length>0){       //have enter-sensor in room
              elem[6].forEach((element)=>{
                let doorFlag=false,x=parseInt(element.split("_")[0]),y=parseInt(element.split("_")[1]);
                if(x+1<=19
                    && document.getElementById(`${x+1}_${y}`).classList[2]==="Door"
                    && elem[7].includes(`${x+1}_${y}`)){
                  doorFlag=true
                }
                if(x-1>=0
                    && document.getElementById(`${x-1}_${y}`).classList[2]==="Door"
                    && elem[7].includes(`${x-1}_${y}`)){
                  doorFlag=true
                }
                if(y+1<14
                    && document.getElementById(`${x}_${y+1}`).classList[2]==="Door"
                    && elem[7].includes(`${x}_${y+1}`)){
                  doorFlag=true
                }
                if(y-1>=0
                    && document.getElementById(`${x}_${y-1}`).classList[2]==="Door"
                    && elem[7].includes(`${x}_${y-1}`)){
                  doorFlag=true
                }
                if(!doorFlag && localStorage.getItem("checkedNine")==="true"){
                  setIcon(oldArray => [...oldArray, "x"]);
                  setResult(oldArray => [...oldArray, "the enter-sensor must be near the Door"]);
                }
              })
            }
          });
          //rule number 8
          sensorPerRoom.forEach((elem)=>{
            let sensorFlag=false;
            if(elem[1]>0){       //have enter-sensor in room
              console.log(elem[8]);
              elem[8].forEach((element)=>{
                let sensorName=document.getElementById(element).classList[2];
                let x=parseInt(element.split("_")[0]),y=parseInt(element.split("_")[1]);
                if(x+1<=19
                    && document.getElementById(`${x+1}_${y}`).classList[2]===sensorName){
                  sensorFlag=true
                }
                if(x-1>=0
                    && document.getElementById(`${x-1}_${y}`).classList[2]===sensorName){
                  sensorFlag=true
                }
                if(y+1<14
                    && document.getElementById(`${x}_${y+1}`).classList[2]===sensorName){
                  sensorFlag=true
                }
                if(y-1>=0
                    && document.getElementById(`${x}_${y-1}`).classList[2]===sensorName){
                  sensorFlag=true
                }

              })
            }

            if(sensorFlag && localStorage.getItem("checkedeight")==="true"){
              setIcon(oldArray => [...oldArray, "x"]);
              setResult(oldArray => [...oldArray, "you have same sensor near each other"]);
            }
          })
          setCount(count+1)
        }}>submit
        </button>
        <button className="submit" onClick={()=>{
          console.log("got to submit")
          console.log(document.getElementById("1_1").classList)
          localStorage.setItem("lines",JSON.stringify(lines));
          localStorage.setItem("position",JSON.stringify(placedTiles));
          localStorage.setItem("room",JSON.stringify(roomLines))
        }}>save</button>
        <Settings />
        <Notification open={count} icons={icons} result={result}/>
      </div>
    </div>
    {lines.map(x => x[2])}
    {roomLines.map(x=>x["right"][2])}
    {roomLines.map(x=>x["left"][2])}
    {roomLines.map(x=>x["top"][2])}
    {roomLines.map(x=>x["bottom"][2])}
  </div>
}