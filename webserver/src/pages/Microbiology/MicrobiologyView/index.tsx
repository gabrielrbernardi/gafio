import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import api from "../../../services/api";

import Loading from "../../../components/Loading";
import ToastComponent from "../../../components/Toast";

interface IMicrobiology {
    IdMicrobiologia: number;
    IdPaciente: number;
    IdProntuario: number;
    DataColeta: string;
    DataResultado: string;
    SwabNasal: string;
    SwabNasalObservacoes: string;
    SwabRetal: string;
    SwabRetalObservacoes: string;
    Sangue: string;
    SangueObservacoes: string;
    Urina: string;
    UrinaObservacoes: string;
    SecrecaoTraqueal: string;
    SecrecaoTraquealObservacoes: string;
    Outros: string;
    OutrosObservacoes: string;
    PerfilSensibilidade: string;
    NomePaciente: string;
    NroPaciente: number;
    NroProntuario: number;
}

interface Props {
    id: number;
    view: boolean;
    setView: any;
}

const MicrobiologyView: React.FC<Props> = ({ view, id, setView }) => {
    const [IdMicrobiologia, setIdMicrobiologia] = useState<number>(0);
    const [NroPaciente, setNroPaciente] = useState<number>(0);
    const [NroProntuario, setNroProntuario] = useState<number>(0);
    const [IdPaciente, setIdPaciente] = useState<number>(0);
    const [IdProntuario, setIdProntuario] = useState<number>(0);
    const [DataColeta, setDataColeta] = useState<string>("");
    const [NomePaciente, setNomePaciente] = useState<string>("");
    const [DataResultado, setDataResultado] = useState<string>("");
    const [SwabNasalObservacoes, setSwabNasalObservacoes] = useState<string>(
        ""
    );
    const [SwabRetalObservacoes, setSwabRetalObservacoes] = useState<string>(
        ""
    );
    const [SangueObservacoes, setSangueObservacoes] = useState<string>("");
    const [UrinaObservacoes, setUrinaObservacoes] = useState<string>("");
    const [
        SecrecaoTraquealObservacoes,
        setSecrecaoTraquealObservacoes,
    ] = useState<string>();
    const [OutrosObservacoes, setOutrosObservacoes] = useState<string>("");
    const [PerfilSensibilidade, setPerfilSensibilidade] = useState<string>("");

    const [toast, setToast] = useState<boolean>(false);
    const [getMessageType, setMessageType] = useState<string>("");
    const [getMessageTitle, setMessageTitle] = useState<string>("");
    const [getMessageContent, setMessageContent] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadMicrobiology() {
            try {
                const response = await api.get<IMicrobiology[]>(
                    `/microbiology/view/${id}`
                );
                const [microbiologyData] = response.data;
                setIdMicrobiologia(microbiologyData.IdMicrobiologia);
                setNroPaciente(microbiologyData.NroPaciente);
                setNroProntuario(microbiologyData.NroProntuario);
                setIdPaciente(microbiologyData.IdPaciente);
                setIdProntuario(microbiologyData.IdProntuario);
                setDataColeta( microbiologyData.DataColeta);
                setDataResultado(microbiologyData.DataResultado);
                setNomePaciente(microbiologyData.NomePaciente);
                setSwabNasalObservacoes(microbiologyData.SwabNasalObservacoes);
                setSwabRetalObservacoes(microbiologyData.SwabRetalObservacoes);
                setSangueObservacoes(microbiologyData.SangueObservacoes);
                setUrinaObservacoes(microbiologyData.UrinaObservacoes);
                setSecrecaoTraquealObservacoes(
                    microbiologyData.SecrecaoTraquealObservacoes
                );
                setOutrosObservacoes(microbiologyData.OutrosObservacoes);
                setPerfilSensibilidade(microbiologyData.PerfilSensibilidade);

                setLoading(false);
            } catch (error) {
                setLoading(false);
                HandleToast("error", "Erro!", "Falha ao carregar os dados.");
            }
        }
        loadMicrobiology();
    }, [id]);

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
            <Dialog
                visible={view}
                style={{ width: "50%" }}
                modal={true}
                onHide={setView}
                maximizable
            >
                <p className="text-dark h3 text-center mr-5 mb-2">
                    Microbiologia de número {IdMicrobiologia}.
                </p>

                <p className="text-dark h5 mt-5">
                    Dados do paciente:
                    <br />
                    Nome: {NomePaciente}.
                    <br />
                    Sequência: {IdPaciente}.
                    <br />
                    Número: {NroPaciente}.
                </p>

                <p className="text-dark h5 mt-5">
                    Dados do prontuário:
                    <br />
                    Sequência: {IdProntuario}.
                    <br />
                    Número: {NroProntuario}.
                </p>

                <p className="text-dark h5 mt-5">
                    Data da coleta: {DataColeta}.
                </p>
                <p className="text-dark h5 mt-3 mb-2">
                    Data do resultado: {DataResultado}.
                </p>

                {SwabNasalObservacoes && (
                    <p className="text-dark h5 text-left mt-5">
                        Observações sobre a swab nasal:
                        <br />
                        {SwabNasalObservacoes}
                    </p>
                )}

                {SwabRetalObservacoes && (
                    <p className="text-dark h5 text-left mt-5">
                        Observações sobre a swab retal:
                        <br />
                        {SwabRetalObservacoes}
                    </p>
                )}

                {SangueObservacoes && (
                    <p className="text-dark h5 text-left mt-5">
                        Observações sobre o sangue:
                        <br />
                        {SangueObservacoes}
                    </p>
                )}

                {UrinaObservacoes && (
                    <p className="text-dark h5 text-left mt-5">
                        Observações sobre a urina: <br />
                        {UrinaObservacoes}
                    </p>
                )}

                {SecrecaoTraquealObservacoes && (
                    <p className="text-dark h5 text-left mt-5">
                        Observações sobre a secreção traqueal:
                        <br />
                        {SecrecaoTraquealObservacoes}
                    </p>
                )}

                {OutrosObservacoes && (
                    <p className="text-dark h5 text-left mt-5">
                        Outras observações:
                        <br />
                        {OutrosObservacoes}
                    </p>
                )}

                <p className="text-dark h5 mt-5">
                    Perfil de sensibilidade:
                    <br />
                    {PerfilSensibilidade}
                </p>
            </Dialog>
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
export default MicrobiologyView;
