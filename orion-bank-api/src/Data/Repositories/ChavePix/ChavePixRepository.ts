import { ChavePix } from "../../../domain/entities/ChavePix";
import { Conta } from "../../../domain/entities/Conta";
import { IChavePixRepository } from "../../../Domain/Interfaces/ChavePix/IChavePixRepository";
import { Situacao } from "../../../Enums/Situacao";
import { TipoChavePix } from "../../../Enums/TipoChavePix";
import { connection } from "../../context/ConnectionString";


export class ChavePixRepository implements IChavePixRepository {

    async CriarChavePix(chavePix: ChavePix): Promise<void> {

        const parametros = [
            chavePix.Codigo,
            chavePix.CodigoConta,
            chavePix.Chave_Pix,
            chavePix.TipoChave,
            Situacao.Ativa,
            new Date(),
            new Date()
        ]

        const sql = `INSERT INTO chave_pix
                        (Codigo, CodigoConta, Chave_Pix, TipoChave, Situacao, DtSituacao, DtInclusao)
                    VALUES
                        (?, ?, ?, ?, ?, ?, ?)`

        await (await connection).query(
            sql,
            parametros
        )

    }

    async ObterChavePixPorChave(chavePix: string): Promise<ChavePix> {

        const sql = `SELECT *
                    FROM 
                        chave_pix
                    WHERE
                        Chave_Pix = ?`

        const chave = await (await connection).query(
            sql,
            [
                chavePix
            ]
        ) as any

        return chave[0][0] as ChavePix
    }

    async ObterChavePixPorCodigoConta(codigoConta: string): Promise<Array<ChavePix>> {

        const parametros = [
            codigoConta,
            Situacao.Ativa
        ]

        const sql = `SELECT *
                    FROM 
                        chave_pix
                    WHERE
                        CodigoConta = ? 
                    AND
                        Situacao = ?`

        const chavesPix = await (await connection).query(
            sql,
            parametros
        ) as any

        return chavesPix[0] as Array<ChavePix>

    }

    async ObterChavepixPorCodigo(codigo: string): Promise<ChavePix> {

        const sql = `SELECT *
                    FROM
                        chave_pix
                    WHERE
                        Codigo = ?`

        const chavePix = await (await connection).query(
            sql,
            [
                codigo
            ]
        ) as any

        return chavePix[0][0] as ChavePix
    }

    async InativarChavePix(codigo: string): Promise<void> {

        const parametros = [
            Situacao.Inativa,
            codigo
        ]

        const sql = `UPDATE chave_pix
                    SET
                        Situacao = ?
                    WHERE
                        Codigo = ?`

        await (await connection).query(
            sql,
            parametros
        )
    }

    async AtivarChavePix(codigo: string): Promise<void> {
        const parametros = [
            Situacao.Ativa,
            codigo
        ]

        const sql = `UPDATE chave_pix
                    SET
                        Situacao = ?
                    WHERE
                        Codigo = ?`

        await (await connection).query(
            sql,
            parametros
        )
    }

    async BuscarContaPorChavePix(chavePix: string, codigoConta: string): Promise<Conta> {

        const parametros = [
            chavePix,
            chavePix,
            chavePix,
            codigoConta
        ]

        const sql = `SELECT 
                        * 
                    FROM 
                        chave_pix AS CP
                    INNER JOIN conta AS C
                        ON C.Codigo = CP.CodigoConta
                        WHERE CP.Chave_Pix = ?
                        AND CP.CodigoConta != ?`

        const conta = await (await connection).query(
            sql,
            parametros
        ) as any

        return conta[0][0] as Conta

    }

    async BuscarTipoChaveExistenteAtiva(codigo: string, tipoChave: number): Promise<boolean> {

        const sql = `SELECT *
                    FROM
                        chave_pix
                    WHERE
                        CodigoConta = ?
                    AND 
                        TipoChave = ?
                    AND 
                        Situacao = ?
                    `

        const tipoChaveExiste = await (await connection).query(
            sql,
            [
                codigo,
                tipoChave,
                Situacao.Ativa
            ]
        ) as any

        const total = tipoChaveExiste[0].length > 0 ? true : false;

        return total;
    }
}