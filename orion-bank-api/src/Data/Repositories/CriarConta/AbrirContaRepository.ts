import { Conta } from "../../../Domain/Entities/Conta";
import { IAbrirContaRepository } from "../../../Domain/Interfaces/AbrirConta/IAbrirContaRepository";
import { connection } from "../../context/ConnectionString";
import { v4 as uuidv4 } from 'uuid';
import { SolicitacaoAberturaDeConta } from '../../../Enums/SituacaoSolicitacaoConta'
import { SolicitacaoAberturaConta } from "../../../Domain/Entities/SolicitacaoAberturaConta";

export class AbrirContaRepository implements IAbrirContaRepository{

    async BuscarDocumentoFederalExistente(documentoFederal: string): Promise<boolean> {
        
        const sql = `SELECT 
                        DocumentoFederal
                    FROM
                        conta
                    WHERE 
                        DocumentoFederal = ?`

        const isExiste = await (await connection).query(
            sql,
            documentoFederal
        ) as any

        return isExiste[0].length == 0 ? true : false
    }

    async ObterSolicitacoesAberturaDeConta(take: number, skip: number) : Promise<Array<SolicitacaoAberturaConta>> {
        
        const parametros =  [
            SolicitacaoAberturaDeConta.Ativa,
            take,
            skip
        ]

        const sql = `SELECT
                        *
                    FROM
                        solicitacao_abertura_conta
                    WHERE
                        Situacao = ?
                    LIMIT ? OFFSET ?`

        const solicitacoesAberturaConta = await (await connection).query(
            sql,
            parametros
        ) as any

        return solicitacoesAberturaConta[0] as Array<SolicitacaoAberturaConta>
    }

    async BuscarContaPorDocumentoFederal(documentoFederal: string) : Promise<Conta> {

        const sql = `SELECT 
                        *
                    FROM
                        Conta
                    WHERE
                        DocumentoFederal = ?`

        const conta = await (await connection).query(
            sql,
            [
                documentoFederal
            ]
        ) as any

        return conta[0][0] as Conta

    }

    async EfetuarAberturaDeConta(conta: Conta, codigoSolicitacao: string) : Promise<void> {
        
        const parametros = [
            conta.Codigo,
            conta.Agencia,
            conta.Conta,
            conta.ContaDigito,
            conta.ContaPgto,
            conta.DocumentoFederal,
            conta.NomeCompleto,
            conta.Senha,
            conta.Email,
            conta.DtNasc,
            conta.TelefoneCelular,
            conta.CEP,
            conta.Logradouro,
            conta.NumeroResidencial,
            conta.DtInclusao,
            SolicitacaoAberturaDeConta.Ativa,
            new Date()
        ]

        const sql = `INSERT INTO conta (Codigo, Agencia, Conta, ContaDigito, ContaPgto, 
                                        DocumentoFederal, NomeCompleto, Senha, Email, 
                                        DtNasc, TelefoneCelular, CEP, Logradouro, 
                                        NumeroResidencial, DtInclusao, Situacao, DtSituacao)
                    VALUES (?, ?, ?, ?, ?, ?, ?, MD5(?), ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        await (await connection).query(
            sql,
            parametros
        )

        const parametrosUpdate = [
            SolicitacaoAberturaDeConta.Aprovada,
            codigoSolicitacao
        ]

        const sqlUpdate = `UPDATE
                                solicitacao_abertura_conta
                            SET 
                                Situacao = ?
                            WHERE 
                                Codigo = ?`
        
        await (await connection).query(
            sqlUpdate,
            parametrosUpdate
        )
    }
    
    async SolicitacaoAberturaDeConta(mensagemSolicitacao: string) : Promise<void> {

        const parametros = [
            uuidv4(),
            mensagemSolicitacao,
            SolicitacaoAberturaDeConta.Ativa,
            new Date(),
            new Date()
        ]

        const sql = `INSERT INTO
                        solicitacao_abertura_conta 
                            (Codigo, MensagemSolicitacao, Situacao, DtSituacao, DtInclusao)
                    VALUES
                        (?, ?, ?, ?, ?)`

        await (await connection).query(
            sql,
            parametros
        );
    }

    async ReprovarAberturaDeConta(codigo: string) : Promise<SolicitacaoAberturaConta> {

        const parametros = [
            SolicitacaoAberturaDeConta.Recusada,
            new Date(),
            codigo
        ]

        const sqlUpdate = `UPDATE
                                solicitacao_abertura_conta
                            SET
                                Situacao = ?,
                                DtSituacao = ?
                            WHERE Codigo = ?`

        await (await connection).query(
            sqlUpdate,
            parametros
        )

        const sqlSelect = `SELECT
                                *
                            FROM
                                solicitacao_abertura_conta
                            WHERE Codigo = ?`

        const conta = await (await connection).query(
            sqlSelect,
            [
                codigo
            ]
        ) as any

        return conta[0][0]
    }

    async BuscarContaPorChavePix(chavePix: string, codigo: string) : Promise<Conta> {
        
        const parametros = [
            chavePix,
            chavePix,
            chavePix,
            codigo
        ]

        const sql = `SELECT 
                        * 
                    FROM 
                        conta 
                    WHERE (
                            DocumentoFederal = ?
                        OR
                            Email = ?
                        OR
                            TelefoneCelular = ?
                    ) AND Codigo != ?`

        const conta = await (await connection).query(
                    sql,
                    parametros
                ) as any

        return conta[0][0] as Conta

    }

    async BuscarContaPorEmail(email: string) : Promise<boolean> {

        const sql = `SELECT *
                    FROM
                        conta
                    WHERE
                        Email = ?`

        const conta = await (await connection).query(
            sql,
            [
                email
            ]
        ) as any

        return conta[0].length == 0 ? true : false

    }

    async BuscarContaPorTelefone(telefone: string) : Promise<boolean> {

        const sql = `SELECT *
                    FROM
                        conta
                    WHERE
                        TelefoneCelular = ?`

        const conta = await (await connection).query(
            sql,
            [
                telefone
            ]
        ) as any
        
        return conta[0].length == 0 ? true : false
    }
}