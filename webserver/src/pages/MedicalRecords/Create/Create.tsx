import React, { useState, FormEvent } from 'react';
import {Dropdown} from 'primereact/dropdown';
import {Dropdown as DropdownReact} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import ToastComponent from '../../../components/Toast';

import {CreateMedicalRecordsService} from './CreateMedicalRecordsService'

const MedicalRecordsForm = () => {

    const [getNroProntuario, setNroProntuario] = useState<any>(null)
    const [getSeqPaciente, setSeqPaciente] = useState<any>(null)
    const [getDataInternacao, setDataInternacao] = useState<string>('')
    const [getCodDoencaPrincipal, setCodDoencaPrincipal] = useState<string>('')
    const [getCodDoencaSecundario, setCodDoencaSecundario] = useState<any>(null)
    const [getSistemaAcometido, setSistemaAcometido] = useState<string>('')
    const [getCodComorbidade, setCodComorbidade] = useState<any>(null)
    const [getOrigem, setOrigem] = useState<string>('')
    const [getAlocacao, setAlocacao] = useState<string>('')
    const [getResultadoColeta, setResultadoColeta] = useState<any>(null)
    const [getCodAtbPrimario, setCodAtbPrimario] = useState<string>('')
    const [getCodAtbSecundario, setCodAtbSecundario] = useState<any>(null)
    const [getSitioInfeccaoPrimario, setSitioInfeccaoPrimario] = useState<any>(null)
    const [getTratamento, setTratamento] = useState<string>('')
    const [getIndicacao, setIndicacao] = useState<string>('')
    const [getDisfuncao, setDisfuncao] = useState<string>('')
    const [getOrigemInfeccao, setOrigemInfeccao] = useState<string>('')
    const [getDose, setDose] = useState<any>(null)
    const [getPosologia, setPosologia] = useState<any>(null)
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');
    const history = useHistory()

    const createMedicalRecordsService = new CreateMedicalRecordsService()

    const onResultadoChange = (e: { value: string }) => {
        setResultadoColeta(e.value);
    };

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

    function checkInput(type: number, e: any){
        if(type == 1){
            if(e === ''){
                setCodDoencaSecundario(null);
            }else{
                setCodDoencaSecundario(e)
            }
        }
        if(type == 2){
            if(e === ''){
                setCodComorbidade(null);
            }else{
                setCodComorbidade(e)
            }
        }
        if(type == 3){
            if(e === ''){
                setCodAtbSecundario(null);
            }else{
                setCodAtbSecundario(e)
            } 
        }
        if(type == 4){
            if(e === ''){
                setSitioInfeccaoPrimario(null);
            }else{
                setSitioInfeccaoPrimario(e)
            }  
        }
    }

    let options = [
        {label: 'Sim', value: 'S'},
        {label: 'Não', value: 'N'}
    ];

    function handleSubmit(event: FormEvent){
        event.preventDefault();

        createMedicalRecordsService.Create(getNroProntuario, getSeqPaciente,
            getDataInternacao, getCodDoencaPrincipal, getCodDoencaSecundario,
            getSistemaAcometido, getCodComorbidade, getOrigem, getAlocacao,
            getResultadoColeta, getCodAtbPrimario, getCodAtbSecundario,
            getSitioInfeccaoPrimario, getTratamento, getIndicacao,
            getDisfuncao, getOrigemInfeccao, getDose, getPosologia)
        .then((response) => {
            if(response.CreatedMedicalRecord){
                showToast('success', 'Sucesso!', `Prontuário criado com sucesso!`);
                setTimeout(() => {
                    history.push('/medicalRecords')
                }, 3500)
            }else{
                if(response.error.sqlMessage){
                    if(response.error.sqlState == 23000){
                        if(String(response.error.sqlMessage).includes("(`CodDoencaPrincipal`)") || String(response.error.sqlMessage).includes("(`CodDoencaSecundario`)")){
                            showToast('error', 'Erro!', `O campo código de doença está incorreto`);
                        }
                        else if(String(response.error.sqlMessage).includes("(`CodAtbPrimario`)")  || String(response.error.sqlMessage).includes("(`CodAtbSecundario`)")){
                            showToast('error', 'Erro!', `O campo código de medicamento está incorreto`);
                        }else{
                            showToast('error', 'Erro!', String(response.error.sqlMessage));
                        }
                    }else{
                        showToast('error', 'Erro!', String(response.error.sqlMessage));
                    }
                }else{
                    showToast('error', 'Erro!', String(response.error));
                }
            }
        })
    }
    
    function showToast(messageType: string, messageTitle: string, messageContent: string){
        setToast(false)
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 4500)
    }

    return (
        <div className="row m-5">
            <div className="card shadow-lg p-3 col-sm-6 offset-md-3 border">
                <p className="text-dark h3 text-center">Cadastro de Prontuário</p>
                <form className="was-validated" onSubmit={handleSubmit}>
                    <div className="form-group">
                        
                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <label htmlFor="NroProntuario">Número do Prontuário</label>
                                <input type="number" className="form-control" id="NroProntuario" name="NroProntuario"
                                    defaultValue={getNroProntuario} onChange={(e) => setNroProntuario(Number((e.target as HTMLInputElement).value))}
                                    placeholder="Digite o número do prontuário" required autoFocus/>
                            </div>

                            <div className="col">
                                <label htmlFor="SeqPaciente">Sequência do Paciente</label>
                                <input type="number" className="form-control" id="SeqPaciente" name="SeqPaciente"
                                defaultValue={getSeqPaciente} onChange={(e) => setSeqPaciente(Number((e.target as HTMLInputElement).value))}
                                placeholder="Digite o número do paciente" required/>
                            </div>
                        </div>

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <label htmlFor="Origem">Origem</label>
                                <input type="text" className="form-control" id="Origem" name="Origem"
                                    defaultValue={getOrigem} onChange={(e) => setOrigem((e.target as HTMLInputElement).value)}
                                    placeholder="Digite a origem" required/>
                            </div>

                            <div className="col">
                                <label htmlFor="Alocacao">Alocação</label>
                                <input type="text" className="form-control" id="Alocacao" name="Alocacao"
                                    defaultValue={getAlocacao} onChange={(e) => setAlocacao((e.target as HTMLInputElement).value)}
                                    placeholder="Digite a alocação" required/>
                            </div>
                        </div>

                        <label htmlFor="DataInternacao" className="mt-4">Data da Internação</label>
                        <input type="date" className="form-control" id="DataInternacao" name="DataInternacao"
                            defaultValue={getDataInternacao} onChange={(e) => setDataInternacao((e.target as HTMLInputElement).value)}
                            required/>
                        
                        <label htmlFor="CodDoencaPrincipal" className="mt-4">Código de Doença Primário</label>
                        <input type="text" className="form-control" id="CodDoencaPrincipal" name="CodDoencaPrincipal"
                            defaultValue={getCodDoencaPrincipal} onChange={(e) => setCodDoencaPrincipal((e.target as HTMLInputElement).value)}
                            placeholder="Digite o código de doença primário" required/>
                        
                        <label htmlFor="CodDoencaSecundario" className="mt-4">Código de Doença Secundário</label>
                        <input type="text" className="form-control" id="CodDoencaSecundario" name="CodDoencaSecundario"
                            defaultValue={getCodDoencaSecundario} onChange={(e) => {checkInput(1, (e.target as HTMLInputElement).value)}}
                            placeholder="Digite o código de doença secundário" />
                        
                        <label htmlFor="SistemaAcometido" className="mt-4">Sistema Acometido</label>
                        <input type="text" className="form-control" id="SistemaAcometido" name="SistemaAcometido"
                            defaultValue={getSistemaAcometido} onChange={(e) => setSistemaAcometido((e.target as HTMLInputElement).value)}
                            placeholder="Digite o sistema acometido" required/>
                        
                        <label htmlFor="CodComorbidade" className="mt-4">Código de Comorbidade</label>
                        <input type="text" className="form-control" id="CodComorbidade" name="CodComorbidade"
                            defaultValue={getCodComorbidade} onChange={(e) => {checkInput(2, (e.target as HTMLInputElement).value)}}
                            placeholder="Digite o código de comorbidade" />
                        
                        <label htmlFor="CodAtbPrimario" className="mt-4">Código de Medicamento Primário</label>
                        <input type="text" className="form-control" id="CodAtbPrimario" name="CodAtbPrimario"
                            defaultValue={getCodAtbPrimario} onChange={(e) => setCodAtbPrimario((e.target as HTMLInputElement).value)}
                            placeholder="Digite o código de medicamento primário" required/>

                        <label htmlFor="CodAtbSecundario" className="mt-4">Código de Medicamento Secundário</label>
                        <input type="text" className="form-control" id="CodAtbSecundario" name="CodAtbSecundario"
                            defaultValue={getCodAtbSecundario} onChange={(e) => {checkInput(3, (e.target as HTMLInputElement).value)}}
                            placeholder="Digite o código de medicamento secundário" />

                        <label htmlFor="SitioInfeccaoPrimario" className="mt-4">Sítio de Infecção Primário</label>
                        <input type="text" className="form-control" id="SitioInfeccaoPrimario" name="SitioInfeccaoPrimario"
                            defaultValue={getSitioInfeccaoPrimario} onChange={(e) => {checkInput(4, (e.target as HTMLInputElement).value)}}
                            placeholder="Digite o sítio de infecção primário" />

                        <label htmlFor="OrigemInfeccao" className="mt-4">Origem da Infecção</label>
                        <input type="text" className="form-control" id="OrigemInfeccao" name="OrigemInfeccao"
                            defaultValue={getOrigemInfeccao} onChange={(e) => setOrigemInfeccao((e.target as HTMLInputElement).value)}
                            placeholder="Digite a origem da infecção" required/>

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact/>
                                    <label htmlFor="ResultadoColeta">Resultado Coleta</label>
                                    <br></br>
                                    <Dropdown className="" value={getResultadoColeta} options={options} onChange={onResultadoChange} placeholder="Selecione uma opção" style={{width: '100%'}}/>
                                <DropdownReact/>
                            </div>
                            
                            <div className="col mr-4">
                                <DropdownReact/>
                                    <label htmlFor="TratamentoCCIH">Tratamento CCIH</label>
                                    <br></br>
                                    <Dropdown className="" value={getTratamento} options={options} onChange={onTratamentoChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>
                                <DropdownReact/>
                            </div>

                            <div className="col">
                                <DropdownReact/>
                                    <label htmlFor="IndicacaoSepse">Indicação Sepse</label>
                                    <br></br>
                                    <Dropdown className="" value={getIndicacao} options={options} onChange={onIndicacaoChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>
                                <DropdownReact/>
                            </div>
                        </div>

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact/>
                                    <label htmlFor="DisfuncaoRenal">Disfunção Renal</label>
                                    <br></br>
                                    <Dropdown className="" value={getDisfuncao} options={options} onChange={onDisfuncaoChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>
                                <DropdownReact/>
                            </div>
                            
                            <div className="col mr-4">
                                <DropdownReact/>
                                    <label htmlFor="DoseCorreta">Dose Correta</label>
                                    <br></br>
                                    <Dropdown className="" value={getDose} options={options} onChange={onDoseChange} placeholder="Selecione uma opção" style={{width: '100%'}}/>
                                <DropdownReact/>
                            </div>

                            <div className="col">
                                <DropdownReact/>
                                    <label htmlFor="PosologiaCorreta">Posologia Correta</label>
                                    <br></br>
                                    <Dropdown className="" value={getPosologia} options={options} onChange={onPosologiaChange} placeholder="Selecione uma opção" style={{width: '100%'}}/>
                                <DropdownReact/>
                            </div>
                        </div>

                    </div>
                    
                    <button type="submit" className="btn btn-info btn-primary mt-3">Cadastrar</button>
                </form>
            </div>
            {getToast &&
                <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
            }
        </div>
    )
}

export default MedicalRecordsForm;