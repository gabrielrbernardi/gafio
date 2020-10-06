import React, { useState, useEffect, FormEvent } from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {FiSearch} from 'react-icons/fi';
import {AiOutlineClose} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import ToastComponent from '../../components/Toast';
import { Dropdown } from 'primereact/dropdown';
import {Dropdown as DropdownReact} from 'react-bootstrap';
import { Dialog } from 'primereact/dialog';

import {MedicalRecordsService} from './MedicalRecordsService';
import Loading from '../../components/Loading';

const MedicalRecords = () => {
    const [getNroProntuario, setNroProntuario] = useState<any>(null)
    const [getNroPaciente, setNroPaciente] = useState<any>(null)
    const [getNomePaciente, setNomePaciente] = useState<any>(null)
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
    const [getDesfecho, setDesfecho] = useState<any>(null)
    const [getDataDesfecho, setDataDesfecho] = useState<any>(null)
    
    const [getDataTratadaInternacao, setDataTratadaInternacao] = useState<string>('')
    const [getResultadoColetaString, setResultadoColetaString] = useState<string>('')
    const [getTratamentoString, setTratamentoString] = useState<string>('')
    const [getIndicacaoString, setIndicacaoString] = useState<string>('')
    const [getDisfuncaoString, setDisfuncaoString] = useState<string>('')
    const [getDoseString, setDoseString] = useState<string>('')
    const [getPosologiaString, setPosologiaString] = useState<string>('')
    const [getDataTratadaDesfecho, setDataTratadaDesfecho] = useState<string>('')
    
    const [MedicalRecords, setMedicalRecords] = useState([]);
    const [datasource, setDatasource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [getFirst, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [open, setOpen] = useState(false);
    const [getMode, setMode] = useState<string>('N');
    const [displayDialog, setDisplayDialog] = useState(false);
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<any>(null);
    const [getOptionState, setOptionState] = useState<any>(null)
    const [getUserChange, setMedicalRecordChange] = useState();
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');
    const [displayDialog1, setDisplayDialog1] = useState(false);
    const [displayDialog2, setDisplayDialog2] = useState(false);
    const [displayDialog3, setDisplayDialog3] = useState(false);
    const [displayDialog4, setDisplayDialog4] = useState(false);

    const medicalRecordsService = new MedicalRecordsService()
    var medicalRecordData:any = {};

    const rows = 10;

    let options = [
        {label: 'Sim', value: 'S'},
        {label: 'Não', value: 'N'},
    ];

    let options2 = [
        {name: 'Nro Prontuário', cod: 'Pro'},
        {name: 'Nro Paciente', cod: 'Pac'},
        {name: 'Data Internação', cod: 'Int'}
    ];

    let options3 = [
        {label: 'Óbito', value: 'Óbito'},
        {label: 'Alta', value: 'Alta'},
        {label: 'Tranferência', value: 'Transferência'}
    ]

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

    const onDesfechoChange = (e: { value: string }) => {
        setDesfecho(e.value);
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

    const onOptionChange = (e: { value: any }) => {
        setOptionState(e.value);
    };
    
    useEffect(() => {
        setLoading1(true);
        setTimeout(() => {
            medicalRecordsService.getMedicalRecordsPaginate(10).then(data => {
                getMedicalRecordsFunction(data)
            });
        }, 1000)

    }, []);

    function getMedicalRecordsFunction(data?: any){
        setLoading(true);
        if(!data){
            medicalRecordsService.getMedicalRecordsPaginate(10).then(data => {
                setDatasource(data.medicalRecords);
                setTotalRecords(data.length);
                data = data.medicalRecords;
                
                setMedicalRecords(data.slice(0, rows));
                setLoading(false);
                setLoading1(false);
                return
            })
        }else{
            setDatasource(data.medicalRecords);
            setTotalRecords(data.length);
            data = data.medicalRecords;
            
            setMedicalRecords(data.slice(0, rows));
            setLoading(false);
            setLoading1(false);
            return
        }
    }

    const onPage = (event: any) => {
        setLoading(true);
        
        const startIndex = event.first;
        const endIndex = event.first + rows;
        medicalRecordsService.getMedicalRecordsPaginate(endIndex).then(data => {
            getMedicalRecordsFunction(data);
        });
        setFirst(startIndex);
        setMedicalRecords(datasource.slice(startIndex, endIndex));
        setLoading(false);
    }

    const header = 
        <>
            <p style={{textAlign:'left'}} className="p-clearfix d-inline">Prontuários</p>
        </>;

    function handleSearch(){
        if(!getOptionState){
            showToast('error', 'Erro!', 'Selecione um filtro para buscar.');
            return
        }
        setLoading(true);
        if(!searchInput){
            medicalRecordsService.getMedicalRecordsPaginate(10).then(data => {
                getMedicalRecordsFunction(data);
                setLoading(false);
                showToast('error', 'Erro!', 'Digite algum valor para pesquisar.');
            })
            return
        }
        setMode('S');
        medicalRecordsService.searchMedicalRecordsGlobal(searchInput, getOptionState.cod, getFirst+rows).then(data => {
            if(!data.showMedicalRecords){
                setLoading(false);
                setMedicalRecords([]);
                showToast('warn', 'Resultados não encontrados!', 'Não foram encontrados resultados para a busca desejada')
                return
            }
            getMedicalRecordsFunction(data)
            let searchType;
            if(getOptionState.name === 'Nro Prontuário'){
                searchType = 'NroProntuario';
            }else if(getOptionState.name === 'Nro Paciente'){
                searchType = 'NroPaciente';
            }else if(getOptionState.name === 'Data Internação'){
                searchType = 'DataInternacao'
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

    function handleSubmit(event: FormEvent){
        event.preventDefault();

        medicalRecordsService.Update(getNroProntuario, getNroPaciente,
            getDataInternacao, getCodDoencaPrincipal, getCodDoencaSecundario,
            getSistemaAcometido, getCodComorbidade, getOrigem, getAlocacao,
            getResultadoColeta, getCodAtbPrimario, getCodAtbSecundario,
            getSitioInfeccaoPrimario, getTratamento, getIndicacao,
            getDisfuncao, getOrigemInfeccao, getDose, getPosologia)
        .then((response) => {
            if(response.updatedMedicalRecord){
                showToast('success', 'Sucesso!', `Prontuário atualizado com sucesso!`);
                getMedicalRecordsFunction()
                setDisplayDialog1(false)
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

    let newMedicalRecord = true
    function onMedicalRecordSelect (e: any) {
        newMedicalRecord = false;
        setMedicalRecordChange(e.value)
        medicalRecordData = e.data;
        
        setNroProntuario(medicalRecordData.NroProntuario)
        setNroPaciente(medicalRecordData.NroPaciente)
        setNomePaciente(medicalRecordData.NomePaciente)
        var res = medicalRecordData.DataInternacao.split("/")
        var newData = res[2] + "-" + res[1] + "-" + res[0]
        setDataTratadaInternacao(medicalRecordData.DataInternacao)
        setDataInternacao(newData)
        setCodDoencaPrincipal(medicalRecordData.CodDoencaPrincipal)
        setCodDoencaSecundario(medicalRecordData.CodDoencaSecundario)
        setSistemaAcometido(medicalRecordData.SistemaAcometido)
        setCodComorbidade(medicalRecordData.CodComorbidade)
        setOrigem(medicalRecordData.Origem)
        setAlocacao(medicalRecordData.Alocacao)
        if(medicalRecordData.ResultadoColeta == "S"){
            setResultadoColetaString("Sim")
        }
        if(medicalRecordData.ResultadoColeta == "N"){
            setResultadoColetaString("Não")
        }
        setResultadoColeta(medicalRecordData.ResultadoColeta)
        setCodAtbPrimario(medicalRecordData.CodAtbPrimario)
        setCodAtbSecundario(medicalRecordData.CodAtbSecundario)
        setSitioInfeccaoPrimario(medicalRecordData.SitioInfeccaoPrimario)
        if(medicalRecordData.TratamentoCCIH == "S"){
            setTratamentoString("Sim")
        }
        if(medicalRecordData.TratamentoCCIH == "N"){
            setTratamentoString("Não")
        }
        setTratamento(medicalRecordData.TratamentoCCIH)
        if(medicalRecordData.IndicacaoSepse == "S"){
            setIndicacaoString("Sim")
        }
        if(medicalRecordData.IndicacaoSepse == "N"){
            setIndicacaoString("Não")
        }
        setIndicacao(medicalRecordData.IndicacaoSepse)
        if(medicalRecordData.DisfuncaoRenal == "S"){
            setDisfuncaoString("Sim")
        }
        if(medicalRecordData.DisfuncaoRenal == "N"){
            setDisfuncaoString("Não")
        }
        setDisfuncao(medicalRecordData.DisfuncaoRenal)
        setOrigemInfeccao(medicalRecordData.OrigemInfeccao)
        if(medicalRecordData.DoseCorreta == "S"){
            setDoseString("Sim")
        }
        if(medicalRecordData.DoseCorreta == "N"){
            setDoseString("Não")
        }
        setDose(medicalRecordData.DoseCorreta)
        if(medicalRecordData.PosologiaCorreta == "S"){
            setPosologiaString("Sim")
        }
        if(medicalRecordData.PosologiaCorreta == "N"){
            setPosologiaString("Não")
        }
        setPosologia(medicalRecordData.PosologiaCorreta)
        setDesfecho(medicalRecordData.Desfecho)
        if(medicalRecordData.DataDesfecho == null){
            setDataDesfecho(medicalRecordData.DataDesfecho)
        }else{
            setDataTratadaDesfecho(medicalRecordData.DataDesfecho)
            var res1 = medicalRecordData.DataDesfecho.split("/")
            var newData1 = res1[2] + "-" + res1[1] + "-" + res1[0]
            setDataDesfecho(newData1)
        }

        setDisplayDialog(true);
    };

    function onClickDelete(){
        medicalRecordsService.Delete(getNroProntuario)
        .then((response) => {
            if(response.deletedMedicalRecord){
                showToast('success', 'Sucesso!', `Prontuário deletado com sucesso!`);
                getMedicalRecordsFunction()
                setTimeout(() => {
                    setDisplayDialog2(false)
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

    function handleSubmit1(event: FormEvent){
        event.preventDefault();

        medicalRecordsService.Desfecho(getNroProntuario, getDesfecho, getDataDesfecho)
        .then((response) => {
            console.log(response)
            if(response.updatedMedicalRecord){
                showToast('success', 'Sucesso!', `Desfecho atualizado com sucesso!`);
                getMedicalRecordsFunction()
                setDisplayDialog3(false)
            }else{
                if(response.error.sqlMessage){
                    showToast('error', 'Erro!', String(response.error.sqlMessage));
                }else{
                    showToast('error', 'Erro!', String(response.error));
                }
            }
        })
    }

    return (
        <>
            <div className="row m-5 px-5">
                <Link to={location => ({...location, pathname: '/medicalRecords/create'})}><Button variant="outline-dark" className="mb-2" style={{borderRadius: '0', height:'41.5px'}}>Cadastrar Prontuário</Button></Link>
                <Button variant="outline-secondary" className="mb-2 ml-2" onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open} style={{borderRadius: '0'}}>Buscar prontuário específico</Button>
                <Collapse in={open} timeout={200}>
                    <div className="ml-2">
                        <div className="p-inputgroup">
                            <span className="p-float-label">
                                <InputText id="float-input" type="search" value={searchInput} onChange={(e) => {setSearchInput((e.target as HTMLInputElement).value)}} onKeyPress={(ev) => {if (ev.key === 'Enter') {handleSearch(); ev.preventDefault();}}}  style={{minWidth:'4em', borderRadius: '0'}} size={30} />
                                {getOptionState === null
                                    ? <label htmlFor="float-input">Buscar</label>
                                    : <label htmlFor="float-input">Buscar por {getOptionState.name}</label>
                                }
                            </span>
                            {searchInput === ''
                                ? <></>
                                :
                                    <>
                                        <Dropdown className="mx-1" value={getOptionState} options={options2} onChange={onOptionChange} placeholder="Selecione um filtro" optionLabel="name" style={{width: '12em'}}/>
                                        <Button tabIndex={2} variant="outline-danger" className="p-0 mr-1" style={{width: '17px', borderRadius: '0'}} onClick={() => {setSearchInput(''); getMedicalRecordsFunction(); setMode('N'); setOptionState(null)}}><AiOutlineClose size={15}/></Button>
                                        <Button onClick={handleSearch} style={{borderRadius: '0'}}><FiSearch size={15}/></Button>
                                    </>
                            }
                        </div>
                    </div>
                </Collapse>
                <div className="ml-auto"></div>

                <DataTable value={MedicalRecords} paginator={true} rows={rows} header={header} totalRecords={totalRecords}
                    emptyMessage="Nenhum resultado encontrado" className="p-datatable-responsive-demo" resizableColumns={true} loading={loading} first={getFirst}
                    onPage={onPage} lazy={true} selectionMode="single" selection={selectedMedicalRecord} onSelectionChange={e => setSelectedMedicalRecord(e.value)}
                    onRowSelect={(e) => {onMedicalRecordSelect(e);}}>
                    <Column field="NroProntuario" header="Nro Prontuário" style={{width:'9.5%', textAlign:'center'}}/>
                    <Column field="NroPaciente" header="Nro Paciente" style={{width:'9.5%', textAlign:'center'}}/>
                    <Column field="DataNascimento" header="Nascimento" style={{width:'11%', textAlign:'center'}}/>
                    <Column field="NomePaciente" header="Nome" style={{width:'12.5%', textAlign:'center'}}/>
                    <Column field="Genero" header="Gênero" style={{width:'8%', textAlign:'center'}}/>
                    <Column field="DataInternacao" header="Data Internação" style={{width:'11.5%', textAlign:'center'}}/>
                    <Column field="DiagnosticoPrincipal" header="Diagnostico" style={{width:'13%', textAlign:'center'}}/>
                    <Column field="Alocacao" header="Alocação" style={{width:'15%', textAlign:'center'}}/>
                    <Column field="Desfecho" header="Desfecho" style={{width:'10%', textAlign:'center'}}/>
                </DataTable>

                <Dialog visible={displayDialog} style={{width: '50%'}} header="Ações" modal={true} onHide={() => setDisplayDialog(false)}>
                    <div className="form-row">
                    <div className="col mr-4 ml-1">
                            <Button className="mx-2 mt-2 mb-2 p-3" onClick={() => {setDisplayDialog4(true); setDisplayDialog(false)}}>Visualizar <br></br> prontuário</Button>
                        </div>
                        <div className="col mr-4">
                            <Button className="mx-2 mt-2 mb-2 p-3" onClick={() => {setDisplayDialog1(true); setDisplayDialog(false)}}>Atualizar <br></br> prontuário</Button>
                        </div>

                        <div className="col mr-4">
                            <Button className="mx-2 mt-2 mb-2 p-3" onClick={() => {setDisplayDialog3(true); setDisplayDialog(false)}}>Atualizar <br></br> desfecho</Button>
                        </div>

                        <div className="col">
                            <Button className="mx-2 mt-2 mb-2 mr-2 p-3" onClick={() => {setDisplayDialog2(true); setDisplayDialog(false)}}>Excluir <br></br> prontuário</Button>
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={displayDialog2} style={{width: '50%'}} modal={true} onHide={() => {setDisplayDialog2(false); showToast('warn', 'Aviso!', 'Operação cancelada pelo usuário.');}}>
                    <p className="h5 mx-2">Deseja realmente excluir o prontuário {getNroProntuario} do paciente {getNomePaciente} do sistema?</p>
                    <Button className="mx-2 mt-2 mb-2 mr-3 pr-3 pl-3" variant="outline-danger" onClick={() => {onClickDelete(); setDisplayDialog2(false)}}>Sim</Button>
                    <Button className="mx-2 mt-2 mb-2 pr-3 pl-3" variant="outline-success"onClick={() => {setDisplayDialog2(false); showToast('warn', 'Aviso!', 'Operação cancelada pelo usuário.');}}>Não</Button>
                </Dialog>

                <Dialog visible={displayDialog3} style={{width: '50%'}} modal={true} onHide={() => {setDisplayDialog3(false); showToast('warn', 'Aviso!', 'Operação cancelada pelo usuário.')}}>
                    <div className="">
                        <p className="text-dark h3 text-center">Atualização de Desfecho</p>
                        <form className="was-validated" onSubmit={handleSubmit1}>
                            <DropdownReact/>
                                <label htmlFor="Desfecho" className="mt-4">Desfecho</label>
                                <br></br>
                                <Dropdown className="" value={getDesfecho} options={options3} onChange={onDesfechoChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>
                            <DropdownReact/>
                            
                            <label htmlFor="DataDesfecho" className="mt-4">Data do Desfecho</label>
                            <input type="date" className="form-control" id="DataDesfecho" name="DataDesfecho"
                                defaultValue={getDataDesfecho} onChange={(e) => setDataDesfecho((e.target as HTMLInputElement).value)}
                                required/>

                            <button type="submit" className="btn btn-info btn-primary mt-4 mb-4">Atualizar</button>
                        </form>
                    </div>
                </Dialog>

                <Dialog visible={displayDialog4} style={{width: '50%'}} modal={true} onHide={() => setDisplayDialog4(false)} maximizable>
                    <p className="text-dark h3 text-center mr-5 mb-2">Prontuário {getNroProntuario} do paciente {getNomePaciente}</p>
                    <p className="text-dark h5 mt-5">Origem: {getOrigem}</p>
                    <p className="text-dark h5 mt-3">Alocação: {getAlocacao}</p>
                    <p className="text-dark h5 mt-3">Data da Internação: {getDataTratadaInternacao}</p>
                    <p className="text-dark h5 mt-3">Código de Doença Primário: {getCodDoencaPrincipal}</p>
                    {getCodDoencaSecundario  &&
                        <p className="text-dark h5 text-left mt-3">Código de Doença Secundário: {getCodDoencaSecundario}</p>
                    }
                    <p className="text-dark h5 text-left mt-3">Sistema Acometido: {getSistemaAcometido}</p>
                    {getCodComorbidade &&
                        <p className="text-dark h5 text-left mt-3">Código de Comorbidade: {getCodComorbidade}</p>
                    }
                    <p className="text-dark h5 text-left mt-3">Código de Medicamento Primário: {getCodAtbPrimario}</p>
                    {getCodAtbSecundario &&
                        <p className="text-dark h5 text-left mt-3">Código de Medicamento Secundário: {getCodAtbSecundario}</p>
                    }
                    {getSitioInfeccaoPrimario &&
                        <p className="text-dark h5 text-left mt-3">Sítio de Infecção Primário: {getSitioInfeccaoPrimario}</p>
                    }
                    <p className="text-dark h5 text-left mt-3">Origem da Infecção: {getOrigemInfeccao}</p>
                    {getResultadoColeta &&
                        <p className="text-dark h5 text-left mt-3">Resultado Coleta: {getResultadoColetaString}</p>
                    }
                    <p className="text-dark h5 text-left mt-3">Tratamento CCIH: {getTratamentoString}</p>
                    <p className="text-dark h5 text-left mt-3">Indicação Sepse: {getIndicacaoString}</p>
                    <p className="text-dark h5 text-left mt-3">Disfunção Renal: {getDisfuncaoString}</p>
                    {getDose &&
                        <p className="text-dark h5 text-left mt-3">Dose Correta: {getDoseString}</p>
                    }
                    {getPosologia &&
                        <p className="text-dark h5 text-left mt-3">Posologia Correta: {getPosologiaString}</p>
                    }
                    {getDataDesfecho &&
                        <p className="text-dark h5 text-left mt-3">Data do Desfecho: {getDataTratadaDesfecho}</p>
                    }
                    {getDesfecho != "Sem desfecho" &&
                        <p className="text-dark h5 text-left mt-3">Desfecho: {getDesfecho}</p>
                    }
                </Dialog>

                <Dialog visible={displayDialog1} style={{width: '50%'}} modal={true} onHide={() => {setDisplayDialog1(false); showToast('warn', 'Aviso!', 'Operação cancelada pelo usuário.');}} maximizable>
                    <div className="">
                        <p className="text-dark h3 text-center">Atualização de Prontuário</p>
                        <form className="was-validated" onSubmit={handleSubmit}>
                            <div className="form-group">
                                
                                <div className="form-row mt-4">
                                    <div className="col mr-4">
                                        <label htmlFor="NroProntuario">Número do Prontuário</label>
                                        <input type="text" className="form-control" id="NroProntuario" name="NroProntuario"
                                            defaultValue={getNroProntuario} readOnly/>
                                    </div>

                                    <div className="col">
                                        <label htmlFor="NroPaciente">Número do Paciente</label>
                                        <input type="number" className="form-control" id="NroPaciente" name="NroPaciente"
                                        defaultValue={getNroPaciente} onChange={(e) => setNroPaciente(Number((e.target as HTMLInputElement).value))}
                                        placeholder="Digite o número do paciente" required autoFocus/>
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
                                    placeholder="Digite a data de internação" required/>
                                
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
                            
                            <button type="submit" className="btn btn-info btn-primary mt-3 mb-3">Atualizar</button>
                        </form>
                    </div>
                </Dialog>
            </div>

            {getToast &&
                <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
            }
            {loading1 &&
                <Loading/>
            }
        </>
    )
}

export default MedicalRecords;