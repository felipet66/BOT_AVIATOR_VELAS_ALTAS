const app = require('../config/express')();
const port = app.get('port');
const axios = require('axios');

const token = 'ILl4k1G3tJrx1dNXqkmS8nk5ty2Rlk1iRYkqz5bwpWeMOlCzyD-8!-1821777368';
const api = 'https://gs9.pragmaticplaylive.net/api/ui/'
const games = 2;

const ENCRYPT_1 = 2;
const ENCRYPT_2 = 6;
const ENCRYPT_3 = 6;

function valorMenorQueZero(valor, fator) {
    return (value1 && value2);
}

async function obtemResultados() {
    try {
        const res = await axios.get(`${api}statisticHistory?tableId=spacemanyxe123nh&numberOfGames=${games}&JSESSIONID=${token}&game_mode=lobby_desktop`);
        return res.data.history;
    } catch (error) {
        console.error(error);
    }
}

async function getApi() {
    try {
        const token = 'FtJ1kaOEoC2z2j98dy4iJLw2gy8wIsxnqXfIAJPLR4O7D0ymcGle!-2025692314';
        const api = 'https://gs9.pragmaticplaylive.net/api/ui/'
        const games = 100;
        const response = await axios.get(`${api}statisticHistory?tableId=spacemanyxe123nh&numberOfGames=${games}&JSESSIONID=${token}&game_mode=lobby_desktop`);
        const probabilidade = await axios.get(`${api}SMSummaryResults?tableId=spacemanyxe123nh&noOfGames=${games}&JSESSIONID=${token}&ck=1670547221537&game_mode=lobby_desktop`)
        const resultProb = JSON.stringify(probabilidade.data.data).replace(".", ",").replace("{", "").replace("}", "").replace("-", "até");

        console.log("PROBABILIDADES", probabilidade.data.data);
        if (response.data.history[0].gameResult < 2 && response.data.history[1].gameResult < 2) {
            if (response.data.history[2] < 2 && response.data.history[3] < 2) {
                await postTelegram("MERCADO RECOLHENDO ATENTOS POSSÍVEL VELA ALTA");
                return;
            }
            const resultado = response.data.history[0].gameResult;
            const horario = new Date().toTimeString();
            const hh = horario.split(' ')[0];
            await postTelegram("🚀 ENTRADA APÓS: " + resultado.replace(".", ",") + "x \n\nATÉ G2 🚀");
            console.info("ENTRAR APÓS VELA: ", resultado);
        } else if (response.data.history[0].gameResult > 6 && response.data.history[0].gameResult < 15) {
            const resultado = response.data.history[0].gameResult;
            const horario = new Date().toTimeString();
            await postTelegram("🙈ENTRADA APÓS: " + resultado.replace(".", ",") + "x \n\nATÉ G1 RISCO 🙈");
            console.info("ENTRAR APÓS VELA: ", resultado);
        } else {
            const msg = "ultimas velas: " + response.data.history.map(x => `  ${x.gameResult.toString().replace(".",",")}  `);
            //await postTelegram(msg);
            console.info("ULTIMOS RESULTADOS ", response.data.history.map((res) => res.gameResult))
        }
        return response.data.history[0].gameResult;
    } catch (error) {
        console.log(error.response);
    }
}

async function postTelegram(message) {
    try {
        const response = await axios.get(`https://api.telegram.org/bot5901528140:AAEz3C_OMuV50t81If4yw-rS0fpLKJy6BV4/sendMessage?chat_id=-1001611576487&text=${message}&parse_mode=MarkdownV2`);
        console.log('ENVIO PRO TELEGRAM', response.data.ok);
    } catch (error) {
        console.error(error)
    }
}

// RODANDO NOSSA APLICAÇÃO NA PORTA SETADA
app.listen(port, async () => {
    let results2 = [{
        gameResult: 50000
    }];

    let dois = false;
    let cinco = false;
    let um = false;

    setInterval(async () => {
        let results = await obtemResultados();
        // let novoResults;

        // setTimeout(async () => {
        //     novoResults = await obtemResultados();
        // }, 3000);

        setTimeout(async () => {
            let cinco = false;
            let um = false;

            if(results[0].gameResult !== results2[0].gameResult) {
                const game1 = results[0].gameResult;
                const game2 = results2[0].gameResult;

                if (dois && (game1 > ENCRYPT_1)) {
                    console.log("DEU GREEN VALOR: ", game1);
                    dois = false;
                    return;
                } else if (dois) {
                    console.log("DEU RED VALOR: ", game1);
                    dois = false;
                    return;
                }

                if (cinco && (game1 > ENCRYPT_1)) {
                    console.log("DEU GREEN VALOR: ", game1);
                    cinco = false;
                    return;
                } else if (cinco) {
                    console.log("DEU RED VALOR: ", game1);
                    cinco = false;
                    return;
                }

                if (um && (game1 > ENCRYPT_1)) {
                    console.log("DEU GREEN VALOR: ", game1);
                    um = false;
                    return;
                } else if (um) {
                    console.log("DEU RED VALOR: ", game1);
                    um = false;
                    return;
                }

                if (game1 <= ENCRYPT_1 && game2 <= ENCRYPT_1) {
                    console.log("ENTRADA CONFIRMADA SAIR EM 2X - APÓS VALOR: ", game1);
                    dois = true;
                    // POSSÍVEL 2X
                    //await postTelegram("🚀 ENTRADA APÓS: " + game1.replace(".", ",") + "x \n\nATÉ G2 🚀 POSSÍVEL 2X");
                }

                if (game1 >= ENCRYPT_1 && game2 >= ENCRYPT_1 && game1 > game2) {
                    // POSSÍVEL 5X
                    console.log("ENTRADA CONFIRMADA SAIR EM 5X - APÓS VALOR: ", game1);
                    cinco = true;
                    //await postTelegram("🚀 ENTRADA APÓS: " + game1.replace(".", ",") + "x \n\nATÉ G3 🚀 POSSÍVEL 5X");
                }

                if (game1 >= ENCRYPT_2 && game2 <= ENCRYPT_2) {
                    // POSSÍVEL 1.5X
                    console.log("ENTRADA CONFIRMADA SAIR EM 1,5X - APÓS VALOR: ", game1);
                    um = true;
                    //await postTelegram("🚀 ENTRADA APÓS: " + game1.replace(".", ",") + "x \n\nATÉ G1 🚀 POSSÍVEL 2X");
                }
            }

            results2 = results;

            /*if (novoResults[0].gameResult !== results[0].gameResult) {
                // ATUALIZOU RESULTADO

                const game1 = novoResults[0].gameResult;
                const game2 = novoResults[1].gameResult;

                console.log("ATUALIZOU O RESULTADO", novoResults);

                if (game1 <= 10 && game2 <= 10) {
                    console.log("ENTRADA 2X");
                    results2 = game1;
                    dois = true;
                    return;
                    // POSSÍVEL 2X
                    //await postTelegram("🚀 ENTRADA APÓS: " + game1.replace(".", ",") + "x \n\nATÉ G2 🚀 POSSÍVEL 2X");
                }

                if (game1 >= ENCRYPT_1 && game2 >= ENCRYPT_1 && game1 > game2) {
                    // POSSÍVEL 5X
                    cinco = true;
                    //await postTelegram("🚀 ENTRADA APÓS: " + game1.replace(".", ",") + "x \n\nATÉ G3 🚀 POSSÍVEL 5X");
                }

                if (game1 >= ENCRYPT_2 && game2 <= ENCRYPT_2) {
                    // POSSÍVEL 1.5X
                    um = false
                    //await postTelegram("🚀 ENTRADA APÓS: " + game1.replace(".", ",") + "x \n\nATÉ G1 🚀 POSSÍVEL 2X");
                }
            } else {
                console.log("RESULTADOS AINDA SAO IGUAIS");
            }


            console.log("---------");
            console.log("ANTIGO", results.map(x => x.gameResult));
            console.log("NOVO", novoResults.map(x => x.gameResult));*/
        }, 3500);
    }, 6500);
});