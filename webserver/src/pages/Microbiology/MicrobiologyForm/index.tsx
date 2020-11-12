import React, { useState, useEffect, FormEvent } from "react";
import * as Yup from "yup";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import Loading from "../../../components/Loading";
import ToastComponent from "../../../components/Toast";
import Select from "./Select";

import MicrobiologyService from "../MicrobiologyService";
import {IMicrobiology} from "../MicrobiologyModel";

interface Props {
    id?: number;
}

const MicrobiologyForm: React.FC<Props> = ({ id }) => {
    const [title, setTitle] = useState<string>("Cadastro de microbiologia");
    const [buttonLabel, setButtonLabel] = useState<string>("Cadastrar");
    const [toast, setToast] = useState<boolean>(false);
    const [getMessageType, setMessageType] = useState<string>("");
    const [getMessageTitle, setMessageTitle] = useState<string>("");
    const [getMessageContent, setMessageContent] = useState<string>("");
    const [IdPaciente, setIdPaciente] = useState<number>(0);
    const [IdProntuario, setIdProntuario] = useState<number>(0);
    const [DataColeta, setDataColeta] = useState<any>();
    const [DataResultado, setDataResultado] = useState<any>();
    const [SwabNasal, setSwabNasal] = useState<string>("");
    const [SwabNasalObservacoes, setSwabNasalObservacoes] = useState<string>("");
    const [SwabRetal, setSwabRetal] = useState<string>("");
    const [SwabRetalObservacoes, setSwabRetalObservacoes] = useState<string>( "");
    const [Sangue, setSangue] = useState<string>("");
    const [SangueObservacoes, setSangueObservacoes] = useState<string>("");
    const [Urina, setUrina] = useState<string>("");
    const [UrinaObservacoes, setUrinaObservacoes] = useState<string>("");
    const [SecrecaoTraqueal, setSecrecaoTraqueal] = useState<string>("");
    const [SecrecaoTraquealObservacoes, setSecrecaoTraquealObservacoes] = useState<string>("");
    const [Outros, setOutros] = useState<string>("");
    const [OutrosObservacoes, setOutrosObservacoes] = useState<string>("");
    const [PerfilSensibilidade, setPerfilSensibilidade] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const pt_br = {
        firstDayOfWeek: 1,
        dayNames: [
            "domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
        ],
        dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        dayNamesMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        // dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
        monthNames: [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
        ],
        monthNamesShort: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez",
        ],
        today: "Hoje",
        clear: "Limpar",
    };

    useEffect(() => {
        function formatDate(date: any) {
            const newDate = date.split("/");
            const formatedDate = new Date(
                newDate[2],
                newDate[1] - 1,
                newDate[0]
            );
            return formatedDate;
        }

       function loadMicrobiologyInfo(id:number) {
            MicrobiologyService.getById(id)
                .then(data => {
                    const [microbiology] = data;

                    setIdPaciente(Number(microbiology.IdPaciente));
                    setIdProntuario(microbiology.IdProntuario);

                    const dataColeta = formatDate(microbiology.DataColeta);
                    setDataColeta(dataColeta);

                    const dataResultado = formatDate(microbiology.DataResultado);
                    setDataResultado(dataResultado);

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
                        setSecrecaoTraquealObservacoes(microbiology.SecrecaoTraquealObservacoes);
                    setOutros(microbiology.Outros);
                    if (microbiology.OutrosObservacoes)
                        setOutrosObservacoes(microbiology.OutrosObservacoes);
                    setPerfilSensibilidade(microbiology.PerfilSensibilidade);

                    setLoading(false);
                })
                .catch(error => {
                    setLoading(false);
                    HandleToast("error", "Erro!", "Falha ao carregar os dados.");
                });
        }
        if (id) {
            setLoading(true);
            setButtonLabel("Atualizar");
            setTitle("Edição de microbiologia");
            loadMicrobiologyInfo(id);
        }
    }, [id]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const data: IMicrobiology = {
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
                DataColeta: Yup.date().required(),
                DataResultado: Yup.date().required(),
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

            await schema.validate(data, {abortEarly: false, });

            if (id) {
                MicrobiologyService.update(data, id).then(() => {
                    HandleToast("success", "Sucesso!", "Microbiologia atualizada com sucesso.");
                    setLoading(false);
                }).catch(err => {
                    const message = err.response.data.error;
                    HandleToast("error", "Erro!", `${message}`)
                    setLoading(false);
                });
            } else {
                MicrobiologyService.create(data).then(() => {
                    HandleToast("success", "Sucesso!", "Microbiologia criada com sucesso.");
                    setLoading(false);
                }).catch(err => {
                    const message = err.response.data.error;
                    HandleToast("error", "Erro!", `${message}`)
                    setLoading(false);
                });
            }
        } catch (err) {
            setLoading(false);
            if (err instanceof Yup.ValidationError) {
                HandleToast("error", "Erro!", "Verifique se todos os campos foram preenchidos corretamente!");
            }
            else return;
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
        setTimeout(() => setToast(false), 4500) }

    return (
        <>
            <div>
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
                                        <InputNumber
                                            id="IdPaciente"
                                            name="IdPaciente"
                                            value={IdPaciente}
                                            min={1}
                                            max={9999999999}
                                            onChange={(e) =>setIdPaciente(Number(e.value)) }
                                            showButtons
                                            style={{ width: "100%" }}
                                            placeholder="Digite o número do paciente"
                                            required
                                        />
                                    </div>

                                    <div className="col">
                                        <label htmlFor="IdProntuario">
                                            Número do Prontuário
                                        </label>
                                        <InputNumber
                                            id="IdProntuario"
                                            name="IdProntuario"
                                            value={IdProntuario}
                                            min={1}
                                            max={9999999999}
                                            onChange={(e) =>setIdProntuario(Number(e.value))}
                                            showButtons
                                            style={{ width: "100%" }}
                                            placeholder="Digite o número do prontuário"
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
                                        <Calendar
                                            id="DataColeta"
                                            name="DataColeta"
                                            value={DataColeta}
                                            onChange={(e) =>setDataColeta(e.value)}
                                            style={{ width: "100%" }}
                                            locale={pt_br}
                                            dateFormat="dd/mm/yy"
                                            placeholder="Selecione a data de coleta"
                                            showButtonBar
                                            monthNavigator
                                            showIcon
                                            showOnFocus={false}
                                            required
                                        />
                                    </div>

                                    <div className="col">
                                        <label  htmlFor="DataResultado"  className="mt-2">
                                            Data do resultado
                                        </label>
                                        <Calendar
                                            id="DataResultado"
                                            name="DataResultado"
                                            value={DataResultado}onChange={(e) =>setDataResultado(e.value)}
                                            style={{ width: "100%" }}
                                            locale={pt_br}
                                            dateFormat="dd/mm/yy"
                                            placeholder="Selecione a data do resultado"
                                            showButtonBar
                                            monthNavigator
                                            showOnFocus={false}
                                            showIcon
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
                                    inputOnChange={(e: any) =>setSwabNasalObservacoes( (e.target as HTMLInputElement).value )}
                                    onChange={(e: { value: string }) => setSwabNasal(e.value)}
                                />
                                <Select
                                    label="Swab Retal"
                                    htmlFor="SwabRetal"
                                    name="SwabRetalObservacoes"
                                    value={SwabRetal}
                                    inputValue={SwabRetalObservacoes}
                                    inputOnChange={(e: any) =>setSwabRetalObservacoes( (e.target as HTMLInputElement).value) }
                                    onChange={(e: { value: string }) => setSwabRetal(e.value) }
                                />
                                <Select
                                    label="Sangue"
                                    htmlFor="Sangue"
                                    name="SangueObservacoes"
                                    value={Sangue}
                                    inputValue={SangueObservacoes}
                                    inputOnChange={(e: any) =>setSangueObservacoes((e.target as HTMLInputElement).value )}
                                    onChange={(e: { value: string }) =>setSangue(e.value) }
                                />
                                <Select
                                    label="Urina"
                                    htmlFor="Urina"
                                    name="UrinaObservacoes"
                                    value={Urina}
                                    inputValue={UrinaObservacoes}
                                    inputOnChange={(e: any) => setUrinaObservacoes( (e.target as HTMLInputElement).value ) }
                                    onChange={(e: { value: string }) =>setUrina(e.value)}
                                />
                                <Select
                                    label="Secreção Traqueal"
                                    htmlFor="SecrecaoTraqueal"
                                    name="SecrecaoTraquealObservacoes"
                                    value={SecrecaoTraqueal}
                                    inputValue={SecrecaoTraquealObservacoes}
                                    inputOnChange={(e: any) => setSecrecaoTraquealObservacoes((e.target as HTMLInputElement).value )}
                                    onChange={(e: { value: string }) =>setSecrecaoTraqueal(e.value)}
                                />
                                <Select
                                    label="Outros"
                                    htmlFor="Outros"
                                    name="OutrosObservacoes"
                                    value={Outros}
                                    inputValue={OutrosObservacoes}
                                    inputOnChange={(e: any) => setOutrosObservacoes((e.target as HTMLInputElement).value )}
                                    onChange={(e: { value: string }) =>setOutros(e.value)}
                                />

                                <label
                                    htmlFor="PerfilSensibilidade"
                                    className="mt-4"
                                >
                                    Perfil Sensibilidade
                                </label>
                                <InputText
                                    id="PerfilSensibilidade"
                                    name="PerfilSensibilidade"
                                    defaultValue={PerfilSensibilidade}
                                    onChange={(e) => setPerfilSensibilidade((e.target as HTMLInputElement).value ) }
                                    keyfilter="alpha"
                                    style={{ width: "100%" }}
                                    placeholder="Digite o perfil de sensibilidade"
                                    autoFocus
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-info btn-primary mt-3" >
                                {buttonLabel}
                            </button>
                        </form>
                    </div>
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
