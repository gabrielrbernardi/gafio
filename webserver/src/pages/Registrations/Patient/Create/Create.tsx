import React, { FormEvent, useState } from 'react';
import {Dropdown} from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import {Dropdown as DropdownReact} from 'react-bootstrap';
import { CreatePatientService } from './CreatePatientService';
import { Button } from 'primereact/button';
import ToastComponent from '../../../../components/Toast';
import { useHistory } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';

import * as Yup from "yup";


const PatientCreate = () => {
    const history = useHistory();

    const [getNroPaciente, setNroPaciente] = useState<any>();
    const [getSeqPaciente, setSeqPaciente] = useState<any>();
    const [getNomePaciente, setNomePaciente] = useState<any>();
    const [getDataNascimentoPaciente, setDataNascimentoPaciente] = useState<any>();
    const [getGeneroPaciente, setGeneroPaciente] = useState<any>();
    
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let nextMonth = (month === 11) ? 0 : month + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;

    const [date, setDate] = useState<Date | Date[] | undefined>(undefined);

    const pt_br = {
        firstDayOfWeek: 1,
        dayNames: ["domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
        dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        dayNamesMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        // dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
        monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        today: "Hoje",
        clear: "Limpar",
    };

    const createPatientService = new CreatePatientService();
    
    let optionsDropdown = [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' }
    ];

    const onGeneroChange = (e: { value: string }) => {
        setGeneroPaciente(e.value);
    };

    async function handleSubmit(event: FormEvent) {
        try {
            event.preventDefault();
            const data = {
                getNroPaciente,
                getNomePaciente,
                getDataNascimentoPaciente,
                getGeneroPaciente
            };
            //Validação de dados
            const schema = Yup.object().shape({
                getNroPaciente: Yup.number().required(),
                getNomePaciente: Yup.string().required(),
                getDataNascimentoPaciente: Yup.date().required(),
                getGeneroPaciente: Yup.string().nullable().oneOf([null, "M", "F"]).required(),
            })

            await schema.validate(data, { abortEarly: false });

            createPatientService.create(getNroPaciente, getNomePaciente, getDataNascimentoPaciente, getGeneroPaciente).then((response) => {
                if (response.createdPatient) {
                    history.push('/registrations/patient');
                } else {
                    if (response.err) {
                        showToast('error', 'Erro!', response.error + ' ' + String(response.err.code));
                    } else {
                        showToast('error', 'Erro!', response.error);
                    }
                }
            })
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                showToast("error", "Erro!", "Verifique se todos os campos foram preenchidos corretamente!");
            }
            else return;
        }
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
    
    return (
        <>
            <div className="row m-5">
                <div className="card shadow-lg p-3 col-sm-8 offset-md-2 border">
                    <p className="text-dark h3 text-center">Cadastro de Paciente</p>
                    <form className="was-validated" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="form-row mt-4">
                                <div className="col mr-4">
                                    <label htmlFor="NroProntuario">Número do Paciente</label>
                                    <br></br>
                                    <InputText keyfilter="pint" style={{width: '100%'}} id="NroProntuario" name="NroProntuario" defaultValue={getNroPaciente} 
                                        onChange={(e) => setNroPaciente(Number((e.target as HTMLInputElement).value))} placeholder="Digite o número do paciente"
                                        required autoFocus/>
                                </div>

                                <div className="col">
                                    <label htmlFor="DataInternacao">Data de Nascimento</label>
                                    <br></br>
                                    <Calendar id="DataInternacao" style={{width: '100%'}} value={getDataNascimentoPaciente} onChange={(e) => setDataNascimentoPaciente(e.value)} locale={pt_br} dateFormat="dd/mm/yy" placeholder="Selecione a data de nascimento do paciente" showButtonBar monthNavigator showIcon showOnFocus={false} required/>
                                </div>
                            </div>

                            <label htmlFor="Nome" className="mt-4">Nome</label>
                            <br></br>
                            <InputText keyfilter="alpha" style={{width: '100%'}} id="Nome" name="Nome" defaultValue={getNomePaciente} onChange={(e) => setNomePaciente((e.target as HTMLInputElement).value)}
                                placeholder="Digite o nome do paciente" required/>
                            
                            <label htmlFor="Genero" className="mt-4">Gênero</label>
                            <br></br>
                            <Dropdown className="" value={getGeneroPaciente} options={optionsDropdown} onChange={onGeneroChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>
                        </div>
                        <button type="submit" className="btn btn-info btn-primary mt-3">Cadastrar</button>
                    </form>
                    {getToast &&
                        <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
                    }
                </div>
            </div>
        </>
    )
}

export default PatientCreate;