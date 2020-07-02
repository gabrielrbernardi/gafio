import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import {GiMedicines, GiVirus} from 'react-icons/gi';

const Registrations = () => {
    useEffect(() => {
        document.title = 'GAFio | Cadastro';
    }, []);

    return (
        <div className="m-5 p-3 row">
            <Link className="text-decoration-none col-sm-6 mx-auto" to="/registrations/medicines">
                <div className="card text-center shadow zoom-hover">
                        <p className="h6">
                            <GiMedicines className="mt-3 mb-3 ml-auto mr-auto" size={40} /><br/>
                            <strong>CADASTRO DE MEDICAMENTOS</strong>
                        </p>
                </div>
            </Link>
            <Link className="text-decoration-none col-sm-6 mx-auto" to="/registrations/diseases">
                <div className="card text-center shadow zoom-hover">
                        <p className="h6">
                            <GiVirus className="mt-3 mb-3 ml-auto mr-auto" size={40} /><br/>
                            <strong>CADASTRO DE DOENÇAS</strong>
                        </p>
                </div>
            </Link>
        </div>
    )
}

export default Registrations;