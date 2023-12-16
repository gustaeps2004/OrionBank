import { AbrirContaRepository } from "../../../Data/Repositories/CriarConta/AbrirContaRepository";
import { Conta } from "../../../domain/entities/Conta";
import { ContaDto } from "../../DTOs/ContaDto";
import { SolicitacaoAberturaContaDto } from "../../DTOs/SolicitacaoAberturaContaDto";
import { IAbrirContaService } from "../../Interfaces/CriarConta/IAbrirContaService";
import { EnviarEmail } from "../../../Middleware/EnviarEmail";
import { SaldoRepository } from "../../../Data/Repositories/Saldo/SaldoRepository";
import { v4 as uuidv4 } from 'uuid';
import { TituloEmail } from "../../../Enums/TituloEmail";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { AutenticacaoTokenDto } from "../../DTOs/AutenticacaoDto";
dotenv.config();

export class AbrirContaService implements IAbrirContaService {

    async BuscarContaPorCodigo(codigo: string) : Promise<Conta> {

        if(codigo === null || codigo.trim().length != 36) {
            throw new Error("Erro interno.")
        }

        const abrirContaRepository = new AbrirContaRepository()
        const conta = await abrirContaRepository.BuscarContaPorCodigo(codigo)

        return conta

    }

    async ObterSolicitacoesAberturaDeConta(take: number, skip: number): Promise<Array<SolicitacaoAberturaContaDto>> {
        
        if(take.toString() === "NaN" || take === 0) {
            throw new Error("Valor de (take) inválido")
        }
        
        if(skip.toString() === "NaN") {
            throw new Error("Valor de (skip) inválido")
        }

        const abrirContaRepository = new AbrirContaRepository()
        const registrosSolicitacao = await abrirContaRepository.ObterSolicitacoesAberturaDeConta(take, skip)

        let registros: Array<SolicitacaoAberturaContaDto> = [];

        if(registrosSolicitacao.length != 0) {
            for(let cont = 0; cont < registrosSolicitacao.length; cont++) {
                const conta = JSON.parse(
                    registrosSolicitacao[cont].MensagemSolicitacao
                ) as Conta

                registros.push({
                    ID: registrosSolicitacao[cont].ID,
                    Codigo: registrosSolicitacao[cont].Codigo,
                    DtInclusao: registrosSolicitacao[cont].DtInclusao,
                    DtSituacao: registrosSolicitacao[cont].DtInclusao,
                    Situacao: registrosSolicitacao[cont].Situacao,
                    conta: conta
                })
            }
        }

        return registros;
    }

    async BuscarContaPorDocumentoFederal(documentoFederal: string) : Promise<boolean> {

        let th = this;
        if (!th.ValidarDocumentoFederal(documentoFederal.replace(/[^0-9]/g, ""))) {
            throw new Error("Documento federal inválido.")
        }

        const abrirContaRepository = new AbrirContaRepository()
        const conta = await abrirContaRepository.BuscarContaPorDocumentoFederal(documentoFederal.replace(/[^0-9]/g, ""))
        
        if(!conta) {
            return false;
        }

        const token = th.CriarTokenJWT(conta)

        const htmlRecuperacao = `<h3>
                                    Prezado(a) ${conta.NomeCompleto}, 
                                </h3>
                                <p>
                                    Realize <a href="${process.env.URL_CRIAR_SENHA}/recuperar?codigo=${token.Codigo}&token=${token.Token}">aqui</a> a alteração da sua senha.
                                </p>
                                <br/>
                                <br/>
                                <img 
                                    src="cid:${conta.Email}"
                                    alt="Imagem logo orion bank"
                                    style="
                                        width: 200px; 
                                        height: 80px;
                                    "
                                />`

        await EnviarEmail(conta.Email, htmlRecuperacao, TituloEmail.Recuperacao);
        return true;

    }

    async EfetuarAberturaDeConta(contaDto: ContaDto, codigoSolicitacao: string): Promise<void> {
        let th = this

        contaDto.DocumentoFederal = contaDto.DocumentoFederal.replace(/[^0-9]/g, "")
        await th.ValidarCriacaoDeConta(contaDto)

        if(codigoSolicitacao === undefined || codigoSolicitacao === null || codigoSolicitacao.trim() === "") {
            throw new Error("Codigo solicitação inválido.")
        }

        const abrirContaRepository = new AbrirContaRepository()
        let conta = th.DtoToDomain(contaDto)
        const senha = th.GerarNumeroAleatorio(8)
        const codigo = uuidv4()
        
        conta.Agencia = "0001";
        conta.Conta = th.GerarNumeroAleatorio(8);
        conta.ContaDigito = "8";
        conta.ContaPgto = `${conta.Conta}${conta.ContaDigito}` 
        conta.Senha = senha;
        conta.Codigo = codigo;
        conta.DtNasc = th.FormatarData(conta.DtNasc);

        await abrirContaRepository.EfetuarAberturaDeConta(conta, codigoSolicitacao);

        const token = th.CriarTokenJWT(conta)

        const htmlAprovacao =  `<h3>
                                    Prezado(a) ${conta.NomeCompleto},
                                </h3>
                                <p>
                                    Avaliamos seus dados e não encontramos nenhuma inconsistência.
                                </p>
                                <p>
                                    Finalize sua solicitação acessando o link
                                    <a href="${process.env.URL_CRIAR_SENHA}/recuperar?codigo=${token.Codigo}&token=${token.Token}">aqui</a>.
                                </p>  
                                <br/>
                                <br/>
                                <img 
                                    src="cid:${conta.Email}"
                                    alt="Imagem logo orion bank"
                                    style="
                                        width: 200px; 
                                        height: 80px;
                                    "
                                />`;

        await EnviarEmail(conta.Email, htmlAprovacao, TituloEmail.Aprovado);

        const saldo = new SaldoRepository();
        await saldo.IniciarSaldoInicialConta(conta.Codigo);
    }

    async SolicitacaoAberturaDeConta(contaDto: ContaDto): Promise<void> {

        let th = this
        await th.ValidarCriacaoDeConta(contaDto)

        const abrirContaRepository = new AbrirContaRepository()
        const conta = th.DtoToDomain(contaDto)

        await abrirContaRepository.SolicitacaoAberturaDeConta(JSON.stringify(conta));
    }

    async ReprovarAberturaDeConta(codigo: string): Promise<void> {

        const abrirContaRepository = new AbrirContaRepository()
        const conta = await abrirContaRepository.ReprovarAberturaDeConta(codigo)

        if(conta === null || !conta) {
            throw new Error("Conta inexistente.")
        }

        const contaJson = JSON.parse(conta.MensagemSolicitacao) as Conta

        const htmlReprovacao = `<h3>
                                    Prezado(a) ${contaJson.NomeCompleto}
                                </h3>
                                <P>
                                    Avaliamos seus dados e encontramos inconsistências. Infelizmente não foi possível prosseguir com a criação de sua conta.
                                </P>
                                <br/>
                                <br/>
                                <img 
                                    src="cid:${contaJson.Email}"
                                    alt="Imagem logo orion bank"
                                    style="
                                        width: 200px; 
                                        height: 80px;
                                    " 
                                />`

        await EnviarEmail(contaJson.Email, htmlReprovacao, TituloEmail.Reprovado)
    }

    private GerarNumeroAleatorio(quantidade: number) : string {
        const numero = Math.random().toString().replace("0.", "")
        return numero.substring(0, quantidade).toString()
    }
    
    private async ValidarCriacaoDeConta(contaDto: ContaDto) : Promise<void> {
        
        if(this.ValidarDocumentoFederal(contaDto.DocumentoFederal) != true) {
            throw new Error("Documento federal inválido.")
        }

        const abrirContaRepository = new AbrirContaRepository()
        if(await abrirContaRepository.BuscarDocumentoFederalExistente(
            contaDto.DocumentoFederal
        ) != true) {
            throw new Error("Documento federal já existente.")
        }        

        if(contaDto.NomeCompleto === null || contaDto.NomeCompleto.trim() === "" ||
        contaDto.NomeCompleto.length > 200 || contaDto.NomeCompleto.length < 5) {
            throw new Error("Nome é obrigatório. Nome tem que estar entre 5 e 200 caracteres.")
        }

        if(contaDto.Email === null || contaDto.Email.trim() === "" || 
        contaDto.Email.length > 100) {
            throw new Error("Email é obrigatório. Email tem que conter no máximo 100 caracteres.")
        }

        if(await abrirContaRepository.BuscarContaPorEmail(contaDto.Email) != true) {
            throw new Error("Email já existente.")
        }

        if(contaDto.TelefoneCelular === null || contaDto.TelefoneCelular.trim() === "" ||
        contaDto.TelefoneCelular.length != 11) {
            throw new Error("Número de telefone é obrigatório.")
        }

        if(await abrirContaRepository.BuscarContaPorTelefone(contaDto.TelefoneCelular) != true) {
            throw new Error("telefone já existente.")
        }

        if(contaDto.CEP === null || contaDto.CEP.trim() === "" ||
        contaDto.CEP.length != 8) {
            throw new Error("CEP é obrigatório.")
        }

        if(contaDto.Logradouro === null || contaDto.Email.trim() === "" || 
        contaDto.Logradouro.length > 60) {
            throw new Error("Logradouro é obrigatório. Logradouro tem que conter no máximo 60 caracteres.")
        }

        if(contaDto.NumeroResidencial === null || contaDto.NumeroResidencial.toString().trim() === "") {
            throw new Error("Número residencial é obrigatório.")
        }
    }

    private ValidarDocumentoFederal(documentoFederal: string) : boolean {
        if(documentoFederal === null) return false
        if(documentoFederal.length != 11 && documentoFederal.length != 14) return false

        let th = this
        if(!th.ValidarCPF(documentoFederal) && !th.ValidarCNPJ(documentoFederal)) {
            return false
        }

        return true
    }

    private DtoToDomain(contaDto: ContaDto) : Conta {
        return {
            DocumentoFederal: contaDto.DocumentoFederal,
            NomeCompleto: contaDto.NomeCompleto,
            Email: contaDto.Email,
            DtNasc: contaDto.DtNasc,
            TelefoneCelular: contaDto.TelefoneCelular,
            CEP: contaDto.CEP,
            Logradouro: contaDto.Logradouro,
            NumeroResidencial: contaDto.NumeroResidencial,
            DtInclusao: new Date(),
            Situacao: 0,
            DtSituacao: new Date()  
        } as Conta
    }

    private ValidarCPF(cpf: string) {
        cpf = cpf.replace(/[\s.-]*/igm, '')
        if (
            !cpf ||
            cpf.length != 11 ||
            cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999" 
        ) {
            return false
        }
        var soma = 0
        var resto
        for (var i = 1; i <= 9; i++) 
            soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
        resto = (soma * 10) % 11
        if ((resto == 10) || (resto == 11))  resto = 0
        if (resto != parseInt(cpf.substring(9, 10)) ) return false
        soma = 0
        for (var i = 1; i <= 10; i++) 
            soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
        resto = (soma * 10) % 11
        if ((resto == 10) || (resto == 11))  resto = 0
        if (resto != parseInt(cpf.substring(10, 11) ) ) return false
        return true
    }

    private ValidarCNPJ(cnpj: string) {
        cnpj = cnpj.replace(/[^\d]+/g,'');
    
        if (cnpj == "00000000000000" || 
            cnpj == "11111111111111" || 
            cnpj == "22222222222222" || 
            cnpj == "33333333333333" || 
            cnpj == "44444444444444" || 
            cnpj == "55555555555555" || 
            cnpj == "66666666666666" || 
            cnpj == "77777777777777" || 
            cnpj == "88888888888888" || 
            cnpj == "99999999999999")
            return false;
            
        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0,tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2)
                pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != parseInt(digitos.charAt(0)))
            return false;
            
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != parseInt(digitos.charAt(1)))
            return false;
            
        return true;
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
                expiresIn: '24h' 
            }
        );

        const autenticador = {
            Token: token,
            Codigo: conta.Codigo
        } as AutenticacaoTokenDto

        return autenticador;

    }

    private FormatarData(data: any) : Date {

        const teste = data.toString().split("/")

        return new Date(`${teste[2]}-${teste[1]}-${teste[0]}`);

    }

}