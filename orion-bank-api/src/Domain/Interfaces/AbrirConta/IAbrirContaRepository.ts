import { Conta } from "../../Entities/Conta";
import { SolicitacaoAberturaConta } from "../../Entities/SolicitacaoAberturaConta";


export interface IAbrirContaRepository {
    EfetuarAberturaDeConta(conta: Conta, codigoSolicitacao: string) : Promise<void>
    SolicitacaoAberturaDeConta(mensagemSolicitacao: string) : Promise<void>
    BuscarContaPorDocumentoFederal(documentoFederal: string) : Promise<Conta>
    BuscarDocumentoFederalExistente(documentoFederal: string) : Promise<boolean>
    ObterSolicitacoesAberturaDeConta(take: number, skip: number) : Promise<Array<SolicitacaoAberturaConta>>
    ReprovarAberturaDeConta(codigo: string) : Promise<SolicitacaoAberturaConta>
    BuscarContaPorChavePix(chavePix: string, codigo: string) : Promise<Conta>
    BuscarContaPorEmail(email: string, telefone: string) : Promise<boolean>
    BuscarContaPorTelefone(telefone: string) : Promise<boolean>
}