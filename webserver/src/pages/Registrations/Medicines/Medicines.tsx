import React, { useState, useEffect } from 'react';
import { MedicinesService } from './MedicinesService';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import Button from 'react-bootstrap/Button';

import { FiSearch } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
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
        medicinesService.getMedicinesPaginate(10).then(data => {
            setTotalRecords(data.length);
            getMedicinesFunction(data);
        });
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

    const header = (
        <>
            <h5 className="py-1">Tabela de medicamentos</h5>

            <div className="p-inputgroup py-1">
                <InputText
                    value={searchInput}
                    placeholder="Pesquisar por medicamento"
                    className="mr-2"
                    style={{ maxWidth: '20vw' }}
                    onChange={(e) => setSearchInput((e.target as HTMLInputElement).value)}
                    onKeyPress={
                        (e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                                e.preventDefault();
                            }
                        }
                    }
                />
                <Dropdown
                    value={optionState}
                    optionLabel="name"
                    placeholder="Selecione um filtro"
                    className="mr-2"
                    style={{ maxWidth: '14vw' }}
                    options={[
                        { name: 'EAN', cod: 'E' },
                        { name: 'Princípio', cod: 'P' },
                        { name: 'Classe', cod: 'C' },
                    ]}
                />
                <Button
                    className="d-inline-flex justify-content-center align-items-center mr-2"
                    variant="outline-danger"
                    onClick={() => {
                        setSearchInput('');
                        getMedicinesFunction();
                        setMode('N');
                        setOptionState(null)
                    }}
                >
                    <AiOutlineClose size={18} />
                </Button>
                <Button 
                    className="d-inline-flex justify-content-center align-items-center mr-2" 
                    onClick={handleSearch}
                >
                    <FiSearch size={18} />
                </Button>
            </div>
        </>
    );

    return (
        <>
            <DataTable
                value={medicines}
                style={{ margin: 48 }}
                paginator={true}
                rows={rows}
                header={header}
                totalRecords={totalRecords}
                emptyMessage="Nenhum resultado encontrado"
                className="p-datatable-responsive-demo"
                resizableColumns={true}
                loading={loading}
                first={first}
                onPage={onPage}
                lazy={true}
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
        </>
    )
}

export default Medicines;