import { Conta } from "../../domain/entities/Conta";
import { connection } from "../context/ConnectionString"
import { IAutenticacaoRepository } from "../../Domain/Interfaces/IAutenticacaoRepository";
import { AutenticacaoDto } from "../../Application/DTOs/AutenticacaoDto";

export class AutenticacaoRepository implements IAutenticacaoRepository {

    async EfetuarConsultaContaExistente(conta: AutenticacaoDto): Promise<Conta> {

        const parametros = [
            conta.Login,
            conta.Senha
        ]
        
        const sql = `SELECT 
                        *
                    FROM
                        conta
                    WHERE (DocumentoFederal = ? AND Senha = MD5(?));`

        const autenticacao = await (await connection).query(
            sql,
            parametros) as unknown as Conta;
        
        return autenticacao;
    }
}