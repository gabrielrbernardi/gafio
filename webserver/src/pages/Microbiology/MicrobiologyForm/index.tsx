import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

import Loading from "../../../components/Loading";
import ToastComponent from "../../../components/Toast";
import Select from "./Select";
 
import api from "../../../services/api";

type Props = {
    id?: string;
};

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

const MicrobiologyForm = ({ match }: RouteComponentProps<Props>) => {
    const [title, setTitle] = useState<string>("Cadastro de microbiologia");
    const [microbiology, setMicrobiology] = useState<IMicrobiology[]>([]);

    const [toast, setToast] = useState<boolean>(false);
    const [getMessageType, setMessageType] = useState<string>("");
    const [getMessageTitle, setMessageTitle] = useState<string>("");
    const [getMessageContent, setMessageContent] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);

    const { id } = match.params;

    useEffect(() => {
        async function loadMicrobiologyInfo() {
            try {
                const response = await api.get<IMicrobiology[]>(
                    `/microbiology/${id}`
                );
                const { data } = response;
                setMicrobiology(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                HandleToast("error", "Erro!", "Falha ao carregar os dados.");
            }
        }
        if (id) {
            setLoading(true);
            setTitle("Edição de microbiologia");
            loadMicrobiologyInfo();
        }
    }, [id]);

    function handleSubmit() {}

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

    return (
        <>
            <div className="row m-5">
                <div className="card shadow-lg p-3 col-sm-6 offset-md-3 border">
                    <p className="text-dark h3 text-center">{title}</p>
                    <form className="was-validated" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="form-row mt-4">
                                <div className="col mr-4">
                                    <label htmlFor="IdPaciente">
                                        Número do Paciente
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="IdPaciente"
                                        name="IdPaciente"
                                        placeholder="Digite o número do paciente"
                                        min="1"
                                        max="999999999"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="col">
                                    <label htmlFor="IdProntuario">
                                        Número do Prontuário
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="IdProntuario"
                                        name="IdProntuario"
                                        placeholder="Digite o número do prontuário"
                                        min="1"
                                        max="999999999"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="form-row mt-4">
                                <div className="col mr-4">
                                    <label
                                        htmlFor="DataColeta"
                                        className="mt-2"
                                    >
                                        Data da Coleta
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="DataColeta"
                                        name="DataColeta"
                                        required
                                    />
                                </div>

                                <div className="col">
                                    <label
                                        htmlFor="DataResultado"
                                        className="mt-2"
                                    >
                                        Data do resultado
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="DataResultado"
                                        name="DataResultado"
                                        required
                                    />
                                </div>
                            </div>

                            <Select
                                label="Swab Nasal"
                                htmlFor="SwabNasal"
                                name="SwabNasalObservacoes"
                            />
                            <Select
                                label="Swab Retal"
                                htmlFor="SwabRetal"
                                name="SwabRetalObservacoes"
                            />
                            <Select
                                label="Sangue"
                                htmlFor="Sangue"
                                name="SangueObservacoes"
                            />
                            <Select
                                label="Urina"
                                htmlFor="Urina"
                                name="UrinaObservacoes"
                            />
                            <Select
                                label="Secreção Traqueal"
                                htmlFor="SecrecaoTraqueal"
                                name="SecrecaoTraquealObservacoes"
                            />
                            <Select
                                label="Outros"
                                htmlFor="Outros"
                                name="OutrosObservacoes"
                            />

                            <label
                                htmlFor="PerfilSensibilidade"
                                className="mt-4"
                            >
                                Perfil Sensibilidade
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="PerfilSensibilidade"
                                name="PerfilSensibilidade"
                                placeholder="perfil"
                                autoFocus
                                required
                            />
                        </div>
                    </form>
                </div>
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

export default MicrobiologyForm;
