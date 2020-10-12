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

import {AssessmentService} from './AssessmentService';
import Loading from '../../components/Loading';

const Assessment = () => {
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
    const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
    const [getOptionState, setOptionState] = useState<any>(null)
    const [getAssessmentChange, setAssessmentChange] = useState();
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    const assessmentService = new AssessmentService()
    var assessmentData:any = {};
    
    const rows = 10;

    let options2 = [
        {name: 'Nro Prontuário', cod: 'Pro'},
        {name: 'Nro Paciente', cod: 'Pac'},
        {name: 'Data Internação', cod: 'Int'}
    ];

    const onOptionChange = (e: { value: any }) => {
        setOptionState(e.value);
    };
    
    useEffect(() => {
        setLoading1(true);
        setTimeout(() => {
            assessmentService.getAssessmentPaginate(10).then(data => {
                getMedicalRecordsFunction(data)
            });
        }, 1000)

    }, []);

    function getMedicalRecordsFunction(data?: any){
        setLoading(true);
        if(!data){
            assessmentService.getAssessmentPaginate(10).then(data => {
                setDatasource(data.assessments);
                setTotalRecords(data.length);
                data = data.assessments;
                
                setMedicalRecords(data.slice(0, rows));
                setLoading(false);
                setLoading1(false);
                return
            })
        }else{
            setDatasource(data.assessments);
            setTotalRecords(data.length);
            data = data.assessments;
            
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
        assessmentService.getAssessmentPaginate(endIndex).then(data => {
            getMedicalRecordsFunction(data);
        });
        setFirst(startIndex);
        setMedicalRecords(datasource.slice(startIndex, endIndex));
        setLoading(false);
    }

    const header = 
        <>
            <p style={{textAlign:'left'}} className="p-clearfix d-inline">Avaliações</p>
        </>;

    // function handleSearch(){
    //     if(!getOptionState){
    //         showToast('error', 'Erro!', 'Selecione um filtro para buscar.');
    //         return
    //     }
    //     setLoading(true);
    //     if(!searchInput){
    //         assessmentService.getAssessmentPaginate(10).then(data => {
    //             getMedicalRecordsFunction(data);
    //             setLoading(false);
    //             showToast('error', 'Erro!', 'Digite algum valor para pesquisar.');
    //         })
    //         return
    //     }
    //     setMode('S');
    //     assessmentService.searchMedicalRecordsGlobal(searchInput, getOptionState.cod, getFirst+rows).then(data => {
    //         if(!data.showMedicalRecords){
    //             setLoading(false);
    //             setMedicalRecords([]);
    //             showToast('warn', 'Resultados não encontrados!', 'Não foram encontrados resultados para a busca desejada')
    //             return
    //         }
    //         getMedicalRecordsFunction(data)
    //         let searchType;
    //         if(getOptionState.name === 'Nro Prontuário'){
    //             searchType = 'NroProntuario';
    //         }else if(getOptionState.name === 'Nro Paciente'){
    //             searchType = 'NroPaciente';
    //         }else if(getOptionState.name === 'Data Internação'){
    //             searchType = 'DataInternacao'
    //         }else{
    //             searchType = getOptionState.name
    //         }
    //         console.log(data)
    //         let dataSize = data.length[0]['count(`' + searchType + '`)']
    //         if(dataSize == 1){
    //             showToast('info', 'Resultado Encontrado!', `Foi encontrado ${dataSize} resultado.`)
    //         }else{
    //             showToast('info', 'Resultados Encontrados!', `Foram encontrados ${dataSize} resultados.`)
    //         }
    //     })
    // }

    let newAssessment = true
    function onAssessmentSelect (e: any) {
        newAssessment = false;
        setAssessmentChange(e.value)
        assessmentData = e.data;
    };
    
    return (
        <div className="row m-5 px-5">
            <Link to={location => ({...location, pathname: '/assessment/create'})}><Button variant="outline-dark" className="mb-2" style={{borderRadius: '0', height:'41.5px'}}>Cadastrar Prontuário</Button></Link>
            <Button variant="outline-secondary" className="mb-2 ml-2" onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open} style={{borderRadius: '0'}}>Buscar prontuário específico</Button>
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
                                    <Dropdown className="mx-1" value={getOptionState} options={options2} onChange={onOptionChange} placeholder="Selecione um filtro" optionLabel="name" style={{width: '12em'}}/>
                                    <Button tabIndex={2} variant="outline-danger" className="p-0 mr-1" style={{width: '17px', borderRadius: '0'}} onClick={() => {setSearchInput(''); getMedicalRecordsFunction(); setMode('N'); setOptionState(null)}}><AiOutlineClose size={15}/></Button>
                                    {/* <Button onClick={handleSearch} style={{borderRadius: '0'}}><FiSearch size={15}/></Button> */}
                                </>
                        }
                    </div>
                </div>
            </Collapse>
            <div className="ml-auto"></div>

            <DataTable value={MedicalRecords} paginator={true} rows={rows} header={header} totalRecords={totalRecords}
                emptyMessage="Nenhum resultado encontrado" className="p-datatable-responsive-demo" resizableColumns={true} loading={loading} first={getFirst}
                onPage={onPage} lazy={true} selectionMode="single" selection={selectedAssessment} onSelectionChange={e => setSelectedAssessment(e.value)}
                onRowSelect={(e) => {onAssessmentSelect(e);}}>
                <Column field="NroAvaliacao" header="Nro Avaliação" style={{width:'9.5%', textAlign:'center'}}/>
            </DataTable>

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