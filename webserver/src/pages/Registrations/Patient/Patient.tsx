import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../../../components/Loading';
import {PatientService} from './PatientService';

const Patient = () => {
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [loading1, setLoading1] = useState<boolean>(false);
    const [getFirst, setFirst] = useState(0);
    
    const rows = 10;
    let newUser = false;

    const [datasource, setDatasource] = useState([]);
    const [paciente, setPaciente] = useState([]);
    const [getPacienteSelect, setPacienteSelect] = useState<any>(null);

    const [getPacienteSeq, setPacienteSeq] = useState<any>('');
    const [getPacienteNro, setPacienteNro] = useState<any>('');
    const [getPacienteGenero, setPacienteGenero] = useState<any>('');
    const [getPacienteNome, setPacienteNome] = useState<any>('');
    const [getPacienteDataNascimento, setPacienteDataNascimento] = useState<any>('');

    const [selectedUser, setSelectedUser] = useState<any>(null);

    const patientService = new PatientService();
    
    const [displayDialog, setDisplayDialog] = useState(false);
    const [displayDialog1, setDisplayDialog1] = useState(false);

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
        setLoading1(false);
        return
    }
    async function getPatientFunction(data?: any){
        setLoading(true);
        setLoading1(true);
        if(!data){
            await patientService.getPatientPaginate(10).then(data => {
                getPatientFunction1(data);
            })
        }else{
            getPatientFunction1(data);
        }
    }

    const onUserSelect = (e: any) => {
        newUser = false;
        console.log(e)
        setPacienteSelect(Object.assign({}, e.data));
        var pacienteData = e.data;
        setPacienteDataNascimento(pacienteData.DataNascimento);
        setPacienteNome(pacienteData.NomePaciente);
        setPacienteGenero(pacienteData.Genero);
        setPacienteNro(pacienteData.NroPaciente);
        setPacienteSeq(pacienteData.SeqPaciente);
        setDisplayDialog(true);
    };

    return (
        <>
            <div className="row m-5 px-5">
                <Link to={location => ({...location, pathname: '/registrations/patient/create'})}><Button variant="outline-dark" className="mb-2" style={{borderRadius: '0', height:'41.5px'}}>Cadastrar Paciente</Button></Link>        
                <DataTable value={paciente} paginator={true} rows={rows} header="Pacientes" totalRecords={totalRecords}
                    emptyMessage="Nenhum resultado encontrado" className="p-datatable-responsive-demo" resizableColumns={true} loading={loading}
                    first={getFirst} onPage={onPage} lazy={true} selectionMode="single" selection={selectedUser} onSelectionChange={e => setSelectedUser(e.value)}
                    onRowSelect={onUserSelect}>
                    <Column field="SeqPaciente" header="SeqPaciente" style={{width: '10%', textAlign: 'center'}}/>
                    <Column field="NroPaciente" header="NroPaciente" style={{width: '10%', textAlign: 'center'}}/>
                    <Column field="Genero" header="Gênero" style={{width: '10%', textAlign: 'center'}}/>
                    <Column field="NomePaciente" header="NomePaciente" style={{width: '20%', textAlign: 'center'}}/>
                    <Column field="DataNascimento" header="DataNascimento" style={{width: '20%', textAlign: 'center'}}/>
                </DataTable>
            </div>
            <Dialog visible={displayDialog} style={{width: '50%'}} header="Ações" modal={true} onHide={() => setDisplayDialog(false)}>
                <div className="form-row">
                    <div className="col ">
                        <Button variant="info" className="mt-2 mb-2 p-3" onClick={() => {setDisplayDialog1(true); setDisplayDialog(false)}}>Visualizar Paciente</Button>
                    </div>
                    <div className="col ml-2">
                        <Button variant="info" className="mt-2 mb-2 p-3" onClick={() => {setDisplayDialog1(true); setDisplayDialog(false)}}>Visualizar Prontuários</Button>
                    </div>
                    <div className="col ml-2">
                        <Button variant="info" className="mt-2 mb-2 p-3" onClick={() => {setDisplayDialog1(true); setDisplayDialog(false)}}>Excluir Paciente</Button>
                    </div>
                    {/* <div className="col mr-4">
                        <Button className="mx-2 mt-2 mb-2 p-3" onClick={() => {setDisplayDialog1(true); setDisplayDialog(false)}}>Atualizar <br></br> prontuário</Button>
                    </div>

                    <div className="col mr-4">
                        <Button className="mx-2 mt-2 mb-2 p-3" onClick={() => {setDisplayDialog3(true); setDisplayDialog(false)}}>Atualizar <br></br> desfecho</Button>
                    </div>

                    <div className="col">
                        <Button className="mx-2 mt-2 mb-2 mr-2 p-3" onClick={() => {setDisplayDialog2(true); setDisplayDialog(false)}}>Excluir <br></br> prontuário</Button>
                    </div> */}
                </div>
            </Dialog>
            
            {/* Caixa de dialogo de listagem de paciente */}
            <Dialog visible={displayDialog1} style={{width: '50%'}} modal={true} onHide={() => setDisplayDialog1(false)} maximizable>
                <p className="text-dark h5 mt-2">Número: {getPacienteNro}</p>
                <p className="text-dark h5 mt-2">Sequência: {getPacienteSeq}</p>
                <p className="text-dark h5 mt-2">Nome: {getPacienteNome}</p>
                <p className="text-dark h5 mt-2">Data de nascimento: {getPacienteDataNascimento}</p>
                <p className="text-dark h5 mt-2">Gênero: {getPacienteGenero}</p>
            </Dialog>

            {loading1 &&
                <Loading/>
            }
        </>
    )
};

export default Patient;