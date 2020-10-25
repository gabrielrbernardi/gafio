import React, { useState, useEffect, FormEvent } from "react";
import { RouteComponentProps } from "react-router-dom";
import * as Yup from "yup";

import Loading from "../../../components/Loading";
import ToastComponent from "../../../components/Toast";
import Select from "./Select";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";

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
}

const MicrobiologyForm = ({ match }: RouteComponentProps<Props>) => {
    const [title, setTitle] = useState<string>("Cadastro de microbiologia");
    const [buttonLabel, setButtonLabel] = useState<string>("Cadastrar");
    const [toast, setToast] = useState<boolean>(false);
    const [getMessageType, setMessageType] = useState<string>("");
    const [getMessageTitle, setMessageTitle] = useState<string>("");
    const [getMessageContent, setMessageContent] = useState<string>("");

    const [IdPaciente, setIdPaciente] = useState<number>(0);
    const [IdProntuario, setIdProntuario] = useState<number>(0);
    const [DataColeta, setDataColeta] = useState<string>("");
    const [DataResultado, setDataResultado] = useState<string>("");
    const [SwabNasal, setSwabNasal] = useState<string>("");
    const [SwabNasalObservacoes, setSwabNasalObservacoes] = useState<string>(
        ""
    );
    const [SwabRetal, setSwabRetal] = useState<string>("");
    const [SwabRetalObservacoes, setSwabRetalObservacoes] = useState<string>(
        ""
    );
    const [Sangue, setSangue] = useState<string>("");
    const [SangueObservacoes, setSangueObservacoes] = useState<string>("");
    const [Urina, setUrina] = useState<string>("");
    const [UrinaObservacoes, setUrinaObservacoes] = useState<string>("");
    const [SecrecaoTraqueal, setSecrecaoTraqueal] = useState<string>("");
    const [
        SecrecaoTraquealObservacoes,
        setSecrecaoTraquealObservacoes,
    ] = useState<string>();
    const [Outros, setOutros] = useState<string>("");
    const [OutrosObservacoes, setOutrosObservacoes] = useState<string>("");
    const [PerfilSensibilidade, setPerfilSensibilidade] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);

    const { id } = match.params;

    useEffect(() => {
        async function loadMicrobiologyInfo() {
            try {
                const response = await api.get<IMicrobiology[]>(
                    `/microbiology/${id}`
                );
                const [microbiology] = response.data;
                setIdPaciente(Number(microbiology.IdPaciente));
                setIdProntuario(microbiology.IdProntuario);
                setDataColeta(microbiology.DataColeta);
                setDataResultado(microbiology.DataResultado);
                setSwabNasal(microbiology.SwabNasal);
                if (microbiology.SwabNasalObservacoes)
                    setSwabNasalObservacoes(microbiology.SwabNasalObservacoes);
                setSwabRetal(microbiology.SwabRetal);
                if (microbiology.SwabRetalObservacoes)
                    setSwabRetalObservacoes(microbiology.SwabRetalObservacoes);
                setSangue(microbiology.Sangue);
               if (microbiology.SangueObservacoes)
                   setSangueObservacoes(microbiology.SangueObservacoes);
                setUrina(microbiology.Urina);
                if (microbiology.UrinaObservacoes)
                    setUrinaObservacoes(microbiology.UrinaObservacoes);
                setSecrecaoTraqueal(microbiology.SecrecaoTraqueal);
                if (microbiology.SecrecaoTraquealObservacoes)
                    setSecrecaoTraquealObservacoes(
                        microbiology.SecrecaoTraquealObservacoes
                    );
                setOutros(microbiology.Outros);
                if (microbiology.OutrosObservacoes)
                    setOutrosObservacoes(microbiology.OutrosObservacoes);
                setPerfilSensibilidade(microbiology.PerfilSensibilidade);

                setLoading(false);
            } catch (error) {
                setLoading(false);
                HandleToast("error", "Erro!", "Falha ao carregar os dados.");
            }
        }
        if (id) {
            setLoading(true);
            setButtonLabel("Atualizar");
            setTitle("Edição de microbiologia");
            loadMicrobiologyInfo();
        }
    }, [id]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const data = {
            IdPaciente,
            IdProntuario,
            DataColeta,
            DataResultado,
            SwabNasal,
            SwabNasalObservacoes,
            SwabRetal,
            SwabRetalObservacoes,
            Sangue,
            SangueObservacoes,
            Urina,
            UrinaObservacoes,
            SecrecaoTraqueal,
            SecrecaoTraquealObservacoes,
            Outros,
            OutrosObservacoes,
            PerfilSensibilidade,
        };
        try {
            setLoading(true);
            //validação dos dados
            const schema = Yup.object().shape({
                IdPaciente: Yup.number().required(),
                IdProntuario: Yup.number().required(),
                DataColeta: Yup.string().required(),
                DataResultado: Yup.string().required(),
                SwabNasal: Yup.string().required(),
                SwabNasalObservacoes: Yup.string(),
                SwabRetal: Yup.string().required(),
                SwabRetalObservacoes: Yup.string(),
                Sangue: Yup.string().required(),
                SangueObservacoes: Yup.string(),
                Urina: Yup.string().required(),
                UrinaObservacoes: Yup.string(),
                SecrecaoTraqueal: Yup.string().required(),
                SecrecaoTraquealObservacoes: Yup.string(),
                Outros: Yup.string().required(),
                OutrosObservacoes: Yup.string(),
                PerfilSensibilidade: Yup.string().required(),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            if (id) {
                await api.put(`/microbiology/update/${id}`, data);
                HandleToast(
                    "success",
                    "Sucesso!",
                    "Microbiologia atualizada com sucesso."
                );
            } else {
                await api.post("/microbiology", data);
                HandleToast(
                    "success",
                    "Sucesso!",
                    "Microbiologia criada com sucesso."
                );
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err instanceof Yup.ValidationError) {
                HandleToast(
                    "error",
                    "Erro!",
                    "Verifique se todos os campos foram preenchidos corretamente!"
                );
            } else {
                const message = err.response.data.error;
                HandleToast("error", "Erro!", `${message}`);
            }
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

    return (
        <>
            <div>
                <Header />
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
                                            onChange={(e) =>
                                                setIdPaciente(
                                                    Number(
                                                        (e.target as HTMLInputElement)
                                                            .value
                                                    )
                                                )
                                            }
                                            value={IdPaciente}
                                            autoFocus
                                            required
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
                                            onChange={(e) =>
                                                setIdProntuario(
                                                    Number(
                                                        (e.target as HTMLInputElement)
                                                            .value
                                                    )
                                                )
                                            }
                                            value={IdProntuario}
                                            autoFocus
                                            required
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
                                            onChange={(e) =>
                                                setDataColeta(
                                                    (e.target as HTMLInputElement)
                                                        .value
                                                )
                                            }
                                            defaultValue={DataColeta}
                                            autoFocus
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
                                            onChange={(e) =>
                                                setDataResultado(
                                                    (e.target as HTMLInputElement)
                                                        .value
                                                )
                                            }
                                            defaultValue={DataResultado}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                </div>

                                <Select
                                    label="Swab Nasal"
                                    htmlFor="SwabNasal"
                                    name="SwabNasalObservacoes"
                                    value={SwabNasal}
                                    inputValue={SwabNasalObservacoes}
                                    inputOnChange={(e: any) =>
                                        setSwabNasalObservacoes(
                                            (e.target as HTMLInputElement).value
                                        )
                                    }
                                    onChange={(e: { value: string }) =>
                                        setSwabNasal(e.value)
                                    }
                                />
                                <Select
                                    label="Swab Retal"
                                    htmlFor="SwabRetal"
                                    name="SwabRetalObservacoes"
                                    value={SwabRetal}
                                    inputValue={SwabRetalObservacoes}
                                    inputOnChange={(e: any) =>
                                        setSwabRetalObservacoes(
                                            (e.target as HTMLInputElement).value
                                        )
                                    }
                                    onChange={(e: { value: string }) =>
                                        setSwabRetal(e.value)
                                    }
                                />
                                <Select
                                    label="Sangue"
                                    htmlFor="Sangue"
                                    name="SangueObservacoes"
                                    value={Sangue}
                                    inputValue={SangueObservacoes}
                                    inputOnChange={(e: any) =>
                                        setSangueObservacoes(
                                            (e.target as HTMLInputElement).value
                                        )
                                    }
                                    onChange={(e: { value: string }) =>
                                        setSangue(e.value)
                                    }
                                />
                                <Select
                                    label="Urina"
                                    htmlFor="Urina"
                                    name="UrinaObservacoes"
                                    value={Urina}
                                    inputValue={UrinaObservacoes}
                                    inputOnChange={(e: any) =>
                                        setUrinaObservacoes(
                                            (e.target as HTMLInputElement).value
                                        )
                                    }
                                    onChange={(e: { value: string }) =>
                                        setUrina(e.value)
                                    }
                                />
                                <Select
                                    label="Secreção Traqueal"
                                    htmlFor="SecrecaoTraqueal"
                                    name="SecrecaoTraquealObservacoes"
                                    value={SecrecaoTraqueal}
                                    inputValue={SecrecaoTraquealObservacoes}
                                    inputOnChange={(e: any) =>
                                        setSecrecaoTraquealObservacoes(
                                            (e.target as HTMLInputElement).value
                                        )
                                    }
                                    onChange={(e: { value: string }) =>
                                        setSecrecaoTraqueal(e.value)
                                    }
                                />
                                <Select
                                    label="Outros"
                                    htmlFor="Outros"
                                    name="OutrosObservacoes"
                                    value={Outros}
                                    inputValue={OutrosObservacoes}
                                    inputOnChange={(e: any) =>
                                        setOutrosObservacoes(
                                            (e.target as HTMLInputElement).value
                                        )
                                    }
                                    onChange={(e: { value: string }) =>
                                        setOutros(e.value)
                                    }
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
                                    placeholder="Digite o perfil de sensibilidade"
                                    onChange={(e) =>
                                        setPerfilSensibilidade(
                                            (e.target as HTMLInputElement).value
                                        )
                                    }
                                    defaultValue={PerfilSensibilidade}
                                    autoFocus
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-info btn-primary mt-3"
                            >
                                {buttonLabel}
                            </button>
                        </form>
                    </div>
                </div>
                <Footer />
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
