import toaster from "toasted-notes";
import "toasted-notes/src/styles.css";

export default class errorDetector{
    allBoard=[];
    liveBoard=[];
    notAliveBoard=[];
    waitFirstBoard=[];
    waitSecondBoard=[];
    waitThirdBoard=[];
    notification=[];
    errorCount=0;
    isBoardExist(x){
        //get object
        let n;
        for (n in this.allBoard){
            if(this.allBoard[n].id===x){
                return true
            }
        }
        return false

    }
    getLiveBoard(){
        return this.liveBoard
    }
    getFirstBoard(){
        return this.waitFirstBoard
    }
    getSecondBoard(){
        return this.waitSecondBoard
    }
    getThirdBoard(){
        return this.waitThirdBoard
    }
    getNotAlive(){
        return this.notAliveBoard
    }
    getAllBoard(){
        return this.allBoard
    }

    setLive(y){
        //get all board that live now
        let x,boardsId=[],boards=y;
        y.forEach(child=>{
            boardsId.push(child.id)
        });
        let index;
        for(x in this.waitThirdBoard){
            if(!boardsId.includes(this.waitThirdBoard[x])){
                //need to move this board to not alive
                let t=this.waitThirdBoard[x];
                this.notAliveBoard.push(this.waitThirdBoard[x]);
                this.waitThirdBoard.splice(x, 1);
                //remove elements from not alive array

                let name="";
                this.allBoard.forEach(child=>{
                    if(child.id===t){
                        name=child.desc
                    }
                });
                toaster.notify(name+"is disconnected at least 3 round of checks", {
                    position:"bottom",
                    duration: 4500
                });
                continue
            }}
        for(x in this.waitSecondBoard){
            if(!boardsId.includes(this.waitSecondBoard[x])){
                //need to move this board to third
                this.waitThirdBoard.push(this.waitSecondBoard[x]);
                this.waitSecondBoard.splice(x, 1);
                //remove elements from not alive array
                continue
            }}
        for(x in this.waitFirstBoard){
            if(!boardsId.includes(this.waitFirstBoard[x])){
                //need to move this board to third
                this.waitSecondBoard.push(this.waitFirstBoard[x]);
                this.waitFirstBoard.splice(x, 1);
                //remove elements from not alive array
                continue
            }}
        for(x in this.liveBoard){
            if(!boardsId.includes(this.liveBoard[x])){
                //need to move this board to third
                this.waitFirstBoard.push(this.liveBoard[x]);
                this.liveBoard.splice(x, 1);
                let name="";
                this.allBoard.forEach(child=>{
                    if(child.id===boardsId[x]){
                        name=child.desc
                    }
                });
                let d= new Date();
                this.notification.unshift([
                    d.toLocaleDateString()+" "+d.toLocaleTimeString(),
                    name,
                    "is not connected anymore",
                    this.errorCount++
                ]);

                //remove elements from not alive array
                continue
            }
            //move all board to the inc array
        }
        for(x in boards){
            //handle if this board  not exist
            if(this.isBoardExist(boardsId[x])===false){
                //first time show this board
                console.log("first update"+boardsId[x]);
                this.allBoard.push(boards[x]);
                this.liveBoard.push(boardsId[x]);
                console.log(x+" "+boardsId[x])
                let name="";
                this.allBoard.forEach(child=>{
                    if(child.id===boardsId[x]){
                        name=child.desc
                    }
                });
                let d= new Date();
                this.notification.unshift([
                    d.toLocaleDateString()+" "+d.toLocaleTimeString(),
                    name,
                    "is connected the first time",
                ]);
            }
            else{
                //the board already exist before

                if(this.notAliveBoard.includes(boardsId[x])===true){
                    //the board is in not alive board
                    let name="";
                    this.allBoard.forEach(child=>{
                        if(child.id===boardsId[x]){
                            name=child.desc
                        }
                    });
                    let d= new Date();
                    this.notification.unshift([
                        d.toLocaleDateString()+" "+d.toLocaleTimeString(),
                        name,
                        "is connected again"
                    ]);
                    index = this.notAliveBoard.indexOf(boardsId[x]);
                    if (index > -1) {
                        this.notAliveBoard.splice(index, 1);
                        //remove elements from not alive array
                    }
                    this.liveBoard.push(boardsId[x]);
                    //add board to live
                    continue

                }
                if(this.liveBoard.includes(boardsId[x])===true){
                    continue
                }
                else if(this.waitFirstBoard.includes(boardsId[x])===true){
                    this.liveBoard.push(boardsId[x]);
                    index = this.waitFirstBoard.indexOf(boardsId[x]);
                    if (index > -1) {
                        this.waitFirstBoard.splice(index, 1);
                        //remove elements from not alive array
                    }
                    console.log(this.waitFirstBoard)
                    let name="";
                    this.allBoard.forEach(child=>{
                        if(child.id===boardsId[x]){
                        name=child.desc
                    }
                })
                    let d= new Date();
                    this.notification.unshift([
                        d.toLocaleDateString()+" "+d.toLocaleTimeString(),
                        name,
                        "is connected again"
                    ]);

                }
                else if(this.waitSecondBoard.includes(boardsId[x])===true){
                    this.liveBoard.push(boardsId[x]);
                    index = this.waitSecondBoard.indexOf(boardsId[x]);
                    if (index > -1) {
                        this.waitSecondBoard.splice(index, 1);
                        //remove elements from not alive array
                    }
                }
                else if(this.waitThirdBoard.includes(boardsId[x])===true){
                    this.liveBoard.push(boardsId[x]);
                    index = this.waitThirdBoard.indexOf(boardsId[x]);
                    if (index > -1) {
                        this.waitThirdBoard.splice(index, 1);
                        //remove elements from not alive array
                    }
                    let name="";
                    this.allBoard.forEach(child=>{
                        if(child.id===boardsId[x]){
                            name=child.desc
                        }
                    })
                    let d= new Date();
                    this.notification.unshift([
                        d.toLocaleDateString()+" "+d.toLocaleTimeString(),
                        name,
                        "is connected again"
                    ]);
                }
            }
        }
    }
}