import React, { useState, useEffect, FormEvent } from "react";
import * as Yup from "yup";

import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Dropdown as DropdownReact } from "react-bootstrap";
import Loading from "../../../components/Loading";
import ToastComponent from "../../../components/Toast";

import MicrobiologyService from "../MicrobiologyService";
import { IMicrobiology } from "../MicrobiologyModel";

import { useHistory} from 'react-router-dom';

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
    const [DataResultado, setDataResultado] = useState<any>(null);
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

    const [viewNasal, setViewNasal] = useState<boolean>(false);
    const [viewRetal, setViewRetal] = useState<boolean>(false);
    const [viewSangue, setViewSangue] = useState<boolean>(false);
    const [viewUrina, setViewUrina] = useState<boolean>(false);
    const [viewSec, setViewSec] = useState<boolean>(false);
    const [viewOutros, setViewOutros] = useState<boolean>(false);


    const pt_br = {
        firstDayOfWeek: 1,
        dayNames: [ "domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado",],
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

    const options = [
        { label: "Sim", value: "S" },
        { label: "Não", value: "N" },
    ];

    const history = useHistory();
    const email = localStorage.getItem('@gafio-user/email');

    useEffect(() => {
        // Formatação de dados
        function formatDate(date: any) {
            const newDate = date.split("/");
            const formatedDate = new Date(
                newDate[2],
                newDate[1] - 1,
                newDate[0]
            );
            return formatedDate;
        }

       //Carrega os dados 
       function loadMicrobiologyInfo(id:number) {
            MicrobiologyService.getById(id)
                .then(data => {
                    const [microbiology] = data;

                    setIdPaciente(Number(microbiology.IdPaciente));
                    setIdProntuario(microbiology.IdProntuario);

                    const dataColeta = formatDate(microbiology.DataColeta);
                    setDataColeta(dataColeta);

                    if (microbiology.DataResultado) {
                           const dataResultado = formatDate(microbiology.DataResultado);
                          setDataResultado(dataResultado);
                    }

                    setSwabNasal(microbiology.SwabNasal);
                    if (microbiology.SwabNasalObservacoes) {
                        setSwabNasalObservacoes(microbiology.SwabNasalObservacoes);
                        setViewNasal(true);
                    }
                    
                    setSwabRetal(microbiology.SwabRetal);
                    if (microbiology.SwabRetalObservacoes){
                        setSwabRetalObservacoes(microbiology.SwabRetalObservacoes);
                        setViewRetal(true);
                    }

                    setSangue(microbiology.Sangue);
                    if (microbiology.SangueObservacoes){
                        setSangueObservacoes(microbiology.SangueObservacoes);
                        setViewSangue(true);
                    }

                    setUrina(microbiology.Urina);
                    if (microbiology.UrinaObservacoes) {
                         setUrinaObservacoes(microbiology.UrinaObservacoes);
                         setViewUrina(true);                       
                    }

                    setSecrecaoTraqueal(microbiology.SecrecaoTraqueal);
                    if (microbiology.SecrecaoTraquealObservacoes){
                        setSecrecaoTraquealObservacoes(microbiology.SecrecaoTraquealObservacoes);
                        setViewSec(true);
                    }

                    setOutros(microbiology.Outros);
                    if (microbiology.OutrosObservacoes) {
                        setOutrosObservacoes(microbiology.OutrosObservacoes);
                        setViewOutros(true);
                    }

                    if (microbiology.PerfilSensibilidade)
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

    //Envio de formulário
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
                DataResultado: Yup.date(),
                SwabNasal: Yup.string().nullable().oneOf([null, "S", "N"]).required(),
                SwabNasalObservacoes: Yup.string().max(250),
                SwabRetal: Yup.string().nullable().oneOf([null, "S", "N"]).required(),
                SwabRetalObservacoes: Yup.string().max(250),
                Sangue: Yup.string().nullable().oneOf([null, "S", "N"]).required(),
                SangueObservacoes: Yup.string().max(250),
                Urina: Yup.string().nullable().oneOf([null, "S", "N"]).required(),
                UrinaObservacoes: Yup.string().max(250),
                SecrecaoTraqueal: Yup.string().nullable().oneOf([null, "S", "N"]).required(),
                SecrecaoTraquealObservacoes: Yup.string().max(250),
                Outros: Yup.string().nullable().oneOf([null, "S", "N"]).required(),
                OutrosObservacoes: Yup.string().max(250),
                PerfilSensibilidade: Yup.string(),
            });
            
             console.log(data)            
            await schema.validate(data, {abortEarly: false, });
            
            if (id) {
                MicrobiologyService.update(data, id, email).then(() => {
                    HandleToast("success", "Sucesso!", "Microbiologia atualizada com sucesso.");
                    setLoading(false);
                }).catch(err => {
                    const message = err.response.data.error;
                    HandleToast("error", "Erro!", `${message}`)
                    setLoading(false);
                });
            } else {
                MicrobiologyService.create(data, email).then(() => {
                    HandleToast("success", "Sucesso!", "Microbiologia criada com sucesso.");
                    setLoading(false);
                    setTimeout(() => {
                        history.push("/microbiology");
                    }, 1500);
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
        setTimeout(() => setToast(false), 4500)
    }
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
                                        />
                                    </div>
                                </div>

                              <div className="form-row mt-4">
                                        <div className="col mr-2">
                                            <DropdownReact />
                                           <label>Swab Nasal</label>
                                            <br></br>
                                            <Dropdown
                                                options={options}
                                                placeholder="Selecione uma opção"
                                                value={SwabNasal}
                                                onChange={(e: { value: string }) => {
                                                    if (e.value === "S") setViewNasal(true);
                                                    else {
                                                        if (SwabNasalObservacoes) setSwabNasalObservacoes("");
                                                        setViewNasal(false)
                                                    };
                                                    setSwabNasal(e.value);
                                               }}
                                              style={{ width: "100%" }}
                                            />
                                            <DropdownReact />
                                    </div>
                                    
                                    <div className="col">
                                            <DropdownReact />
                                           <label>Swab Retal</label>
                                            <br></br>
                                            <Dropdown
                                                options={options}
                                                placeholder="Selecione uma opção"
                                                value={SwabRetal}
                                                onChange={(e: { value: string }) => {
                                                    if (e.value === "S") setViewRetal(true);
                                                    else {
                                                        if (SwabRetalObservacoes) setSwabRetalObservacoes("");
                                                        setViewRetal(false);
                                                    }
                                                    setSwabRetal(e.value);
                                                }}
                                                style={{ width: "100%" }}
                                            />
                                            <DropdownReact />
                                    </div>
                                </div>

                                <div className="form-row mt-4">
                                    <div className="col mr-2">
                                        <DropdownReact />
                                        <label>Sangue</label>
                                        <br></br>
                                        <Dropdown
                                            options={options}
                                            placeholder="Selecione uma opção"
                                            value={Sangue}
                                            onChange={(e: { value: string }) => {
                                                if (e.value === "S") setViewSangue(true);
                                                else {
                                                    if (SangueObservacoes) setSangueObservacoes("");
                                                    setViewSangue(false)
                                                };
                                                setSangue(e.value);
                                            }}
                                            style={{ width: "100%" }}
                                        />
                                        <DropdownReact />
                                    </div>

                                    <div className="col">
                                        <DropdownReact />
                                        <label>Urina</label>
                                        <br></br>
                                        <Dropdown
                                            options={options}
                                            placeholder="Selecione uma opção"
                                            value={Urina}
                                            onChange={(e: { value: string }) => {
                                                if (e.value === "S") setViewUrina(true);
                                                else {
                                                    if (UrinaObservacoes) setUrinaObservacoes("");
                                                    setViewUrina(false)
                                                };
                                                setUrina(e.value);
                                            }}
                                            style={{ width: "100%" }}
                                        />
                                        <DropdownReact />
                                    </div>
                                </div>

                                
                                <div className="form-row mt-4">
                                    <div className="col mr-2">
                                        <DropdownReact />
                                        <label>Secreção Traqueal</label>
                                        <br></br>
                                        <Dropdown
                                            options={options}
                                            placeholder="Selecione uma opção"
                                            value={SecrecaoTraqueal}
                                            onChange={(e: { value: string }) => {
                                                if (e.value === "S") setViewSec(true);
                                                else {
                                                    if (SecrecaoTraquealObservacoes) setSecrecaoTraquealObservacoes("");
                                                    setViewSec(false);
                                                }
                                                setSecrecaoTraqueal(e.value);
                                            }}
                                            style={{ width: "100%" }}
                                        />
                                        <DropdownReact />
                                    </div>

                                    <div className="col">
                                        <DropdownReact />
                                        <label>Outros</label>
                                        <br></br>
                                        <Dropdown
                                            options={options}
                                            placeholder="Selecione uma opção"
                                            value={Outros}
                                            onChange={(e: { value: string }) => {
                                                if (e.value === "S") {
                                                    setViewOutros(true);
                                                }
                                                else {
                                                    if (OutrosObservacoes) setOutrosObservacoes("");
                                                    setViewOutros(false)
                                                };
                                                setOutros(e.value);
                                            }}
                                            style={{ width: "100%" }}
                                        />
                                        <DropdownReact />
                                    </div>
                                </div>

                                {viewNasal && (
                                    < div className="mt-4">
                                        <label htmlFor="SwabNasal">Observações da Swab Nasal</label>
                                        <InputTextarea
                                                   maxLength={250}
                                                   autoResize
                                                    keyfilter="alpha"
                                                    style={{ width: "100%" }}
                                                    id="SwabNasal"
                                                    name="SwabNasal"
                                                    placeholder="Digite a observação..."
                                                    defaultValue={SwabNasalObservacoes}
                                                    onChange={(e: any) => setSwabNasalObservacoes((e.target as HTMLInputElement).value)}
                                                    autoFocus
                                                    required
                                                />
                                </div>
                                )}

                                {viewRetal && (
                                    < div className="mt-4">
                                        <label htmlFor="SwabRetal">Observações da Swab Retal</label>
                                        <InputTextarea
                                            autoResize
                                            maxLength={250}
                                            keyfilter="alpha"
                                            style={{ width: "100%" }}
                                            id="SwabRetal"
                                            name="SwabRetal"
                                            placeholder="Digite a observação..."
                                            defaultValue={SwabRetalObservacoes}
                                            onChange={(e: any) => setSwabRetalObservacoes((e.target as HTMLInputElement).value)}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                )}

                                {viewSangue && (
                                    < div className="mt-4">
                                        <label htmlFor="Sangue">Observações do Sangue</label>
                                        <InputTextarea
                                            maxLength={250}
                                            autoResize
                                            keyfilter="alpha"
                                            style={{ width: "100%" }}
                                            id="Sangue"
                                            name="Sangue"
                                            placeholder="Digite a observação..."
                                            defaultValue={SangueObservacoes}
                                            onChange={(e: any) => setSangueObservacoes((e.target as HTMLInputElement).value)}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                )}

                                {viewUrina && (
                                    < div className="mt-4">
                                        <label htmlFor="Urina">Observações da Urina</label>
                                        <InputTextarea
                                            maxLength={250}
                                            autoResize
                                            keyfilter="alpha"
                                            style={{ width: "100%" }}
                                            id="Urina"
                                            name="Urina"
                                            placeholder="Digite a observação..."
                                            defaultValue={UrinaObservacoes}
                                            onChange={(e: any) => setUrinaObservacoes((e.target as HTMLInputElement).value)}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                )}
                                {viewSec && (
                                    < div className="mt-4">
                                        <label htmlFor="Secrecao">Observações da Secreção Traqueal</label>
                                        <InputTextarea
                                            maxLength={250}
                                            autoResize
                                            keyfilter="alpha"
                                            style={{ width: "100%" }}
                                            id="Secrecao"
                                            name="Secrecao"
                                            placeholder="Digite a observação..."
                                            defaultValue={SecrecaoTraquealObservacoes}
                                            onChange={(e: any) => {
                                                setSecrecaoTraquealObservacoes((e.target as HTMLInputElement).value);
                                            }}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                )}

                                {viewOutros && (
                                    < div className="mt-4">
                                        <label htmlFor="Outros">Observações</label>
                                        <InputTextarea
                                            maxLength={250}
                                            autoResize
                                            keyfilter="alpha"
                                            style={{ width: "100%" }}
                                            id="Outros"
                                            name="Outros"
                                            placeholder="Digite a observação..."
                                            defaultValue={OutrosObservacoes}
                                            onChange={(e: any) => setOutrosObservacoes((e.target as HTMLInputElement).value)}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                )}

                                <div className="mt-4">
                                    <label
                                        htmlFor="PerfilSensibilidade"
                                    >
                                        Perfil Sensibilidade
                                </label>
                                    <InputTextarea
                                        maxLength={250}
                                        autoResize
                                        id="PerfilSensibilidade"
                                        name="PerfilSensibilidade"
                                        defaultValue={PerfilSensibilidade}
                                        onChange={(e) => setPerfilSensibilidade((e.target as HTMLInputElement).value)}
                                        keyfilter="alpha"
                                        style={{ width: "100%" }}
                                        placeholder="Digite o perfil de sensibilidade"
                                        autoFocus
                                    />
                                </div>
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
