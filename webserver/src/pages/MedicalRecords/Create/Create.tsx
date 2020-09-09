import React, { useState, FormEvent } from 'react';
import {Dropdown} from 'primereact/dropdown';
import {Dropdown as DropdownReact} from 'react-bootstrap';

import api from '../../../services/api';

const MedicalRecordsForm = () => {

    const [getNroProntuario, setNroProntuario] = useState<number>()
    const [getNroPaciente, setNroPaciente] = useState<number>()
    const [getDataInternacao, setDataInternacao] = useState<string>('')
    const [getCodDoencaPrincipal, setCodDoencaPrincipal] = useState<string>('')
    const [getCodDoencaSecundario, setCodDoencaSecundario] = useState<string>('')
    const [getSistemaAcometido, setSistemaAcometido] = useState<string>('')
    const [getCodComorbidade, setCodComorbidade] = useState<string>('')
    const [getOrigem, setOrigem] = useState<string>('')
    const [getAlocacao, setAlocacao] = useState<string>('')
    const [getColeta, setColeta] = useState<string>('')
    const [getResultadoColeta, setResultadoColeta] = useState<string>('')
    const [getCodAtbPrimario, setCodAtbPrimario] = useState<string>('')
    const [getCodAtbSecundario, setCodAtbSecundario] = useState<string>('')
    const [getSitioInfeccaoPrimario, setSitioInfeccaoPrimario] = useState<string>('')
    const [getTratamento, setTratamento] = useState<string>('')
    const [getIndicacao, setIndicacao] = useState<string>('')
    const [getDisfuncao, setDisfuncao] = useState<string>('')
    const [getOrigemInfeccao, setOrigemInfeccao] = useState<string>('')
    const [getDose, setDose] = useState<string>('')
    const [getPosologia, setPosologia] = useState<string>('')

    const onTratamentoChange = (e: { value: string }) => {
        setTratamento(e.value);
    };

    const onIndicacaoChange = (e: { value: string }) => {
        setIndicacao(e.value);
    };

    const onDisfuncaoChange = (e: { value: string }) => {
        setDisfuncao(e.value);
    };

    const onDoseChange = (e: { value: string }) => {
        setDose(e.value);
    };

    const onPosologiaChange = (e: { value: string }) => {
        setPosologia(e.value);
    };

    let options = [
        {label: 'Sim', value: 'S'},
        {label: 'Não', value: 'N'},
    ];

    function handleSubmit(event: FormEvent){
        event.preventDefault();
        
        api.post('medicalRecords', {NroProntuario: getNroProntuario, NroPaciente: getNroPaciente, DataInternacao: getDataInternacao, CodDoencaPrincipal: getCodDoencaPrincipal, CodDoencaSecundario: getCodDoencaSecundario, SistemaAcometido: getSistemaAcometido, CodComorbidade: getCodComorbidade, Origem: getOrigem, Alocacao: getAlocacao, Coleta: getColeta, ResultadoColeta: getResultadoColeta, CodAtbPrimario: getCodAtbPrimario, CodAtbSecundario: getCodAtbSecundario, SitioInfeccaoPrimario: getSitioInfeccaoPrimario, TratamentoCCIH: getTratamento, IndicacaoSepse: getIndicacao, DisfuncaoRenal: getDisfuncao, OrigemInfeccao: getOrigemInfeccao, DoseCorreta: getDose, PosologiaCorreta: getPosologia})
        .then(function(response){
            
        })

    }
    
    return (
        <div className="row m-5">
            <div className="card shadow-lg p-3 col-sm-6 offset-md-3 border">
                <p className="text-dark h3 text-center">Cadastro de Prontuario</p>
                <form className="was-validated" onSubmit={handleSubmit}>
                    <div className="form-group">
                        
                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <label htmlFor="NroProntuario">Numero do Prontuario</label>
                                <input type="number" className="form-control" id="NroProntuario" name="NroProntuario"
                                    defaultValue={getNroProntuario} onChange={(e) => setNroProntuario(Number((e.target as HTMLInputElement).value))}
                                    placeholder="Digite o numero do prontuario" required autoFocus/>
                            </div>

                            <div className="col">
                                <label htmlFor="NroPaciente">Numero do Paciente</label>
                                <input type="number" className="form-control" id="NroPaciente" name="NroPaciente"
                                defaultValue={getNroPaciente} onChange={(e) => setNroPaciente(Number((e.target as HTMLInputElement).value))}
                                placeholder="Digite o numero do paciente" required/>
                            </div>
                        </div>

                        <label htmlFor="DataInternacao" className="mt-4">Data da Internacao</label>
                        <input type="date" className="form-control" id="DataInternacao" name="DataInternacao"
                            defaultValue={getDataInternacao} onChange={(e) => setDataInternacao((e.target as HTMLInputElement).value)}
                            placeholder="Digite a data de internacao" required/>
                        
                        <label htmlFor="CodDoencaPrincipal" className="mt-4">Codigo de Doenca Principal</label>
                        <input type="text" className="form-control" id="CodDoencaPrincipal" name="CodDoencaPrincipal"
                            defaultValue={getCodDoencaPrincipal} onChange={(e) => setCodDoencaPrincipal((e.target as HTMLInputElement).value)}
                            placeholder="Digite o codigo de doenca principal" required/>
                        
                        <label htmlFor="CodDoencaSecundario" className="mt-4">Codigo de Doenca Secundario</label>
                        <input type="text" className="form-control" id="CodDoencaSecundario" name="CodDoencaSecundario"
                            defaultValue={getCodDoencaSecundario} onChange={(e) => setCodDoencaSecundario((e.target as HTMLInputElement).value)}
                            placeholder="Digite o codigo de doenca secundario" />
                        
                        <label htmlFor="SistemaAcometido" className="mt-4">Sistema Acometido</label>
                        <input type="text" className="form-control" id="SistemaAcometido" name="SistemaAcometido"
                            defaultValue={getSistemaAcometido} onChange={(e) => setSistemaAcometido((e.target as HTMLInputElement).value)}
                            placeholder="Digite o sistema acometido" required/>
                        
                        <label htmlFor="CodComorbidade" className="mt-4">Codigo de Comorbidade</label>
                        <input type="text" className="form-control" id="CodComorbidade" name="CodComorbidade"
                            defaultValue={getCodComorbidade} onChange={(e) => setCodComorbidade((e.target as HTMLInputElement).value)}
                            placeholder="Digite o codigo de comorbidade" />
                        
                        <label htmlFor="Origem" className="mt-4">Origem</label>
                        <input type="text" className="form-control" id="Origem" name="Origem"
                            defaultValue={getOrigem} onChange={(e) => setOrigem((e.target as HTMLInputElement).value)}
                            placeholder="Digite a origem" required/>
                        
                        <label htmlFor="Alocacao" className="mt-4">Alocacao</label>
                        <input type="text" className="form-control" id="Alocacao" name="Alocacao"
                            defaultValue={getAlocacao} onChange={(e) => setAlocacao((e.target as HTMLInputElement).value)}
                            placeholder="Digite a alocacao" required/>
                        
                        <label htmlFor="Coleta" className="mt-4">Coleta</label>
                        <input type="text" className="form-control" id="Coleta" name="Coleta"
                            defaultValue={getColeta} onChange={(e) => setColeta((e.target as HTMLInputElement).value)}
                            placeholder="Digite a coleta" />
                        
                        <label htmlFor="ResultadoColeta" className="mt-4">Resultado Coleta</label>
                        <input type="text" className="form-control" id="ResultadoColeta" name="ResultadoColeta"
                            defaultValue={getResultadoColeta} onChange={(e) => setResultadoColeta((e.target as HTMLInputElement).value)}
                            placeholder="Digite o resultado da coleta" />
                        
                        <label htmlFor="CodAtbPrimario" className="mt-4">Codigo de Medicamento Primario</label>
                        <input type="text" className="form-control" id="CodAtbPrimario" name="CodAtbPrimario"
                            defaultValue={getCodAtbPrimario} onChange={(e) => setCodAtbPrimario((e.target as HTMLInputElement).value)}
                            placeholder="Digite o codigo de medicamento primario" required/>

                        <label htmlFor="CodAtbSecundario" className="mt-4">Codigo de Medicamento Secundario</label>
                        <input type="text" className="form-control" id="CodAtbSecundario" name="CodAtbSecundario"
                            defaultValue={getCodAtbSecundario} onChange={(e) => setCodAtbSecundario((e.target as HTMLInputElement).value)}
                            placeholder="Digite o codigo de medicamento secundario" />

                        <label htmlFor="SitioInfeccaoPrimario" className="mt-4">Sitio Infeccao Primario</label>
                        <input type="text" className="form-control" id="SitioInfeccaoPrimario" name="SitioInfeccaoPrimario"
                            defaultValue={getSitioInfeccaoPrimario} onChange={(e) => setSitioInfeccaoPrimario((e.target as HTMLInputElement).value)}
                            placeholder="Digite o siteo de infeccao primario" />

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact/>
                                    <label htmlFor="TratamentoCCIH">Tratamento CCIH</label>
                                    <br></br>
                                    <Dropdown className="" value={getTratamento} options={options} onChange={onTratamentoChange} placeholder="Selecione uma opcao" style={{width: '100%'}} required/>
                                <DropdownReact/>
                            </div>

                            <div className="col mr-4">
                                <DropdownReact/>
                                    <label htmlFor="IndicacaoSepse">Indicacao Sepse</label>
                                    <br></br>
                                    <Dropdown className="" value={getIndicacao} options={options} onChange={onIndicacaoChange} placeholder="Selecione uma opcao" style={{width: '100%'}} required/>
                                <DropdownReact/>
                            </div>

                            <div className="col">
                                <DropdownReact/>
                                    <label htmlFor="DisfuncaoRenal">Disfuncao Renal</label>
                                    <br></br>
                                    <Dropdown className="" value={getDisfuncao} options={options} onChange={onDisfuncaoChange} placeholder="Selecione uma opcao" style={{width: '100%'}} required/>
                                <DropdownReact/>
                            </div>
                        </div>

                        <label htmlFor="OrigemInfeccao" className="mt-4">Origem da Infeccao</label>
                        <input type="text" className="form-control" id="OrigemInfeccao" name="OrigemInfeccao"
                            defaultValue={getOrigemInfeccao} onChange={(e) => setOrigemInfeccao((e.target as HTMLInputElement).value)}
                            placeholder="Digite a origem da infeccao" required/>

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact/>
                                    <label htmlFor="DoseCorreta">Dose Correta</label>
                                    <br></br>
                                    <Dropdown className="" value={getDose} options={options} onChange={onDoseChange} placeholder="Selecione uma opcao" style={{width: '100%'}}/>
                                <DropdownReact/>
                            </div>

                            <div className="col">
                                <DropdownReact/>
                                    <label htmlFor="PosologiaCorreta">Posologia Correta</label>
                                    <br></br>
                                    <Dropdown className="" value={getPosologia} options={options} onChange={onPosologiaChange} placeholder="Selecione uma opcao" style={{width: '100%'}}/>
                                <DropdownReact/>
                            </div>
                        </div>

                    </div>

                    <button type="submit" className="btn btn-info btn-primary mt-3">Cadastrar</button>
                </form>
            </div>
        </div>
    )
}

export default MedicalRecordsForm;