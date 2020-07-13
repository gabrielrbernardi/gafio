import React, { useState, useEffect, useRef } from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';

import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {FiSearch} from 'react-icons/fi';

import {FiTrash2} from 'react-icons/fi';
import {TiExport} from 'react-icons/ti';
import {AiOutlineClose} from 'react-icons/ai';

import {MedicalRecordsService} from './MedicalRecordsService';
import { Link } from 'react-router-dom';

const MedicalRecords = () => {
    const [prontuario, setProntuario] = useState([]);
    const [datasource, setDatasource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [first, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [open, setOpen] = useState(false);

    const medicalRecordsService = new MedicalRecordsService();
    const rows = 10;
    
    useEffect(() => { 
        setTimeout(() => {
            medicalRecordsService.getUsers().then(data => {
                setDatasource(data);
                setTotalRecords(2);
                for(let i = 0; i < data.length; i++){
                    if(data[i]['TipoUsuario'] === 'A'){
                        data[i]['TipoUsuario'] = 'Administradores';
                    }else if(data[i]['TipoUsuario'] === 'M'){
                        data[i]['TipoUsuario'] = 'Médico';
                    }else{
                        data[i]['TipoUsuario'] = 'Farmacêutico';
                    }
                    if(data[i]['isVerified'] === 1){
                        data[i]['isVerified'] = 'Sim';
                    }else{
                        data[i]['isVerified'] = 'Não';
                    }
                }
                setProntuario(data.slice(0, rows));
                setLoading(false);
            });
        }, 500);
    }, [medicalRecordsService]);
    
    const onPage = (event: any) => {
        setLoading(true);
        
        const startIndex = event.first;
        const endIndex = event.first + rows;
        
        setFirst(startIndex);
        setProntuario(datasource.slice(startIndex, endIndex));
        setLoading(false);
    }
    
    const VerifiedTemplate = (rowData: any) => {
        let verifyStatus = rowData.isVerified;
        let fontColor: any = verifyStatus === 'Não' ? "#a80000" : "#106b00";

        return <span style={{color: fontColor}}>{rowData.isVerified}</span>;
    }

    const actionsTemplate = (rowData: any, column: any) => {
        return (
            <>
                {/* <Button type="button" variant="outline-info" className="m-1"><FiEdit size={17}/></Button> */}
                <Button type="button" onClick={() => {alert(rowData['CodUsuario'])}} variant="outline-danger"><FiTrash2 size={17}/></Button>
            </>
        )
    }
    let dt = useRef<any>(null);
    const onExport = () => {
        dt.current.exportCSV();
    };
    const header = 
        <>
            <p style={{textAlign:'left'}} className="p-clearfix d-inline">Prontuários</p>
            <div style={{textAlign:'right'}} className="m-0"><Button type="button" variant="outline-success" onClick={onExport}><TiExport size={20}/>  Exportar dados</Button></div>
        </>;

    function handleSearch(){
        alert(searchInput)
    }

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
                <DataTable value={prontuario} paginator={true} rows={rows} totalRecords={totalRecords} header={header}
                    lazy={true} first={first} onPage={onPage} loading={loading} resizableColumns={true} responsive={true} ref={dt}>
                    <Column field="CodUsuario" header="Código" style={{width:'8%', textAlign:'center'}} />
                    <Column field="Nome" header="Nome" style={{width:'20%', textAlign:'center'}}/>
                    <Column field="Email" header="Email" style={{width:'20%', textAlign:'center'}}/>
                    <Column field="Matricula" header="Matrícula" style={{width:'10%', textAlign:'center'}}/>
                    <Column field="TipoUsuario" header="Tipo usuário" style={{width:'20%', textAlign:'center'}}/>
                    <Column field="isVerified" header="Verificado" style={{width:'10%', textAlign:'center'}} body={VerifiedTemplate}/>
                    <Column header="Ações" body={actionsTemplate} style={{textAlign:'center', width: '10%'}}/>
                </DataTable>
            </div>
        </>
    )
}

export default MedicalRecords;