import React from 'react';
import {Table} from 'react-bootstrap'
import './History.css'
var connection = window.require(process.env.PUBLIC_URL +'/database.js');

const SELECT_ALL = 'SELECT * FROM events WHERE id_s = 1';
export default class History extends React.Component {
    constructor() {
        super();
        this.state={rows:[]};
    }
    componentDidMount() {
        this.setState({rows:this.props.rows})
        connection.query(SELECT_ALL,(err,results)=>{
            if(err){
                
            }
            else{
                this.setState({rows:results})
            }
        })
    }

    render() {
        return (
            <Table className="history" striped bordered hover>
                <thead>
                <tr>
                    <th>Created</th>
                    <th>Board</th>
                    <th>Message</th>
                </tr>
                </thead>
                <tbody>
                {this.props.rows.map((item, i)=>(
                    <tr key={`table${i}`}>
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                        <td>{item[2]}</td>
                    </tr>
                ))}

                </tbody>
            </Table>
        );
    }


}