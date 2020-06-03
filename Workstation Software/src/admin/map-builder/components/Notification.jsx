import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

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

export default function Notification(props) {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(0);
    useEffect(()=>{
    },[])
    const handleClose = () => {
        setOpen(open+1);
    };
    let arr=[]
    if(props.result.length===0){
        arr.push(<h2>V - Well done your architecture is in compliance with all the rules</h2>)
    }
    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2>Planner checker result</h2>
            {props.result.forEach((elem,i)=>{
               arr.push(<h3>{props.icons[i]} - {elem}</h3>)
            })}

            {console.log(arr)}
            {arr}
            <footer>
                <button onClick={handleClose}>exit</button>
            </footer>
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
