import { MovimentoPixDto } from "../../DTOs/MovimentoDto";
import { MovimentoEMVDto } from "../../DTOs/MovimentoEMVDto";
import { Movimento } from "../../../domain/entities/Movimento";
import { MovimentoDadosBancariosDto } from "../../DTOs/MovimentoDadosBancariosDto";

export interface IMovimentoService {
    RealizarTransacaoPixViaChave(movimento: MovimentoPixDto): Promise<void>
    ObterUltimasTransacoes(codigoConta: string): Promise<Array<Movimento>>
    RealizarTransacaoPorDadosBancarios(movimento: MovimentoDadosBancariosDto): Promise<void>
    RealizarTransacaoPixViaEMV(movimento: MovimentoEMVDto): Promise<void>
}