import { Saldo } from "../../../domain/entities/Saldo";


export interface ISaldoService {
    ObterSaldoPorCodigo(codigo: string) : Promise<Saldo>
}