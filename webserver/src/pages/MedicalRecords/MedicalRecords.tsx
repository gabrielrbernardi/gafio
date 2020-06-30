import React, { useState, useEffect } from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';

import {MedicalRecordsService} from './MedicalRecordsService';

const MedicalRecords = () => {
    const [prontuario, setProntuario] = useState([]);
    const [datasource, setDatasource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [first, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    const medicalRecordsService = new MedicalRecordsService();
    const rows = 10;
    
    useEffect(() => {
        setTimeout(() => {
            medicalRecordsService.getUsers().then(data => {
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
                }
                setProntuario(data.slice(0, rows));
                setLoading(false);
            });
        }, 1000);
    }, []);
    
    const onPage = (event: any) => {
        setLoading(true);
        
        const startIndex = event.first;
        const endIndex = event.first + rows;
        
        setFirst(startIndex);
        setProntuario(datasource.slice(startIndex, endIndex));
        setLoading(false);
    }
    
    return (
        <>
            <div className="row m-5">
                <DataTable value={prontuario} paginator={true} rows={rows} totalRecords={totalRecords}
                    lazy={true} first={first} onPage={onPage} loading={loading} resizableColumns={true}>
                    <Column field="CodUsuario" header="Código" style={{width:'10%'}} />
                    <Column field="Nome" header="Nome" style={{width:'20%'}}/>
                    <Column field="Email" header="Email" style={{width:'30%'}}/>
                    <Column field="Matricula" header="Matrícula" style={{width:'10%', heigth: '10px'}}/>
                    <Column field="TipoUsuario" header="Tipo usuário" style={{width:'20%'}}/>
                    <Column field="isVerified" header="Verificado" style={{width:'10%'}}/>
                </DataTable>
            </div>
        </>
    )
}

export default MedicalRecords;