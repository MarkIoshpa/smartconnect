import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Checkbox from '@material-ui/core/Checkbox';

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {

    const left = 50 + rand();

    return {

        left: `${left}%`,

    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 600,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function Settings() {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [numOfConnect,setConnectLimit]=useState(10)
    const [numOfConnectFour,setRatioLimit]=useState(3)
    const [checkedOne, setCheckedOne] = React.useState(true);
    const [checkedTwo, setCheckedTwo] = React.useState(true);
    const [checkedThree, setCheckedThree] = React.useState(true);
    const [checkedFour, setCheckedFour] = React.useState(true);
    const [numOfLedFive, setLedLimit] = React.useState(4);
    const [checkedFive, setCheckedFive] = React.useState(true);
    const [checkedSix, setCheckedSix] = React.useState(true);
    const [checkedSeven, setCheckedSeven] = React.useState(true);
    const [checkedeight, setCheckedeight] = React.useState(true);
    const [checkedNine, setCheckedNine] = React.useState(true);
    const [checkedTen, setCheckedTen] = React.useState(true);
    const [checkedEleven, setCheckedEleven] = React.useState(true);
    const [checkedTwelve, setCheckedTwelve] = React.useState(true);
    const [checked13, setChecked13] = React.useState(true);
    const [checked14, setChecked14] = React.useState(true);
    const [checked15, setChecked15] = React.useState(true);
    const handleOpen = () => {
        setOpen(true);
    };
    useEffect(()=>{
        //rule number one
        let limitSensors=JSON.parse(localStorage.getItem("limitSensors"))
        if(parseInt(limitSensors)){
            setConnectLimit(parseInt(limitSensors))
        }
        if(JSON.parse(localStorage.getItem("checkOne"))===true){
            setCheckedOne(true)
        }
        else{
            setCheckedOne(false)
        }

        //rule number two
        if(JSON.parse(localStorage.getItem("checkedTwo"))===true){
            setCheckedTwo(true)
        }
        else{
            setCheckedTwo(false)
        }
        //rule number three
        if(JSON.parse(localStorage.getItem("checkedThree"))===true){
            setCheckedThree(true)
        }
        else{
            setCheckedThree(false)
        }

        //rule number four
        let numOfConnectFour=JSON.parse(localStorage.getItem("numOfConnectFour"))
        if(parseInt(numOfConnectFour)){
            setRatioLimit(parseInt(numOfConnectFour))
        }
        if(JSON.parse(localStorage.getItem("checkedFour"))===true){
            setCheckedFour(true)
        }
        else{
            console.log("ccdcd")
            setCheckedFour(false)
        }
        //rule number 5
        let numOfLedFive=JSON.parse(localStorage.getItem("numOfLedFive"))
        if(parseInt(numOfLedFive)){
            setLedLimit(parseInt(numOfLedFive))
        }
        if(JSON.parse(localStorage.getItem("checkedFive"))===true){
            setCheckedFive(true)
        }
        else{
            console.log("ccdcd")
            setCheckedFive(false)
        }
        //rule number six
        if(JSON.parse(localStorage.getItem("checkedSix"))===true){
            setCheckedSix(true)
        }
        else{
            setCheckedSix(false)
        }
        //rule number seven
        if(JSON.parse(localStorage.getItem("checkedSeven"))===true){
            setCheckedSeven(true)
        }
        else{
            setCheckedSeven(false)
        }
        //rule number eight
        if(JSON.parse(localStorage.getItem("checkedeight"))===true){
            setCheckedeight(true)
        }
        else{
            setCheckedeight(false)
        }
        //rule number nine
        if(JSON.parse(localStorage.getItem("checkedNine"))===true){
            setCheckedNine(true)
        }
        else{
            setCheckedNine(false)
        }
        //rule number ten
        if(JSON.parse(localStorage.getItem("checkedTen"))===true){
            setCheckedTen(true)
        }
        else{
            setCheckedTen(false)
        }
        //rule number eleven
        if(JSON.parse(localStorage.getItem("checkedEleven"))===true){
            setCheckedEleven(true)
        }
        else{
            setCheckedEleven(false)
        }
        //rule number Twelve
        if(JSON.parse(localStorage.getItem("checkedTwelve"))===true){
            setCheckedTwelve(true)
        }
        else{
            setCheckedTwelve(false)
        }
        //rule number 13
        if(JSON.parse(localStorage.getItem("checked13"))===true){
            setChecked13(true)
        }
        else{
            setChecked13(false)
        }
        //rule number 14
        if(JSON.parse(localStorage.getItem("checked14"))===true){
            setChecked14(true)
        }
        else{
            setChecked14(false)
        }
        //rule number 15
        if(JSON.parse(localStorage.getItem("checked15"))===true){
            setChecked15(true)
        }
        else{
            setChecked15(false)
        }
    },[])
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange=(event)=>{
        if(!Number.isNaN(event.target.value)){
            setConnectLimit(event.target.value)
            console.log("ddd")
        }

    }
    const handleSubmit=(e)=>{
        //rule number one
        let limit=JSON.parse(localStorage.getItem("limitSensors"));
        if((!parseInt(limit) && numOfConnect) || (numOfConnect && numOfConnect!==parseInt(limit))){
            localStorage.setItem("limitSensors",numOfConnect);
            console.log("ccc")
        }
        localStorage.setItem("checkOne",checkedOne);

        //rule number two
        localStorage.setItem("checkedTwo",checkedTwo);
        //rule number three
        localStorage.setItem("checkedThree",checkedThree);
        //rule number four
        localStorage.setItem("numOfConnectFour",numOfConnectFour);
        localStorage.setItem("checkedFour",checkedFour);
        //rule number five
        localStorage.setItem("numOfLedFive",numOfLedFive);
        localStorage.setItem("checkedFive",checkedFive);
        //rule number six
        localStorage.setItem("checkedSix",checkedSix);
        //rule number seven
        localStorage.setItem("checkedSeven",checkedSeven);
        //rule number eight
        localStorage.setItem("checkedeight",checkedeight);
        //rule number nine
        localStorage.setItem("checkedNine",checkedNine);
        //rule number ten
        localStorage.setItem("checkedTen",checkedTen);
        //rule number eleven
        localStorage.setItem("checkedEleven",checkedEleven);
        //rule number Twelve
        localStorage.setItem("checkedTwelve",checkedTwelve);
        //rule number 13
        localStorage.setItem("checked13",checked13);
        //rule number 14
        localStorage.setItem("checked14",checked14);
        //rule number 15
        localStorage.setItem("checked15",checked15);
        e.preventDefault()
        handleClose()
    }
    const body = (
        <div style={modalStyle} className={classes.paper}>
            <form onSubmit={handleSubmit}>
                <h2>Planner checker settings</h2>
                {/*rule number one*/}
                <Checkbox
                    checked={checkedOne}
                    onChange={(event)=>{
                        setCheckedOne(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    The maximum number that can be connected to the board
                    <input type="number" min="2" max="16"  value={numOfConnect} onChange={handleChange} />
                </label>
                <br/>
                {/*rule number two*/}
                <Checkbox
                    checked={checkedTwo}
                    onChange={(event)=>{
                        setCheckedTwo(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    check if sensor connected to other sensor
                </label>
                <br/>
                {/*rule number three*/}
                <Checkbox
                    checked={checkedThree}
                    onChange={(event)=>{
                        setCheckedThree(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    check if sensor not connected to board
                </label>
                <br/>
                {/*rule number 4*/}
                <Checkbox
                    checked={checkedFour}
                    onChange={(event)=>{
                        setCheckedFour(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    Too many boards per sensor ratio in room
                    <input type="number"  value={numOfConnectFour} min="1" max="10" onChange={(event)=>{
                        if(!Number.isNaN(event.target.value)){
                            setRatioLimit(event.target.value)
                            console.log("dd1")
                        }

                    }} />
                </label>
                <br/>
                {/*rule number 5*/}
                <Checkbox
                    checked={checkedFive}
                    onChange={(event)=>{
                        setCheckedFive(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    few led per room size
                    <input type="number"  value={numOfLedFive} min="4" max="6" onChange={(event)=>{
                        if(!Number.isNaN(event.target.value)){
                            setLedLimit(event.target.value)
                            console.log("dd1")
                        }

                    }} />
                </label>
                <br/>
                {/*rule number six*/}
                <Checkbox
                    checked={checkedSix}
                    onChange={(event)=>{
                        setCheckedSix(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    light detector must be near window
                </label>
                <br/>
                {/*rule number seven*/}
                <Checkbox
                    checked={checkedSeven}
                    onChange={(event)=>{
                        setCheckedSeven(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    must be at least one door in frame of room
                </label>
                <br/>
                {/*rule number eight*/}
                <Checkbox
                    checked={checkedeight}
                    onChange={(event)=>{
                        setCheckedeight(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    no sensor near the same sensor in room
                </label>
                <br/>
                {/*rule number nine*/}
                <Checkbox
                    checked={checkedNine}
                    onChange={(event)=>{
                        setCheckedNine(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    enter sensor must be near door
                </label>
                <br/>
                {/*rule number ten*/}
                <Checkbox
                    checked={checkedTen}
                    onChange={(event)=>{
                        setCheckedTen(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    board must be with connection
                </label>
                <br/>
                {/*rule number Eleven*/}
                <Checkbox
                    checked={checkedEleven}
                    onChange={(event)=>{
                        setCheckedEleven(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    disallow to place room on other room
                </label>
                <br/>
                {/*rule number Twelve*/}
                <Checkbox
                    checked={checkedTwelve}
                    onChange={(event)=>{
                        setCheckedTwelve(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    window must be in room frame
                </label>
                <br/>
                {/*rule number 13*/}
                <Checkbox
                    checked={checked13}
                    onChange={(event)=>{
                        setChecked13(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    must be board in room
                </label>
                <br/>
                {/*rule number 14*/}
                <Checkbox
                    checked={checked14}
                    onChange={(event)=>{
                        setChecked14(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    must be place sensor in room
                </label>
                <br/>
                {/*rule number 15*/}
                <Checkbox
                    checked={checked15}
                    onChange={(event)=>{
                        setChecked15(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <label>
                    door must be in room frame
                </label>
                <br/>
                <input type="submit" value="Save" />
            </form>
        </div>
    );

    return (
        <div style={{marginLeft:10,marginTop:15}}>
            <button type="button" onClick={handleOpen}>
                Open Settings
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}

            </Modal>
        </div>
    );
}
