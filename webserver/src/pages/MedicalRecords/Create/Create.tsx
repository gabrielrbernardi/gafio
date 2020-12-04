import React, { useState, FormEvent, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Dropdown as DropdownReact, ResponsiveEmbed } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import ToastComponent from '../../../components/Toast';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import Button from 'react-bootstrap/Button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Collapse from 'react-bootstrap/Collapse';
import {FiSearch} from 'react-icons/fi';
import {AiOutlineClose} from 'react-icons/ai';
import Loading from '../../../components/Loading';
import * as Yup from "yup";

import { CreateMedicalRecordsService } from './CreateMedicalRecordsService'
import { DiseasesService } from '../../Registrations/Diseases/DiseasesService';
import { MedicinesService } from '../../Registrations/Medicines/MedicinesService';

const MedicalRecordsForm = () => {

    const [getNroProntuario, setNroProntuario] = useState<any>(null)
    const [getSeqPaciente, setSeqPaciente] = useState<any>(null)
    const [getDataInternacao, setDataInternacao] = useState<any>(null)
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
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [getOptionState, setOptionState] = useState<any>(null)
    const [mode, setMode] = useState('N');
    const [datasource, setDatasource] = useState([]);
    const [open, setOpen] = useState(false);
    const [getDiseasesChange, setDiseasesChange] = useState();
    const [selectedDiseases, setSelectedDiseases] = useState<any>(null);
    const [getType, setType] = useState<number>(0);
    const diseasesService = new DiseasesService();
    const rows = 10;

    const [medicines, setMedicines] = useState([]);
    const [totalRecords2, setTotalRecords2] = useState(0);
    const [first2, setFirst2] = useState(0);
    const [searchInput2, setSearchInput2] = useState('');
    const [getOptionState2, setOptionState2] = useState<any>(null);
    const [mode2, setMode2] = useState('N');
    const [open2, setOpen2] = useState(false);
    const [getMedicinesChange, setMedicinesChange] = useState();
    const [selectedMedicines, setSelectedMedicines] = useState<any>(null);
    const medicinesService = new MedicinesService();

    const [displayDialog, setDisplayDialog] = useState(false);
    const [displayDialog2, setDisplayDialog2] = useState(false);

    const history = useHistory()

    const createMedicalRecordsService = new CreateMedicalRecordsService()
    var DiseasesData:any = {};
    var MedicinesData:any = {};

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

    function checkInput(type: number, e: any) {
        if (type == 1) {
            if (e === '') {
                setCodDoencaSecundario(null);
            } else {
                setCodDoencaSecundario(e)
            }
        }
        if (type == 2) {
            if (e === '') {
                setCodComorbidade(null);
            } else {
                setCodComorbidade(e)
            }
        }
        if (type == 3) {
            if (e === '') {
                setCodAtbSecundario(null);
            } else {
                setCodAtbSecundario(e)
            }
        }
        if (type == 4) {
            if (e === '') {
                setSitioInfeccaoPrimario(null);
            } else {
                setSitioInfeccaoPrimario(e)
            }
        }
    }

    const onOptionChange = (e: { value: any }) => {
        setOptionState(e.value);
    };

    const onOptionChange2 = (e: { value: any }) => {
        setOptionState2(e.value);
    };

    let options = [
        { label: 'Sim', value: 'S' },
        { label: 'Não', value: 'N' }
    ];

    let options2 = [
        { name: 'Código', cod: 'C' },
        { name: 'Nome', cod: 'N' }
    ];

    let options3 = [
        { name: 'Código', cod: 'E' },
        { name: 'Princípio', cod: 'P' },
    ];

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

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        
        const data = {
            getNroProntuario, getSeqPaciente,
            getDataInternacao, getCodDoencaPrincipal, getCodDoencaSecundario,
            getSistemaAcometido, getCodComorbidade, getOrigem, getAlocacao,
            getResultadoColeta, getCodAtbPrimario, getCodAtbSecundario,
            getSitioInfeccaoPrimario, getTratamento, getIndicacao,
            getDisfuncao, getOrigemInfeccao, getDose, getPosologia
        }

        try{
            const schema = Yup.object().shape({
                getNroProntuario: Yup.number().required(),
                getSeqPaciente: Yup.number().required(),
                getDataInternacao: Yup.date().required(),
                getCodDoencaPrincipal: Yup.string().required(),
                getCodDoencaSecundario: Yup.string().nullable(),
                getSistemaAcometido: Yup.string().required(),
                getCodComorbidade: Yup.string().nullable(),
                getOrigem: Yup.string().required(),
                getAlocacao: Yup.string().required(),
                getResultadoColeta: Yup.string().nullable().oneOf([null, "S", "N"]),
                getCodAtbPrimario: Yup.string().required(),
                getCodAtbSecundario: Yup.string().nullable(),
                getSitioInfeccaoPrimario: Yup.string().nullable(),
                getTratamento: Yup.string().oneOf(["S", "N"]).required(),
                getIndicacao: Yup.string().oneOf(["S", "N"]).required(),
                getDisfuncao: Yup.string().oneOf(["S", "N"]).required(),
                getOrigemInfeccao: Yup.string().required(),
                getDose: Yup.string().nullable().oneOf([null, "S", "N"]),
                getPosologia: Yup.string().nullable().oneOf([null, "S", "N"])
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            createMedicalRecordsService.Create(getNroProntuario, getSeqPaciente,
                getDataInternacao, getCodDoencaPrincipal, getCodDoencaSecundario,
                getSistemaAcometido, getCodComorbidade, getOrigem, getAlocacao,
                getResultadoColeta, getCodAtbPrimario, getCodAtbSecundario,
                getSitioInfeccaoPrimario, getTratamento, getIndicacao,
                getDisfuncao, getOrigemInfeccao, getDose, getPosologia
            ).then((response) => {
                if (response.CreatedMedicalRecord) {
                    showToast('success', 'Sucesso!', `Prontuário criado com sucesso!`);
                    setTimeout(() => {
                        history.push('/medicalRecords')
                    }, 3500)
                } else {
                    if (response.error.sqlMessage) {
                        if (response.error.sqlState == 23000) {
                            if (String(response.error.sqlMessage).includes("(`CodDoencaPrincipal`)") || String(response.error.sqlMessage).includes("(`CodDoencaSecundario`)")) {
                                showToast('error', 'Erro!', `O campo código de doença está incorreto`);
                            }
                            else if (String(response.error.sqlMessage).includes("(`CodAtbPrimario`)") || String(response.error.sqlMessage).includes("(`CodAtbSecundario`)")) {
                                showToast('error', 'Erro!', `O campo código de medicamento está incorreto`);
                            } else {
                                showToast('error', 'Erro!', String(response.error.sqlMessage));
                            }
                        } else {
                            showToast('error', 'Erro!', String(response.error.sqlMessage));
                        }
                    } else {
                        showToast('error', 'Erro!', String(response.error));
                    }
                }
            })
        }catch(error){
            if (error instanceof Yup.ValidationError)
                showToast('error', 'Erro!', `Verifique se todos os campos foram preenchidos corretamente!`);
        }
    }

    function showToast(messageType: string, messageTitle: string, messageContent: string) {
        setToast(false)
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 4500)
    }

    const header = 
        <>
            <p style={{textAlign:'left'}} className="p-clearfix d-inline">Doenças</p>
        </>;

    const header2 = 
    <>
        <p style={{textAlign:'left'}} className="p-clearfix d-inline">Medicamentos</p>
    </>;

    useEffect(() => {
        setLoading1(true);
        setTimeout(() => {
            diseasesService.getDiseasesPaginate(10).then(data => {
                setTotalRecords(data.length);
                getDiseasesFunction(data);
            });
        }, 1000)
    }, []);

    function getDiseasesFunction(data?: any) {
        setLoading(true);
        if (!data) {
            diseasesService.getDiseasesPaginate(10).then(data => {
                setDatasource(data.diseases);
                setTotalRecords(data.length);
                data = data.diseases;

                setDiseases(data.slice(0, rows));
                setLoading(false);
                setLoading1(false);
                return;
            });
        }
        else {
            setDatasource(data.diseases);
            setTotalRecords(data.length);
            data = data.diseases;

            setDiseases(data.slice(0, rows));
            setLoading(false);
            setLoading1(false);
            return;
        }
    }

    const onPage = (event: any) => {
        setLoading(true);
        setTimeout(() => {
            const startIndex = event.first;
            const endIndex = event.first + rows;

            diseasesService.getDiseasesPaginate(endIndex).then(data => {
                getDiseasesFunction(data.diseases);
            });

            setFirst(startIndex);
            setLoading(false);
        });
    }

    function handleSearch() {
        if (!getOptionState) {
            showToast('error', 'Erro!', 'Selecione um filtro para buscar.');
            return;
        }
        setLoading(true);

        if (!searchInput) {
            diseasesService.getDiseasesPaginate(10).then(data => {
                getDiseasesFunction(data);
                setLoading(false);
                showToast('error', 'Erro!', 'Digite algum valor para pesquisar.');
            });

            return;
        }
        setMode('S');
        diseasesService.searchDiseasesGlobal(searchInput, getOptionState.cod, first + rows).then(data => {
            if (!data.diseases) {
                setLoading(false);
                return;
            }
            getDiseasesFunction(data);
        });
    }

    let newDiseases = true
    function onDiseasesSelect (e: any, type: any) {
        newDiseases = false;
        setDiseasesChange(e.value)
        DiseasesData = e.data;
        if(type == 1){
            setCodDoencaPrincipal(DiseasesData.CodDoenca) 
        }
        if(type == 2){
            setCodDoencaSecundario(DiseasesData.CodDoenca)
        }
        setTimeout(() => {
            setDisplayDialog(false)
        }, 500);
    };

    useEffect(() => {
        setLoading1(true);
        setTimeout(() => {
            medicinesService.getMedicinesPaginate(10).then(data => {
                setTotalRecords2(data.length);
                getMedicinesFunction(data);
            });
        }, 1000);
    }, []);

    function getMedicinesFunction(data?: any) {
        setLoading(true);
        setMedicines([]);

        if (!data) {
            medicinesService.getMedicinesPaginate(10).then(data => {
                console.log(data);

                setDatasource(data.medicines);
                setMedicines(datasource.slice(0, rows));
                setLoading(false);

                return;
            });
        }
        else {
            console.log(data);

            setDatasource(data.medicines);
            setMedicines(data.medicines.slice(0, rows));
            setLoading(false);
        }
    }

    const onPage2 = (event: any) => {
        setLoading(true);
        setTimeout(() => {
            const startIndex2 = event.first2;
            const endIndex2 = event.first2 + rows;

            medicinesService.getMedicinesPaginate(endIndex2).then(data => {
                getMedicinesFunction(data.medicines);
            });

            setFirst2(startIndex2);
            setLoading(false);
        });
    }

    function handleSearch2() {
        if (!getOptionState2) {
            showToast('error', 'Erro!', 'Selecione um filtro para buscar.');
            return;
        }
        setLoading(true);

        if (!searchInput2) {
            medicinesService.getMedicinesPaginate(10).then(data => {
                getMedicinesFunction(data);
                setLoading(false);
                showToast('error', 'Erro!', 'Digite algum valor para pesquisar.');
            });

            return;
        }
        setMode2('S');
        medicinesService.searchMedicineGlobal(searchInput2, getOptionState2.cod, first2 + rows).then(data => {
            if (!data.medicines) {
                setLoading(false);
                return;
            }
            getMedicinesFunction(data);
        });
    }

    let newMedicines = true
    function onMedicinesSelect (e: any, type: any) {
        newMedicines = false;
        setMedicinesChange(e.value)
        MedicinesData = e.data;
        if(type == 1){
            setCodAtbPrimario(MedicinesData.EAN) 
        }
        if(type == 2){
            setCodAtbSecundario(MedicinesData.EAN)
        }
        setTimeout(() => {
            setDisplayDialog2(false)
        }, 500);
    };

    return (
        <div className="row m-5">
            <div className="card shadow-lg p-3 col-sm-6 offset-md-3 border">
                <p className="text-dark h3 text-center">Cadastro de Prontuário</p>
                <form className="was-validated" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <label htmlFor="NroProntuario">Número do Prontuário</label>
                                <InputText keyfilter="pint" style={{ width: '100%' }} id="NroProntuario" name="NroProntuario"
                                    defaultValue={getNroProntuario} onChange={(e) => setNroProntuario(Number((e.target as HTMLInputElement).value))}
                                    placeholder="Digite o número do prontuário" min="1" max="999999999" required autoFocus />
                            </div>

                            <div className="col">
                                <label htmlFor="SeqPaciente">Sequência do Paciente</label>
                                <InputText keyfilter="pint" style={{ width: '100%' }} id="SeqPaciente" name="SeqPaciente"
                                    defaultValue={getSeqPaciente} onChange={(e) => setSeqPaciente(Number((e.target as HTMLInputElement).value))}
                                    placeholder="Digite o número do paciente" min="1" max="999999999" required />
                            </div>
                        </div>

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <label htmlFor="Origem">Origem</label>
                                <InputText style={{ width: '100%' }} id="Origem" name="Origem"
                                    defaultValue={getOrigem} onChange={(e) => setOrigem((e.target as HTMLInputElement).value)}
                                    placeholder="Digite a origem" required />
                            </div>

                            <div className="col">
                                <label htmlFor="Alocacao">Alocação</label>
                                <InputText style={{ width: '100%' }} id="Alocacao" name="Alocacao"
                                    defaultValue={getAlocacao} onChange={(e) => setAlocacao((e.target as HTMLInputElement).value)}
                                    placeholder="Digite a alocação" required />
                            </div>
                        </div>

                        <label htmlFor="DataInternacao" className="mt-4">Data da Internação</label>
                        <Calendar id="DataInternacao" style={{ width: '100%' }} value={getDataInternacao}
                            onChange={(e) => setDataInternacao(e.value)} locale={pt_br} dateFormat="dd/mm/yy"
                            placeholder="Selecione a data da internação" showButtonBar monthNavigator
                            showIcon showOnFocus={false} required />

                        <div className="form-row">
                            <label htmlFor="CodDoencaPrincipal" className="mt-4 ml-1">Código de Doença Primário</label>
                            <InputText style={{ width: '82%' }} className="ml-1" id="CodDoencaPrincipal" name="CodDoencaPrincipal"
                                defaultValue={getCodDoencaPrincipal} onChange={(e) => setCodDoencaPrincipal((e.target as HTMLInputElement).value)}
                                placeholder="Digite o código de doença primário" required />
                            <Button variant="primary" style={{ width: '16%' }} className="ml-1" onClick={() => {setDisplayDialog(true); setType(1);}}>Buscar</Button><br/>
                        </div>

                        <div className="form-row">
                            <label htmlFor="CodDoencaSecundario" className="mt-4 ml-1">Código de Doença Secundário</label>
                            <InputText style={{ width: '82%' }} className="ml-1" id="CodDoencaSecundario" name="CodDoencaSecundario"
                                defaultValue={getCodDoencaSecundario} onChange={(e) => { checkInput(1, (e.target as HTMLInputElement).value) }}
                                placeholder="Digite o código de doença secundário" />
                            <Button variant="primary" style={{ width: '16%' }} className="ml-1" onClick={() => {setDisplayDialog(true); setType(2);}}>Buscar</Button><br/>
                        </div>

                        <label htmlFor="SistemaAcometido" className="mt-4">Sistema Acometido</label>
                        <InputText style={{ width: '100%' }} id="SistemaAcometido" name="SistemaAcometido"
                            defaultValue={getSistemaAcometido} onChange={(e) => setSistemaAcometido((e.target as HTMLInputElement).value)}
                            placeholder="Digite o sistema acometido" required />

                        <label htmlFor="CodComorbidade" className="mt-4">Código de Comorbidade</label>
                        <InputText style={{ width: '100%' }} id="CodComorbidade" name="CodComorbidade"
                            defaultValue={getCodComorbidade} onChange={(e) => { checkInput(2, (e.target as HTMLInputElement).value) }}
                            placeholder="Digite o código de comorbidade" />

                        <div className="form-row">
                            <label htmlFor="CodAtbPrimario" className="mt-4 ml-1">Código de Medicamento Primário</label>
                            <InputText style={{ width: '82%' }} className="ml-1" id="CodAtbPrimario" name="CodAtbPrimario"
                                defaultValue={getCodAtbPrimario} onChange={(e) => setCodAtbPrimario((e.target as HTMLInputElement).value)}
                                placeholder="Digite o código de medicamento primário" required />
                            <Button variant="primary" style={{ width: '16%' }} className="ml-1" onClick={() => {setDisplayDialog2(true); setType(1);}}>Buscar</Button><br/>
                        </div>

                        <div className="form-row">
                            <label htmlFor="CodAtbSecundario" className="mt-4 ml-1">Código de Medicamento Secundário</label>
                            <InputText style={{ width: '82%' }} className="ml-1" id="CodAtbSecundario" name="CodAtbSecundario"
                                defaultValue={getCodAtbSecundario} onChange={(e) => { checkInput(3, (e.target as HTMLInputElement).value) }}
                                placeholder="Digite o código de medicamento secundário" />
                            <Button variant="primary" style={{ width: '16%' }} className="ml-1" onClick={() => {setDisplayDialog2(true); setType(2);}}>Buscar</Button><br/>
                        </div>

                        <label htmlFor="SitioInfeccaoPrimario" className="mt-4">Sítio de Infecção Primário</label>
                        <InputText style={{ width: '100%' }} id="SitioInfeccaoPrimario" name="SitioInfeccaoPrimario"
                            defaultValue={getSitioInfeccaoPrimario} onChange={(e) => { checkInput(4, (e.target as HTMLInputElement).value) }}
                            placeholder="Digite o sítio de infecção primário" />

                        <label htmlFor="OrigemInfeccao" className="mt-4">Origem da Infecção</label>
                        <InputText style={{ width: '100%' }} id="OrigemInfeccao" name="OrigemInfeccao"
                            defaultValue={getOrigemInfeccao} onChange={(e) => setOrigemInfeccao((e.target as HTMLInputElement).value)}
                            placeholder="Digite a origem da infecção" required />

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact />
                                <label htmlFor="ResultadoColeta">Resultado Coleta</label>
                                <br></br>
                                <Dropdown className="" value={getResultadoColeta} options={options} onChange={onResultadoChange} placeholder="Selecione uma opção" style={{ width: '100%' }} />
                                <DropdownReact />
                            </div>

                            <div className="col mr-4">
                                <DropdownReact />
                                <label htmlFor="TratamentoCCIH">Tratamento CCIH</label>
                                <br></br>
                                <Dropdown className="" value={getTratamento} options={options} onChange={onTratamentoChange} placeholder="Selecione uma opção" style={{ width: '100%' }} required />
                                <DropdownReact />
                            </div>

                            <div className="col">
                                <DropdownReact />
                                <label htmlFor="IndicacaoSepse">Indicação Sepse</label>
                                <br></br>
                                <Dropdown className="" value={getIndicacao} options={options} onChange={onIndicacaoChange} placeholder="Selecione uma opção" style={{ width: '100%' }} required />
                                <DropdownReact />
                            </div>
                        </div>

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact />
                                <label htmlFor="DisfuncaoRenal">Disfunção Renal</label>
                                <br></br>
                                <Dropdown className="" value={getDisfuncao} options={options} onChange={onDisfuncaoChange} placeholder="Selecione uma opção" style={{ width: '100%' }} required />
                                <DropdownReact />
                            </div>

                            <div className="col mr-4">
                                <DropdownReact />
                                <label htmlFor="DoseCorreta">Dose Correta</label>
                                <br></br>
                                <Dropdown className="" value={getDose} options={options} onChange={onDoseChange} placeholder="Selecione uma opção" style={{ width: '100%' }} />
                                <DropdownReact />
                            </div>

                            <div className="col">
                                <DropdownReact />
                                <label htmlFor="PosologiaCorreta">Posologia Correta</label>
                                <br></br>
                                <Dropdown className="" value={getPosologia} options={options} onChange={onPosologiaChange} placeholder="Selecione uma opção" style={{ width: '100%' }} />
                                <DropdownReact />
                            </div>
                        </div>

                    </div>

                    <button type="submit" className="btn btn-info btn-primary mt-3 mb-3">Cadastrar</button>
                </form>
            </div>

            <Dialog visible={displayDialog} style={{width: '75%'}} modal={true} onHide={() => {setDisplayDialog(false); setSearchInput(''); getDiseasesFunction(); setMode('N'); setOptionState(null); setOpen(false)}}>
            <div className="form-row">
                <Button variant="outline-secondary" className="mb-2 ml-2" onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open} style={{borderRadius: '0', height:'41.5px'}}>Buscar doença específica</Button>
                <Collapse in={open} timeout={200}>
                    <div className="ml-1">
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
                                        <Button tabIndex={2} variant="outline-danger" className="p-0 mr-1" style={{width: '17px', borderRadius: '0'}} onClick={() => {setSearchInput(''); getDiseasesFunction(); setMode('N'); setOptionState(null)}}><AiOutlineClose size={15}/></Button>
                                        <Button onClick={handleSearch} style={{borderRadius: '0'}}><FiSearch size={15}/></Button>
                                    </>
                            }
                        </div>
                    </div>
                </Collapse>
            </div>

            <div className="ml-auto"></div>
            
            <DataTable value={diseases} style={{ margin: 4 }} paginator={true} rows={rows} header={header} 
                totalRecords={totalRecords} emptyMessage="Nenhum resultado encontrado" className="p-datatable-responsive-demo"
                resizableColumns={true} loading={loading} first={first} onPage={onPage} lazy={true} 
                selectionMode="single" selection={selectedDiseases}
                onSelectionChange={e => setSelectedDiseases(e.value)} onRowSelect={(e) => {onDiseasesSelect(e, getType);}} >
                <Column field="CodDoenca" header="Código" style={{ width: '50%', textAlign: 'center' }} />
                <Column field="Nome" header="Nome" style={{ width: '50%', textAlign: 'center' }} />
            </DataTable>
            </Dialog>

            <Dialog visible={displayDialog2} style={{width: '75%'}} modal={true} onHide={() => {setDisplayDialog2(false); setSearchInput2(''); getMedicinesFunction(); setMode2('N'); setOptionState2(null); setOpen2(false)}}>
                <div className="form-row">
                    <Button variant="outline-secondary" className="mb-2 ml-2" onClick={() => setOpen2(!open2)} aria-controls="example-collapse-text" aria-expanded={open2} style={{borderRadius: '0', height:'41.5px'}}>Buscar medicamento específico</Button>
                    <Collapse in={open2} timeout={200}>
                        <div className="ml-1">
                            <div className="p-inputgroup">
                                <span className="p-float-label">
                                    <InputText id="float-input" type="search" value={searchInput2} onChange={(e) => {setSearchInput2((e.target as HTMLInputElement).value)}} onKeyPress={(ev) => {if (ev.key === 'Enter') {handleSearch2(); ev.preventDefault();}}}  style={{minWidth:'4em', borderRadius: '0'}} size={30} />
                                    {getOptionState2 === null
                                        ? <label htmlFor="float-input">Buscar</label>
                                        : <label htmlFor="float-input">Buscar por {getOptionState2.name}</label>
                                    }
                                </span>
                                {searchInput2 === ''
                                    ? <></>
                                    :
                                        <>
                                            <Dropdown className="mx-1" value={getOptionState2} options={options3} onChange={onOptionChange2} placeholder="Selecione um filtro" optionLabel="name" style={{width: '12em'}}/>
                                            <Button tabIndex={2} variant="outline-danger" className="p-0 mr-1" style={{width: '17px', borderRadius: '0'}} onClick={() => {setSearchInput2(''); getMedicinesFunction(); setMode2('N'); setOptionState2(null)}}><AiOutlineClose size={15}/></Button>
                                            <Button onClick={handleSearch2} style={{borderRadius: '0'}}><FiSearch size={15}/></Button>
                                        </>
                                }
                            </div>
                        </div>
                    </Collapse>
                </div>

                <div className="ml-auto"></div>

                <DataTable value={medicines} paginator={true} rows={rows}
                    header={header2} totalRecords={totalRecords2}
                    emptyMessage="Nenhum resultado encontrado" className="p-datatable-responsive-demo"
                    resizableColumns={true} loading={loading} first={first2} onPage={onPage2} lazy={true}
                    selectionMode="single" selection={selectedMedicines}
                    onSelectionChange={e => setSelectedMedicines(e.value)} onRowSelect={(e) => {onMedicinesSelect(e, getType);}}>
                    <Column field="EAN" header="Código" style={{ width: "33.3%", textAlign: "center" }} />
                    <Column field="PrincipioAtivo" header="Principio Ativo" style={{ width: "33.4%", textAlign: "center" }} />
                    <Column field="Apresentacao" header="Apresentação" style={{ width: "33.3%", textAlign: "center" }} />
                </DataTable>
            </Dialog>

            {getToast &&
                <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent} />
            }
            {loading1 &&
                <Loading/>
            }
        </div>
    )
}

export default MedicalRecordsForm;