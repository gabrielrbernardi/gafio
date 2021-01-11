import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MedicinesService } from './MedicinesService';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';

import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import { FiSearch } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';

import * as Yup from "yup";

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);

    const medicinesService = new MedicinesService();
    const rows = 10;

    const [searchInput, setSearchInput] = useState('');
    const [optionState, setOptionState] = useState<any>(null);
    const [mode, setMode] = useState('N');
    const [toast, setToast] = useState<boolean>();
    const [messageType, setMessageType] = useState<string>('');
    const [messageTitle, setMessageTitle] = useState<string>('');
    const [messageContent, setMessageContent] = useState<string>('');
    const [datasource, setDatasource] = useState([]);
    const [open, setOpen] = useState(false);

    const [displayDialogs, setDisplayDialogs] = useState(false);
    const [displayDialog1, setDisplayDialog1] = useState(false);
    const [displayDialog2, setDisplayDialog2] = useState(false);
    const [displayDialog3, setDisplayDialog3] = useState(false);

    const [ean, setEan] = useState<any>('');

    var medicineData:any = {}

    const [updatedEan, setUpdatedEan] = useState<any>('');

    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [selectedMedicine, setSelectedMedicine] = useState<any>(null);

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

    useEffect(() => {
        setLoading1(true);
        setTimeout(() => {
            medicinesService.getMedicinesPaginate(10).then(data => {
                setTotalRecords(data.length);
                getMedicinesFunction(data);
            });
        }, 1000);
    }, []);

    const onPage = (event: any) => {
        setLoading(true);
        setTimeout(() => {
            const startIndex = event.first;
            const endIndex = event.first + rows;

            medicinesService.getMedicinesPaginate(endIndex).then(data => {
                getMedicinesFunction(data.medicines);
            });

            setFirst(startIndex);
            setLoading(false);
        });
    }

    function handleSearch() {
        if (!optionState) {
            showToast('error', 'Erro!', 'Selecione um filtro para buscar.');
            return;
        }
        setLoading(true);

        if (!searchInput) {
            medicinesService.getMedicinesPaginate(10).then(data => {
                getMedicinesFunction(data);
                setLoading(false);
                showToast('error', 'Erro!', 'Digite algum valor para pesquisar.');
            });

            return;
        }
        setMode('S');
        medicinesService.searchMedicineGlobal(searchInput, optionState.cod, first + rows).then(data => {
            if (!data.medicines) {
                setLoading(false);
                return;
            }
            getMedicinesFunction(data);
        });
    }

    function showToast(messageType: string, messageTitle: string, messageContent: string) {
        setToast(false);
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => { setToast(false) }, 4500);
    }

    function onUserSelect(e: any) {
        setSelectedMedicine(Object.assign({}, e.data));

        medicineData = e.data;
        console.log(e.data);

        setEan(medicineData.EAN);
        setDisplayDialogs(true);
    };

    function updateMedicine() {
        setUpdatedEan(ean);
    }

    // async function handleSubmit(event: FormEvent) {
    //     try {
    //         event.preventDefault();

    //         const data = {};
    //         const schema = Yup.object().shape({
    //             up: Yup.string().required(),
    //             updatedCodDoenca: Yup.string().required(),
    //             updatedNome: Yup.string().required()
    //         })

    //         await schema.validate(data, { abortEarly: false });

    //         medicinesService.updateMedicine().then(response => {
    //             if (response.updatedMedicine) {
    //                 showToast("success", "Atualização!", "Medicamento atualizado com sucesso.");
    //                 setDisplayDialog2(false);
    //                 getMedicinesFunction();
    //             } 
    //             else {
    //                 showToast("error", "Erro!", String(response.error));
    //             }
    //         });
    //     } 
    //     catch (err) {
    //         if (err instanceof Yup.ValidationError) {
    //             showToast("error", "Erro!", "Verifique se todos os campos foram preenchidos corretamente!");
    //         }
    //         else return;
    //     }
    // }

    async function deleteMedicine() {
        await medicinesService.deleteMedicine(ean).then(response => {

            if (response.deletedMedicine) {
                showToast("success", "Atualização!", "Medicamento excluído com sucesso.");
                setDisplayDialog3(false);
                getMedicinesFunction();
            } 
            else {
                console.log(response.error);

                if (response.error.code) {
                    showToast("error", "Erro!", String(response.error.code) + ' ' + String(response.error.sqlMessage));
                } 
                else {
                    showToast('error', "Erro!", String(response.error));
                }
            }
        });
    }

    return (
        <>
            <div className="row m-5 px-5">
                <Link to={location => ({ ...location, pathname: '/registrations/medicines/create' })}>
                    <Button 
                        variant="outline-dark" 
                        className="mr-2 mb-2" 
                        style={{ borderRadius: '0', height:'41.5px' }}
                    >
                        Cadastrar Medicamento
                    </Button>
                </Link>
                <Button
                    className="mr-2 mb-2"
                    variant="outline-secondary"
                    onClick={() => setOpen(!open)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                    style={{ borderRadius: '0', height:'41.5px' }}
                >
                    Buscar medicamento específico
                </Button>
                <Collapse className="mb-2" in={open} timeout={200}>
                    <div>
                        <div className="p-inputgroup">
                            <span className="p-float-label mr-2"> 
                                <InputText
                                    id="float-input"
                                    type="search"
                                    value={searchInput}
                                    onChange={(e) => { setSearchInput((e.target as HTMLInputElement).value) }}
                                    onKeyPress={(ev) => { if (ev.key === 'Enter') { handleSearch(); ev.preventDefault(); } }}
                                    style={{ minWidth: '4em', borderRadius: '0', height:'41.5px' }}
                                />
                                {
                                    optionState === null
                                        ? <label htmlFor="float-input">Buscar</label>
                                        : <label htmlFor="float-input">Buscar por {optionState.name}</label>
                                }
                            </span>
                            {
                                searchInput === ''
                                    ? <></>
                                    : <>
                                        <Dropdown
                                            className="mr-2"
                                            value={optionState}
                                            options={[
                                                { name: 'EAN', cod: 'E' },
                                                { name: 'Princípio', cod: 'P' },
                                                { name: 'Classe', cod: 'C' },
                                            ]}
                                            onChange={(e: { value: any }) => setOptionState(e.value)}
                                            placeholder="Selecione um filtro"
                                            optionLabel="name"
                                            style={{ width: '12em' }}
                                        />
                                        <Button
                                            tabIndex={2}
                                            variant="outline-danger"
                                            className="d-inline-flex justify-content-center align-items-center mr-2"
                                            style={{ borderRadius: '0' }}
                                            onClick={() => { setSearchInput(''); getMedicinesFunction(); setMode('N'); setOptionState(null) }}
                                        >
                                            <AiOutlineClose size={18} />
                                        </Button>
                                        <Button
                                            onClick={handleSearch}
                                            style={{ borderRadius: '0' }}
                                            className="d-inline-flex justify-content-center align-items-center"
                                        >
                                            <FiSearch size={18} />
                                        </Button>
                                    </>
                            }
                        </div>
                    </div>
                </Collapse>

                <DataTable
                    value={medicines}
                    paginator={true}
                    rows={rows}
                    header={<h5 className="py-1">Tabela de medicamentos</h5>}
                    totalRecords={totalRecords}
                    emptyMessage="Nenhum resultado encontrado"
                    className="p-datatable-responsive-demo"
                    resizableColumns={true}
                    loading={loading}
                    first={first}
                    onPage={onPage}
                    lazy={true}
                    selectionMode="single" 
                    selection={selectedRow} 
                    onSelectionChange={(e) => setSelectedRow(e.value)}
                    onRowSelect={(e) => onUserSelect(e)}
                >
                    <Column field="EAN" header="Código" style={{ width: "12.5%", textAlign: "center" }} />
                    <Column field="PrincipioAtivo" header="Principio Ativo" style={{ width: "12.5%", textAlign: "center" }} />
                    <Column field="CNPJ" header="CNPJ" style={{ width: "12.5%", textAlign: "center" }} />
                    <Column field="Laboratorio" header="Laboratório" style={{ width: "12.5%", textAlign: "center" }} />
                    <Column field="Registro" header="Registro" style={{ width: "12.5%", textAlign: "center" }} />
                    <Column field="Produto" header="Produto" style={{ width: "12.5%", textAlign: "center" }} />
                    <Column field="Apresentacao" header="Apresentação" style={{ width: "12.5%", textAlign: "center" }} />
                    <Column field="ClasseTerapeutica" header="Classe Terapêutica" style={{ width: "12.5%", textAlign: "center" }} />
                </DataTable>

                <Dialog 
                    visible={displayDialogs} 
                    style={{ width: '50%' }} 
                    header="Ações" 
                    modal={true} 
                    onHide={() => setDisplayDialogs(false)}
                >
                    <div className="form-row">
                        <div className="col">
                            <Button 
                                variant="info" 
                                className="mt-2 mb-2 p-3" 
                                style={{ width: '100%' }} 
                                onClick={() => { 
                                    setDisplayDialog1(true); 
                                    setDisplayDialogs(false);
                                }}
                            >
                                Visualizar medicamento
                            </Button>
                        </div>

                        <div className="col ml-2">
                            <Button 
                                variant="primary" 
                                className="mt-2 mb-2 p-3" 
                                style={{ width: '100%' }} 
                                onClick={() => { 
                                    updateMedicine(); 
                                    setDisplayDialog2(true); 
                                    setDisplayDialogs(false) 
                                }}
                            >
                                Atualizar medicamento
                            </Button>
                        </div>

                        <div className="col ml-2">
                            <Button 
                                variant="danger" 
                                className="mt-2 mb-2 p-3" 
                                style={{ width: '100%' }} 
                                onClick={() => { 
                                    setDisplayDialog3(true); 
                                    setDisplayDialogs(false) 
                                }}
                            >
                                Excluir medicamento
                            </Button>
                        </div>
                    </div>
                </Dialog>

                {/* Caixa de dialogo de listagem de medicamentos */}
                <Dialog 
                    visible={displayDialog1} 
                    style={{ width: '50%' }} 
                    modal={true} 
                    onHide={() => setDisplayDialog1(false)} 
                    maximizable
                >
                    <p className="text-dark h5 mt-2">EAN: {ean}</p>
                </Dialog>

                <Dialog 
                    visible={displayDialog2} 
                    style={{ width: '70%' }} 
                    modal={true} 
                    onHide={() => setDisplayDialog2(false)} 
                    maximizable maximized
                >
                    <p className="text-dark h3 text-center">Atualização dos dados do medicamento {ean}</p>

                    <form className="was-validated" /*onSubmit={handleSubmit}*/>
                        <div className="mt-4 mb-2">
                            <span className="p-float-label">
                                <InputText 
                                    id="codeUpdate" 
                                    style={{ width: '100%' }} 
                                    value={updatedEan} 
                                    onChange={(e) => setUpdatedEan((e.target as HTMLInputElement).value)} 
                                />
                                <label htmlFor="NomeUpdate">EAN</label>
                            </span>
                        </div>

                        <button type="submit" className="btn btn-info btn-primary mt-3">Cadastrar</button>
                    </form>
                </Dialog>

                <Dialog 
                    visible={displayDialog3} 
                    style={{ width: '50%' }} 
                    modal={true}
                    header="Exclusão de medicamento" 
                    onHide={() => setDisplayDialog3(false)}
                >
                    <p className="text-dark h5 mt-2">Deseja exluir o medicamento de EAN {ean}?</p>

                    <div className="row">
                        <div className="col">
                            <Button variant="outline-danger" onClick={() => deleteMedicine()} style={{ width: '100%' }}>Sim</Button>
                        </div>
                        <div className="col">
                            <Button variant="outline-info" onClick={() => setDisplayDialog3(false)} style={{ width: '100%' }}>Não</Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    )
}

export default Medicines;