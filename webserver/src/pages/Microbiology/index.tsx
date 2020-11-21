import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import Collapse from "react-bootstrap/Collapse";
import { FiSearch } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Button from "react-bootstrap/Button";
import ToastComponent from "../../components/Toast";
import Loading from "../../components/Loading";
import { Dialog } from "primereact/dialog";
import View from "./MicrobiologyView";
import Form from "./MicrobiologyForm";
import {IMicrobiology } from "./MicrobiologyModel";

import "./index.css";

import MicrobiologyService from "./MicrobiologyService"

const Microbiology = () => {
    const [microbiologies, setMicrobiologies] = useState<IMicrobiology[]>([]);
    const [records, setRecords] = useState<number>(0);
    const [first, setFirst] = useState<number>(0);
    const [id, setId] = useState<number>(0);
    const [view, setView] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [displayDialog, setDisplayDialog] = useState<boolean>(false);
    const [selectedMicrobiology, setselectedMicrobiology] = useState<any>(null);
    const [toast, setToast] = useState<boolean>(false);
    const [getMessageType, setMessageType] = useState<string>("");
    const [getMessageTitle, setMessageTitle] = useState<string>("");
    const [getMessageContent, setMessageContent] = useState<string>("");
    const [tableloading, setTableLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState<boolean>(false);
    const [optionState, setOptionState] = useState<any>(null);
    const [filter, setFilter] = useState<string>("");
    const [filterValue, setFilterValue] = useState<any>("");
    const [successfulSearch, setSuccessfulSearch] = useState<boolean>(false);

    const rows = 10;

    const dropdownOptions = [
        { name: "Id", filter: "id" },
        { name: "Paciente", filter: "paciente" },
        { name: "Prontuário", filter: "prontuario" },
        { name: "Data da coleta", filter: "dataColeta" },
        { name: "Data do Resultado", filter: "dataResultado" },
    ];

    useEffect(() => {
        //carrega os dados da tabela e a quantidade total de registros
       function loadMicrobiologies() {
           MicrobiologyService.getMicrobiologies({ page: 1 })
               .then(data => {
                   const { results } = data;
                   const { count } = data.count;
                   const microbiologiesData = results.map(handleFormat);
                   setRecords(Number(count));
                   setMicrobiologies(microbiologiesData);
                   setLoading(false);
                   setTableLoading(false);
               })
               .catch(error => {
                   setLoading(false);
                   setTableLoading(false);
                   HandleToast("error", "Erro!", "Falha ao carregar os registros.");
               });
        }

        loadMicrobiologies();
    }, []);


    function handleFormat(microbiology: IMicrobiology) {  
        const verifica = (item: string) => {
            if (item === "S") return "Sim";
            else return "Não";
        }

        let SwabNasal, SwabRetal, Sangue, Urina, SecrecaoTraqueal, Outros;
        SwabNasal = verifica(microbiology.SwabNasal);
        SwabRetal = verifica(microbiology.SwabRetal);
        Sangue = verifica(microbiology.Sangue);
        Urina = verifica(microbiology.Urina);
        SecrecaoTraqueal = verifica(microbiology.SecrecaoTraqueal);
        Outros = verifica(microbiology.Outros);

        return {
            ...microbiology,
            SwabNasal,
            SwabRetal,
            Sangue,
            Urina,
            SecrecaoTraqueal,
            Outros
        }
    }

    // Toast
    function HandleToast(
        messageType: string,
        messageTitle: string,
        messageContent: string
    ) {
        setToast(false);
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() =>  setToast(false), 4500);
    }

    //Busca os registros por página
    function handlePage(event: any) {
         setTableLoading(true);
            const index = event.first;
            const page = Number(index) / 10 + 1;
            let response;
            if (filter && successfulSearch) {
                MicrobiologyService.getMicrobiologies({ page, filter, filterValue }).then(data => {
                    response = data;
                    const { results } = response;
                    const microbiologiesData = results.map(handleFormat);
                    setMicrobiologies(microbiologiesData);
                    setFirst(index);
                    setTableLoading(false);
                }).catch(err => setTableLoading(false));
            } else {
                MicrobiologyService.getMicrobiologies({page}).then(data => {
                    response = data;
                    const { results } = response;
                    const microbiologiesData = results.map(handleFormat);
                    setMicrobiologies(microbiologiesData);
                    setFirst(index);
                    setTableLoading(false);
                }).catch(err => setTableLoading(false));
            } 
    }

    function onMicrobiologySelect(e: any) {
        const microbiologyData = e.data;
        const { IdMicrobiologia } = microbiologyData;
        setId(IdMicrobiologia);
        setDisplayDialog(true);
    }

    //Atualiza os dados da tabela
    function handleTableUpdate() {
        setTableLoading(true);
        MicrobiologyService.getMicrobiologies({ page: 1 })
            .then(data => {
                const { results } = data;
                const { count } = data.count;
                setRecords(Number(count));
                const microbiologiesData = results.map(handleFormat);
                setMicrobiologies(microbiologiesData);
                setTableLoading(false);
            })
            .catch(error => {
                setTableLoading(false);
                HandleToast("error", "Erro!", "Falha ao atualizar os registros.");
            });
    }

    //Deleta microbiologia
    function handleDelete() {
        MicrobiologyService.delete(id)
            .then(() => {
                setDeleteDialog(false);
                HandleToast("success", "Sucesso!", "A microbiologia foi excluída.");
                handleTableUpdate();
            })
            .catch(error => {
                setDeleteDialog(false);
                HandleToast("error", "Erro!", "Falha ao excluir a microbiologia.");
            });
    }

    function handleUpdate() {
        setUpdate(false);
        handleTableUpdate();
    }

    //Para filtragem
    function handleSearch() {
        if (!optionState) {
            HandleToast("error", "Erro!", "Selecione um filtro para buscar.");
            return;
        }
        if (!filterValue) {
            HandleToast("error", "Erro!", "Digite algum valor para pesquisar.");
            return;
        }
        setLoading(true);
        setTableLoading(true);
        MicrobiologyService.getMicrobiologies({ page: 1, filter, filterValue })
            .then(data => {
                const { results } = data;
                const { count } = data.count;
                setRecords(Number(count));
                const microbiologiesData = results.map(handleFormat);
                setMicrobiologies(microbiologiesData);
                setLoading(false);
                setTableLoading(false);
                let res = "resultado";
                if (count > 1) res += "s";
                HandleToast("info", "Resultado Encontrado!", `Foi encontrado ${count} ${res}.`);
                setSuccessfulSearch(true);
            })
            .catch(err => {
                setLoading(false);
                setTableLoading(false);
                const message = err.response.data.error;
                HandleToast("error", "Sem resultado!", `${message}`);
            });
    }

    function handleReset() {
        setFilterValue("");
        setOptionState(null);
        setSuccessfulSearch(false);
        handleTableUpdate();
    }

    function onOptionChange(e: { value: any }) {
        setOptionState(e.value);
        setFilter(e.value.filter);
    }

    // Para as colunas da tabela
    const IdBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Id</span>
                <span>{rowData.IdMicrobiologia}</span>
            </React.Fragment>
        );
    };

    const PacienteBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Paciente</span>
                <span>{rowData.IdPaciente}</span>
            </React.Fragment>
        );
    };

    const ProntuarioBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Prontuário</span>
                <span>{rowData.IdProntuario}</span>
            </React.Fragment>
        );
    };

    const DataColetaBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Coleta</span>
                <span>{rowData.DataColeta}</span>
            </React.Fragment>
        );
    };

    const DataResultadoBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Resultado</span>
                <span>{rowData.DataResultado}</span>
            </React.Fragment>
        );
    };

    const SwabNasalBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Swab Nasal</span>
                <span>{rowData.SwabNasal}</span>
            </React.Fragment>
        );
    };

    const SwabRetalBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Swab Retal</span>
                <span>{rowData.SwabRetal}</span>
            </React.Fragment>
        );
    };

    const SangueBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Sangue</span>
                <span>{rowData.Sangue}</span>
            </React.Fragment>
        );
    };

    const UrinaBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Urina</span>
                <span>{rowData.Urina}</span>
            </React.Fragment>
        );
    };

    const SecrecaoTraquealBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Secrecao Traqueal</span>
                <span>{rowData.SecrecaoTraqueal}</span>
            </React.Fragment>
        );
    };

    const OutrosBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Outros</span>
                <span>{rowData.Outros}</span>
            </React.Fragment>
        );
    };

    return (
        <>
            <div className="row m-5 px-5">
                <Link to="/microbiology/create">
                    <Button
                        variant="outline-dark"
                        className="mb-2"
                        style={{ borderRadius: "0", height: "41.5px" }}
                    >
                        Cadastrar Microbiologia
                    </Button>
                </Link>
                <Button
                    variant="outline-secondary"
                    className="mb-2 ml-2"
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                    style={{ borderRadius: "0" }}
                >
                    Buscar por microbiologia
                </Button>

                <Collapse in={open} timeout={200}>
                    <div className="ml-2">
                        <div className="p-inputgroup">
                            <span className="p-float-label">
                                <InputText
                                    id="float-input"
                                    type="search"
                                    value={filterValue}
                                    onChange={(e) => {  setFilterValue( (e.target as HTMLInputElement).value);
                                        if ((e.target as HTMLInputElement).value === "" &&  successfulSearch ) handleReset();
                                    }}
                                    onKeyPress={(ev) => {
                                        if (ev.key === "Enter") {
                                            handleSearch();
                                            ev.preventDefault();
                                        }
                                    }}
                                    style={{minWidth: "4em",borderRadius: "0", }}
                                    size={30}
                                />
                                {optionState === null ? (
                                    <label htmlFor="float-input">Buscar</label>
                                ) : (
                                    <label htmlFor="float-input">
                                        Buscar por {optionState.name}
                                    </label>
                                )}
                            </span>
                            {filterValue && (
                                <>
                                    <Dropdown
                                        className="mx-1"
                                        value={optionState}
                                        options={dropdownOptions}
                                        onChange={onOptionChange}
                                        placeholder="Selecione um filtro"
                                        optionLabel="name"
                                        style={{ width: "12em" }}
                                    />
                                    <Button
                                        tabIndex={2}
                                        variant="outline-danger"
                                        className="p-0 mr-1"
                                        style={{ width: "17px", borderRadius: "0", }}
                                        onClick={() =>  handleReset()}
                                    >
                                        <AiOutlineClose size={15} />
                                    </Button>
                                    <Button
                                        onClick={handleSearch}
                                        style={{ borderRadius: "0", }}
                                    >
                                        <FiSearch size={15} />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Collapse>
                <div className="datatable-responsive-demo">
                    <DataTable
                        value={microbiologies}
                        loading={tableloading}
                        paginator={true}
                        rows={rows}
                        totalRecords={records}
                        first={first}
                        onPage={handlePage}
                        header="Microbiologias"
                        emptyMessage="Nenhum resultado encontrado"
                        lazy={true}
                        selectionMode="single"
                        className="p-datatable-responsive-demo"
                        resizableColumns={true}
                        selection={selectedMicrobiology}
                        onSelectionChange={(e) => setselectedMicrobiology(e.value) }
                        onRowSelect={(e) => onMicrobiologySelect(e)}
                    >
                        <Column
                            field="IdMicrobiologia"
                            header="Id"
                            body={IdBodyTemplate}
                        />
                        <Column
                            field="IdPaciente"
                            header="Paciente"
                            body={PacienteBodyTemplate}
                        />
                        <Column
                            field="IdProntuario"
                            header="Prontuário"
                            body={ProntuarioBodyTemplate}
                        />
                        <Column
                            field="DataColeta"
                            header="Coleta"
                            body={DataColetaBodyTemplate}
                        />
                        <Column
                            field="DataResultado"
                            header="Resultado"
                            body={DataResultadoBodyTemplate}
                        />
                        <Column
                            field="SwabNasal"
                            header="Swab Nasal"
                            body={SwabNasalBodyTemplate}
                        />
                        <Column
                            field="SwabRetal"
                            header="Swab Retal"
                            body={SwabRetalBodyTemplate}
                        />
                        <Column
                            field="Sangue"
                            header="Sangue"
                            body={SangueBodyTemplate}
                        />
                        <Column
                            field="Urina"
                            header="Urina"
                            body={UrinaBodyTemplate}
                        />
                        <Column
                            field="SecrecaoTraqueal"
                            header="Secreção Traqueal"
                            body={SecrecaoTraquealBodyTemplate}
                        />
                        <Column
                            field="Outros"
                            header="Outros"
                            body={OutrosBodyTemplate}
                        />
                    </DataTable>
                </div>

                <Dialog
                    visible={displayDialog}
                    style={{ width: "55%" }}
                    header="Ações"
                    modal={true}
                    onHide={() => setDisplayDialog(false)}
                >
                    <div className="form-row text-center">
                        <div className="col">
                            <Button
                                variant="info"
                                className="mt-2 mb-2 p-3"
                                onClick={() => {
                                    setDisplayDialog(false);
                                    setView(true);
                                }}
                            >
                                Visualizar microbiologia
                            </Button>
                        </div>
                        <div className="col">
                            <Button
                                variant="primary"
                                className="mt-2 mb-2 p-3"
                                onClick={() => {
                                    setDisplayDialog(false);
                                    setUpdate(true);
                                }}
                            >
                                Atualizar microbiologia
                            </Button>
                        </div>

                        <div className="col">
                            <Button
                                variant="danger"
                                className="mt-2 mb-2 p-3"
                                onClick={() => {
                                    setDisplayDialog(false);
                                    setDeleteDialog(true);
                                }}
                            >
                                Excluir microbiologia
                            </Button>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    visible={deleteDialog}
                    style={{ width: "50%" }}
                    modal={true}
                    header="Exclusão de microbiologia"
                    onHide={() => setDeleteDialog(false)}
                >
                    <p className="text-dark h5 mt-2">
                        Deseja realmente exluir esta microbiologia?
                    </p>
                    <div className="row">
                        <div className="col">
                            <Button
                                variant="outline-danger"
                                onClick={() => handleDelete()}
                                style={{ width: "100%" }}
                            >
                                Sim
                            </Button>
                        </div>
                        <div className="col">
                            <Button
                                variant="outline-info"
                                onClick={() => setDeleteDialog(false)}
                                style={{ width: "100%" }}
                            >
                                Não
                            </Button>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    visible={update}
                    style={{ width: "80%" }}
                    modal={true}
                    maximizable
                    maximized
                    onHide={() => handleUpdate()}
                >
                    <Form id={id} />
                </Dialog>

                {view && (
                    <View view={view} id={id} setView={() => setView(false)} />
                )}
            </div>
            {toast && (
                <ToastComponent
                    messageType={getMessageType}
                    messageTitle={getMessageTitle}
                    messageContent={getMessageContent}
                />
            )}
            {loading && <Loading />}
        </>
    );
};

export default Microbiology;
