export interface IMicrobiology {
    IdMicrobiologia?: number;
    IdPaciente: number;
    IdProntuario: number;
    DataColeta: any;
    DataResultado: any;
    SwabNasal: string;
    SwabNasalObservacoes?: string;
    SwabRetal: string;
    SwabRetalObservacoes?: string;
    Sangue: string;
    SangueObservacoes: string;
    Urina: string;
    UrinaObservacoes?: string;
    SecrecaoTraqueal: string;
    SecrecaoTraquealObservacoes?: string;
    Outros: string;
    OutrosObservacoes?: string;
    PerfilSensibilidade: string;
}