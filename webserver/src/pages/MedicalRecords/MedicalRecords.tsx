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
    
    const rows = 10;
    
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
                <Link to={location => ({...location, pathname: '/medicalRecords/create'})}><Button variant="outline-dark" className="mb-2">Cadastrar Prontuário</Button></Link>
                <Button variant="outline-secondary" className="mb-2 ml-2" onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open}>Buscar prontuário específico</Button>
                <Collapse in={open} timeout={200}>
                    <div className="ml-2">
                        <span className="p-float-label p-inputgroup">
                            <InputText id="float-input" type="text" className="bg-light" size={30} value={searchInput} onChange={(e) => setSearchInput((e.target as HTMLInputElement).value)} />
                            {searchInput
                            ? <Button tabIndex={2} variant="outline-danger" className="p-0 mr-1" style={{width: '17px'}} onClick={() => setSearchInput('')}><AiOutlineClose size={15}/></Button>
                            : <></>
                            }
                            <label htmlFor="float-input">Buscar</label>
                            <Button onClick={handleSearch}><FiSearch size={20}/></Button>
                        </span>
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