import React, { useState, useEffect, FormEvent } from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {FiSearch} from 'react-icons/fi';
import {AiOutlineClose} from 'react-icons/ai';
import { Link, useLocation} from 'react-router-dom';
import ToastComponent from '../../../components/Toast';
import { Dropdown } from 'primereact/dropdown';
import {Dropdown as DropdownReact} from 'react-bootstrap';
import { Dialog } from 'primereact/dialog';

import {AssessmentService} from './AssessmentService';
import Loading from '../../../components/Loading';

const Assessment = () => {
    const query = new URLSearchParams(useLocation().search)
    const queryResponse = query.get("seqProntuario") || ""

    const [getNroAvaliacao, setNroAvaliacao] = useState<any>(null)
    const [getDataAvaliacao, setDataAvaliacao] = useState<string>('')
    const [getResultadoCulturas, setResultadoCulturas] = useState<any>(null)
    const [getResCulturasAcao, setResCulturasAcao] = useState<any>(null)
    const [getDoseCorreta, setDoseCorreta] = useState<any>(null)
    const [getDoseCorretaString, setDoseCorretaString] = useState<any>(null)
    const [getPosologiaCorreta, setPosologiaCorreta] = useState<any>(null)
    const [getPosologiaCorretaString, setPosologiaCorretaString] = useState<any>(null)
    const [getAlertaDot, setAlertaDot] = useState<any>(null)
    const [getAlertaDotString, setAlertaDotString] = useState<any>(null)
    const [getAlertaDotDescricao, setAlertaDotDescricao] = useState<any>(null)
    const [getDisfuncaoRenal, setDisfuncaoRenal] = useState<string>('')
    const [getAtbContraindicacao, setAtbContraindicacao] = useState<any>(null)
    const [getAlteracaoPrescricao, setAlteracaoPrescricao] = useState<any>(null)
    const [getAlteracaoPrescricaoString, setAlteracaoPrescricaoString] = useState<any>(null)
    const [getAtbDiluicaoInfusao, setAtbDiluicaoInfusao] = useState<any>(null)
    const [getAtbDiluicaoInfusaoString, setAtbDiluicaoInfusaoString] = useState<any>(null)
    const [getInteracaoAtbMedicamento, setInteracaoAtbMedicamento] = useState<any>(null)
    const [getInteracaoAtbMedicamentoString, setInteracaoAtbMedicamentoString] = useState<any>(null)
    const [getHemodialise, setHemodialise] = useState<any>(null)
    const [getHemodialiseString, setHemodialiseString] = useState<any>(null)
    const [getAtbOral, setAtbOral] = useState<any>(null)
    const [getTrocaAtb, setTrocaAtb] = useState<any>(null)
    const [getNovoAtb, setNovoAtb] = useState<any>(null)
    const [getNomePaciente, setNomePaciente] = useState<string>('')
    const [getDataAvaliacaoTratada, setDataAvaliacaoTratada] = useState<string>('')

    const [assessment, setAssessment] = useState([]);
    const [datasource, setDatasource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [getFirst, setFirst] = useState(0);
    const [totalAssessment, setTotalAssessment] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [open, setOpen] = useState(false);
    const [getMode, setMode] = useState<string>('N');
    const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
    const [getOptionState, setOptionState] = useState<any>(null)
    const [getAssessmentChange, setAssessmentChange] = useState();
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    const [displayDialog, setDisplayDialog] = useState(false);
    const [displayDialog1, setDisplayDialog1] = useState(false);
    const [displayDialog2, setDisplayDialog2] = useState(false);
    const [displayDialog3, setDisplayDialog3] = useState(false);

    const assessmentService = new AssessmentService()
    var assessmentData:any = {};
    
    const rows = 10;

    const onOptionChange = (e: { value: any }) => {
        setOptionState(e.value);
    };
    
    useEffect(() => {
        setLoading1(true);
        setTimeout(() => {
            assessmentService.getAssessmentPaginate(queryResponse, 10).then(data => {
                getAssessmentFunction(data)
            });
        }, 1000)
    }, []);

    function getAssessmentFunction(data?: any){
        setLoading(true);
        if(!data){
            assessmentService.getAssessmentPaginate(queryResponse, 10).then(data => {
                if(data.showAssessments){
                    setDatasource(data.assessments);
                    setTotalAssessment(data.length);
                    data = data.assessments;
                    
                    setAssessment(data.slice(0, rows));
                    setLoading(false);
                    setLoading1(false);
                    return 
                }else{
                    showToast('error', 'Erro!', String(data.error));
                    setLoading(false);
                    setLoading1(false);
                }
            })
        }else{
            if(data.showAssessments){
                setDatasource(data.assessments);
                setTotalAssessment(data.length);
                data = data.assessments;
                
                setAssessment(data.slice(0, rows));
                setLoading(false);
                setLoading1(false);
                return
            }else{
                showToast('error', 'Erro!', String(data.error));
                setLoading(false);
                setLoading1(false);
            }
        }
    }

    const onPage = (event: any) => {
        setLoading(true);
        
        const startIndex = event.first;
        const endIndex = event.first + rows;
        assessmentService.getAssessmentPaginate(queryResponse, endIndex).then(data => {
            getAssessmentFunction(data);
        });
        setFirst(startIndex);
        setAssessment(datasource.slice(startIndex, endIndex));
        setLoading(false);
    }

    const header = 
        <>
            <p style={{textAlign:'left'}} className="p-clearfix d-inline">Avaliações</p>
        </>;

    function handleSearch(){
        if(!getOptionState){
            showToast('error', 'Erro!', 'Selecione um filtro para buscar.');
            return
        }
        setLoading(true);
        if(!searchInput){
            assessmentService.getAssessmentPaginate(queryResponse, 10).then(data => {
                getAssessmentFunction(data);
                setLoading(false);
                showToast('error', 'Erro!', 'Digite algum valor para pesquisar.');
            })
            return
        }
        setMode('S');
        assessmentService.searchAssessmentGlobal(queryResponse, searchInput, getOptionState.cod, getFirst+rows).then(data => {
            if(!data.showAssessments){
                setLoading(false);
                setAssessment([]);
                showToast('warn', 'Resultados não encontrados!', 'Não foram encontrados resultados para a busca desejada')
                return
            }
            getAssessmentFunction(data)
            let searchType;
            if(getOptionState.name === 'Nro Avaliação'){
                searchType = 'NroAvaliacao';
            }else if(getOptionState.name === 'Data Avaliação'){
                searchType = 'DataAvaliacao';
            }else{
                searchType = getOptionState.name
            }
            console.log(data)
            let dataSize = data.length[0]['count(`' + searchType + '`)']
            if(dataSize == 1){
                showToast('info', 'Resultado Encontrado!', `Foi encontrado ${dataSize} resultado.`)
            }else{
                showToast('info', 'Resultados Encontrados!', `Foram encontrados ${dataSize} resultados.`)
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

    function checkInput(type: number, e: any){
        if(type == 1){
            if(e === ''){
                setResultadoCulturas(null);
            }else{
                setResultadoCulturas(e)
            }
        }
        if(type == 2){
            if(e === ''){
                setResCulturasAcao(null);
            }else{
                setResCulturasAcao(e)
            }
        }
        if(type == 3){
            if(e === ''){
                setAlertaDotDescricao(null);
            }else{
                setAlertaDotDescricao(e)
            }
        }
        if(type == 4){
            if(e === ''){
                setNovoAtb(null);
            }else{
                setNovoAtb(e)
            }
        }
    }

    const onDoseCorretaChange = (e: { value: string }) => {
        setDoseCorreta(e.value);
    };

    const onPosologiaCorretaChange = (e: { value: string }) => {
        setPosologiaCorreta(e.value);
    };

    const onAlertaDotChange = (e: { value: string }) => {
        setAlertaDot(e.value);
    };

    const onAlteracaoPrescricaoChange = (e: { value: string }) => {
        setAlteracaoPrescricao(e.value);
    };

    const onAtbContraindicacaoChange = (e: { value: string }) => {
        setAtbContraindicacao(e.value);
    };

    const onAtbDiluicaoInfusaoChange = (e: { value: string }) => {
        setAtbDiluicaoInfusao(e.value);
    };

    const onInteracaoAtbMedicamentoChange = (e: { value: string }) => {
        setInteracaoAtbMedicamento(e.value);
    };

    const onHemodialiseChange = (e: { value: string }) => {
        setHemodialise(e.value);
    };

    const onAtbOralChange = (e: { value: string }) => {
        setAtbOral(e.value);
    };

    const onTrocaAtbChange = (e: { value: string }) => {
        setTrocaAtb(e.value);
    };

    let options = [
        {label: 'Sim', value: 'S'},
        {label: 'Não', value: 'N'}
    ]

    let options2 = [
        {label: 'Sim', value: 'S'},
        {label: 'Sim intermitente', value: 'SI'},
        {label: 'Não', value: 'N'}
    ]

    let options3 = [
        {label: 'Sim', value: 'Sim'},
        {label: 'Não aplica', value: 'Não aplica'},
        {label: 'Não', value: 'Não'}
    ]

    let options4 = [
        {name: 'Nro Avaliação', cod: 'Nro'},
        {name: 'Data Avaliação', cod: 'Dat'}
    ]

    let options5 = [
        {label: 'Sim', value: 'Sim'},
        {label: 'Não', value: 'Não'}
    ]

    function handleSubmit(event: FormEvent){
        event.preventDefault();

        assessmentService.Update(queryResponse, getNroAvaliacao, getDataAvaliacao, getResultadoCulturas, getResCulturasAcao,
            getDoseCorreta, getPosologiaCorreta, getAlertaDot, getAlertaDotDescricao, getDisfuncaoRenal,
            getHemodialise, getAtbOral, getAtbContraindicacao, getAlteracaoPrescricao, getAtbDiluicaoInfusao, 
            getInteracaoAtbMedicamento, getTrocaAtb, getNovoAtb)
        .then((response) => {
            if(response.updatedAssessment){
                showToast('success', 'Sucesso!', `Avaliação atualizada com sucesso!`);
                getAssessmentFunction()
                setDisplayDialog2(false)
            }else{
                if(response.error.sqlMessage){
                    if(response.error.sqlState == 23000){
                        console.log(response.error.sqlState)
                        if(String(response.error.sqlMessage).includes("(`NovoAtb`)")){
                            showToast('error', 'Erro!', `O campo Novo Atb está incorreto`);
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

    function onClickDelete(){
        assessmentService.Delete(getNroAvaliacao)
        .then((response) => {
            if(response.deletedAssessment){
                showToast('success', 'Sucesso!', `Avaliação deletada com sucesso!`);
                getAssessmentFunction()
                setTimeout(() => {
                    setDisplayDialog3(false)
                }, 2500)
            }else{
                if(response.error.sqlMessage){
                    showToast('error', 'Erro!', String(response.error.sqlMessage));
                }else{
                    showToast('error', 'Erro!', String(response.error));
                }
            }
        })
    }
    
    let newAssessment = true
    function onAssessmentSelect (e: any) {
        newAssessment = false;
        setAssessmentChange(e.value);
        assessmentData = e.data;

        setNroAvaliacao(assessmentData.NroAvaliacao)
        var res = assessmentData.DataAvaliacao.split("/")
        var newData = res[2] + "-" + res[1] + "-" + res[0]
        setDataAvaliacaoTratada(assessmentData.DataAvaliacao)
        setDataAvaliacao(newData)
        setResultadoCulturas(assessmentData.ResultadoCulturas)
        setResCulturasAcao(assessmentData.ResCulturasAcao)
        if(assessmentData.DoseCorreta == "S"){
            setDoseCorretaString("Sim")
        }
        if(assessmentData.DoseCorreta == "N"){
            setDoseCorretaString("Não")
        }
        setDoseCorreta(assessmentData.DoseCorreta)
        if(assessmentData.PosologiaCorreta == "S"){
            setPosologiaCorretaString("Sim")
        }
        if(assessmentData.PosologiaCorreta == "N"){
            setPosologiaCorretaString("Não")
        }
        setPosologiaCorreta(assessmentData.PosologiaCorreta)
        if(assessmentData.AlertaDot == "S"){
            setAlertaDotString("Sim")
        }
        if(assessmentData.AlertaDot == "N"){
            setAlertaDotString("Não")
        }
        setAlertaDot(assessmentData.AlertaDot)
        setAlertaDotDescricao(assessmentData.AlertaDotDescricao)
        setDisfuncaoRenal(assessmentData.DisfuncaoRenal)
        setAtbContraindicacao(assessmentData.AtbContraindicacao)
        if(assessmentData.AlteracaoPrescricao == "S"){
            setAlteracaoPrescricaoString("Sim")
        }
        if(assessmentData.AlteracaoPrescricao == "N"){
            setAlteracaoPrescricaoString("Não")
        }
        setAlteracaoPrescricao(assessmentData.AlteracaoPrescricao)
        if(assessmentData.AtbDiluicaoInfusao == "S"){
            setAtbDiluicaoInfusaoString("Sim")
        }
        if(assessmentData.AtbDiluicaoInfusao == "N"){
            setAtbDiluicaoInfusaoString("Não")
        }
        setAtbDiluicaoInfusao(assessmentData.AtbDiluicaoInfusao)
        if(assessmentData.InteracaoAtbMedicamento == "S"){
            setInteracaoAtbMedicamentoString("Sim")
        }
        if(assessmentData.InteracaoAtbMedicamento == "N"){
            setInteracaoAtbMedicamentoString("Não")
        }
        setInteracaoAtbMedicamento(assessmentData.InteracaoAtbMedicamento)
        if(assessmentData.Hemodialise == "S"){
            setHemodialiseString("Sim")
        }
        if(assessmentData.Hemodialise == "SI"){
            setHemodialiseString("Sim intermitente")
        }
        if(assessmentData.Hemodialise == "N"){
            setHemodialiseString("Não")
        }
        setHemodialise(assessmentData.Hemodialise)
        setAtbOral(assessmentData.AtbOral)
        setTrocaAtb(assessmentData.TrocaAtb)
        setNovoAtb(assessmentData.NovoAtb)
        setNomePaciente(assessmentData.NomePaciente)
        
        setDisplayDialog(true)
    };

    return (
        <div className="row m-5 px-5">
            <Link to={location => ({...location, pathname: '/medicalRecords/assessment/create/'})}><Button variant="outline-dark" className="mb-2" style={{borderRadius: '0', height:'41.5px'}}>Cadastrar Avaliação</Button></Link>
            <Button variant="outline-secondary" className="mb-2 ml-2" onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open} style={{borderRadius: '0'}}>Buscar avaliação específica</Button>
            <Collapse in={open} timeout={200}>
                <div className="ml-2">
                    <div className="p-inputgroup">
                        <span className="p-float-label">
                            <InputText id="float-input" type="search" value={searchInput} onChange={(e) => {setSearchInput((e.target as HTMLInputElement).value)}} onKeyPress={(ev) => {if (ev.key === 'Enter') {ev.preventDefault();}}}  style={{minWidth:'4em', borderRadius: '0'}} size={30} />
                            {getOptionState === null
                                ? <label htmlFor="float-input">Buscar</label>
                                : <label htmlFor="float-input">Buscar por {getOptionState.name}</label>
                            }
                        </span>
                        {searchInput === ''
                            ? <></>
                            :
                                <>
                                    <Dropdown className="mx-1" value={getOptionState} options={options4} onChange={onOptionChange} placeholder="Selecione um filtro" optionLabel="name" style={{width: '12em'}}/>
                                    <Button tabIndex={2} variant="outline-danger" className="p-0 mr-1" style={{width: '17px', borderRadius: '0'}} onClick={() => {setSearchInput(''); getAssessmentFunction(); setMode('N'); setOptionState(null)}}><AiOutlineClose size={15}/></Button>
                                    <Button onClick={handleSearch} style={{borderRadius: '0'}}><FiSearch size={15}/></Button>
                                </>
                        }
                    </div>
                </div>
            </Collapse>
            <div className="ml-auto"></div>

            <DataTable value={assessment} paginator={true} rows={rows} header={header} totalRecords={totalAssessment}
                emptyMessage="Nenhum resultado encontrado" className="p-datatable-responsive-demo" resizableColumns={true} loading={loading} first={getFirst}
                onPage={onPage} lazy={true} selectionMode="single" selection={selectedAssessment} onSelectionChange={e => setSelectedAssessment(e.value)}
                onRowSelect={(e) => {onAssessmentSelect(e);}}>
                <Column field="NroAvaliacao" header="Nro Avaliação" style={{width:'20%', textAlign:'center'}}/>
                <Column field="DataAvaliacao" header="Data Avaliação" style={{width:'20%', textAlign:'center'}}/>
                <Column field="AtbOral" header="Antibiótico Oral" style={{width:'20%', textAlign:'center'}}/>
                <Column field="AtbContraindicacao" header="Antibiótico Contraindicacao" style={{width:'20%', textAlign:'center'}}/>
                <Column field="TrocaAtb" header="Troca antibiótico" style={{width:'20%', textAlign:'center'}}/>
            </DataTable>

            <Dialog visible={displayDialog} style={{width: '50%'}} header="Ações" modal={true} onHide={() => setDisplayDialog(false)}>
                <div className="form-row text-center">
                    <div className="col">
                        <Button className="mx-2 p-3" onClick={() => {setDisplayDialog(false); setDisplayDialog1(true)}}>Visualizar <br></br> avaliação</Button>
                    </div>
                    <div className="col">
                        <Button className="mx-2 p-3" onClick={() => {setDisplayDialog(false); setDisplayDialog2(true)}}>Atualizar <br></br> avaliação</Button>
                    </div>
                    <div className="col">
                        <Button className="mx-2 p-3" onClick={() => {setDisplayDialog(false); setDisplayDialog3(true)}}>Excluir <br></br> avaliação</Button>
                    </div>
                </div>
            </Dialog>

            <Dialog visible={displayDialog3} style={{width: '50%'}} modal={true} onHide={() => {setDisplayDialog3(false); showToast('warn', 'Aviso!', 'Operação cancelada pelo usuário.');}}>
                <p className="h5 mx-2">Deseja realmente excluir a avaliação {getNroAvaliacao} do paciente {getNomePaciente} do sistema?</p>
                <Button className="mx-2 mt-2 mb-2 mr-3 pr-3 pl-3" variant="outline-danger" onClick={() => {onClickDelete(); setDisplayDialog3(false)}}>Sim</Button>
                <Button className="mx-2 mt-2 mb-2 pr-3 pl-3" variant="outline-success"onClick={() => {setDisplayDialog3(false); showToast('warn', 'Aviso!', 'Operação cancelada pelo usuário.');}}>Não</Button>
            </Dialog>

            <Dialog visible={displayDialog1} style={{width: '50%'}} modal={true} maximizable onHide={() => {setDisplayDialog1(false);}}>
                <p className="text-dark h3 text-center mr-5 mb-2">Avaliação {getNroAvaliacao} do paciente {getNomePaciente}</p>
                <p className="text-dark h5 mt-5">Data da Avaliação: {getDataAvaliacaoTratada}</p>
                {getResultadoCulturas &&
                    <p className="text-dark h5 mt-3">Resultado das Culturas: {getResultadoCulturas}</p>
                }
                {getResCulturasAcao &&
                    <p className="text-dark h5 mt-3">Ação do Resultado das Culturas: {getResCulturasAcao}</p>
                }
                {getDoseCorreta &&
                    <p className="text-dark h5 mt-3">Dose Correta: {getDoseCorretaString}</p>
                }
                {getPosologiaCorreta &&
                    <p className="text-dark h5 mt-3">Posologia Correta: {getPosologiaCorretaString}</p>
                }
                {getAlertaDot &&
                    <p className="text-dark h5 mt-3">Alerta Dot: {getAlertaDotString}</p>
                }
                {getAlertaDotDescricao &&
                    <p className="text-dark h5 mt-3">Descrição do Alerta Dot: {getAlertaDotDescricao}</p>
                }
                <p className="text-dark h5 mt-3">Disfuncao Renal: {getDisfuncaoRenal}</p>
                <p className="text-dark h5 mt-3">Contraindicação de Atb: {getAtbContraindicacao}</p>
                {getAlteracaoPrescricao &&
                    <p className="text-dark h5 mt-3">Alteração da Prescrição: {getAlteracaoPrescricaoString}</p>
                }
                <p className="text-dark h5 mt-3">Diluição e/ou Infusão de Atb: {getAtbDiluicaoInfusaoString}</p>
                <p className="text-dark h5 mt-3">Interação Atb e Medicamento: {getInteracaoAtbMedicamentoString}</p>
                <p className="text-dark h5 mt-3">Hemodialise: {getHemodialiseString}</p>
                <p className="text-dark h5 mt-3">Atb Oral: {getAtbOral}</p>
                <p className="text-dark h5 mt-3">Troca do Atb: {getTrocaAtb}</p>
                {getNovoAtb &&
                    <p className="text-dark h5 mt-3">Novo Atb: {getNovoAtb}</p>
                }
            </Dialog>

            <Dialog visible={displayDialog2} style={{width: '50%'}} header="" modal={true} maximizable onHide={() => {setDisplayDialog2(false); showToast('warn', 'Aviso!', 'Operação cancelada pelo usuário.');}}>
                <div className="">
                    <p className="text-dark h3 text-center">Atualização de Avaliação</p>
                    <form className="was-validated" onSubmit={handleSubmit}>
                        <div className="form-group">

                            <div className="form-row mt-4">
                                <div className="col mr-4">
                                    <label htmlFor="NroAvaliacao">Número da Avaliação</label>
                                    <input type="number" className="form-control" id="NroAvaliacao" name="NroAvaliacao"
                                        defaultValue={getNroAvaliacao} onChange={(e) => setNroAvaliacao(Number((e.target as HTMLInputElement).value))}
                                        placeholder="Digite o número da avaliação" min="1" max="999999999" required readOnly/>
                                </div>

                                <div className="col">
                                    <label htmlFor="DataAvaliacao" className="mt">Data da Avaliação</label>
                                    <input type="date" className="form-control" id="DataAvaliacao" name="DataAvaliacao"
                                        defaultValue={getDataAvaliacao} onChange={(e) => setDataAvaliacao((e.target as HTMLInputElement).value)} autoFocus required/>
                                </div>
                            </div>

                            <label htmlFor="ResultadoCulturas" className="mt-4">Resultado das Culturas</label>
                            <input type="text" className="form-control" id="ResultadoCulturas" name="ResultadoCulturas"
                                defaultValue={getResultadoCulturas} onChange={(e) => {checkInput(1, (e.target as HTMLInputElement).value)}}
                                placeholder="Digite o resultado das culturas"/>
                            
                            <label htmlFor="ResCulturasAcao" className="mt-4">Ação do Resultado das Culturas</label>
                            <input type="text" className="form-control" id="ResCulturasAcao" name="ResCulturasAcao"
                                defaultValue={getResCulturasAcao} onChange={(e) => {checkInput(2, (e.target as HTMLInputElement).value)}}
                                placeholder="Digite a ação do resultado das culturas"/>

                            <div className="form-row mt-4">
                                <div className="col mr-4">
                                    <DropdownReact/>
                                        <label htmlFor="DoseCorreta">Dose Correta</label>
                                        <br></br>
                                        <Dropdown className="" value={getDoseCorreta} options={options} 
                                        onChange={onDoseCorretaChange} placeholder="Selecione uma opção" style={{width: '100%'}}/>

                                    <DropdownReact/>
                                </div>
                                
                                <div className="col mr-4">
                                    <DropdownReact/>
                                        <label htmlFor="PosologiaCorreta">Posologia Correta</label>
                                        <br></br>
                                        <Dropdown className="" value={getPosologiaCorreta} options={options} 
                                        onChange={onPosologiaCorretaChange} placeholder="Selecione uma opção" style={{width: '100%'}}/>

                                    <DropdownReact/>
                                </div>

                                <div className="col">
                                    <DropdownReact/>
                                        <label htmlFor="AlertaDot">Alerta Dot</label>
                                        <br></br>
                                        <Dropdown className="" value={getAlertaDot} options={options} 
                                        onChange={onAlertaDotChange} placeholder="Selecione uma opção" style={{width: '100%'}}/>

                                    <DropdownReact/>
                                </div>
                            </div>

                            <label htmlFor="AlertaDotDescricao" className="mt-4">Descrição do Alerta Dot</label>
                            <input type="text" className="form-control" id="AlertaDotDescricao" name="AlertaDotDescricao"
                                defaultValue={getAlertaDotDescricao} onChange={(e) => {checkInput(3, (e.target as HTMLInputElement).value)}}
                                placeholder="Digite a descrição do alerta dot"/>

                            <label htmlFor="DisfuncaoRenal" className="mt-4">Disfuncao Renal</label>
                            <input type="text" className="form-control" id="DisfuncaoRenal" name="DisfuncaoRenal"
                                defaultValue={getDisfuncaoRenal} onChange={(e) => setDisfuncaoRenal((e.target as HTMLInputElement).value)}
                                placeholder="Digite a disfunção renal" required/>

                            <div className="form-row mt-4">
                                <div className="col mr-4">
                                    <DropdownReact/>
                                        <label htmlFor="AtbContraindicacao">Contraindicação de Atb</label>
                                        <br></br>
                                        <Dropdown className="" value={getAtbContraindicacao} options={options5} 
                                        onChange={onAtbContraindicacaoChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>

                                    <DropdownReact/>
                                </div>
                                
                                <div className="col">
                                    <DropdownReact/>
                                        <label htmlFor="AlteracaoPrescricao">Alteração da Prescrição</label>
                                        <br></br>
                                        <Dropdown className="" value={getAlteracaoPrescricao} options={options} 
                                        onChange={onAlteracaoPrescricaoChange} placeholder="Selecione uma opção" style={{width: '100%'}}/>

                                    <DropdownReact/>
                                </div>
                            </div>

                            <div className="form-row mt-4">
                                <div className="col mr-4">
                                    <DropdownReact/>
                                        <label htmlFor="AtbDiluicaoInfusao">Diluição e/ou Infusão de Atb</label>
                                        <br></br>
                                        <Dropdown className="" value={getAtbDiluicaoInfusao} options={options} 
                                        onChange={onAtbDiluicaoInfusaoChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>

                                    <DropdownReact/>
                                </div>
                                
                                <div className="col">
                                    <DropdownReact/>
                                        <label htmlFor="InteracaoAtbMedicamento">Interação Atb e Medicamento</label>
                                        <br></br>
                                        <Dropdown className="" value={getInteracaoAtbMedicamento} options={options} 
                                        onChange={onInteracaoAtbMedicamentoChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>

                                    <DropdownReact/>
                                </div>
                            </div>

                            <div className="form-row mt-4">
                                <div className="col mr-4">
                                    <DropdownReact/>
                                        <label htmlFor="Hemodialise">Hemodialise</label>
                                        <br></br>
                                        <Dropdown className="" value={getHemodialise} options={options2} 
                                        onChange={onHemodialiseChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>

                                    <DropdownReact/>
                                </div>
                                
                                <div className="col mr-4">
                                    <DropdownReact/>
                                        <label htmlFor="AtbOral">Atb Oral</label>
                                        <br></br>
                                        <Dropdown className="" value={getAtbOral} options={options3} 
                                        onChange={onAtbOralChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>

                                    <DropdownReact/>
                                </div>

                                <div className="col">
                                    <DropdownReact/>
                                        <label htmlFor="TrocaAtb">Troca do Atb</label>
                                        <br></br>
                                        <Dropdown className="" value={getTrocaAtb} options={options5} 
                                        onChange={onTrocaAtbChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>

                                    <DropdownReact/>
                                </div>
                            </div>

                            <label htmlFor="NovoAtb" className="mt-4">Novo Atb</label>
                            <input type="text" className="form-control" id="NovoAtb" name="NovoAtb"
                                defaultValue={getNovoAtb} onChange={(e) => {checkInput(4, (e.target as HTMLInputElement).value)}}
                                placeholder="Digite o novo Atb"/>

                        </div>
                        
                        <button type="submit" className="btn btn-info btn-primary mt-3">Atualizar</button>
                    </form>
                </div>
            </Dialog>

            {getToast &&
                <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
            }

            {loading1 &&
                <Loading/>
            }
        </div>
    )
}

export default Assessment;