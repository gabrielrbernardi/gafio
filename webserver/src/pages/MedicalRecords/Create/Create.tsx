import React from 'react';
import {InputText} from 'primereact/inputtext';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dropdown} from 'primereact/dropdown';
import Button from 'react-bootstrap/Button';
import {Alert} from 'react-bootstrap';
import {Dropdown as DropdownReact} from 'react-bootstrap';

import {FiCheck, FiSearch} from 'react-icons/fi';

const MedicalRecordsForm = () => {
    let options = [
        {label: 'Sim', value: 'S'},
        {label: 'Não', value: 'N'},
    ];
    
    return (
        <div className="row m-5">
            <div className="card shadow-lg p-3 col-sm-6 offset-md-3 border">
                <p className="text-dark h3 text-center">Cadastro de Prontuario</p>
                <form className="was-validated">
                <div className="form-group">
                    <label htmlFor="">Numero do Prontuario</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite o numero do prontuario" required autoFocus/>
                    <div className="m-4"></div>
                    <label htmlFor="">Numero do Paciente</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite o numero do paciente" required/>
                    <div className="m-4"></div>
                    <label htmlFor="">Data da Internacao</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite a data de internacao" required/>
                    <div className="m-4"></div>
                    <label htmlFor="">Codigo de Doenca Principal</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite o codigo de doenca principal" required/>
                    <div className="m-4"></div>
                    <label htmlFor="">Codigo de Doenca Secundario</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite o codigo de doenca secundario" />
                    <div className="m-4"></div>
                    <label htmlFor="">Sistema Acometido</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite o sistema acometido" required/>
                    <div className="m-4"></div>
                    <label htmlFor="">Codigo de Comorbidade</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite o codigo de comorbidade" />
                    <div className="m-4"></div>
                    <label htmlFor="">Origem</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite a origem" required/>
                    <div className="m-4"></div>
                    <label htmlFor="">Alocacao</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite a alocacao" required/>
                    <div className="m-4"></div>
                    <label htmlFor="">Coleta</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite a coleta" />
                    <div className="m-4"></div>
                    <label htmlFor="">Resultado Coleta</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite o resultado da coleta" />
                    <div className="m-4"></div>
                    <label htmlFor="">Codigo de Medicamento Primario</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite o codigo de medicamento primario" required/>
                    <div className="m-4"></div>
                    <label htmlFor="">Codigo de Medicamento Secundario</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite o codigo de medicamento secundario" />
                    <div className="m-4"></div>
                    <label htmlFor="">Sitio Infeccao Primario</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite o siteo de infeccao primario" />
                    <div className="m-4"></div>
                    <DropdownReact/>
                        <label htmlFor="">Tratamento CCIH</label>
                        <br></br>
                        <Dropdown className="" options={options} style={{width: '100%'}} placeholder="Selecione uma opcao"/>
                    <DropdownReact/>
                    <div className="m-4"></div>
                    <DropdownReact/>
                        <label htmlFor="">Indicacao Sepse</label>
                        <br></br>
                        <Dropdown className="" options={options} style={{width: '100%'}} placeholder="Selecione uma opcao"/>
                    <DropdownReact/>
                    <div className="m-4"></div>
                    <DropdownReact/>
                        <label htmlFor="">Disfuncao Renal</label>
                        <br></br>
                        <Dropdown className="" options={options} style={{width: '100%'}} placeholder="Selecione uma opcao"/>
                    <DropdownReact/>
                    <div className="m-4"></div>
                    <label htmlFor="">Origem da Infeccao</label>
                    <input type="text" className="form-control" id="" name="" placeholder="Digite a origem da infeccao" required/>
                    <div className="m-4"></div>
                    <DropdownReact/>
                        <label htmlFor="">Dose Correta</label>
                        <br></br>
                        <Dropdown className="" options={options} style={{width: '100%'}} placeholder="Selecione uma opcao"/>
                    <DropdownReact/>
                    <div className="m-4"></div>
                    <DropdownReact/>
                        <label htmlFor="">Posologia Correta</label>
                        <br></br>
                        <Dropdown className="" options={options} style={{width: '100%'}} placeholder="Selecione uma opcao"/>
                    <DropdownReact/>
                    <div className="m-4"></div>
                </div>
                <button type="submit" className="btn btn-info btn-primary">Cadastrar</button>
                </form>
            </div>
        </div>
    )
}

export default MedicalRecordsForm;