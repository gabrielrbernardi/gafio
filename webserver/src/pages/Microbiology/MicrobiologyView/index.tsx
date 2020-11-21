import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import Loading from "../../../components/Loading";
import ToastComponent from "../../../components/Toast";
import MicrobiologyService from "../MicrobiologyService"

import "./index.css";

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
    const [SwabNasalObservacoes, setSwabNasalObservacoes] = useState<string>( "");
    const [SwabRetalObservacoes, setSwabRetalObservacoes] = useState<string>( "" );
    const [SangueObservacoes, setSangueObservacoes] = useState<string>("");
    const [UrinaObservacoes, setUrinaObservacoes] = useState<string>("");
    const [SecrecaoTraquealObservacoes,setSecrecaoTraquealObservacoes] = useState<string>();
    const [OutrosObservacoes, setOutrosObservacoes] = useState<string>("");
    const [PerfilSensibilidade, setPerfilSensibilidade] = useState<string>("");
    const [toast, setToast] = useState<boolean>(false);
    const [getMessageType, setMessageType] = useState<string>("");
    const [getMessageTitle, setMessageTitle] = useState<string>("");
    const [getMessageContent, setMessageContent] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        function loadMicrobiology() {
            MicrobiologyService.view(id)
                .then(data => {
                    const [microbiologyData] = data;
                    setIdMicrobiologia(microbiologyData.IdMicrobiologia);
                    setNroPaciente(microbiologyData.NroPaciente);
                    setNroProntuario(microbiologyData.NroProntuario);
                    setIdPaciente(microbiologyData.IdPaciente);
                    setIdProntuario(microbiologyData.IdProntuario);
                    setDataColeta(microbiologyData.DataColeta);
                    setDataResultado(microbiologyData.DataResultado);
                    setNomePaciente(microbiologyData.NomePaciente);
                    setSwabNasalObservacoes(microbiologyData.SwabNasalObservacoes);
                    setSwabRetalObservacoes(microbiologyData.SwabRetalObservacoes);
                    setSangueObservacoes(microbiologyData.SangueObservacoes);
                    setUrinaObservacoes(microbiologyData.UrinaObservacoes);
                    setSecrecaoTraquealObservacoes(microbiologyData.SecrecaoTraquealObservacoes);
                    setOutrosObservacoes(microbiologyData.OutrosObservacoes);
                    setPerfilSensibilidade(microbiologyData.PerfilSensibilidade);
                    setLoading(false);
                })    
               .catch(error => {
                    setLoading(false);
                    HandleToast("error", "Erro!", "Falha ao carregar os dados.");
                });
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
        setTimeout(() => setToast(false), 4500);
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
                <main>
                    <h2 className="text-dark text-center mb-4">
                        Microbiologia de número {IdMicrobiologia}
                    </h2>
                    <section className="text-dark">
                        <h4>Dados do paciente</h4>
                        <ul>
                            <li> Nome: {NomePaciente}.</li>
                            <li> Sequência: {IdPaciente}.</li>
                            <li> Número: {NroPaciente}.</li>
                        </ul>
                    </section>

                    <section>
                        <h4>Dados do prontuário</h4>
                        <ul>
                            <li>Sequência: {IdProntuario}.</li>
                            <li>Número: {NroProntuario}.</li>
                        </ul>
                    </section>

                    <section>
                            <h4>Datas</h4>
                            <ul>
                                <li>Data da coleta: {DataColeta}.</li>
                                <li>Data do resultado: {DataResultado}.</li>
                            </ul>
                    </section>

                    {SwabNasalObservacoes && (
                        <section>
                                <h4>Observações sobre a swab nasal</h4>
                                <p>{SwabNasalObservacoes}</p>
                        </section>
                    )}

                    {SwabRetalObservacoes && (
                        <section>
                               <h4>Observações sobre a swab retal</h4> 
                                <p>{SwabRetalObservacoes}</p>
                        </section>
                    )}

                    {SangueObservacoes && (
                        <section>
                               <h4>Observações sobre o sangue</h4> 
                                <p>{SangueObservacoes}</p>
                        </section>
                    )}

                    {UrinaObservacoes && (
                        <section>
                                <h4>Observações sobre a urina</h4>
                                <p>{UrinaObservacoes} </p>
                        </section>
                    )}

                    {SecrecaoTraquealObservacoes && (
                        <section>
                               <h4>Observações sobre a secreção traqueal</h4> 
                                <p>{SecrecaoTraquealObservacoes} </p>
                        </section>
                    )}

                    {OutrosObservacoes && (
                        <section>
                                <h4>Outras observações</h4>
                                <p>{OutrosObservacoes}</p>
                        </section> 
                    )}

                    <section>
                           <h4>Perfil de sensibilidade</h4> 
                            <p>{PerfilSensibilidade} </p>
                    </section>
                </main>
                {toast && (
                    <ToastComponent
                        messageType={getMessageType}
                        messageTitle={getMessageTitle}
                        messageContent={getMessageContent}
                    />
                )}
            </Dialog>
            {loading && <Loading />}
        </>
    );
};
export default MicrobiologyView;
