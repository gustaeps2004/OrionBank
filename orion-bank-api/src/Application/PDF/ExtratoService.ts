import { AbrirContaRepository } from "../../Data/Repositories/CriarConta/AbrirContaRepository";
import { ExtratoRepository } from "../../Data/Repositories/Extrato/ExtratoRepository";
import { ExtratoMovimentoRawQuery } from "../../Domain/RawQuery/ExtratoMovimentoRawQuery";
import { ValidarDataInicioMenor } from "../../Middleware/ValidarData";
import { IExtratoService } from "../Interfaces/Extrato/IExtratoService";

const _extratoRepository = new ExtratoRepository();
const _contaRepository = new AbrirContaRepository();

export class ExtratoService implements IExtratoService {

    async FormatarDadosExtrato(codigoConta: string, dataInicio: Date, dataFim: Date): Promise<Array<ExtratoMovimentoRawQuery>> {
        
        const conta = await _contaRepository.BuscarContaPorCodigo(codigoConta);
        if (!conta) {
            throw new Error("Erro interno.");
        }

        ValidarDataInicioMenor(dataInicio, dataFim);
        const extrato = await _extratoRepository.ObterMovimentacao(codigoConta, dataInicio, dataFim)

        if (extrato.length === 0) {
            throw new Error("Sem movimentações durante esse período.");
        }

        let extratoFormatado: Array<ExtratoMovimentoRawQuery> = [];

        for(let cont = 0; cont < extrato.length; cont++) {

            extratoFormatado.push({
                Data: this.SomarData(extrato[cont].Data),
                TipoTransacao: extrato[cont].TipoTransacao,
                Descricao: extrato[cont].Descricao,
                Valor: extrato[cont].Valor.replace(",", ""),
                CodigoContaDestino: extrato[cont].CodigoContaDestino,
                CodigoContaOrigem: extrato[cont].CodigoContaOrigem,
                NomeDestino: extrato[cont].NomeDestino,
                NomeOrigem: extrato[cont].NomeOrigem,
                IsSaida: extrato[cont].CodigoContaOrigem === codigoConta ? true : false
            })

        }

        return extratoFormatado
    }

    private SomarData(data: Date) : Date {
        return new Date(data.setHours(data.getHours() + 3));
    }
}