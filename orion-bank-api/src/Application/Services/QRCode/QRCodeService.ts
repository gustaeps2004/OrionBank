import { QRCodeRepository } from "../../../Data/Repositories/QRCode/QRCodeRepository";
import { QRCodeDto } from "../../DTOs/QRCodeDto";
import { IQRCodeService } from "../../Interfaces/QRCode/IQRCodeService";
import { QRCodeContaRawQuery } from "../../../Domain/RawQuery/QRCodeContaRawQuery";
import { createStaticPix, hasError, parsePix } from 'pix-utils';
import { QRCode } from "../../../domain/entities/QrCode";
import { v4 as uuidv4 } from "uuid";

const qrCodeRepository = new QRCodeRepository()

export class QRCodeService implements IQRCodeService {

    async BuscarQRCodePorEMV(emv: string, codigoConta: string): Promise<QRCodeContaRawQuery> {

        if (emv === null || emv.trim() === "") {
            throw new Error("O código EMV é obrigatório.")
        }

        if (codigoConta === null || codigoConta.trim() === "") {
            throw new Error("Erro interno.")
        }

        let response = await qrCodeRepository.BuscarQRCodePorEMV(emv, codigoConta);

        if (response !== undefined) {
            const pix = parsePix(emv);

            if ('pixKey' in pix) {
                response.ChavePix = pix.pixKey;
            }

            if ('infoAdicional' in pix) {
                response.InfoAdicional = pix.infoAdicional ?? '';
            }
        }

        return response
    }

    async CriarQRCode(qrCode: QRCodeDto): Promise<object> {
        let th = this;
        th.ValidarParametros(qrCode);

        const pix = createStaticPix({
            merchantName: qrCode.NomeCompleto.substring(0, 25),
            merchantCity: 'Joinville',
            pixKey: qrCode.ChavePix,
            infoAdicional: qrCode.InfoAdicional,
            transactionAmount: qrCode.Valor
        });

        if (hasError(pix)) {
            throw new Error("Erro ao gerar QRCode.")
        }

        const emv = pix.toBRCode();
        await qrCodeRepository.SalvarQRCode(th.DtoParaDomainQRCode(qrCode, emv))

        const imagem = await pix.toImage();

        const response = {
            emv: emv,
            imagem: imagem
        }

        return response;
    }

    private ValidarParametros(qrCode: QRCodeDto): void {
        if (qrCode.ChavePix === null || qrCode.ChavePix.trim() === "") {
            throw new Error("A chave pix é obrigatória.")
        }

        if (qrCode.CodigoConta === null || qrCode.CodigoConta.trim() === "") {
            throw new Error("Conta inválida.")
        }

        if (qrCode.Valor === undefined || qrCode.Valor === null || qrCode.Valor < 0) {
            throw new Error("Informe um valor inválido.")
        }
    }

    private DtoParaDomainQRCode(qrCodeDto: QRCodeDto, emv: string): QRCode {
        return {
            Codigo: uuidv4(),
            CodigoConta: qrCodeDto.CodigoConta,
            Chave_Pix: qrCodeDto.ChavePix,
            Valor: qrCodeDto.Valor,
            EMV: emv,
            DtInclusao: new Date()
        } as QRCode
    }
}