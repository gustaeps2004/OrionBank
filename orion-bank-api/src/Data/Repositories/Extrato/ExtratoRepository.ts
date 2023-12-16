import { IExtratoRepository } from "../../../Domain/Interfaces/Extrato/IExtratoRepository";
import { ExtratoMovimentoRawQuery } from "../../../Domain/RawQuery/ExtratoMovimentoRawQuery";
import { connection } from "../../context/ConnectionString";


export class ExtratoRepository implements IExtratoRepository {

    async ObterMovimentacao(codigoConta: string, dataInicio: Date, dataFim: Date): Promise<Array<ExtratoMovimentoRawQuery>> {
        const strDataInicio = `${dataInicio} 02:00:00`
        const strDataFim = `${dataFim} 21:59:59`

        const parametros = [
            codigoConta,
            codigoConta,
            strDataInicio,
            strDataFim
        ]

        const sql = `SELECT
                        m.DtMovimento Data,
                        m.InfoAdicional Descricao,
                        m.TipoTransacao,
                        FORMAT(m.Valor, 2) AS Valor,
                        m.CodigoContaDestino,
                        m.CodigoContaOrigem,
                        co.NomeCompleto NomeOrigem,
                        cd.NomeCompleto NomeDestino
                    FROM
                        movimento m

                    INNER JOIN conta co
                    ON m.CodigoContaOrigem = co.Codigo

                    INNER JOIN conta cd
                    ON m.CodigoContaDestino = cd.Codigo
                    
                    WHERE (
                        CodigoContaOrigem = ?
                    OR 
                        CodigoContaDestino = ? )
                    AND 
                        DtMovimento BETWEEN ? AND ?
                    ORDER BY
                        DtMovimento DESC`

        const movimento = await (await connection).query(
            sql,
            parametros
        ) as any

        return movimento[0] as Array<ExtratoMovimentoRawQuery>

    }
}