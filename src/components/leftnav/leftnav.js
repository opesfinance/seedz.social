import React  from "react";
import { Link } from 'react-router-dom';
import Store from "../../stores";
import { FaThLarge } from "react-icons/fa";


const store = Store.store

class LeftNav extends React.Component{

    constructor(props){
        super(props)

        const themeType = store.getStore("themeType")
        const activeclass = store.getStore("activeclass") 
        this.state = {
            themeType : themeType,
            activeclass : activeclass
        }
    }

  
       
    render(){

        return (
            <>
                <div className="leftNav">
                    <ul>
                        <Link to="/#">
                            <li className="item-menu">
                                <FaThLarge/>
                                <span className="menu">Dashboard</span>
                            </li>
                        </Link> 
                        <Link to="/hives">
                            <li className="item-menu">
                                <img
                                    alt=""
                                    src={require('../../assets/house.png')}
                                    width="20"
                                /> 
                                <span className="menu">Hive</span>
                            </li>
                        </Link>
                        <Link to="/farm">
                            <li className="item-menu">
                                <img
                                    alt=""
                                    src={require('../../assets/honey.png')}
                                    width="20"
                                /> 
                                <span className="menu">Farm</span>
                            </li>
                        </Link>    
                        <Link to="/whaletank">
                            <li className="item-menu">
                                <img
                                    alt=""
                                    src={require('../../assets/whale-tail.png')}
                                    width="20"
                                /> 
                                <span className="menu">Whale Tank</span>
                            </li>
                        </Link> 
                        
                        
                    </ul>
                </div> 
            </>
        )
    }
    
}

export default LeftNav