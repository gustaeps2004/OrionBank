import { ExtratoRepository } from "../../Data/Repositories/Extrato/ExtratoRepository";
import { TipoTransacao } from "../../Enums/TipoTransacao";
import { ValidarDataInicioMenor } from "../../Middleware/ValidarData";

const _extratoRepository = new ExtratoRepository()

export async function GerarPDF(codigoConta: string, dataInicio: Date, dataFim: Date): Promise<string> {
    ValidarDataInicioMenor(dataInicio, dataFim);

    return await PegarHTML(codigoConta, dataInicio, dataFim);
}

async function PegarHTML(codigoConta: string, dataInicio: Date, dataFim: Date): Promise<string> {
    return `
    <html>
        <body>
            ${ObterHTMLCabecaloExtrato()}
            <br>
            <br>
            ${ObterHTMLCabecalhoValores()}
            ${await ObterHTMLValoresExtrato(codigoConta, dataInicio, dataFim)}
        </body>
    </html>
    `;
}

function ObterDataAtual(dataAtual: Date): string {
    const dataCompleta: Date = dataAtual.toString() === "" ? new Date() : dataAtual

    const ano = dataCompleta.getFullYear();
    const mes = dataCompleta.getMonth() + 1;
    let dia: string = dataCompleta.getDate().toString();
    dia = parseInt(dia) < 10 ? `0${dia}` : dia;
    return `${dia}/${mes}/${ano}`;
}

function ObterLogo(): string {
    return `
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="168" height="70" viewBox="0 0 598.000000 193.000000"
        preserveAspectRatio="xMidYMid meet">
        
        <g transform="translate(0.000000,193.000000) scale(0.100000,-0.100000)"
        fill="#DB4648" stroke="none">
        <path d="M2784 1841 c-62 -28 -94 -76 -94 -139 0 -45 5 -57 36 -91 41 -46 84
        -63 155 -63 134 2 224 133 157 232 -48 70 -172 100 -254 61z"/>
        <path d="M1400 1401 c-30 -10 -79 -30 -109 -45 l-55 -28 -75 26 c-412 141
        -811 -58 -896 -448 -26 -117 -17 -324 17 -426 l26 -75 -28 -55 c-61 -123 -79
        -225 -47 -274 34 -51 139 -43 274 21 68 32 74 33 101 19 69 -35 155 -50 297
        -50 156 -1 235 17 350 77 77 41 181 145 222 222 63 120 78 192 78 370 -1 149
        -3 166 -28 239 l-28 80 26 47 c39 72 65 156 65 210 0 62 -6 77 -41 94 -37 19
        -81 18 -149 -4z m45 -91 c86 -95 -213 -533 -578 -846 -193 -165 -383 -280
        -481 -291 -36 -4 -48 -1 -66 17 -19 19 -22 30 -17 69 3 26 11 59 18 74 l12 26
        39 -54 c32 -45 44 -55 68 -55 30 0 207 86 248 120 l23 19 -35 45 c-58 76 -71
        131 -71 296 1 127 3 152 23 201 53 133 126 190 252 197 155 9 256 -60 304
        -205 10 -29 19 -53 21 -53 7 0 93 127 125 183 17 31 38 78 46 104 l14 47 -37
        38 c-20 21 -45 40 -55 44 -27 8 -22 20 15 32 55 17 112 14 132 -8z m-250 -736
        c-25 -110 -88 -195 -166 -228 -43 -18 -169 -33 -169 -20 1 5 21 25 45 44 25
        19 103 92 173 163 70 70 128 123 130 118 2 -5 -4 -40 -13 -77z"/>
        <path d="M2361 1384 c-113 -30 -214 -108 -272 -208 l-29 -51 0 118 0 117 -167
        0 -168 0 3 -635 2 -635 175 0 174 0 3 357 c3 316 6 364 22 409 28 80 82 144
        151 179 55 28 65 30 177 30 l118 0 0 161 0 162 -31 6 c-48 9 -98 6 -158 -10z"/>
        <path d="M3735 1394 c-73 -12 -156 -38 -224 -71 -140 -67 -260 -220 -307 -393
        -25 -89 -25 -309 -1 -400 59 -224 221 -390 432 -445 86 -22 236 -30 325 -16
        259 41 426 181 507 426 24 71 27 96 27 225 0 110 -4 161 -18 210 -64 230 -217
        385 -441 445 -61 16 -245 27 -300 19z m225 -285 c126 -57 185 -183 183 -391
        -1 -191 -54 -305 -167 -363 -51 -25 -70 -30 -136 -30 -66 0 -85 5 -136 30
        -112 58 -167 180 -168 370 0 219 72 353 214 396 52 15 163 9 210 -12z"/>
        <path d="M5248 1384 c-106 -25 -194 -81 -249 -158 l-29 -39 0 86 0 87 -170 0
        -170 0 0 -635 0 -635 174 0 174 0 4 397 c5 430 8 462 61 541 33 50 99 83 180
        89 113 9 177 -21 218 -104 24 -48 24 -48 27 -486 l3 -437 175 2 175 3 -1 451
        c0 490 -5 556 -54 653 -14 28 -42 67 -63 87 -93 94 -295 137 -455 98z"/>
        <path d="M2700 725 l0 -635 175 0 175 0 0 635 0 635 -175 0 -175 0 0 -635z"/>
        </g>
        </svg>`
        ;
}

function ObterHTMLCabecaloExtrato(): string {
    return `
        <div style="
            width: 100%;
            height: 15%;
            border: 2px solid rgb(94, 92, 92);
        ">
        <p style="
            margin-top: 30px;
        ">
            ${ObterLogo()}
        </p>
        <p style="
                color: black;
                display: flex;
                justify-content: flex-end;
                margin-right: 10px;
                margin-top: -110px;
        ">
            Emisão: ${ObterDataAtual(new Date())}
        </p>
        <p style="
                color: black;
                display: flex;
                justify-content: center;
                font-size: 25px;
                margin-top: 85px;
        ">
            EXTRATO BANCÁRIO
        </p>
        </div>
    `;
}

function ObterHTMLCabecalhoValores(): string {
    return `
        <div style="
            width: 100%;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            border: 1px solid rgb(94, 92, 92);
        ">

            <div style="
                width: 10%;
                padding: 5px;
                margin: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid rgb(94, 92, 92);
            ">
                DATA
            </div>

            <div style="
                width: 20%;
                padding: 5px;
                margin: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid rgb(94, 92, 92);
            ">
                TIPO TRANSAÇÃO
            </div>

            <div style="
                width: 20%;
                padding: 5px;
                margin: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid rgb(94, 92, 92);
            ">
                LANÇAMENTO
            </div>

            <div style="
                width: 15%;
                padding: 5px;
                margin: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid rgb(94, 92, 92);
            ">
                DESCRIÇÃO
            </div>

            <div style="
                width: 15%;
                padding: 5px;
                margin: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid rgb(94, 92, 92);
            ">
                VALOR
            </div>
        </div>
    `;
}

async function ObterHTMLValoresExtrato(codigoConta: string, dataInicio: Date, dataFim: Date): Promise<string> {

    const movimentos = await _extratoRepository.ObterMovimentacao(codigoConta, dataInicio, dataFim);

    if (movimentos.length == 0)
        throw new Error("Sem movimentações para está conta.");

    let html: string = "";

    for (let cont = 0; cont < movimentos.length; cont++) {

        if (movimentos[cont].CodigoContaOrigem === codigoConta) {

            html += MontarHTMLValores(
                movimentos[cont].Data,
                movimentos[cont].TipoTransacao,
                movimentos[cont].Descricao,
                `-${movimentos[cont].Valor.replace(".", ",")}`,
                movimentos[cont].NomeDestino
            )

        } else {

            html += MontarHTMLValores(
                movimentos[cont].Data,
                movimentos[cont].TipoTransacao,
                movimentos[cont].Descricao,
                `+${movimentos[cont].Valor.replace(",", "").replace(".", ",")}`,
                movimentos[cont].NomeOrigem
            )

        }

    }


    return `
        <div style="
            width: 100%;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgb(94, 92, 92);
        ">
            <div style="
                width: 100%;
                display: grid;            
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr; 
            ">
                ${html}
            </div>

        </div>
    `;
}

function MontarHTMLValores(data: Date, tipoTransacao: string, descricao: string, valor: string, nome: string): string {

    return `            
        <div style="
            width: 80px;
            padding: 1px;
            margin: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            ${ObterDataAtual(data)}
        </div>

        <div style="
            width: 25px;
            padding: 1px;
            margin: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            ${ObterTipoTransacao(parseInt(tipoTransacao))}
        </div>

        <div style="
            width: 140px;
            padding: 1px;
            margin: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            ${nome}
        </div>

        <div style="
            width: 140px;
            padding: 1px;
            margin: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            ${descricao.substring(0, 30)}
        </div>

        <div style="
            width: 100px;
            padding: 1px;
            margin: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            R$ ${valor}
        </div>       
    `;

}

function ObterTipoTransacao(tipoTransacao: number): string {
    switch (tipoTransacao) {

        case TipoTransacao.Pix:
            return "PIX"

        case TipoTransacao.Ted:
            return "TED"

        case TipoTransacao.QrCode:
            return "QRCODE"

        default:
            return "Erro tipo transação."
    }
}