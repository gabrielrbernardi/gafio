import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from "yup";

import ToastComponent from "../../../../components/Toast";

import { CreateDiseaseService } from './CreateDiseaseService';

const DiseasesCreate = () => {

    const [codDoenca, setCodDoeca] = useState<string>('');
    const [nome, setNome] = useState<string>('');

    const [toast, setToast] = useState<boolean>(false);
    const [getMessageType, setMessageType] = useState<string>("");
    const [getMessageTitle, setMessageTitle] = useState<string>("");
    const [getMessageContent, setMessageContent] = useState<string>("");

    const history = useHistory();

    const createDiseaseService = new CreateDiseaseService();

   async function handleSubmit(event: FormEvent) {
       try {
            event.preventDefault();
            const data = {
                codDoenca,
                nome,
            };
            //Validação de dados
            const schema = Yup.object().shape({
                codDoenca: Yup.string().required(),
                nome: Yup.string().required()
            })

            await schema.validate(data, { abortEarly: false });
            const email = localStorage.getItem('@gafio-user/email');

            createDiseaseService.Create(
                codDoenca,
                nome,
                email
            ).then(() => {
                HandleToast("success", "Sucesso!", "Doença criada com sucesso!");
                history.push('/registrations/diseases');
            });

        } 
        catch (err) {
            if (err instanceof Yup.ValidationError) HandleToast("error", "Erro!", "Verifique se todos os campos foram preenchidos corretamente!");
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
        <div className="row m-5">
            <div className="card shadow-lg p-3 col-sm-6 offset-md-3 border">

                <p className="text-dark h3 text-center">Cadastro de Doenças</p>
                <form className="was-validated" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <label htmlFor="codDoenca" className="mt-4">Código da doença</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="codDoenca"
                                    name="codDoenca"
                                    defaultValue={codDoenca}
                                    onChange={(e) => setCodDoeca((e.target as HTMLInputElement).value)}
                                    placeholder="Código da doença"
                                    required={true}
                                />
                            </div>

                            <div className="col">
                                <label htmlFor="nome" className="mt-4">Nome da doença</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nome"
                                    name="nome"
                                    defaultValue={nome}
                                    onChange={(e) => setNome((e.target as HTMLInputElement).value)}
                                    placeholder="Nome da doença"
                                    required={true}
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-info btn-primary mt-2">Cadastrar</button>
                </form>
            </div>
        </div>
        { 
            toast && (
                <ToastComponent
                    messageType={getMessageType}
                    messageTitle={getMessageTitle}
                    messageContent={getMessageContent}
                />
            ) 
        }
        </>
    );
}

export default DiseasesCreate;