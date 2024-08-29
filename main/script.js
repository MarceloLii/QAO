/**
 * Inicializa o conteúdo do menu suspenso com opções de datas.
 */
document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('data-2tenente');
    const currentYear = new Date().getFullYear();

    // Adiciona opções para 1º de Junho e 1º de Dezembro para cada ano desde 2015 até o ano atual.
    for (let year = 2015; year <= currentYear; year++) {
        // Opção para 1º de Junho
        const optionJune = document.createElement('option');
        optionJune.value = `${year}-06-01`;
        optionJune.textContent = `1 de Junho de ${year}`;
        select.appendChild(optionJune);

        // Opção para 1º de Dezembro
        const optionDecember = document.createElement('option');
        optionDecember.value = `${year}-12-01`;
        optionDecember.textContent = `1 de Dezembro de ${year}`;
        select.appendChild(optionDecember);
    }
});

/**
 * Calcula a trajetória de promoções com base na data selecionada.
 */
function calcular() {
    const data2TenenteInput = document.getElementById('data-2tenente').value;
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';

    // Verifica se uma data foi selecionada
    if (!data2TenenteInput) {
        resultadosDiv.innerHTML = 'Por favor, selecione uma data.';
        return;
    }

    // Converte a data selecionada para um objeto Date
    const data2Tenente = new Date(data2TenenteInput);
    const agora = new Date();

    // Calcula as datas de promoção a 1º Tenente e Capitão
    const proximaPromocao1Tenente = calcularProximaPromocao(data2Tenente, 2); // Promoção a 1º Tenente em +2 anos
    const proximaPromocaoCapitao = calcularProximaPromocao(data2Tenente, 5); // Promoção a Capitão em +5 anos

    // Verifica se a data de promoção a Capitão já passou
    if (agora >= proximaPromocaoCapitao) {
        resultadosDiv.innerHTML = `Você foi promovido a Capitão em ${formatarData(proximaPromocaoCapitao)}.`;
    } else {
        const tempoRestanteCapitao = calcularTempoRestante(proximaPromocaoCapitao, agora);

        let timeline = '';
        if (agora >= proximaPromocao1Tenente) {
            timeline += `<li><div class="date">${formatarData(proximaPromocao1Tenente)}</div><div class="event">Promoção a 1º Tenente</div></li>`;
        } else {
            const tempoRestante1Tenente = calcularTempoRestante(proximaPromocao1Tenente, agora);
            timeline += `<li><div class="date">${formatarData(proximaPromocao1Tenente)}</div><div class="event">Promoção a 1º Tenente</div>`;
            timeline += `<p>Faltam ${tempoRestante1Tenente.dias} dias, ${tempoRestante1Tenente.horas} horas e ${tempoRestante1Tenente.minutos} minutos para a promoção a 1º Tenente.</p>`;
            timeline += `</li>`;
        }
        timeline += `<li><div class="date">${formatarData(proximaPromocaoCapitao)}</div><div class="event">Promoção a Capitão</div>`;
        timeline += `<p>Faltam ${tempoRestanteCapitao.dias} dias, ${tempoRestanteCapitao.horas} horas e ${tempoRestanteCapitao.minutos} minutos para a promoção a Capitão.</p>`;
        timeline += `</li>`;
        resultadosDiv.innerHTML = `<ul class="timeline">${timeline}</ul>`;
    }
}

/**
 * Calcula a próxima data de promoção considerando a data base e o número de anos a adicionar.
 * @param {Date} dataBase - Data base para o cálculo.
 * @param {number} anosAdicionar - Número de anos a adicionar à data base.
 * @returns {Date} - Data de promoção calculada.
 */
function calcularProximaPromocao(dataBase, anosAdicionar) {
    const anoBase = dataBase.getFullYear();
    const mesBase = dataBase.getMonth(); // 0 = Janeiro, 11 = Dezembro
    const diaBase = dataBase.getDate();

    // Adiciona anos à data base
    const anoPromocao = anoBase + anosAdicionar;

    // Determina o mês e o dia da promoção com base na seleção original
    let mesPromocao = mesBase; // 5 = Junho, 11 = Dezembro
    let diaPromocao = diaBase;

    // Ajusta para 1º de Junho ou 1º de Dezembro
    if (mesBase <= 5) {
        mesPromocao = 5; // Junho
        diaPromocao = 1;
    } else {
        mesPromocao = 11; // Dezembro
        diaPromocao = 1;
    }

    // Cria a data de promoção
    let dataPromocao = new Date(anoPromocao, mesPromocao, diaPromocao);

    // Se a data base está após a data de promoção, ajusta para o próximo ano
    if (dataBase > dataPromocao) {
        dataPromocao = new Date(anoPromocao + 1, mesPromocao, diaPromocao);
    }

    return dataPromocao;
}

/**
 * Calcula o tempo restante entre duas datas.
 * @param {Date} futuro - Data futura para comparação.
 * @param {Date} presente - Data atual para comparação.
 * @returns {Object} - Objeto contendo dias, horas e minutos restantes.
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
 * Formata uma data no formato DD/MM/YYYY.
 * @param {Date} data - Data a ser formatada.
 * @returns {string} - Data formatada como string.
 */
function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}
