import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Table } from 'react-bootstrap';
export function rand() {
    return Math.round(Math.random() * 20) - 10;
}

export function getModalStyle() {

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

export default function Notification(props) {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(0);
    const handleClose = () => {
        setOpen(open+1);
    };
    const checkResult = (ruleNum) => {
        if(props.icons.includes(ruleNum)){
            return props.result.includes(ruleNum)?"X":"V"
        }
        else return "-"

    }
    const checkExist = ()=>{
        return props.result.length>0 ? "red":"green"
    }
    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 style={{color:checkExist()}}>{props.result.length===0?"Well done, the chosen rules were successfully fulfilled":"Unfortunately, there are still some rules in planner system that have not been fulfilled"}</h2>
            <Table striped bordered hover variant="dark">
                <thead>
                <tr>
                    <th>Rule</th>
                    <th> </th>
                    <th>Planner</th>
                    <th>Real System</th>
                </tr>
                </thead>
                <tbody>
                <tr>

                    <td colSpan="2">The number of boards in planner and the real system match</td>
                    <td id="2_1">{checkResult("100")}</td>
                    <td id="2_2">{checkResult("100")}</td>
                </tr>
                <tr>
                    <td colSpan="2">The maximum number of devices that can be connected to the board</td>
                    <td id="1_1">{checkResult("1")}</td>
                    <td id="1_2">{checkResult("101")}</td>
                </tr>
                <tr>

                    <td colSpan="2">Check if sensor is connected to another sensor</td>
                    <td id="2_1">{checkResult("2")}</td>
                    <td id="2_2">{checkResult("102")}</td>
                </tr>
                <tr>
                    <td colSpan="2">Check if sensor is not connected to board</td>
                    <td id="3_1">{checkResult("3")}</td>
                    <td id="3_2">{checkResult("103")}</td>
                </tr>
                <tr>

                    <td colSpan="2">Too many boards per sensor ratio in room</td>
                    <td id="4_1">{checkResult("4")}</td>
                    <td id="4_2">{checkResult("104")}</td>
                </tr>
                <tr>

                    <td colSpan="2">Sufficient amount of LEDs per room size</td>
                    <td id="5_1">{checkResult("5")}</td>
                    <td id="5_2">{checkResult("105")}</td>
                </tr>
                <tr>
                    <td colSpan="2">Light detector must be near window</td>
                    <td id="6_1">{checkResult("6")}</td>
                    <td id="6_2">{checkResult("106")}</td>
                </tr>
                <tr>
                    <td colSpan="2">Must be at least one door in room frame</td>
                    <td id="7_1">{checkResult("7")}</td>
                    <td id="7_2">{checkResult("107")}</td>
                </tr>
                <tr>
                    <td colSpan="2">No sensor near the same sensor in room</td>
                    <td id="8_1">{checkResult("8")}</td>
                    <td id="8_2">{checkResult("108")}</td>
                </tr>
                <tr>
                    <td colSpan="2">Enter sensor must be near door</td>
                    <td id="9_1">{checkResult("9")}</td>
                    <td id="9_2">{checkResult("109")}</td>
                </tr>
                <tr>
                    <td colSpan="2">Board must have a connection</td>
                    <td id="10_1">{checkResult("10")}</td>
                    <td id="10_2">{checkResult("110")}</td>
                </tr>
                <tr>
                    <td colSpan="2">Disallow placement of room on another room</td>
                    <td id="11_1">{checkResult("11")}</td>
                    <td id="11_2">{checkResult("111")}</td>
                </tr>
                <tr>
                    <td colSpan="2">Window must be in room frame</td>
                    <td id="12_1">{checkResult("12")}</td>
                    <td id="12_2">{checkResult("112")}</td>
                </tr>
                <tr>
                    <td colSpan="2">Board must be in a room</td>
                    <td id="13_1">{checkResult("13")}</td>
                    <td id="13_2">{checkResult("113")}</td>
                </tr>
                <tr>
                    <td colSpan="2">Sensor must be placed in a room</td>
                    <td id="14_1">{checkResult("14")}</td>
                    <td id="14_2">{checkResult("114")}</td>
                </tr>
                <tr>
                    <td colSpan="2">Door must be in room frame</td>
                    <td id="15_1">{checkResult("15")}</td>
                    <td id="15_2">{checkResult("115")}</td>
                </tr>

                </tbody>
            </Table>
        </div>
    );

    return (
        <div style={{marginLeft:10,marginTop:15}}>
            <Modal
                open={props.open>open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    );
}
