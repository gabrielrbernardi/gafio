import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { DiseasesService } from './DiseasesService';

/* Importações do Prime React */
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';

/* Importações do React Bootstrap */
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

/* Importações dos icones */
import { FiSearch } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';

import * as Yup from "yup";

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

    const [displayDialogs, setDisplayDialogs] = useState(false);
    const [vizualizeDiseaseDialog, setVizualizeDiseaseDialog] = useState(false);
    const [updateDiseaseDialog, setUpdateDiseaseDialog] = useState(false);
    const [deleteDiseaseDialog, setDeleteDiseaseDialog] = useState(false);

    const [codDoenca, setCodDoenca] = useState<any>('');
    const [nome, setNome] = useState<any>('');

    const [updatedCodDoenca, setUpdatedCodDoenca] = useState<any>('');
    const [updatedNome, setUpdatedNome] = useState<any>('');

    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [selectedDisease, setSelectedDisease] = useState<any>(null);

    /**
     * Função para carregar as doenças
    **/
    function getDiseasesFunction(data?: any) {
        setLoading(true);

        if (!data) {
            diseasesService.getDiseasesPaginate(10).then(data => {
                setDatasource(data.diseases);
                setTotalRecords(data.length);
                data = data.diseases;

                setDiseases(data.slice(0, rows));
                setLoading(false);

                return;
            });
        }
        else {
            setDatasource(data.diseases);
            setTotalRecords(data.length);
            data = data.diseases;

            setDiseases(data.slice(0, rows));
            setLoading(false);

            return;
        }
    }

    useEffect(() => {
        setTimeout(() => {
            diseasesService.getDiseasesPaginate(10).then(data => {
                setTotalRecords(data.length);
                getDiseasesFunction(data);
            });
        }, 1000);
    }, []);

    /**
     * Função para mostrar avisos
    **/
    function showToast(messageType: string, messageTitle: string, messageContent: string) {
        setToast(false);
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);

        setTimeout(() => { setToast(false) }, 4500);
    }

    /**
     * Função para filtrar doenças
    **/
    function handleSearch() {
        if (!optionState) {
            showToast("error", "Erro!", "Selecione um filtro para buscar.");
            return;
        }
        setLoading(true);

        if (!searchInput) {
            diseasesService.getDiseasesPaginate(10).then(data => {
                getDiseasesFunction(data);
                setLoading(false);
                showToast("error", "Erro!", "Digite algum valor para pesquisar.");
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

    /**
     * Função para pegar os dados da doença selecionada
    **/
    function onUserSelect(e: any) {
        setSelectedDisease(Object.assign({}, e.data));

        let diseaseData: any = e.data;

        setCodDoenca(diseaseData.CodDoenca);
        setNome(diseaseData.Nome);

        setDisplayDialogs(true);
    };

    /**
     * Função para sobrescrever os dados de uma doença
    **/
    function overwrite() {
        setCodDoenca(updatedCodDoenca);
        setNome(updatedNome);
    }

    /**
     * Função para atualizar os dados de uma doença
    **/
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        try {
            const data = { codDoenca, nome };
            const schema = Yup.object().shape({
                up: Yup.string().required(),
                codDoenca: Yup.string().required(),
                nome: Yup.string().required()
            })

            await schema.validate(data, { abortEarly: false });

            diseasesService.updateDisease(codDoenca, nome).then(response => {
                if (response.updatedDisease) {
                    showToast("success", "Atualização!", "Doença atualizada com sucesso.");
                    setUpdateDiseaseDialog(false);
                    getDiseasesFunction();
                }
                else showToast("error", "Erro!", String(response.error));
            });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError) {
                showToast("error", "Erro!", "Verifique se todos os campos foram preenchidos corretamente!");
            }
            else {
                return;
            }
        }
    }

    /**
     * Função para deletar uma doença
    **/
    async function deleteDisease() {
        await diseasesService.deleteDisease(codDoenca).then(response => {
            if (response.deletedDisease) {
                showToast("success", "Atualização!", "Doença excluída com sucesso.");
                setDeleteDiseaseDialog(false);
                getDiseasesFunction();
            }
            else {
                console.log(response.error);

                if (response.error.code) {
                    showToast("error", "Erro!", `${String(response.error.code)} ${String(response.error.sqlMessage)}`);
                }
                else {
                    showToast("error", "Erro!", String(response.error));
                }
            }
        });
    }

    return (
        <>
            <div className="row m-5 px-5">

                {/* Botão de cadastrar doenças */}
                <Link to={location => ({ ...location, pathname: '/registrations/diseases/create' })}>
                    <Button
                        variant="outline-dark"
                        className="mr-2 mb-2"
                        style={{ borderRadius: "0", height: "41.5px" }}
                    >
                        Cadastrar Doença
                    </Button>
                </Link>

                {/* Botão de buscar doenças */}
                <Button
                    className="mr-2 mb-2"
                    variant="outline-secondary"
                    onClick={() => setOpen(!open)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                    style={{ borderRadius: "0", height: "41.5px" }}
                >
                    Buscar doença específica
                </Button>

                {/* Filtros de pesquisa */}
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
                                    style={{ minWidth: "4em", borderRadius: "0", height: "41.5px" }}
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
                                                { name: "Código", cod: "C" },
                                                { name: "Nome", cod: "N" },
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
                                            style={{ borderRadius: "0" }}
                                            onClick={() => {
                                                setSearchInput('');
                                                getDiseasesFunction();
                                                setMode('N');
                                                setOptionState(null)
                                            }}
                                        >
                                            <AiOutlineClose size={18} />
                                        </Button>
                                        <Button
                                            onClick={handleSearch}
                                            style={{ borderRadius: "0" }}
                                            className="d-inline-flex justify-content-center align-items-center"
                                        >
                                            <FiSearch size={18} />
                                        </Button>
                                    </>
                            }
                        </div>
                    </div>
                </Collapse>

                {/* Tabela de doeças */}
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
                    lazy={true}
                    selectionMode="single"
                    selection={selectedRow}
                    onSelectionChange={(e) => setSelectedRow(e.value)}
                    onRowSelect={(e) => onUserSelect(e)}
                >
                    <Column field="CodDoenca" header="Código" style={{ width: "8%", textAlign: "center" }} />
                    <Column field="Nome" header="Nome" style={{ width: "20%", textAlign: "center" }} />
                </DataTable>
            </div>

            {/* Dialog para mostrar as opções da tabela (displayDialogs) */}
            <Dialog
                visible={displayDialogs}
                style={{ width: "50%" }}
                header="Ações"
                modal={true}
                onHide={() => setDisplayDialogs(false)}
            >
                <div className="form-row">

                    {/* Botão de vizualizar doenças */}
                    <div className="col">
                        <Button
                            variant="info"
                            className="mt-2 mb-2 p-3"
                            style={{ width: "100%" }}
                            onClick={() => {
                                setVizualizeDiseaseDialog(true);
                                setDisplayDialogs(false);
                            }}
                        >
                            Visualizar doença
                        </Button>
                    </div>

                    {/* Botão de atualizar doenças */}
                    <div className="col ml-2">
                        <Button
                            variant="primary"
                            className="mt-2 mb-2 p-3"
                            style={{ width: "100%" }}
                            onClick={() => {
                                overwrite();
                                setUpdateDiseaseDialog(true);
                                setDisplayDialogs(false)
                            }}
                        >
                            Atualizar doença
                        </Button>
                    </div>

                    {/* Botão de excluir doenças */}
                    <div className="col ml-2">
                        <Button
                            variant="danger"
                            className="mt-2 mb-2 p-3"
                            style={{ width: "100%" }}
                            onClick={() => {
                                setDeleteDiseaseDialog(true);
                                setDisplayDialogs(false)
                            }}
                        >
                            Excluir doença
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Popup para visualizar doença */}
            <Dialog
                visible={vizualizeDiseaseDialog}
                style={{ width: "50%" }}
                modal={true}
                onHide={() => setVizualizeDiseaseDialog(false)}
                maximizable
            >
                <p className="text-dark h5 mt-2">Código: {codDoenca}</p>
                <p className="text-dark h5 mt-2">Nome: {nome}</p>
            </Dialog>

            {/* Popup para atualizar doença */}
            <Dialog
                visible={updateDiseaseDialog}
                style={{ width: "70%" }}
                modal={true}
                onHide={() => setUpdateDiseaseDialog(false)}
                maximizable maximized
            >
                <p className="text-dark h3 text-center">Atualização dos dados da doença {nome}</p>

                <form className="was-validated" onSubmit={handleSubmit}>
                    <div className="mt-4 mb-2">
                        <span className="p-float-label">
                            <InputText
                                id="codeUpdate"
                                style={{ width: "100%" }}
                                value={codDoenca}
                                onChange={(e) => setUpdatedCodDoenca((e.target as HTMLInputElement).value)}
                            />
                            <label htmlFor="NomeUpdate">Código da doença</label>
                        </span>
                    </div>

                    <div className="mt-4 mb-2">
                        <span className="p-float-label">
                            <InputText
                                id="nameUpdate"
                                style={{ width: "100%" }}
                                value={nome}
                                onChange={(e) => setUpdatedNome((e.target as HTMLInputElement).value)}
                            />
                            <label htmlFor="NomeUpdate">Nome da doença</label>
                        </span>
                    </div>

                    <button type="submit" className="btn btn-info btn-primary mt-3">Atualizar</button>
                </form>
            </Dialog>

            {/* Popup para deletar uma doença */}
            <Dialog
                visible={deleteDiseaseDialog}
                style={{ width: "50%" }}
                modal={true}
                header="Exclusão de doença"
                onHide={() => setDeleteDiseaseDialog(false)}
            >
                <p className="text-dark h5 mt-2">Deseja exluir a doença {nome} de código {codDoenca}?</p>

                <div className="row">
                    <div className="col">
                        <Button variant="outline-danger" onClick={() => deleteDisease()} style={{ width: "100%" }}>Sim</Button>
                    </div>
                    <div className="col">
                        <Button variant="outline-info" onClick={() => setDeleteDiseaseDialog(false)} style={{ width: "100%" }}>Não</Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default Diseases;