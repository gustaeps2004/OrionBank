import { QRCode } from "../../../domain/entities/QrCode";
import { IQRCodeRepository } from "../../../Domain/Interfaces/QRCode/IQRCodeRepository";
import { QRCodeContaRawQuery } from "../../../Domain/RawQuery/QRCodeContaRawQuery";
import { connection } from "../../context/ConnectionString";


export class QRCodeRepository implements IQRCodeRepository {

    async BuscarQRCodePorEMV(emv: string, codigoContaOrigem: string): Promise<QRCodeContaRawQuery> {
        const sql = `SELECT 
                        qr.Valor,
                        ct.Agencia,
                        ct.ContaPgto,
                        ct.DocumentoFederal,
                        ct.NomeCompleto,
                        qr.CodigoConta
                    FROM
                        qr_code AS qr
                    INNER JOIN conta AS ct
                        ON qr.CodigoConta = ct.Codigo
                    WHERE
                        qr.EMV = ?
                    AND 
                        qr.CodigoConta != ?
                    `

        let contaEMV = await (await connection).query(
            sql,
            [
                emv,
                codigoContaOrigem
            ]
        ) as any

        return contaEMV[0][0] as QRCodeContaRawQuery
    }

    async SalvarQRCode(qrCode: QRCode): Promise<void> {
        const parametros = [
            qrCode.Codigo,
            qrCode.CodigoConta,
            qrCode.Chave_Pix,
            qrCode.Valor,
            qrCode.EMV,
            qrCode.DtInclusao,
        ]

        const sql = `INSERT INTO qr_code
                        (Codigo, CodigoConta, Chave_Pix, Valor, EMV, DtInclusao)
                    VALUES 
                        (?, ?, ?, ?, ?, ?)`

        await (await connection).query(
            sql,
            parametros
        )

    }
}