import React, { useState, useEffect, useRef } from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import Button from 'react-bootstrap/Button';

import {FiTrash2} from 'react-icons/fi';
import {AiOutlineDownload} from 'react-icons/ai';

import {UsersService} from './UsersService';
import { useCookies } from 'react-cookie';

const MedicalRecords = () => {
    const [cookie] = useCookies();
    const [prontuario, setProntuario] = useState([]);
    const [datasource, setDatasource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [first, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    const [formData, setFormData] = useState({
        email: "null",
        senha: "null"
    });
    
    const usersService = new UsersService();
    const rows = 10;
    
    let dt = useRef<any>(null);
    const onExport = () => {
        dt.current.exportCSV();
    };

    //DataTable
    useEffect(() => {
        setTimeout(() => {
            usersService.getUsers().then(data => {
                setDatasource(data);
                setTotalRecords(2);
                for(let i = 0; i < data.length; i++){
                    if(data[i]['TipoUsuario'] === 'A'){
                        data[i]['TipoUsuario'] = 'Administrador';
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
        }, 300);
    }, []);
    
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

    // function deleteUser(rowData: any){
    //     const codUsuarioDelete = rowData['CodUsuario'];
    //     const Email = rowData['Email'];
    //     if(codUsuarioDelete !== cookie.userData.CodUsuario){
    //         console.log(usersService.deleteUser(codUsuarioDelete, Email))
    //         usersService.getUsers().then(data => {
    //             setDatasource(data);
    //             setTotalRecords(2);
    //             for(let i = 0; i < data.length; i++){
    //                 if(data[i]['TipoUsuario'] === 'A'){
    //                     data[i]['TipoUsuario'] = 'Administrador';
    //                 }else if(data[i]['TipoUsuario'] === 'M'){
    //                     data[i]['TipoUsuario'] = 'Médico';
    //                 }else{
    //                     data[i]['TipoUsuario'] = 'Farmacêutico';
    //                 }
    //                 if(data[i]['isVerified'] === 1){
    //                     data[i]['isVerified'] = 'Sim';
    //                 }else{
    //                     data[i]['isVerified'] = 'Não';
    //                 }
    //             }
    //             setProntuario(data.slice(0, rows));
    //             setLoading(false);
    //         });
    //     }
    // }

    // const actionsTemplate = (rowData: any, column: any) => {
    //     return (
    //         <>
    //             {/* <Button type="button" variant="outline-info" className="m-1"><FiEdit size={17}/></Button> */}
    //             <Button type="button" onClick={() => {deleteUser(rowData)}} variant="outline-danger"><FiTrash2 size={17}/></Button>
    //         </>
    //     )
    // }
    const onHide = (stateMethod: any) => {
        stateMethod(false);
    }
    
    const header = 
        <>
            <p style={{textAlign:'left'}} className="p-clearfix d-inline">Dados dos usuários</p>
            <div style={{textAlign:'right'}} className="m-0"><Button type="button" variant="outline-success" onClick={onExport}><AiOutlineDownload size={20}/>  Exportar dados</Button></div>
        </>;

    return (
        <>
            <div className="row m-5 px-5">
                <DataTable value={prontuario} paginator={true} rows={rows} totalRecords={totalRecords} header={header}
                    lazy={true} first={first} onPage={onPage} loading={loading} resizableColumns={true} responsive={true} ref={dt}>
                    <Column field="CodUsuario" header="Código" style={{width:'8%', textAlign:'center'}} />
                    <Column field="Nome" header="Nome" style={{width:'20%', textAlign:'center'}}/>
                    <Column field="Email" header="Email" style={{width:'20%', textAlign:'center'}}/>
                    <Column field="Matricula" header="Matrícula" style={{width:'10%', textAlign:'center'}}/>
                    <Column field="TipoUsuario" header="Tipo usuário" style={{width:'20%', textAlign:'center'}}/>
                    <Column field="isVerified" header="Verificado" style={{width:'10%', textAlign:'center'}} body={VerifiedTemplate}/>
                    {/* <Column header="Ações" body={actionsTemplate} style={{textAlign:'center', width: '10%'}}/> */}
                </DataTable>
            </div>
            
        </>
    )
}

export default MedicalRecords;