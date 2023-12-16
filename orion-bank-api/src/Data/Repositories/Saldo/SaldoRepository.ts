import { ISaldoRepository } from "../../../Domain/Interfaces/Saldo/ISaldoRepository";
import { v4 as uuidv4 } from 'uuid';
import { connection } from "../../context/ConnectionString";
import { Saldo } from "../../../domain/entities/Saldo";

export class SaldoRepository implements ISaldoRepository {

    async IniciarSaldoInicialConta(codigoConta: string): Promise<void> {
        
        const parametrosConta = [
            uuidv4(),
            codigoConta,
            new Date(),
            1000
        ]

        const sqlSaldo = `INSERT INTO
                        saldo
                        (Codigo, CodigoConta, DtAtualizacao, Saldo)
                    VALUES
                        (?, ?, ?, ?)`

        await (await connection).query(
            sqlSaldo,
            parametrosConta
        )

        const parametrosSaldoConta = [
            uuidv4(),
            codigoConta,
            1000000,
            1000000,
            new Date()
        ]

        const sqlSaldoConta = `INSERT INTO
                                    saldo_data
                                    (Codigo, CodigoConta, SaldoInicial, SaldoFinal, DtInclusao)
                                VALUES
                                    (?, ?, ?, ?, ?)`

        await (await connection).query(
            sqlSaldoConta,
            parametrosSaldoConta
        )
    }

    async ObterSaldoPorCodigo(codigo: string) : Promise<Saldo> {

        const sql = `SELECT 
                        *
                    FROM
                        saldo
                    WHERE
                        CodigoConta = ?`

        const saldo = await (await connection).query(
            sql,
            [
                codigo
            ]
        ) as any

        return saldo[0][0] as Saldo
    }
    
}