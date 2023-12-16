import { ChavePixRepository } from "../../../Data/Repositories/ChavePix/ChavePixRepository";
import { ChavePix } from "../../../domain/entities/ChavePix";
import { TipoChavePix } from "../../../Enums/TipoChavePix";
import { ChavePixDto } from "../../DTOs/ChavePixDto";
import { IChavePixService } from "../../Interfaces/ChavePix/IChavePixService";
import { v4 as uuidv4 } from "uuid";
import { Conta } from "../../../domain/entities/Conta";

const chavePixRepository = new ChavePixRepository()

export class ChavePixService implements IChavePixService {

    async CriarChavePix(chavePix: ChavePixDto): Promise<void> {
        let th = this;
        th.ValidarParametros(chavePix)

        const tipoChaveExistente = await chavePixRepository.BuscarTipoChaveExistenteAtiva(chavePix.CodigoConta, chavePix.TipoChave);
        if (tipoChaveExistente)
            throw new Error("Não é possivel criar mais de uma chave do mesmo tipo.")

        const chave = await chavePixRepository.ObterChavePixPorChave(chavePix.Chave_Pix)
        if (chave) {
            if (chave.Situacao == 2) {
                await chavePixRepository.AtivarChavePix(chave.Codigo);
                return;
            } else {
                throw new Error("Chave pix já existente.")
            }
        }

        await chavePixRepository.CriarChavePix(th.DomainToDto(chavePix))
    }

    async ObterChavePixPorCodigoConta(codigoConta: string): Promise<Array<ChavePix>> {

        if (codigoConta === null || codigoConta.trim() === "" || codigoConta.trim().length != 36) {
            throw new Error("Erro interno.")
        }

        const chavesPix = await chavePixRepository.ObterChavePixPorCodigoConta(codigoConta)

        if (chavesPix.length === 0) {
            throw new Error("Não há chaves pix para está conta.")
        }
        return chavesPix
    }

    async InativarChavePix(codigo: string): Promise<void> {

        if (codigo === null || codigo.trim() === "" || codigo.trim().length != 36) {
            throw new Error("Erro interno.")
        }

        if (!await chavePixRepository.ObterChavepixPorCodigo(codigo)) {
            throw new Error("Chave Pix inválida.")
        }

        await chavePixRepository.InativarChavePix(codigo)
    }

    async BuscarContaPorChavePix(chavePix: string, codigoConta: string): Promise<Conta> {

        if (chavePix === null || chavePix.trim() === "") {
            throw new Error("A chave pix é obrigatória.")
        }

        if (codigoConta === null || codigoConta.trim() === "") {
            throw new Error("Erro interno.")
        }

        const conta = await chavePixRepository.BuscarContaPorChavePix(chavePix, codigoConta);
        return conta;
    }

    private ValidarParametros(chavePix: ChavePixDto): void {

        const tipoChave = TipoChavePix[chavePix.TipoChave === 1 ? "DocumentoFederal"
            : chavePix.TipoChave === 2 ? "Email"
                : chavePix.TipoChave === 3 ? "Telefone"
                    : "Erro"
        ]
        if (tipoChave === 99) {
            throw new Error("Tipo de chave inválida.")
        }

        if (chavePix.Chave_Pix === null || chavePix.Chave_Pix.trim() === "") {
            throw new Error("A chave pix é obrigatória.")
        }

        if (chavePix.CodigoConta === null || chavePix.CodigoConta.trim() === "") {
            throw new Error("Conta inválida.")
        }
    }

    private DomainToDto(chavePix: ChavePixDto): ChavePix {
        return {
            Codigo: uuidv4(),
            CodigoConta: chavePix.CodigoConta,
            Chave_Pix: chavePix.Chave_Pix,
            TipoChave: chavePix.TipoChave
        } as ChavePix
    }
}