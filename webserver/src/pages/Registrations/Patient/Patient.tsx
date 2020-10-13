import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {PatientService} from './PatientService';

const Patient = () => {
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [getFirst, setFirst] = useState(0);
    
    const rows = 10;
    let newUser = false;

    const [datasource, setDatasource] = useState([]);
    const [paciente, setPaciente] = useState([]);
    const [getUser, setUser] = useState<any>(null);

    const [selectedUser, setSelectedUser] = useState<any>(null);

    const patientService = new PatientService();
    
    const [displayDialog, setDisplayDialog] = useState(false);

    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    useEffect(() => {
        document.title = 'GAFio | Paciente';
        getPatientFunction();
    }, [])
    
    const onPage = (event: any) => {
        setLoading(true);
        setTimeout(() => {
            const startIndex = event.first;
            const endIndex = event.first + rows;
            patientService.getPatientPaginate(endIndex).then(response => getPatientFunction(response))
            setFirst(startIndex);      
            setLoading(false);
        });
    }
    function getPatientFunction1(data: any){
        setDatasource(data.patients);
        let dataSize = data.length[0]['count(`NroPaciente`)']
        setTotalRecords(dataSize);
        data = data.patients;
        for(let i = 0; i < data.length; i++){
            if(data[i]['Genero'] === 'M'){
                data[i]['Genero'] = 'Masculino';
            }else if(data[i]['Genero'] === 'F'){
                data[i]['Genero'] = 'Feminino';
            }
        }
        
        setPaciente(data.slice(0, rows));
        setLoading(false);
        // setLoading1(false);
        return
    }
    function getPatientFunction(data?: any){
        setLoading(true);
        if(!data){
            patientService.getPatientPaginate(10).then(data => {
                getPatientFunction1(data);
            })
        }else{
            getPatientFunction1(data);
        }
    }

    const onUserSelect = (e: any) => {
        newUser = false;
        console.log(e)
        setUser(Object.assign({}, e.data));
        setDisplayDialog(true);
    };

    return (
        <>
            <div className="row m-5 px-5">
                <Link to={location => ({...location, pathname: '/medicalRecords/create'})}><Button variant="outline-dark" className="mb-2" style={{borderRadius: '0', height:'41.5px'}}>Cadastrar Prontuário</Button></Link>        
                <DataTable value={paciente} paginator={true} rows={rows} header="Dados dos Pacientes" totalRecords={totalRecords}
                    emptyMessage="Nenhum resultado encontrado" className="p-datatable-responsive-demo" resizableColumns={true} loading={loading}
                    first={getFirst} onPage={onPage} lazy={true} selectionMode="single" selection={selectedUser} onSelectionChange={e => setSelectedUser(e.value)}
                    onRowSelect={onUserSelect}>
                    <Column field="SeqPaciente" header="SeqPaciente" style={{width: '5%', textAlign: 'center'}}/>
                    <Column field="NroPaciente" header="NroPaciente" style={{width: '5%', textAlign: 'center'}}/>
                    <Column field="Genero" header="Gênero" style={{width: '5%', textAlign: 'center'}}/>
                    <Column field="NomePaciente" header="NomePaciente" style={{width: '20%', textAlign: 'center'}}/>
                    <Column field="DataNascimento" header="DataNascimento" style={{width: '20%', textAlign: 'center'}}/>
                </DataTable>
            </div>
        </>
    )
};

export default Patient;