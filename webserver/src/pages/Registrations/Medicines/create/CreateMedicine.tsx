import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';

import { CreateMedicineService } from './CreateMedicineService';

const MedicinesCreate = () => {

    const [EAN, setEAN] = useState<string>('');
    const [principioAtivo, setPrincipioAtivo] = useState<string>('');
    const [registro, setRegistro] = useState<string>('');
    const [laboratorio, setLaboratorio] = useState<string>('');
    const [produto, setProduto] = useState<string>('');
    const [apresentacao, setApresentacao] = useState<string>('');
    const [classeTerapeutica, setClasseTerapeutica] = useState<string>('');
    const [CNPJ, setCNPJ] = useState<string>('');

    const history = useHistory();

    const createMedicineService = new CreateMedicineService();

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        createMedicineService.Create(
            EAN,
            principioAtivo,
            registro,
            laboratorio,
            produto,
            apresentacao,
            classeTerapeutica,
            CNPJ
        ).then(() => history.push('/registrations/medicines'));
    }

    return (
        <div className="row m-5">
            <div className="card shadow-lg p-3 col-sm-6 offset-md-3 border">
                <p className="text-dark h3 text-center">Cadastro de Medicamento</p>
                <form className="was-validated" onSubmit={handleSubmit}>
                    <div className="form-group">

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <label htmlFor="EAN" className="mt-4">EAN</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="EAN" 
                                    name="EAN"
                                    defaultValue={EAN} 
                                    onChange={(e) => setEAN((e.target as HTMLInputElement).value)}
                                    placeholder="EAN"
                                    required={true}
                                />
                            </div>

                            <div className="col">
                                <label htmlFor="CNPJ" className="mt-4">CNPJ</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="CNPJ" 
                                    name="CNPJ"
                                    defaultValue={CNPJ} 
                                    onChange={(e) => setCNPJ((e.target as HTMLInputElement).value)}
                                    placeholder="CNPJ"
                                    required={true}
                                />
                            </div>
                        </div>

                        <label htmlFor="principioAtivo" className="mt-4">Princípio Ativo</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="principioAtivo" 
                            name="principioAtivo"
                            defaultValue={principioAtivo} 
                            onChange={(e) => setPrincipioAtivo((e.target as HTMLInputElement).value)}
                            placeholder="Princípio Ativo"
                            required={true}
                        />
                        
                        <label htmlFor="registro" className="mt-4">Registro</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="registro" 
                            name="registro"
                            defaultValue={registro} 
                            onChange={(e) => setRegistro((e.target as HTMLInputElement).value)}
                            placeholder="Registro"
                            required={true}
                        />

                        <label htmlFor="laboratorio" className="mt-4">Laboratório</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="laboratorio" 
                            name="laboratorio"
                            defaultValue={laboratorio} 
                            onChange={(e) => setLaboratorio((e.target as HTMLInputElement).value)}
                            placeholder="Laboratório"
                            required={true}
                        />

                        <label htmlFor="produto" className="mt-4">Produto</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="produto" 
                            name="produto"
                            defaultValue={produto} 
                            onChange={(e) => setProduto((e.target as HTMLInputElement).value)}
                            placeholder="Produto"
                            required={true}
                        />

                        <label htmlFor="apresentacao" className="mt-4">Apresentação</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="apresentacao" 
                            name="apresentacao"
                            defaultValue={apresentacao} 
                            onChange={(e) => setApresentacao((e.target as HTMLInputElement).value)}
                            placeholder="Apresentação"
                            required={true}
                        />

                        <label htmlFor="classeTerapeutica" className="mt-4">Classe Terapeutica</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="classeTerapeutica" 
                            name="classeTerapeutica"
                            defaultValue={classeTerapeutica} 
                            onChange={(e) => setClasseTerapeutica((e.target as HTMLInputElement).value)}
                            placeholder="Classe Terapeutica"
                            required={true}
                        />

                    </div>
                    
                    <button type="submit" className="btn btn-info btn-primary mt-3">Cadastrar</button>
                </form>
            </div>
        </div>
    )
}

export default MedicinesCreate;