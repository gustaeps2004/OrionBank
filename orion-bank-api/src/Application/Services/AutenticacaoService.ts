import { Conta } from '../../domain/entities/Conta';
import { AutenticacaoDto, AutenticacaoTokenDto } from '../DTOs/AutenticacaoDto';
import { IAutenticacaoService } from '../Interfaces/IAutenticacaoService'
import { AutenticacaoRepository } from '../../Data/Repositories/AutenticacaoRepository';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export class AutenticacaoService implements IAutenticacaoService {

    async EfetuarLogin(conta: AutenticacaoDto): Promise<AutenticacaoTokenDto> {
        let th = this;

        th.ValidatarParametros(conta);
        const _autenticacaaoRepository = new AutenticacaoRepository()
        const [loginConta,] = await _autenticacaaoRepository.EfetuarConsultaContaExistente(conta) as any;

        if(loginConta.length === 0) {
            return {} as AutenticacaoTokenDto
        }

        return th.CriarTokenJWT(loginConta[0] as Conta);
    }
    
    private CriarTokenJWT(conta: Conta): AutenticacaoTokenDto {

        const secret = process.env.SECRET_JWT as string;
        const token = jwt.sign(
            {
                Nome: conta.NomeCompleto,
                Email: conta.Email,
                TipoConta: conta.TipoConta
            },
            secret, 
            { 
                expiresIn: '1h' 
            }
        );

        const autenticador = {
            Token: token,
            Codigo: conta.Codigo
        } as AutenticacaoTokenDto

        return autenticador;

    }

    private ValidatarParametros(conta: AutenticacaoDto) : void {
        if(conta.Login === null || conta.Login.trim() === "" || 
        (conta.Login.length != 11 && conta.Login.length != 14)) {
            throw new Error("Usuário inválido.")    
        }

        if(conta.Senha === null || conta.Senha.trim() === "") {
            throw new Error("Usuário inválido.")    
        }
    } 
}