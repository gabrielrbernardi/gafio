import React, { useState, FormEvent, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Dropdown as DropdownReact } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import ToastComponent from '../../../../components/Toast';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import Button from 'react-bootstrap/Button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Collapse from 'react-bootstrap/Collapse';
import {FiSearch} from 'react-icons/fi';
import {AiOutlineClose} from 'react-icons/ai';
import Loading from '../../../../components/Loading';
import * as Yup from "yup";

import { CreateAssessmentService } from './CreateAssessmentService'
import { MedicinesService } from '../../../Registrations/Medicines/MedicinesService';

const AssessmentForm = () => {
    const query = new URLSearchParams(useLocation().search)
    const queryResponse = query.get("seqProntuario") || ""

    const [getNroAvaliacao, setNroAvaliacao] = useState<any>(null)
    const [getDataAvaliacao, setDataAvaliacao] = useState<any>(null)
    const [getResultadoCulturas, setResultadoCulturas] = useState<any>(null)
    const [getResCulturasAcao, setResCulturasAcao] = useState<any>(null)
    const [getDoseCorreta, setDoseCorreta] = useState<any>(null)
    const [getPosologiaCorreta, setPosologiaCorreta] = useState<any>(null)
    const [getAlertaDot, setAlertaDot] = useState<any>(null)
    const [getAlertaDotDescricao, setAlertaDotDescricao] = useState<any>(null)
    const [getDisfuncaoRenal, setDisfuncaoRenal] = useState<string>('')
    const [getAtbContraindicacao, setAtbContraindicacao] = useState<any>(null)
    const [getAlteracaoPrescricao, setAlteracaoPrescricao] = useState<any>(null)
    const [getAtbDiluicaoInfusao, setAtbDiluicaoInfusao] = useState<any>(null)
    const [getInteracaoAtbMedicamento, setInteracaoAtbMedicamento] = useState<any>(null)
    const [getHemodialise, setHemodialise] = useState<any>(null)
    const [getAtbOral, setAtbOral] = useState<any>(null)
    const [getTrocaAtb, setTrocaAtb] = useState<any>(null)
    const [getNovoAtb, setNovoAtb] = useState<any>(null)
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [datasource, setDatasource] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [totalRecords2, setTotalRecords2] = useState(0);
    const [first2, setFirst2] = useState(0);
    const [searchInput2, setSearchInput2] = useState('');
    const [getOptionState2, setOptionState2] = useState<any>(null);
    const [mode2, setMode2] = useState('N');
    const [open2, setOpen2] = useState(false);
    const [getMedicinesChange, setMedicinesChange] = useState();
    const [selectedMedicines, setSelectedMedicines] = useState<any>(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const medicinesService = new MedicinesService();
    var MedicinesData:any = {};
    const rows = 10;

    const history = useHistory()

    const createAssessmentService = new CreateAssessmentService()

    useEffect(() => {
        createAssessmentService.Verify(queryResponse).then(response => {
            if(response.verifyMR){
                return
            }else{
                showToast('error', 'Erro!', String(response.error))
                setTimeout(() => {
                    history.push('/medicalRecords')
                }, 2500)
            }
        })
    }, [])

    function checkInput(type: number, e: any) {
        if (type == 1) {
            if (e === '') {
                setResultadoCulturas(null);
            } else {
                setResultadoCulturas(e)
            }
        }
        if (type == 2) {
            if (e === '') {
                setResCulturasAcao(null);
            } else {
                setResCulturasAcao(e)
            }
        }
        if (type == 3) {
            if (e === '') {
                setAlertaDotDescricao(null);
            } else {
                setAlertaDotDescricao(e)
            }
        }
        if (type == 4) {
            if (e === '') {
                setNovoAtb(null);
            } else {
                setNovoAtb(e)
            }
        }
    }

    const onDoseCorretaChange = (e: { value: string }) => {
        setDoseCorreta(e.value);
    };

    const onPosologiaCorretaChange = (e: { value: string }) => {
        setPosologiaCorreta(e.value);
    };

    const onAlertaDotChange = (e: { value: string }) => {
        setAlertaDot(e.value);
    };

    const onAlteracaoPrescricaoChange = (e: { value: string }) => {
        setAlteracaoPrescricao(e.value);
    };

    const onAtbContraindicacaoChange = (e: { value: string }) => {
        setAtbContraindicacao(e.value);
    };

    const onAtbDiluicaoInfusaoChange = (e: { value: string }) => {
        setAtbDiluicaoInfusao(e.value);
    };

    const onInteracaoAtbMedicamentoChange = (e: { value: string }) => {
        setInteracaoAtbMedicamento(e.value);
    };

    const onHemodialiseChange = (e: { value: string }) => {
        setHemodialise(e.value);
    };

    const onAtbOralChange = (e: { value: string }) => {
        setAtbOral(e.value);
    };

    const onTrocaAtbChange = (e: { value: string }) => {
        setTrocaAtb(e.value);
    };

    let options = [
        { label: 'Sim', value: 'S' },
        { label: 'Não', value: 'N' }
    ]

    let options2 = [
        { label: 'Sim', value: 'S' },
        { label: 'Sim intermitente', value: 'SI' },
        { label: 'Não', value: 'N' }
    ]

    let options3 = [
        { label: 'Sim', value: 'S' },
        { label: 'Não aplica', value: 'NA' },
        { label: 'Não', value: 'N' }
    ]

    let options4 = [
        { name: 'Código', cod: 'E' },
        { name: 'Princípio', cod: 'P' },
    ];

    const header2 = 
    <>
        <p style={{textAlign:'left'}} className="p-clearfix d-inline">Medicamentos</p>
    </>;

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
            getNroAvaliacao, getDataAvaliacao, getResultadoCulturas, getResCulturasAcao,
            getDoseCorreta, getPosologiaCorreta, getAlertaDot, getAlertaDotDescricao, getDisfuncaoRenal,
            getHemodialise, getAtbOral, getAtbContraindicacao, getAlteracaoPrescricao, getAtbDiluicaoInfusao,
            getInteracaoAtbMedicamento, getTrocaAtb, getNovoAtb
        }

        try{
            const schema = Yup.object().shape({
                getNroAvaliacao: Yup.number().required(),
                getDataAvaliacao: Yup.date().required(),
                getResultadoCulturas: Yup.string().nullable(),
                getResCulturasAcao: Yup.string().nullable(),
                getDoseCorreta: Yup.string().nullable().oneOf([null, "S", "N"]),
                getPosologiaCorreta: Yup.string().nullable().oneOf([null, "S", "N"]),
                getAlertaDot: Yup.string().nullable().oneOf([null, "S", "N"]),
                getAlertaDotDescricao: Yup.string().nullable(),
                getDisfuncaoRenal: Yup.string().required(),
                getHemodialise: Yup.string().oneOf(["S", "SI", "N"]).required(),
                getAtbOral: Yup.string().oneOf(["S", "NA", "N"]).required(),
                getAtbContraindicacao: Yup.string().oneOf(["S", "N"]).required(),
                getAlteracaoPrescricao: Yup.string().nullable().oneOf([null, "S", "N"]),
                getAtbDiluicaoInfusao: Yup.string().oneOf(["S", "N"]).required(),
                getInteracaoAtbMedicamento: Yup.string().oneOf(["S", "N"]).required(),
                getTrocaAtb: Yup.string().oneOf(["S", "N"]).required(),
                getNovoAtb: Yup.string().nullable()
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            createAssessmentService.Create(queryResponse, getNroAvaliacao, getDataAvaliacao, getResultadoCulturas, getResCulturasAcao,
                getDoseCorreta, getPosologiaCorreta, getAlertaDot, getAlertaDotDescricao, getDisfuncaoRenal,
                getHemodialise, getAtbOral, getAtbContraindicacao, getAlteracaoPrescricao, getAtbDiluicaoInfusao,
                getInteracaoAtbMedicamento, getTrocaAtb, getNovoAtb)
            .then((response) => {
                if (response.CreatedAssessment) {
                    showToast('success', 'Sucesso!', `Avaliação criada com sucesso!`);
                    setTimeout(() => {
                        history.push(`/medicalRecords/assessment/?seqProntuario=${queryResponse}`)
                    }, 3500)
                } else {
                    if (response.error.sqlMessage) {
                        if (response.error.sqlState == 23000) {
                            console.log(response.error.sqlState)
                            if (String(response.error.sqlMessage).includes("(`NovoAtb`)")) {
                                showToast('error', 'Erro!', `O campo Novo Atb está incorreto`);
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

    const onOptionChange2 = (e: { value: any }) => {
        setOptionState2(e.value);
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
                setLoading1(false);
                return;
            });
        }
        else {
            console.log(data);

            setDatasource(data.medicines);
            setMedicines(data.medicines.slice(0, rows));
            setLoading(false);
            setLoading1(false);
            return
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
    function onMedicinesSelect (e: any) {
        newMedicines = false;
        setMedicinesChange(e.value)
        MedicinesData = e.data;
        
        setNovoAtb(MedicinesData.EAN)
        setTimeout(() => {
            setDisplayDialog(false)
        }, 500);
    };

    return (
        <div className="row m-5">
            <div className="card shadow-lg p-3 col-sm-6 offset-md-3 border">
                <p className="text-dark h3 text-center">Cadastro de Avaliação</p>
                <form className="was-validated" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <label htmlFor="NroAvaliacao">Número da Avaliação</label>
                                <InputText keyfilter="pint" style={{ width: '100%' }} id="NroAvaliacao" name="NroAvaliacao"
                                    defaultValue={getNroAvaliacao} onChange={(e) => setNroAvaliacao(Number((e.target as HTMLInputElement).value))}
                                    placeholder="Digite o número da avaliação" min="1" max="999999999" required autoFocus />
                            </div>

                            <div className="col">
                                <label htmlFor="DataAvaliacao" className="mt">Data da Avaliação</label>
                                <Calendar id="DataInternacao" style={{ width: '100%' }} value={getDataAvaliacao}
                                    onChange={(e) => setDataAvaliacao(e.value)} locale={pt_br} dateFormat="dd/mm/yy"
                                    placeholder="Selecione a data da internação" showButtonBar monthNavigator
                                    showIcon showOnFocus={false} required />
                            </div>
                        </div>

                        <label htmlFor="ResultadoCulturas" className="mt-4">Resultado das Culturas</label>
                        <InputText style={{ width: '100%' }} id="ResultadoCulturas" name="ResultadoCulturas"
                            defaultValue={getResultadoCulturas} onChange={(e) => { checkInput(1, (e.target as HTMLInputElement).value) }}
                            placeholder="Digite o resultado das culturas" />

                        <label htmlFor="ResCulturasAcao" className="mt-4">Ação do Resultado das Culturas</label>
                        <InputText style={{ width: '100%' }} id="ResCulturasAcao" name="ResCulturasAcao"
                            defaultValue={getResCulturasAcao} onChange={(e) => { checkInput(2, (e.target as HTMLInputElement).value) }}
                            placeholder="Digite a ação do resultado das culturas" />

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact />
                                <label htmlFor="DoseCorreta">Dose Correta</label>
                                <br></br>
                                <Dropdown className="" value={getDoseCorreta} options={options}
                                    onChange={onDoseCorretaChange} placeholder="Selecione uma opção" style={{ width: '100%' }} />

                                <DropdownReact />
                            </div>

                            <div className="col mr-4">
                                <DropdownReact />
                                <label htmlFor="PosologiaCorreta">Posologia Correta</label>
                                <br></br>
                                <Dropdown className="" value={getPosologiaCorreta} options={options}
                                    onChange={onPosologiaCorretaChange} placeholder="Selecione uma opção" style={{ width: '100%' }} />

                                <DropdownReact />
                            </div>

                            <div className="col">
                                <DropdownReact />
                                <label htmlFor="AlertaDot">Alerta Dot</label>
                                <br></br>
                                <Dropdown className="" value={getAlertaDot} options={options}
                                    onChange={onAlertaDotChange} placeholder="Selecione uma opção" style={{ width: '100%' }} />

                                <DropdownReact />
                            </div>
                        </div>

                        <label htmlFor="AlertaDotDescricao" className="mt-4">Descrição do Alerta Dot</label>
                        <InputText style={{ width: '100%' }} id="AlertaDotDescricao" name="AlertaDotDescricao"
                            defaultValue={getAlertaDotDescricao} onChange={(e) => { checkInput(3, (e.target as HTMLInputElement).value) }}
                            placeholder="Digite a descrição do alerta dot" />

                        <label htmlFor="DisfuncaoRenal" className="mt-4">Disfuncao Renal</label>
                        <InputText style={{ width: '100%' }} id="DisfuncaoRenal" name="DisfuncaoRenal"
                            defaultValue={getDisfuncaoRenal} onChange={(e) => setDisfuncaoRenal((e.target as HTMLInputElement).value)}
                            placeholder="Digite a disfunção renal" required />

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact />
                                <label htmlFor="AtbContraindicacao">Contraindicação de Atb</label>
                                <br></br>
                                <Dropdown className="" value={getAtbContraindicacao} options={options}
                                    onChange={onAtbContraindicacaoChange} placeholder="Selecione uma opção" style={{ width: '100%' }} required />

                                <DropdownReact />
                            </div>

                            <div className="col">
                                <DropdownReact />
                                <label htmlFor="AlteracaoPrescricao">Alteração da Prescrição</label>
                                <br></br>
                                <Dropdown className="" value={getAlteracaoPrescricao} options={options}
                                    onChange={onAlteracaoPrescricaoChange} placeholder="Selecione uma opção" style={{ width: '100%' }} />

                                <DropdownReact />
                            </div>
                        </div>

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact />
                                <label htmlFor="AtbDiluicaoInfusao">Diluição e/ou Infusão de Atb</label>
                                <br></br>
                                <Dropdown className="" value={getAtbDiluicaoInfusao} options={options}
                                    onChange={onAtbDiluicaoInfusaoChange} placeholder="Selecione uma opção" style={{ width: '100%' }} required />

                                <DropdownReact />
                            </div>

                            <div className="col">
                                <DropdownReact />
                                <label htmlFor="InteracaoAtbMedicamento">Interação Atb e Medicamento</label>
                                <br></br>
                                <Dropdown className="" value={getInteracaoAtbMedicamento} options={options}
                                    onChange={onInteracaoAtbMedicamentoChange} placeholder="Selecione uma opção" style={{ width: '100%' }} required />

                                <DropdownReact />
                            </div>
                        </div>

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact />
                                <label htmlFor="Hemodialise">Hemodialise</label>
                                <br></br>
                                <Dropdown className="" value={getHemodialise} options={options2}
                                    onChange={onHemodialiseChange} placeholder="Selecione uma opção" style={{ width: '100%' }} required />

                                <DropdownReact />
                            </div>

                            <div className="col mr-4">
                                <DropdownReact />
                                <label htmlFor="AtbOral">Atb Oral</label>
                                <br></br>
                                <Dropdown className="" value={getAtbOral} options={options3}
                                    onChange={onAtbOralChange} placeholder="Selecione uma opção" style={{ width: '100%' }} required />

                                <DropdownReact />
                            </div>

                            <div className="col">
                                <DropdownReact />
                                <label htmlFor="TrocaAtb">Troca do Atb</label>
                                <br></br>
                                <Dropdown className="" value={getTrocaAtb} options={options}
                                    onChange={onTrocaAtbChange} placeholder="Selecione uma opção" style={{ width: '100%' }} required />

                                <DropdownReact />
                            </div>
                        </div>

                        <div className="form-row">
                            <label htmlFor="NovoAtb" className="mt-4 ml-1"  style={{ width: '100%' }}>Novo Atb</label>
                            <InputText style={{ width: '82%' }} className="ml-1" id="NovoAtb" name="NovoAtb"
                                defaultValue={getNovoAtb} onChange={(e) => { checkInput(4, (e.target as HTMLInputElement).value) }}
                                placeholder="Digite o novo Atb" required />
                            <Button variant="primary" style={{ width: '16%' }} className="ml-1" onClick={() => {setDisplayDialog(true);}}>Buscar</Button><br/>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-info btn-primary mt-3 mb-3">Cadastrar</button>
                </form>
            </div>

            <Dialog visible={displayDialog} style={{width: '75%'}} modal={true} onHide={() => {setDisplayDialog(false); setSearchInput2(''); getMedicinesFunction(); setMode2('N'); setOptionState2(null); setOpen2(false)}}>
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
                                            <Dropdown className="mx-1" value={getOptionState2} options={options4} onChange={onOptionChange2} placeholder="Selecione um filtro" optionLabel="name" style={{width: '12em'}}/>
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
                    onSelectionChange={e => setSelectedMedicines(e.value)} onRowSelect={(e) => {onMedicinesSelect(e);}}>
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

export default AssessmentForm