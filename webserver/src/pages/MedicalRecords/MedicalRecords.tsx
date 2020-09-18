import React, { useState, useEffect, useRef } from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {FiSearch} from 'react-icons/fi';
import {AiOutlineClose} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import ToastComponent from '../../components/Toast';

import {MedicalRecordsService} from './MedicalRecordsService';
import { Dropdown } from 'primereact/dropdown';
const medicalRecordsService = new MedicalRecordsService()

const MedicalRecords = () => {
    const [MedicalRecords, setMedicalRecords] = useState([]);
    const [datasource, setDatasource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [getFirst, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [open, setOpen] = useState(false);

    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<any>(null);
    const [getMedicalRecord, setMedicalRecord] = useState<any>(null);

    const [getOptionState, setOptionState] = useState<any>(null)
    
    const rows = 10;

    let options = [
        {name: 'CódUsuário', cod: 'C'},
        {name: 'Nome', cod: 'N'},
        {name: 'Email', cod: 'E'},
        {name: 'Matrícula', cod: 'M'},
        {name: 'TipoUsuário', cod: 'TU'}
    ];

    const onOptionChange = (e: { value: any }) => {
        setOptionState(e.value);
    };
    
    useEffect(() => {
        medicalRecordsService.getMedicalRecordsPaginate(10).then(data => {
            getMedicalRecordsFunction(data)
        });
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
                return
            })
        }else{
            setDatasource(data.medicalRecords);
            setTotalRecords(data.length);
            console.log(data)
            data = data.medicalRecords;
            
            setMedicalRecords(data.slice(0, rows));
            setLoading(false);
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
        alert(searchInput)
    }

    let newMedicalRecord = false;
    const onMedicalRecordSelect = (e: any) => {
        newMedicalRecord = false;
        setMedicalRecord(Object.assign({}, e.data));
    };

    return (
        <>
            <div className="row m-5 px-5">
                <Link to={location => ({...location, pathname: '/medicalRecords/create'})}><Button variant="outline-dark" className="mb-2" style={{borderRadius: '0'}}>Cadastrar Prontuário</Button></Link>
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
                                        <Dropdown className="mx-1" value={getOptionState} options={options} onChange={onOptionChange} placeholder="Selecione um filtro" optionLabel="name" style={{width: '12em'}}/>
                                        <Button tabIndex={2} variant="outline-danger" className="p-0 mr-1" style={{width: '17px', borderRadius: '0'}} onClick={() => {setSearchInput(''); setOptionState(null)}}><AiOutlineClose size={15}/></Button>
                                        <Button onClick={handleSearch} style={{borderRadius: '0'}}><FiSearch size={15}/></Button>
                                    </>
                            }
                        </div>
                    </div>
                </Collapse>
                <div className="ml-auto"></div>

                <DataTable value={MedicalRecords} paginator={true} rows={rows} header={header} totalRecords={totalRecords}
                    emptyMessage="Nenhum resultado encontrado" className=" p-datatable-responsive-demo" resizableColumns={true} loading={loading} first={getFirst}
                    onPage={onPage} lazy={true} selectionMode="single" selection={selectedMedicalRecord} onSelectionChange={e => setSelectedMedicalRecord(e.value)}
                    onRowSelect={onMedicalRecordSelect}>
                    <Column field="NroProntuario" header="NroProntuário" style={{width:'9.5%', textAlign:'center'}}/>
                    <Column field="NroPaciente" header="NroPaciente" style={{width:'9.5%', textAlign:'center'}}/>
                    <Column field="DataNascimento" header="Nascimento" style={{width:'11%', textAlign:'center'}}/>
                    <Column field="NomePaciente" header="Nome" style={{width:'12.5%', textAlign:'center'}}/>
                    <Column field="Genero" header="Gênero" style={{width:'8%', textAlign:'center'}}/>
                    <Column field="DataInternacao" header="Internação" style={{width:'11.5%', textAlign:'center'}}/>
                    <Column field="DiagnosticoPrincipal" header="Diagnostico" style={{width:'13%', textAlign:'center'}}/>
                    <Column field="Alocacao" header="Alocação" style={{width:'15%', textAlign:'center'}}/>
                    <Column field="Desfecho" header="Desfecho" style={{width:'10%', textAlign:'center'}}/>
                </DataTable>
            </div>
        </>
    )
}

export default MedicalRecords;