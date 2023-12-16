import { Conta } from "../../../domain/entities/Conta";
import { ContaDto } from "../../DTOs/ContaDto";
import { SolicitacaoAberturaContaDto } from "../../DTOs/SolicitacaoAberturaContaDto";

export interface IAbrirContaService {
    EfetuarAberturaDeConta(contaDto: ContaDto, codigoSolicitacao: string) : Promise<void>
    SolicitacaoAberturaDeConta(contaDto: ContaDto) : Promise<void>
    ObterSolicitacoesAberturaDeConta(take: number, skip: number): Promise<Array<SolicitacaoAberturaContaDto>>
    ReprovarAberturaDeConta(codigo: string) : Promise<void>
    BuscarContaPorDocumentoFederal(documentoFederal: string) : Promise<boolean>
    BuscarContaPorCodigo(codigo: string) : Promise<Conta>
}