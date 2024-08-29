// main/script.js

document.addEventListener('DOMContentLoaded', function() {
    populateDateOptions();
});

/**
 * Preenche o select com opções de datas.
 */
function populateDateOptions() {
    const select = document.getElementById('data-2tenente');
    const currentYear = new Date().getFullYear();

    for (let year = 2015; year <= currentYear; year++) {
        addDateOption(select, year, '06', '01', '1 de Junho');
        addDateOption(select, year, '12', '01', '1 de Dezembro');
    }
}

/**
 * Adiciona uma opção de data ao select.
 * @param {HTMLElement} select - O elemento select ao qual adicionar a opção.
 * @param {number} year - O ano para a data.
 * @param {string} month - O mês da data (MM).
 * @param {string} day - O dia da data (DD).
 * @param {string} text - O texto a ser exibido na opção.
 */
function addDateOption(select, year, month, day, text) {
    const option = document.createElement('option');
    const value = `${year}-${month}-${day}`;
    option.value = value;
    option.textContent = `${text} de ${year}`;
    select.appendChild(option);
}

/**
 * Calcula e exibe as datas de promoção e o tempo restante até a promoção a Capitão.
 */
function calcular() {
    const data2TenenteInput = document.getElementById('data-2tenente').value;
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';

    if (!data2TenenteInput) {
        resultadosDiv.innerHTML = 'Por favor, selecione uma data.';
        return;
    }

    const data2Tenente = new Date(data2TenenteInput);
    const agora = new Date();

    const data1Tenente = adicionarMeses(data2Tenente, 24);
    const dataCapitao = adicionarMeses(data2Tenente, 60);

    if (agora >= dataCapitao) {
        resultadosDiv.innerHTML = `Você foi promovido a Capitão em ${formatarData(dataCapitao)}.`;
    } else {
        const tempoRestanteCapitao = calcularTempoRestante(dataCapitao, agora);

        let timeline = '';
        if (agora >= data1Tenente) {
            timeline += criarLinhaTempo(data1Tenente, 'Promoção a 1º Tenente');
        }
        timeline += criarLinhaTempo(dataCapitao, 'Promoção a Capitão', tempoRestanteCapitao);
        resultadosDiv.innerHTML = `<ul class="timeline">${timeline}</ul>`;
    }
}

/**
 * Adiciona um número de meses a uma data.
 * @param {Date} data - A data inicial.
 * @param {number} meses - O número de meses a adicionar.
 * @returns {Date} - A nova data com os meses adicionados.
 */
function adicionarMeses(data, meses) {
    const novaData = new Date(data);
    novaData.setMonth(novaData.getMonth() + meses);
    return novaData;
}

/**
 * Calcula a diferença entre duas datas e retorna um objeto com dias, horas e minutos restantes.
 * @param {Date} futuro - A data futura.
 * @param {Date} presente - A data atual.
 * @returns {Object} - Um objeto com dias, horas e minutos restantes.
 */
function calcularTempoRestante(futuro, presente) {
    const diffMs = futuro - presente;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return {
        dias: diffDays,
        horas: diffHrs,
        minutos: diffMins
    };
}

/**
 * Formata uma data no formato DD/MM/AAAA.
 * @param {Date} data - A data a ser formatada.
 * @returns {string} - A data formatada.
 */
function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

/**
 * Cria uma linha de timeline para exibir a promoção.
 * @param {Date} data - A data da promoção.
 * @param {string} evento - O evento de promoção.
 * @param {Object} [tempoRestante] - O tempo restante até a promoção.
 * @returns {string} - Uma string HTML para a linha de timeline.
 */
function criarLinhaTempo(data, evento, tempoRestante) {
    let linha = `<li><div class="date">${formatarData(data)}</div><div class="event">${evento}</div>`;
    if (tempoRestante) {
        linha += `<p>Faltam ${tempoRestante.dias} dias, ${tempoRestante.horas} horas e ${tempoRestante.minutos} minutos para a promoção a Capitão.</p>`;
    }
    linha += `</li>`;
    return linha;
}
