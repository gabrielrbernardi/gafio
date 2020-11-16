import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DiseasesService } from './DiseasesService';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import { FiSearch } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';

const Diseases = () => {
    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);

    const diseasesService = new DiseasesService();
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

    function getDiseasesFunction(data?: any) {
        setLoading(true);
        setDiseases([]);

        if (!data) {
            diseasesService.getDiseasesPaginate(10).then(data => {
                console.log(data);

                setDatasource(data.diseases);
                setDiseases(datasource.slice(0, rows));
                setLoading(false);

                return;
            });
        }
        else {
            console.log(data);

            setDatasource(data.diseases);
            setDiseases(data.diseases.slice(0, rows));
            setLoading(false);
        }
    }

    useEffect(() => {
        diseasesService.getDiseasesPaginate(10).then(data => {
            setTotalRecords(data.length);
            getDiseasesFunction(data);
        });
    }, []);

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
        if (!optionState) {
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
        diseasesService.searchDiseasesGlobal(searchInput, optionState.cod, first + rows).then(data => {
            if (!data.diseases) {
                setLoading(false);
                return;
            }
            getDiseasesFunction(data);
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

    return (
        <>
            <div className="row m-5 px-5">
                <Link to={location => ({ ...location, pathname: '/registrations/diseases/create' })}>
                    <Button 
                        variant="outline-dark" 
                        className="mr-2 mb-2" 
                        style={{ borderRadius: '0' }}
                    >
                        Cadastrar Doença
                    </Button>
                </Link>
                <Button
                    className="mr-2 mb-2"
                    variant="outline-secondary"
                    onClick={() => setOpen(!open)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                    style={{ borderRadius: '0' }}
                >
                    Buscar doença específica
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
                                    style={{ minWidth: '4em', borderRadius: '0' }}
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
                                                { name: 'Código', cod: 'C' },
                                                { name: 'Nome', cod: 'N' },
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
                                            onClick={() => { setSearchInput(''); getDiseasesFunction(); setMode('N'); setOptionState(null) }}
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
                    value={diseases}
                    paginator={true}
                    rows={rows}
                    header={<h5 className="py-1">Tabela de doenças</h5>}
                    totalRecords={totalRecords}
                    emptyMessage="Nenhum resultado encontrado"
                    className="p-datatable-responsive-demo"
                    resizableColumns={true}
                    loading={loading}
                    first={first}
                    onPage={onPage}
                    lazy={true}
                >
                    <Column field="CodDoenca" header="Código" style={{ width: '8%', textAlign: 'center' }} />
                    <Column field="Nome" header="Nome" style={{ width: '20%', textAlign: 'center' }} />
                </DataTable>
            </div>
        </>
    )
}

export default Diseases;