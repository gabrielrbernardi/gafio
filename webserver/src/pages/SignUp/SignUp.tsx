import React, {useState, FormEvent, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import ToastComponent from '../../components/Toast';
import { InputText } from 'primereact/inputtext';
// import jwt from 'jsonwebtoken';

import '../Login/login.css';

import api from '../../services/api';

// const secretWord = 'PalavraSecreta';

const SignUp = () => {
    const [getNome, setNome] = useState('');
    const [getEmail, setEmail] = useState('');
    const [getMatricula, setMatricula] = useState('');
    const [getSenha, setSenha] = useState('');
    const [getRedefinirSenha, setRedefinirSenha] = useState('');

    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    const history = useHistory()
    
    function handleSubmit(event: FormEvent){
        event.preventDefault();
        const nome = getNome;
        const email = getEmail;
        const matricula = getMatricula;
        const senha = getSenha;
        const confirmarSenha = getRedefinirSenha;
        
        // const token = jwt.sign({nome: nome, email: email, senha: senha, confirmarSenha: confirmarSenha, matricula: matricula}, secretWord);
        api.post('users', {nome: nome, email: email, senha: senha, confirmarSenha: confirmarSenha, matricula: matricula})
        .then(function(response){
            if(response.data.createdUser){
                showToast('success', 'Sucesso!', `Usuário criado com sucesso.`);
                // setTimeout(function(){history.push('/login')}, 1750);
                setTimeout(() => {
                    history.push('/login')
                }, 2500);
            }else{
                if(response.data.status === 502){
                    showToast('error', 'Erro!', `Error 502 Bad Gateway. Contate o administrador do sistema para mais detalhes. Erro: UserCreationDatabase`);
                }else{
                    showToast('error', 'Erro!', String(response.data.error));
                }
            }
        })
        // history.push('/');
    }

    useEffect(() => {
        document.title = 'GAFio | Cadastro de Usuário';
    }, []);

    function showToast(messageType: string, messageTitle: string, messageContent: string){
        setToast(false)
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 4500)
    }
    
    return (
        <>
            <div className="row m-5">
                <div className="card shadow-lg p-3 col-md-6 offset-md-3 border">
                    <p className="text-dark h3 text-center">Cadastro de Usuário</p>
                    <form className="was-validated" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo:</label>
                        <InputText type="text" style={{width: '100%'}} id="nome" name="nome" defaultValue={getNome} onChange={(e) => setNome((e.target as HTMLInputElement).value)} placeholder="Digite seu nome" required autoFocus/>
                        
                        <label htmlFor="email" className="mt-4">Email:</label>
                        <InputText type="email" style={{width: '100%'}} id="email" name="email" defaultValue={getEmail} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} placeholder="Digite seu email" required/>
                        
                        <label htmlFor="matricula" className="mt-4">Matrícula:</label>
                        <InputText type="text" style={{width: '100%'}} id="matricula" name="matricula" defaultValue={getMatricula} onChange={(e) => setMatricula((e.target as HTMLInputElement).value)} placeholder="Digite sua matrícula" required/>
                        
                        <label htmlFor="senha" className="mt-4">Senha:</label>
                        <InputText type="password" style={{width: '100%'}} id="senha" name="senha" defaultValue={getSenha} onChange={(e) => setSenha((e.target as HTMLInputElement).value)} minLength={8} placeholder="Digite sua senha" required/>
                        
                        <label htmlFor="confirmarSenha" className="mt-4">Confirmar Senha:</label>
                        <InputText type="password" style={{width: '100%'}} id="confirmarSenha" name="confirmarSenha" defaultValue={getRedefinirSenha} onChange={(e) => setRedefinirSenha((e.target as HTMLInputElement).value)} minLength={8} placeholder="Confirme sua senha" required/>
                    </div>
                    {/* {
                    enableSubmitButton === 0
                    ? <button type="submit" className="btn btn-info btn-primary disabled" disabled>Cadastrar</button>
                    : <button type="submit" className="btn btn-info btn-primary">Cadastrar</button>
                    } */}
                    <button type="submit" className="btn btn-info btn-primary mt-3 mb-3">Cadastrar</button>
                    </form>
                </div>
            </div>
            
            {getToast &&
                <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
            }
        </>
    )
}

export default SignUp;