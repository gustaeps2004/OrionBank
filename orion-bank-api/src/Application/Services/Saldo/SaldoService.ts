import { SaldoRepository } from "../../../Data/Repositories/Saldo/SaldoRepository";
import { Saldo } from "../../../domain/entities/Saldo";
import { ISaldoService } from "../../Interfaces/Saldo/ISaldoService";

const saldoRepository = new SaldoRepository()

export class SaldoService implements ISaldoService {

    async ObterSaldoPorCodigo(codigo: string): Promise<Saldo> {
        
        if(codigo === null || codigo.trim() === "" || codigo.trim().length != 36) {
            throw new Error("Erro interno.")
        }

        const saldo = await saldoRepository.ObterSaldoPorCodigo(codigo)

        if(!saldo) {
            throw new Error("Erro ao buscar o saldo.")
        }

        return saldo;

    }

}