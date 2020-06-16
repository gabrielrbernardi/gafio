import React from 'react';
import {Link} from 'react-router-dom';
import { RiComputerLine, RiBarChart2Line, RiPagesLine } from "react-icons/ri";

import './Home.css';

const Home = () => {
    return (
        <div className="m-5 p-3 card-columns">
            <Link className="text-decoration-none" to="/medicalRecords">
                <div className="card text-center shadow zoom-hover">
                        <p className="h6">
                            <RiPagesLine className="mt-3 mb-3 ml-auto mr-auto" size={40} /><br/>
                            <strong>PRONTUÁRIOS</strong>
                        </p>
                </div>
            </Link>
            <Link className="text-decoration-none" to="/registrations">
                <div className="card text-center shadow zoom-hover">
                        <p className="h6">
                            <RiComputerLine className="mt-3 mb-3 ml-auto mr-auto" size={40} /><br/>
                            <strong>CADASTROS</strong>
                        </p>
                </div>
            </Link>
            <Link className="text-decoration-none" to="/dashboard">
                <div className="card text-center shadow zoom-hover">
                        <p className="h6">
                            <RiBarChart2Line className="mt-3 mb-3 ml-auto mr-auto" size={40} /><br/>
                            <strong>DASHBOARD</strong>
                        </p>
                </div>
            </Link>
        </div>
    )
}

export default Home;