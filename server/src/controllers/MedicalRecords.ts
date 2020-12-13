/****************************************
| Data: 28/08/2020                      |
| Resumo: Controlador Prontuário (CRUD) |
| Sistema: GAFio                        |
****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";
import MedicalRecordLog from '../jobs/MedicalRecordLog';


class ProntuarioController {
    //CRIAR PRONTUARIO
    async create(request: Request, response: Response) {
        const {
            NroProntuario,
            SeqPaciente,
            DataInternacao,
            CodDoencaPrincipal,
            CodDoencaSecundario,
            SistemaAcometido,
            CodComorbidade,
            Origem,
            Alocacao,
            ResultadoColeta,
            CodAtbPrimario,
            CodAtbSecundario,
            SitioInfeccaoPrimario,
            TratamentoCCIH,
            IndicacaoSepse,
            DisfuncaoRenal,
            OrigemInfeccao,
            DoseCorreta,
            PosologiaCorreta,
            email
        } = request.body

        if (!NroProntuario || !SeqPaciente || !DataInternacao || !CodDoencaPrincipal || !SistemaAcometido || !Origem || !Alocacao || !CodAtbPrimario || !TratamentoCCIH || !IndicacaoSepse || !DisfuncaoRenal || !OrigemInfeccao) {
            return response.json({
                CreatedMedicalRecords: false,
                error: "Preencha todos os campos necessários."
            })
        } else {
            const MedicalRecordDB = await knex("Prontuario").where("NroProntuario", NroProntuario);
            const MedicalRecord = MedicalRecordDB[0];

            if (!MedicalRecord) {
                const patientDB = await knex("Paciente").where("SeqPaciente", SeqPaciente)
                const patient = patientDB[0]

                if (patient) {
                    var DataInternacaoTratada = DataInternacao.substring(0, 10);
                    var res = DataInternacaoTratada.split("-")
                    var dataTratada = res[2] + "/" + res[1] + "/" + res[0]

                    await knex("Prontuario").insert({
                        NroProntuario,
                        SeqPaciente,
                        DataInternacao: dataTratada,
                        CodDoencaPrincipal,
                        CodDoencaSecundario,
                        SistemaAcometido,
                        CodComorbidade,
                        Origem,
                        Alocacao,
                        ResultadoColeta,
                        CodAtbPrimario,
                        CodAtbSecundario,
                        SitioInfeccaoPrimario,
                        TratamentoCCIH,
                        IndicacaoSepse,
                        DisfuncaoRenal,
                        OrigemInfeccao,
                        DoseCorreta,
                        PosologiaCorreta
                    }).then((SeqProntuarioDB) => {
                        knex("Historico").insert({ "IdProntuario": SeqProntuarioDB, "IdPaciente": patient.SeqPaciente }).then(() => {
                            MedicalRecordLog.handleSuccessfulCreation(email);
                            return response.json({ CreatedMedicalRecord: true });
                        }).catch((error) => {
                            MedicalRecordLog.handleUnsuccessfulCreation(email, error);
                            return response.json({ CreatedMedicalRecord: false, error });
                        })
                    }).catch(error => {
                         MedicalRecordLog.handleUnsuccessfulCreation(email, error);
                        return response.json({ CreatedMedicalRecord: false, error });
                    })
                } else {
                    MedicalRecordLog.handleUnsuccessfulCreation(email, "Paciente inexistente");
                    return response.json({
                        CreatedMedicalRecord: false,
                        error: "A sequência de paciente não existe."
                    });
                }
            } else {
                MedicalRecordLog.handleUnsuccessfulCreation(email, "Prontuário existente");
                return response.json({
                    CreatedMedicalRecord: false,
                    error: "O número de prontuário já existe."
                });
            }
        }
    }

    //LISTA DOS PRONTUARIOS
    async index(request: Request, response: Response) {
        const MedicalRecord = await knex("Prontuario").select("*");
        return response.send(MedicalRecord);
    }

    //PAGINACAO DA LISTA DE PRONTUARIOS
    async indexPagination(request: Request, response: Response) {
        var page = String(request.query.page);
        if (!page) {
            page = "10"
        }
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            const MedicalRecords = await knex("Prontuario").select("*").orderBy('SeqProntuario', 'desc').offset((pageRequest - 1) * rows).limit(rows)

            var serializedMedicalRecords = MedicalRecords.map(MedicalRecord => {
                var newDesfecho
                if (MedicalRecord.Desfecho == null) {
                    newDesfecho = "Sem desfecho"
                } else {
                    if (MedicalRecord.Desfecho == "A") {
                        newDesfecho = "Alta"
                    }
                    if (MedicalRecord.Desfecho == "O") {
                        newDesfecho = "Óbito"
                    }
                    if (MedicalRecord.Desfecho == "T") {
                        newDesfecho = "Transferência"
                    }
                }
                return {
                    SeqProntuario: MedicalRecord.SeqProntuario,
                    NroProntuario: MedicalRecord.NroProntuario,
                    SeqPaciente: MedicalRecord.SeqPaciente,
                    DataNascimento: null,
                    NomePaciente: null,
                    Genero: null,
                    DataInternacao: MedicalRecord.DataInternacao,
                    DiagnosticoPrincipal: MedicalRecord.CodDoencaPrincipal,
                    CodDoencaPrincipal: MedicalRecord.CodDoencaPrincipal,
                    Alocacao: MedicalRecord.Alocacao,
                    Desfecho: newDesfecho,
                    CodDoencaSecundario: MedicalRecord.CodDoencaSecundario,
                    SistemaAcometido: MedicalRecord.SistemaAcometido,
                    CodComorbidade: MedicalRecord.CodComorbidade,
                    Origem: MedicalRecord.Origem,
                    ResultadoColeta: MedicalRecord.ResultadoColeta,
                    CodAtbPrimario: MedicalRecord.CodAtbPrimario,
                    CodAtbSecundario: MedicalRecord.CodAtbSecundario,
                    SitioInfeccaoPrimario: MedicalRecord.SitioInfeccaoPrimario,
                    TratamentoCCIH: MedicalRecord.TratamentoCCIH,
                    IndicacaoSepse: MedicalRecord.IndicacaoSepse,
                    DisfuncaoRenal: MedicalRecord.DisfuncaoRenal,
                    OrigemInfeccao: MedicalRecord.OrigemInfeccao,
                    DoseCorreta: MedicalRecord.DoseCorreta,
                    PosologiaCorreta: MedicalRecord.PosologiaCorreta,
                    DataDesfecho: MedicalRecord.DataDesfecho
                }
            })
            for (let i = 0; i < serializedMedicalRecords.length; i++) {
                const patientDB = await knex("Paciente").where("SeqPaciente", serializedMedicalRecords[i]["SeqPaciente"]);
                serializedMedicalRecords[i]['NomePaciente'] = patientDB[0]['NomePaciente'];
                serializedMedicalRecords[i]['Genero'] = patientDB[0]['Genero'];
                serializedMedicalRecords[i]['DataNascimento'] = patientDB[0]['DataNascimento'];
                const diseaseDB = await knex("Doenca").where("CodDoenca", serializedMedicalRecords[i]["DiagnosticoPrincipal"]);
                serializedMedicalRecords[i]['DiagnosticoPrincipal'] = diseaseDB[0]['Nome'];
            }
            const MedicalRecordsLength = (await knex("Prontuario").select("*")).length;
            return response.json({ showMedicalRecords: true, medicalRecords: serializedMedicalRecords, length: MedicalRecordsLength });
        } catch (err) {
            return response.json({ showMedicalRecords: false, error: err });
        }
    }

    //FILTROS DE BUSCA
    //FILTRAR POR NroProntuario
    async indexByNroProntuario(request: Request, response: Response) {
        const { nroProntuario } = request.query;
        var page = String(request.query.page);
        if (!page) {
            page = "10"
        }
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            const MedicalRecord = await knex("Prontuario").where('NroProntuario', 'like', `%${nroProntuario}%`).offset((pageRequest - 1) * rows).limit(rows);
            var serializedMedicalRecords = MedicalRecord.map(MedicalRecord => {
                var newDesfecho
                if (MedicalRecord.Desfecho == null) {
                    newDesfecho = "Sem desfecho"
                } else {
                    if (MedicalRecord.Desfecho == "A") {
                        newDesfecho = "Alta"
                    }
                    if (MedicalRecord.Desfecho == "O") {
                        newDesfecho = "Óbito"
                    }
                    if (MedicalRecord.Desfecho == "T") {
                        newDesfecho = "Transferência"
                    }
                }
                return {
                    SeqProntuario: MedicalRecord.SeqProntuario,
                    NroProntuario: MedicalRecord.NroProntuario,
                    SeqPaciente: MedicalRecord.SeqPaciente,
                    DataNascimento: null,
                    NomePaciente: null,
                    Genero: null,
                    DataInternacao: MedicalRecord.DataInternacao,
                    DiagnosticoPrincipal: MedicalRecord.CodDoencaPrincipal,
                    CodDoencaPrincipal: MedicalRecord.CodDoencaPrincipal,
                    Alocacao: MedicalRecord.Alocacao,
                    Desfecho: newDesfecho,
                    CodDoencaSecundario: MedicalRecord.CodDoencaSecundario,
                    SistemaAcometido: MedicalRecord.SistemaAcometido,
                    CodComorbidade: MedicalRecord.CodComorbidade,
                    Origem: MedicalRecord.Origem,
                    ResultadoColeta: MedicalRecord.ResultadoColeta,
                    CodAtbPrimario: MedicalRecord.CodAtbPrimario,
                    CodAtbSecundario: MedicalRecord.CodAtbSecundario,
                    SitioInfeccaoPrimario: MedicalRecord.SitioInfeccaoPrimario,
                    TratamentoCCIH: MedicalRecord.TratamentoCCIH,
                    IndicacaoSepse: MedicalRecord.IndicacaoSepse,
                    DisfuncaoRenal: MedicalRecord.DisfuncaoRenal,
                    OrigemInfeccao: MedicalRecord.OrigemInfeccao,
                    DoseCorreta: MedicalRecord.DoseCorreta,
                    PosologiaCorreta: MedicalRecord.PosologiaCorreta,
                    DataDesfecho: MedicalRecord.DataDesfecho
                }
            })
            for (let i = 0; i < serializedMedicalRecords.length; i++) {
                const patientDB = await knex("Paciente").where("SeqPaciente", serializedMedicalRecords[i]["SeqPaciente"]);
                serializedMedicalRecords[i]['NomePaciente'] = patientDB[0]['NomePaciente'];
                serializedMedicalRecords[i]['Genero'] = patientDB[0]['Genero'];
                serializedMedicalRecords[i]['DataNascimento'] = patientDB[0]['DataNascimento'];
                const diseaseDB = await knex("Doenca").where("CodDoenca", serializedMedicalRecords[i]["DiagnosticoPrincipal"]);
                serializedMedicalRecords[i]['DiagnosticoPrincipal'] = diseaseDB[0]['Nome'];
            }
            const MedicalRecordsLength = (await knex("Prontuario").count('NroProntuario').where('NroProntuario', 'like', `%${nroProntuario}%`));
            return response.json({ showMedicalRecords: true, medicalRecords: serializedMedicalRecords, length: MedicalRecordsLength, length1: serializedMedicalRecords.length });
        } catch (err) {
            return response.json({ showMedicalRecords: false, error: err });
        }
    }

    //FILTRAR POR SeqPaciente
    async indexBySeqPaciente(request: Request, response: Response) {
        const { seqPaciente } = request.query;
        var page = String(request.query.page);
        if (!page) {
            page = "10"
        }
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            const MedicalRecord = await knex("Prontuario").where('SeqPaciente', 'like', `%${seqPaciente}%`).offset((pageRequest - 1) * rows).limit(rows);
            var serializedMedicalRecords = MedicalRecord.map(MedicalRecord => {
                var newDesfecho
                if (MedicalRecord.Desfecho == null) {
                    newDesfecho = "Sem desfecho"
                } else {
                    if (MedicalRecord.Desfecho == "A") {
                        newDesfecho = "Alta"
                    }
                    if (MedicalRecord.Desfecho == "O") {
                        newDesfecho = "Óbito"
                    }
                    if (MedicalRecord.Desfecho == "T") {
                        newDesfecho = "Transferência"
                    }
                }
                return {
                    SeqProntuario: MedicalRecord.SeqProntuario,
                    NroProntuario: MedicalRecord.NroProntuario,
                    SeqPaciente: MedicalRecord.SeqPaciente,
                    DataNascimento: null,
                    NomePaciente: null,
                    Genero: null,
                    DataInternacao: MedicalRecord.DataInternacao,
                    DiagnosticoPrincipal: MedicalRecord.CodDoencaPrincipal,
                    CodDoencaPrincipal: MedicalRecord.CodDoencaPrincipal,
                    Alocacao: MedicalRecord.Alocacao,
                    Desfecho: newDesfecho,
                    CodDoencaSecundario: MedicalRecord.CodDoencaSecundario,
                    SistemaAcometido: MedicalRecord.SistemaAcometido,
                    CodComorbidade: MedicalRecord.CodComorbidade,
                    Origem: MedicalRecord.Origem,
                    ResultadoColeta: MedicalRecord.ResultadoColeta,
                    CodAtbPrimario: MedicalRecord.CodAtbPrimario,
                    CodAtbSecundario: MedicalRecord.CodAtbSecundario,
                    SitioInfeccaoPrimario: MedicalRecord.SitioInfeccaoPrimario,
                    TratamentoCCIH: MedicalRecord.TratamentoCCIH,
                    IndicacaoSepse: MedicalRecord.IndicacaoSepse,
                    DisfuncaoRenal: MedicalRecord.DisfuncaoRenal,
                    OrigemInfeccao: MedicalRecord.OrigemInfeccao,
                    DoseCorreta: MedicalRecord.DoseCorreta,
                    PosologiaCorreta: MedicalRecord.PosologiaCorreta,
                    DataDesfecho: MedicalRecord.DataDesfecho
                }
            })
            for (let i = 0; i < serializedMedicalRecords.length; i++) {
                const patientDB = await knex("Paciente").where("SeqPaciente", serializedMedicalRecords[i]["SeqPaciente"]);
                serializedMedicalRecords[i]['NomePaciente'] = patientDB[0]['NomePaciente'];
                serializedMedicalRecords[i]['Genero'] = patientDB[0]['Genero'];
                serializedMedicalRecords[i]['DataNascimento'] = patientDB[0]['DataNascimento'];
                const diseaseDB = await knex("Doenca").where("CodDoenca", serializedMedicalRecords[i]["DiagnosticoPrincipal"]);
                serializedMedicalRecords[i]['DiagnosticoPrincipal'] = diseaseDB[0]['Nome'];
            }
            const MedicalRecordsLength = (await knex("Prontuario").count('SeqPaciente').where('SeqPaciente', 'like', `%${seqPaciente}%`));
            return response.json({ showMedicalRecords: true, medicalRecords: serializedMedicalRecords, length: MedicalRecordsLength, length1: serializedMedicalRecords.length });
        } catch (err) {
            return response.json({ showMedicalRecords: false, error: err });
        }
    }

    //FILTRAR POR DataInternacao
    async indexByDataInternacao(request: Request, response: Response) {
        const { dataInternacao } = request.query;
        var page = String(request.query.page);
        if (!page) {
            page = "10"
        }
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            const MedicalRecord = await knex("Prontuario").where('DataInternacao', 'like', `%${dataInternacao}%`).offset((pageRequest - 1) * rows).limit(rows);
            var serializedMedicalRecords = MedicalRecord.map(MedicalRecord => {
                var newDesfecho
                if (MedicalRecord.Desfecho == null) {
                    newDesfecho = "Sem desfecho"
                } else {
                    if (MedicalRecord.Desfecho == "A") {
                        newDesfecho = "Alta"
                    }
                    if (MedicalRecord.Desfecho == "O") {
                        newDesfecho = "Óbito"
                    }
                    if (MedicalRecord.Desfecho == "T") {
                        newDesfecho = "Transferência"
                    }
                }
                return {
                    SeqProntuario: MedicalRecord.SeqProntuario,
                    NroProntuario: MedicalRecord.NroProntuario,
                    SeqPaciente: MedicalRecord.SeqPaciente,
                    DataNascimento: null,
                    NomePaciente: null,
                    Genero: null,
                    DataInternacao: MedicalRecord.DataInternacao,
                    DiagnosticoPrincipal: MedicalRecord.CodDoencaPrincipal,
                    CodDoencaPrincipal: MedicalRecord.CodDoencaPrincipal,
                    Alocacao: MedicalRecord.Alocacao,
                    Desfecho: newDesfecho,
                    CodDoencaSecundario: MedicalRecord.CodDoencaSecundario,
                    SistemaAcometido: MedicalRecord.SistemaAcometido,
                    CodComorbidade: MedicalRecord.CodComorbidade,
                    Origem: MedicalRecord.Origem,
                    ResultadoColeta: MedicalRecord.ResultadoColeta,
                    CodAtbPrimario: MedicalRecord.CodAtbPrimario,
                    CodAtbSecundario: MedicalRecord.CodAtbSecundario,
                    SitioInfeccaoPrimario: MedicalRecord.SitioInfeccaoPrimario,
                    TratamentoCCIH: MedicalRecord.TratamentoCCIH,
                    IndicacaoSepse: MedicalRecord.IndicacaoSepse,
                    DisfuncaoRenal: MedicalRecord.DisfuncaoRenal,
                    OrigemInfeccao: MedicalRecord.OrigemInfeccao,
                    DoseCorreta: MedicalRecord.DoseCorreta,
                    PosologiaCorreta: MedicalRecord.PosologiaCorreta,
                    DataDesfecho: MedicalRecord.DataDesfecho
                }
            })
            for (let i = 0; i < serializedMedicalRecords.length; i++) {
                const patientDB = await knex("Paciente").where("SeqPaciente", serializedMedicalRecords[i]["SeqPaciente"]);
                serializedMedicalRecords[i]['NomePaciente'] = patientDB[0]['NomePaciente'];
                serializedMedicalRecords[i]['Genero'] = patientDB[0]['Genero'];
                serializedMedicalRecords[i]['DataNascimento'] = patientDB[0]['DataNascimento'];
                const diseaseDB = await knex("Doenca").where("CodDoenca", serializedMedicalRecords[i]["DiagnosticoPrincipal"]);
                serializedMedicalRecords[i]['DiagnosticoPrincipal'] = diseaseDB[0]['Nome'];
            }
            const MedicalRecordsLength = (await knex("Prontuario").count('DataInternacao').where('DataInternacao', 'like', `%${dataInternacao}%`));
            return response.json({ showMedicalRecords: true, medicalRecords: serializedMedicalRecords, length: MedicalRecordsLength, length1: serializedMedicalRecords.length });
        } catch (err) {
            return response.json({ showMedicalRecords: false, error: err });
        }
    }

    //UPDATE DE DADOS
    async update(request: Request, response: Response) {
        const {
            NroProntuario,
            SeqPaciente,
            DataInternacao,
            CodDoencaPrincipal,
            CodDoencaSecundario,
            SistemaAcometido,
            CodComorbidade,
            Origem,
            Alocacao,
            ResultadoColeta,
            CodAtbPrimario,
            CodAtbSecundario,
            SitioInfeccaoPrimario,
            TratamentoCCIH,
            IndicacaoSepse,
            DisfuncaoRenal,
            OrigemInfeccao,
            DoseCorreta,
            PosologiaCorreta,
            email
        } = request.body

        if (!SeqPaciente || !DataInternacao || !CodDoencaPrincipal || !SistemaAcometido || !Origem || !Alocacao || !CodAtbPrimario || !TratamentoCCIH || !IndicacaoSepse || !DisfuncaoRenal || !OrigemInfeccao) {
            return response.json({
                updatedMedicalRecord: false,
                error: "Preencha todos os campos necessários."
            })
        } else {
            const MedicalRecordDB = await knex('Prontuario').where('NroProntuario', NroProntuario)
            const MedicalRecord = MedicalRecordDB[0]

            if (MedicalRecord) {
                const patientDB = await knex("Paciente").where("SeqPaciente", SeqPaciente)
                const patient = patientDB[0]

                if (patient) {
                    var DataInternacaoTratada = DataInternacao.substring(0, 10);
                    var res = DataInternacaoTratada.split("-")
                    var dataTratada = res[2] + "/" + res[1] + "/" + res[0]

                    await knex('Prontuario').where('NroProntuario', NroProntuario).update({
                        SeqPaciente: SeqPaciente,
                        DataInternacao: dataTratada,
                        CodDoencaPrincipal: CodDoencaPrincipal,
                        CodDoencaSecundario: CodDoencaSecundario,
                        SistemaAcometido: SistemaAcometido,
                        CodComorbidade: CodComorbidade,
                        Origem: Origem,
                        Alocacao: Alocacao,
                        ResultadoColeta: ResultadoColeta,
                        CodAtbPrimario: CodAtbPrimario,
                        CodAtbSecundario: CodAtbSecundario,
                        SitioInfeccaoPrimario: SitioInfeccaoPrimario,
                        TratamentoCCIH: TratamentoCCIH,
                        IndicacaoSepse: IndicacaoSepse,
                        DisfuncaoRenal: DisfuncaoRenal,
                        OrigemInfeccao: OrigemInfeccao,
                        DoseCorreta: DoseCorreta,
                        PosologiaCorreta: PosologiaCorreta,
                    }).then(() => {
                        knex('Historico').where('IdProntuario', MedicalRecord.SeqProntuario).update({
                            IdPaciente: SeqPaciente
                        }).then(() => {
                            MedicalRecordLog.handleSuccessfulUpdate(email, NroProntuario);
                            return response.json({ updatedMedicalRecord: true })
                        }).catch(error => {
                            MedicalRecordLog.handleUnsuccessfulUpdate(email, error, NroProntuario);
                            return response.json({ updatedMedicalRecord: false, error })
                        })
                    }).catch(error => {
                        MedicalRecordLog.handleUnsuccessfulUpdate(email, error, NroProntuario);
                        return response.json({ updatedMedicalRecord: false, error });
                    })
                } else {
                    MedicalRecordLog.handleUnsuccessfulUpdate(email, "Paciente inexistente", NroProntuario);
                    return response.json({
                        updatedMedicalRecord: false,
                        error: "A sequência de paciente não existe."
                    });
                }
            } else {
                MedicalRecordLog.handleUnsuccessfulUpdate(email, "Prontuário inexistente", NroProntuario);
                return response.json({ updatedMedicalRecord: false, error: "O número de prontuário não existe." });
            }
        }
    }

    //UPDATE NO DESFECHO
    async updateDesfecho(request: Request, response: Response) {
        const {
            NroProntuario,
            DataDesfecho,
            Desfecho,
            email
        } = request.body

        if (!DataDesfecho || !Desfecho) {
            return response.json({
                updatedMedicalRecord: false,
                error: "Preencha todos os campos necessários."
            })
        } else {
            const MedicalRecordDB = await knex('Prontuario').where('NroProntuario', NroProntuario)
            const MedicalRecord = MedicalRecordDB[0]

            if (MedicalRecord) {
                var DataDesfechoTratada = DataDesfecho.substring(0, 10);
                var res = DataDesfechoTratada.split("-")
                var dataTratada = res[2] + "/" + res[1] + "/" + res[0]
                let desfechoChar = Desfecho[0][0];

                await knex('Prontuario').where('NroProntuario', NroProntuario).update({
                    Desfecho: desfechoChar,
                    DataDesfecho: dataTratada
                }).then(() => {
                    MedicalRecordLog.handleSuccessfulUpdate(email, NroProntuario);
                    return response.json({ updatedMedicalRecord: true })
                }).catch(error => {
                    MedicalRecordLog.handleUnsuccessfulUpdate(email, error, NroProntuario);
                    return response.json({ updatedMedicalRecord: false, error, teste: 1 })
                })
            } else {
                MedicalRecordLog.handleUnsuccessfulUpdate(email, "Prontúario inexistente", NroProntuario);
                return response.json({ updatedMedicalRecord: false, error: "O número de prontuário não existe." });
            }
        }
    }

    //DELETAR PRONTUARIO
    async delete(request: Request, response: Response) {
        const { NroProntuario, email } = request.body;

        const MedicalRecordDB = await knex("Prontuario").where("NroProntuario", NroProntuario);
        const MedicalRecord = MedicalRecordDB[0];

        if (MedicalRecord) {
            await knex("Historico").where("IdProntuario", MedicalRecord.SeqProntuario).delete().then(() => {
                const AvaliacaoDB = knex("Avaliacao").where("IdProntuario", MedicalRecord.SeqProntuario)
                if (AvaliacaoDB) {
                    knex("Avaliacao").where("IdProntuario", MedicalRecord.SeqProntuario).delete().then(() => {
                        knex("Prontuario").where("NroProntuario", NroProntuario).delete().then(() => {
                            MedicalRecordLog.handleSuccessfulDelete(email, NroProntuario);                        
                            return response.json({ deletedMedicalRecord: true });
                        }).catch((error) => {
                            MedicalRecordLog.handleUnsuccessfulDelete(email, error, NroProntuario);
                            return response.json({ deletedMedicalRecord: false, error });
                        })
                    }).catch((error) => {
                        MedicalRecordLog.handleUnsuccessfulDelete(email, error, NroProntuario);
                        return response.json({ deletedMedicalRecord: false, error });
                    })
                } else {
                    knex("Prontuario").where("NroProntuario", NroProntuario).delete().then(() => {
                        MedicalRecordLog.handleSuccessfulDelete(email, NroProntuario);
                        return response.json({ deletedMedicalRecord: true });
                    }).catch((error) => {
                        MedicalRecordLog.handleUnsuccessfulDelete(email, error, NroProntuario);
                        return response.json({ deletedMedicalRecord: false, error });
                    })
                }
            }).catch((error) => {
                MedicalRecordLog.handleUnsuccessfulDelete(email, error, NroProntuario);
                return response.json({ deletedMedicalRecord: false, error });
            })
        } else {
            MedicalRecordLog.handleUnsuccessfulDelete(email, "Prontuário inexistente", NroProntuario);
            return response.json({ deletedMedicalRecord: false, error: "Prontuário não encontrado." });
        }
    }
}

export default ProntuarioController;