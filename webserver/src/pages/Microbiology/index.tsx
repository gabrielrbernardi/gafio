import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import ToastComponent from "../../components/Toast";

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
                //  toast.error("Falha ao carregar dados");
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
            } catch (error) {
                //  toast.error("Falha ao carregar dados");
            }
        }

        loadRecords();
        loadMicrobiologies();
    }, []);

    async function handlePage(event: any) {
        try {
             const index = event.first;
             const page = Number(index) / 10 + 1;
             const response = await api.get("microbiology", {
                 params: { page },
             });
             const { data } = response;
             setMicrobiologies(data);
             setFirst(index);
        } catch (error) {
         //toast de erro   
         console.log(error)
        }
    }

    const header = (
        <>
            <p style={{ textAlign: "left" }} className="p-clearfix d-inline">
                Microbiologia
            </p>
        </>
    );

    return (
        <div className="row m-5 px-5">
            {first}
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
    );
};

export default Microbiology;
