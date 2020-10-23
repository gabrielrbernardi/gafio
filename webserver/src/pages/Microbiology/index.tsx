import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Button from "react-bootstrap/Button";
import ToastComponent from "../../components/Toast";
import Loading from "../../components/Loading";

import api from "../../services/api";

interface IMicrobiology {
    IdMicrobiologia: number;
    IdPaciente: number;
    IdProntuario: number;
    DataColeta: string;
    DataResultado: string;
    SwabNasal: any;
    SwabNasalObservacoes?: string;
    SwabRetal: any;
    SwabRetalObservacoes?: string;
    Sangue: any;
    SangueObservacoes?: string;
    Urina: any;
    UrinaObservacoes?: string;
    SecrecaoTraqueal: any;
    SecrecaoTraquealObservacoes?: string;
    Outros: any;
    OutrosObservacoes?: string;
    PerfilSensibilidade: string;
}

const Microbiology = () => {
    const [microbiologies, setMicrobiologies] = useState<IMicrobiology[]>([]);
    const [records, setRecords] = useState<number>(0);
    const [first, setFirst] = useState<number>(0);

    const [toast, setToast] = useState<boolean>(false);
    const [getMessageType, setMessageType] = useState<string>("");
    const [getMessageTitle, setMessageTitle] = useState<string>("");
    const [getMessageContent, setMessageContent] = useState<string>("");

    const [tableloading, setTableLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);

    const rows = 10;

    useEffect(() => {
        //carrega a quantidade total de registros para a paginação da tabela
        async function loadRecords() {
            try {
                const response = await api.get("microbiology/data/length/");
                const { count } = response.data;
                const records = Number(count);
                setRecords(records);
            } catch (error) {
                HandleToast(
                    "error",
                    "Erro!",
                    "Falha ao carregar os registros."
                );
            }
        }

        //carrega os dados da tabela
        async function loadMicrobiologies() {
            try {
                const response = await api.get<IMicrobiology[]>(
                    "/microbiology"
                );
                const { data } = response;
                setMicrobiologies(data);
                setLoading(false);
                setTableLoading(false);
            } catch (error) {
                setLoading(false);
                setTableLoading(false);
                HandleToast(
                    "error",
                    "Erro!",
                    "Falha ao carregar os registros."
                );
            }
        }

        loadRecords();
        loadMicrobiologies();
    }, []);

    async function handlePage(event: any) {
        try {
            setTableLoading(true);
            const index = event.first;
            const page = Number(index) / 10 + 1;
            const response = await api.get("microbiology", {
                params: { page },
            });
            const { data } = response;
            setMicrobiologies(data);
            setFirst(index);
            setTableLoading(false);
        } catch (error) {
            setTableLoading(false);
            HandleToast("error", "Erro!", "Falha ao carregar os registros.");
        }
    }

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
        setTimeout(() => {
            setToast(false);
        }, 4500);
    }

    const header = (
        <>
            <p style={{ textAlign: "left" }} className="p-clearfix d-inline">
                Microbiologia
            </p>
        </>
    );

    return (
        <>
            <div className="row m-5 px-5">
                <Button
                    variant="outline-dark"
                    className="mb-2"
                    style={{ borderRadius: "0", height: "41.5px" }}
                >
                    Cadastrar Microbiologia
                </Button>
                <Button
                    variant="outline-secondary"
                    className="mb-2 ml-2"
                    aria-controls="example-collapse-text"
                    style={{ borderRadius: "0" }}
                >
                    Buscar por microbiologia
                </Button>

                <DataTable
                    value={microbiologies}
                    loading={tableloading}
                    paginator={true}
                    rows={rows}
                    totalRecords={records}
                    first={first}
                    onPage={handlePage}
                    header={header}
                    emptyMessage="Nenhum resultado encontrado"
                    lazy={true}
                    selectionMode="single"
                    className="p-datatable-responsive-demo"
                    resizableColumns={true}
                >
                    <Column
                        field="IdMicrobiologia"
                        header="Id"
                        style={{ width: "6%", textAlign: "center" }}
                    />
                    <Column
                        field="IdPaciente"
                        header="Paciente"
                        style={{ width: "8%", textAlign: "center" }}
                    />
                    <Column
                        field="IdProntuario"
                        header="Prontuário"
                        style={{ width: "8%", textAlign: "center" }}
                    />
                    <Column
                        field="DataColeta"
                        header="Coleta"
                        style={{ width: "10%", textAlign: "center" }}
                    />
                    <Column
                        field="DataResultado"
                        header="Resultado"
                        style={{ width: "10%", textAlign: "center" }}
                    />
                    <Column
                        field="SwabNasal"
                        header="Swab nasal"
                        style={{ width: "7%", textAlign: "center" }}
                    />
                    <Column
                        field="SwabRetal"
                        header="Swab retal"
                        style={{ width: "7%", textAlign: "center" }}
                    />
                    <Column
                        field="Sangue"
                        header="Sangue"
                        style={{ width: "6%", textAlign: "center" }}
                    />
                    <Column
                        field="Urina"
                        header="Urina"
                        style={{ width: "6%", textAlign: "center" }}
                    />
                    <Column
                        field="SecrecaoTraqueal"
                        header="Secreção Traqueal"
                        style={{ width: "8%", textAlign: "center" }}
                    />
                    <Column
                        field="Outros"
                        header="Outros"
                        style={{ width: "6%", textAlign: "center" }}
                    />
                    <Column
                        field="PerfilSensibilidade"
                        header="Perfil"
                        style={{ width: "12%", textAlign: "center" }}
                    />
                </DataTable>
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
