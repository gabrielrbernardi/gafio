import React, { useState, useEffect, FormEvent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Button from "react-bootstrap/Button";
import { AiOutlineClose } from "react-icons/ai";
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

    useEffect(() => {
        async function loadMicrobiologies() {
            const response = await api.get<IMicrobiology[]>("/microbiology");
            const { data } = response;
            setMicrobiologies(data);
        }
        loadMicrobiologies();
    }, []);

    const header = (
        <>
            <p style={{ textAlign: "left" }} className="p-clearfix d-inline">
                Microbiologia
            </p>
        </>
    );

    return (
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
                paginator={true}
                rows={10}
                header={header}
                emptyMessage="Nenhum resultado encontrado"
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
