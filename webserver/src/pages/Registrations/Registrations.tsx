import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import {GiMedicines, GiVirus} from 'react-icons/gi';
import {BsFillPeopleFill} from 'react-icons/bs';

const Registrations = () => {
    useEffect(() => {
        document.title = 'GAFio | Cadastro';
    }, []);

    return (
        <>
        <p className="h3 text-center">Cadastros</p>
        <div className="mx-5 p-3 mt-0 pt-0 row">
            <Link className="text-decoration-none col-sm-4 mx-auto" to="/registrations/patient">
                <div className="card text-center shadow zoom-hover">
                    <p className="h6">
                        <BsFillPeopleFill className="mt-3 mb-3 ml-auto mr-auto" size={40} /><br/>
                        <strong>PACIENTES</strong>
                    </p>
                </div>
            </Link>
            <Link className="text-decoration-none col-sm-4 mx-auto" to="/registrations/medicines">
                <div className="card text-center shadow zoom-hover">
                    <p className="h6">
                        <GiMedicines className="mt-3 mb-3 ml-auto mr-auto" size={40} /><br/>
                        <strong>MEDICAMENTOS</strong>
                    </p>
                </div>
            </Link>
            <Link className="text-decoration-none col-sm-4 mx-auto" to="/registrations/diseases">
                <div className="card text-center shadow zoom-hover">
                    <p className="h6">
                        <GiVirus className="mt-3 mb-3 ml-auto mr-auto" size={40} /><br/>
                        <strong>DOENÇAS</strong>
                    </p>
                </div>
            </Link>
        </div>
        </>
    )
}

export default Registrations;