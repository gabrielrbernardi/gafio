import React, { useState, FormEvent } from 'react';
import {Dropdown} from 'primereact/dropdown';
import {Dropdown as DropdownReact} from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import ToastComponent from '../../../../components/Toast';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';

import {CreateAssessmentService} from './CreateAssessmentService'

const AssessmentForm = () => {
    const query = new URLSearchParams(useLocation().search)
    const queryResponse = query.get("seqProntuario") || ""

    const [getNroAvaliacao, setNroAvaliacao] = useState<any>(null)
    const [getDataAvaliacao, setDataAvaliacao] = useState<any>(null)
    const [getResultadoCulturas, setResultadoCulturas] = useState<any>(null)
    const [getResCulturasAcao, setResCulturasAcao] = useState<any>(null)
    const [getDoseCorreta, setDoseCorreta] = useState<any>(null)
    const [getPosologiaCorreta, setPosologiaCorreta] = useState<any>(null)
    const [getAlertaDot, setAlertaDot] = useState<any>(null)
    const [getAlertaDotDescricao, setAlertaDotDescricao] = useState<any>(null)
    const [getDisfuncaoRenal, setDisfuncaoRenal] = useState<string>('')
    const [getAtbContraindicacao, setAtbContraindicacao] = useState<any>(null)
    const [getAlteracaoPrescricao, setAlteracaoPrescricao] = useState<any>(null)
    const [getAtbDiluicaoInfusao, setAtbDiluicaoInfusao] = useState<any>(null)
    const [getInteracaoAtbMedicamento, setInteracaoAtbMedicamento] = useState<any>(null)
    const [getHemodialise, setHemodialise] = useState<any>(null)
    const [getAtbOral, setAtbOral] = useState<any>(null)
    const [getTrocaAtb, setTrocaAtb] = useState<any>(null)
    const [getNovoAtb, setNovoAtb] = useState<any>(null)
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');
    const history = useHistory()

    const createAssessmentService = new CreateAssessmentService()

    function checkInput(type: number, e: any){
        if(type == 1){
            if(e === ''){
                setResultadoCulturas(null);
            }else{
                setResultadoCulturas(e)
            }
        }
        if(type == 2){
            if(e === ''){
                setResCulturasAcao(null);
            }else{
                setResCulturasAcao(e)
            }
        }
        if(type == 3){
            if(e === ''){
                setAlertaDotDescricao(null);
            }else{
                setAlertaDotDescricao(e)
            }
        }
        if(type == 4){
            if(e === ''){
                setNovoAtb(null);
            }else{
                setNovoAtb(e)
            }
        }
    }

    const onDoseCorretaChange = (e: { value: string }) => {
        setDoseCorreta(e.value);
    };

    const onPosologiaCorretaChange = (e: { value: string }) => {
        setPosologiaCorreta(e.value);
    };

    const onAlertaDotChange = (e: { value: string }) => {
        setAlertaDot(e.value);
    };

    const onAlteracaoPrescricaoChange = (e: { value: string }) => {
        setAlteracaoPrescricao(e.value);
    };

    const onAtbContraindicacaoChange = (e: { value: string }) => {
        setAtbContraindicacao(e.value);
    };

    const onAtbDiluicaoInfusaoChange = (e: { value: string }) => {
        setAtbDiluicaoInfusao(e.value);
    };

    const onInteracaoAtbMedicamentoChange = (e: { value: string }) => {
        setInteracaoAtbMedicamento(e.value);
    };

    const onHemodialiseChange = (e: { value: string }) => {
        setHemodialise(e.value);
    };

    const onAtbOralChange = (e: { value: string }) => {
        setAtbOral(e.value);
    };

    const onTrocaAtbChange = (e: { value: string }) => {
        setTrocaAtb(e.value);
    };

    let options = [
        {label: 'Sim', value: 'S'},
        {label: 'Não', value: 'N'}
    ]

    let options2 = [
        {label: 'Sim', value: 'S'},
        {label: 'Sim intermitente', value: 'SI'},
        {label: 'Não', value: 'N'}
    ]

    let options3 = [
        {label: 'Sim', value: 'S'},
        {label: 'Não aplica', value: 'NA'},
        {label: 'Não', value: 'N'}
    ]

    const pt_br = {
        firstDayOfWeek: 1,
        dayNames: ["domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
        dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        dayNamesMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        // dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
        monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        today: "Hoje",
        clear: "Limpar",
    };

    function handleSubmit(event: FormEvent){
        event.preventDefault();

        createAssessmentService.Create(queryResponse, getNroAvaliacao, getDataAvaliacao, getResultadoCulturas, getResCulturasAcao,
            getDoseCorreta, getPosologiaCorreta, getAlertaDot, getAlertaDotDescricao, getDisfuncaoRenal,
            getHemodialise, getAtbOral, getAtbContraindicacao, getAlteracaoPrescricao, getAtbDiluicaoInfusao, 
            getInteracaoAtbMedicamento, getTrocaAtb, getNovoAtb)
        .then((response) => {
            if(response.CreatedAssessment){
                showToast('success', 'Sucesso!', `Avaliação criada com sucesso!`);
                setTimeout(() => {
                    history.push(`/medicalRecords/assessment/?seqProntuario=${queryResponse}`)
                }, 3500)
            }else{
                if(response.error.sqlMessage){
                    if(response.error.sqlState == 23000){
                        console.log(response.error.sqlState)
                        if(String(response.error.sqlMessage).includes("(`NovoAtb`)")){
                            showToast('error', 'Erro!', `O campo Novo Atb está incorreto`);
                        }else{
                            showToast('error', 'Erro!', String(response.error.sqlMessage));
                        }
                    }else{
                        showToast('error', 'Erro!', String(response.error.sqlMessage));
                    }
                }else{
                    showToast('error', 'Erro!', String(response.error));
                }
            }
        })
    }

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
        <div className="row m-5">
            <div className="card shadow-lg p-3 col-sm-6 offset-md-3 border">
                <p className="text-dark h3 text-center">Cadastro de Avaliação</p>
                <form className="was-validated" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <label htmlFor="NroAvaliacao">Número da Avaliação</label>
                                <InputText keyfilter="pint" style={{width: '100%'}} id="NroAvaliacao" name="NroAvaliacao"
                                    defaultValue={getNroAvaliacao} onChange={(e) => setNroAvaliacao(Number((e.target as HTMLInputElement).value))}
                                    placeholder="Digite o número da avaliação" min="1" max="999999999" required autoFocus/>
                            </div>

                            <div className="col">
                                <label htmlFor="DataAvaliacao" className="mt">Data da Avaliação</label>
                                <Calendar id="DataInternacao" style={{width: '100%'}} value={getDataAvaliacao} 
                                    onChange={(e) => setDataAvaliacao(e.value)} locale={pt_br} dateFormat="dd/mm/yy" 
                                    placeholder="Selecione a data da internação" showButtonBar monthNavigator 
                                    showIcon showOnFocus={false} required/>
                            </div>
                        </div>

                        <label htmlFor="ResultadoCulturas" className="mt-4">Resultado das Culturas</label>
                        <InputText style={{width: '100%'}} id="ResultadoCulturas" name="ResultadoCulturas"
                            defaultValue={getResultadoCulturas} onChange={(e) => {checkInput(1, (e.target as HTMLInputElement).value)}}
                            placeholder="Digite o resultado das culturas"/>
                        
                        <label htmlFor="ResCulturasAcao" className="mt-4">Ação do Resultado das Culturas</label>
                        <InputText style={{width: '100%'}} id="ResCulturasAcao" name="ResCulturasAcao"
                            defaultValue={getResCulturasAcao} onChange={(e) => {checkInput(2, (e.target as HTMLInputElement).value)}}
                            placeholder="Digite a ação do resultado das culturas"/>

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact/>
                                    <label htmlFor="DoseCorreta">Dose Correta</label>
                                    <br></br>
                                    <Dropdown className="" value={getDoseCorreta} options={options} 
                                    onChange={onDoseCorretaChange} placeholder="Selecione uma opção" style={{width: '100%'}}/>

                                <DropdownReact/>
                            </div>
                            
                            <div className="col mr-4">
                                <DropdownReact/>
                                    <label htmlFor="PosologiaCorreta">Posologia Correta</label>
                                    <br></br>
                                    <Dropdown className="" value={getPosologiaCorreta} options={options} 
                                    onChange={onPosologiaCorretaChange} placeholder="Selecione uma opção" style={{width: '100%'}}/>

                                <DropdownReact/>
                            </div>

                            <div className="col">
                                <DropdownReact/>
                                    <label htmlFor="AlertaDot">Alerta Dot</label>
                                    <br></br>
                                    <Dropdown className="" value={getAlertaDot} options={options} 
                                    onChange={onAlertaDotChange} placeholder="Selecione uma opção" style={{width: '100%'}}/>

                                <DropdownReact/>
                            </div>
                        </div>

                        <label htmlFor="AlertaDotDescricao" className="mt-4">Descrição do Alerta Dot</label>
                        <InputText style={{width: '100%'}} id="AlertaDotDescricao" name="AlertaDotDescricao"
                            defaultValue={getAlertaDotDescricao} onChange={(e) => {checkInput(3, (e.target as HTMLInputElement).value)}}
                            placeholder="Digite a descrição do alerta dot"/>

                        <label htmlFor="DisfuncaoRenal" className="mt-4">Disfuncao Renal</label>
                        <InputText style={{width: '100%'}} id="DisfuncaoRenal" name="DisfuncaoRenal"
                            defaultValue={getDisfuncaoRenal} onChange={(e) => setDisfuncaoRenal((e.target as HTMLInputElement).value)}
                            placeholder="Digite a disfunção renal" required/>

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact/>
                                    <label htmlFor="AtbContraindicacao">Contraindicação de Atb</label>
                                    <br></br>
                                    <Dropdown className="" value={getAtbContraindicacao} options={options} 
                                    onChange={onAtbContraindicacaoChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>

                                <DropdownReact/>
                            </div>
                            
                            <div className="col">
                                <DropdownReact/>
                                    <label htmlFor="AlteracaoPrescricao">Alteração da Prescrição</label>
                                    <br></br>
                                    <Dropdown className="" value={getAlteracaoPrescricao} options={options} 
                                    onChange={onAlteracaoPrescricaoChange} placeholder="Selecione uma opção" style={{width: '100%'}}/>

                                <DropdownReact/>
                            </div>
                        </div>

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact/>
                                    <label htmlFor="AtbDiluicaoInfusao">Diluição e/ou Infusão de Atb</label>
                                    <br></br>
                                    <Dropdown className="" value={getAtbDiluicaoInfusao} options={options} 
                                    onChange={onAtbDiluicaoInfusaoChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>

                                <DropdownReact/>
                            </div>
                            
                            <div className="col">
                                <DropdownReact/>
                                    <label htmlFor="InteracaoAtbMedicamento">Interação Atb e Medicamento</label>
                                    <br></br>
                                    <Dropdown className="" value={getInteracaoAtbMedicamento} options={options} 
                                    onChange={onInteracaoAtbMedicamentoChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>

                                <DropdownReact/>
                            </div>
                        </div>

                        <div className="form-row mt-4">
                            <div className="col mr-4">
                                <DropdownReact/>
                                    <label htmlFor="Hemodialise">Hemodialise</label>
                                    <br></br>
                                    <Dropdown className="" value={getHemodialise} options={options2} 
                                    onChange={onHemodialiseChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>

                                <DropdownReact/>
                            </div>
                            
                            <div className="col mr-4">
                                <DropdownReact/>
                                    <label htmlFor="AtbOral">Atb Oral</label>
                                    <br></br>
                                    <Dropdown className="" value={getAtbOral} options={options3} 
                                    onChange={onAtbOralChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>

                                <DropdownReact/>
                            </div>

                            <div className="col">
                                <DropdownReact/>
                                    <label htmlFor="TrocaAtb">Troca do Atb</label>
                                    <br></br>
                                    <Dropdown className="" value={getTrocaAtb} options={options} 
                                    onChange={onTrocaAtbChange} placeholder="Selecione uma opção" style={{width: '100%'}} required/>

                                <DropdownReact/>
                            </div>
                        </div>

                        <label htmlFor="NovoAtb" className="mt-4">Novo Atb</label>
                        <InputText style={{width: '100%'}} id="NovoAtb" name="NovoAtb"
                            defaultValue={getNovoAtb} onChange={(e) => {checkInput(4, (e.target as HTMLInputElement).value)}}
                            placeholder="Digite o novo Atb"/>

                    </div>
                    
                    <button type="submit" className="btn btn-info btn-primary mt-3 mb-3">Cadastrar</button>
                </form>
            </div>

            {getToast &&
                <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
            }
        </div>
    )
}

export default AssessmentForm