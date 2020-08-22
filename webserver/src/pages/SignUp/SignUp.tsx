import React, {useState, FormEvent, useEffect} from 'react';
// import jwt from 'jsonwebtoken';

import '../Login/login.css';

import api from '../../services/api';

// const secretWord = 'PalavraSecreta';

const SignUp = () => {
    
    const [responseDataStatus, setResponseDataStatus] = useState(Number);
    const [responseData, setResponseData] = useState('');
    const [getNome, setNome] = useState('gabriel');
    const [getEmail, setEmail] = useState('teste1@gafio.com');
    const [getMatricula, setMatricula] = useState('11821');
    const [getSenha, setSenha] = useState('teste123');
    const [getRedefinirSenha, setRedefinirSenha] = useState('teste123');

    // const [formData, setFormData] = useState({
    //     nome: '',
    //     email: '',
    //     senha: '',
    //     confirmarSenha: '',
    //     matricula: '',
    // });

    // function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    //     const { name, value } = event.target;
    //     setFormData({...formData, [name]: value});
    //     if(formData['nome'] && formData['email'] && formData['senha'] && formData['confirmarSenha'] && formData['matricula']){
    //         setEnableSubmitButton(1);
    //     }else{
    //         setEnableSubmitButton(0);
    //     }
    // }
    
    function handleSubmit(event: FormEvent){
        event.preventDefault();
        // const {nome, email, senha, confirmarSenha, matricula} = formData;
        const nome = getNome;
        const email = getEmail;
        const matricula = getMatricula;
        const senha = getSenha;
        const confirmarSenha = getRedefinirSenha;
        
        // const token = jwt.sign({nome: nome, email: email, senha: senha, confirmarSenha: confirmarSenha, matricula: matricula}, secretWord);
        api.post('users', {nome: nome, email: email, senha: senha, confirmarSenha: confirmarSenha, matricula: matricula})
        .then(function(response){
            if(response.data.createdUser){
                setResponseDataStatus(1);
                setResponseData('Usuário criado com sucesso.');
                // setTimeout(function(){history.push('/login')}, 1750);
                setTimeout(() => {setResponseDataStatus(0)}, 1000);
            }else{
                if(response.data.status === 502){
                    setResponseData('Error 502 Bad Gateway. Contate o administrador do sistema para mais detalhes. Erro: UserCreationDatabase');
                }else{
                    setResponseData(response.data.error);
                }
                setResponseDataStatus(2);
            }
        })
 
        // history.push('/');
    }

    useEffect(() => {
        document.title = 'GAFio | Cadastro de Usuário';
    }, []);
    
    return (
        <div className="row m-5">
            <div className="card shadow-lg p-3 col-sm-6 offset-md-3 border">
                <p className="text-dark h3 text-center">Cadastro de Usuário</p>
                <form className="was-validated" onSubmit={handleSubmit}>
                <div className="form-group">
                    {responseDataStatus === 0
                    ? <></>
                    : responseDataStatus === 1 
                        ?
                        <div className="alert alert-success alert-dismissible fade show">
                            {responseData}
                        </div>
                        :
                        <div className="alert alert-danger alert-dismissible fade show">
                            {responseData}
                        </div>
                    }
                    <label htmlFor="nome">Nome Completo:</label>
                    <input type="text" className="form-control" id="nome" name="nome" defaultValue={getNome} onChange={(e) => setNome((e.target as HTMLInputElement).value)} placeholder="Digite seu nome" required autoFocus/>
                    <div className="m-4"></div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" className="form-control" id="email" name="email" defaultValue={getEmail} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} placeholder="Digite seu email" required/>
                    <div className="m-4"></div>
                    <label htmlFor="matricula">Matrícula:</label>
                    <input type="text" className="form-control" id="matricula" name="matricula" defaultValue={getMatricula} onChange={(e) => setMatricula((e.target as HTMLInputElement).value)} placeholder="Digite sua matrícula" required/>
                    <div className="m-4"></div>
                    <label htmlFor="senha">Senha:</label>
                    <input type="password" className="form-control" id="senha" name="senha" defaultValue={getSenha} onChange={(e) => setSenha((e.target as HTMLInputElement).value)} minLength={8} placeholder="Digite sua senha" required/>
                    <div className="m-4"></div>
                    <label htmlFor="confirmarSenha">Confirmar Senha:</label>
                    <input type="password" className="form-control" id="confirmarSenha" name="confirmarSenha" defaultValue={getRedefinirSenha} onChange={(e) => setRedefinirSenha((e.target as HTMLInputElement).value)} minLength={8} placeholder="Confirme sua senha" required/>
                </div>
                {/* {
                enableSubmitButton === 0
                ? <button type="submit" className="btn btn-info btn-primary disabled" disabled>Cadastrar</button>
                : <button type="submit" className="btn btn-info btn-primary">Cadastrar</button>
                } */}
                <button type="submit" className="btn btn-info btn-primary">Cadastrar</button>
                </form>
            </div>
        </div>
    )
}

export default SignUp;