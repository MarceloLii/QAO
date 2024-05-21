document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('data-2tenente');
    const currentYear = new Date().getFullYear();

    for (let year = 2015; year <= currentYear; year++) {
        const optionJune = document.createElement('option');
        optionJune.value = `${year}-06-01`;
        optionJune.textContent = `1 de Junho de ${year}`;
        select.appendChild(optionJune);

        const optionDecember = document.createElement('option');
        optionDecember.value = `${year}-12-01`;
        optionDecember.textContent = `1 de Dezembro de ${year}`;
        select.appendChild(optionDecember);
    }
});

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

    const data1Tenente = new Date(data2Tenente);
    data1Tenente.setFullYear(data1Tenente.getFullYear() + 2);
    data1Tenente.setDate(1); // Garante que a data seja 1º do próximo mês
    data1Tenente.setMonth(data1Tenente.getMonth() + 1); // Próximo mês após a promoção

    const dataCapitao = new Date(data2Tenente);
    dataCapitao.setFullYear(dataCapitao.getFullYear() + 5);
    dataCapitao.setDate(1); // Garante que a data seja 1º do próximo mês
    dataCapitao.setMonth(dataCapitao.getMonth() + 1); // Próximo mês após a promoção

    if (agora >= dataCapitao) {
        resultadosDiv.innerHTML = `Você foi promovido a Capitão em ${formatarData(dataCapitao)}.`;
    } else {
        const tempoRestanteCapitao = calcularTempoRestante(dataCapitao, agora);

        let timeline = '';
        if (agora >= data1Tenente) {
            timeline += `<li><div class="date">${formatarData(data1Tenente)}</div><div class="event">Promoção a 1º Tenente</div></li>`;
        } else {
            timeline += `<li><div class="date">${formatarData(data1Tenente)}</div><div class="event">Promoção a 1º Tenente</div></li>`;
        }
        timeline += `<li><div class="date">${formatarData(dataCapitao)}</div><div class="event">Promoção a Capitão</div>`;
        timeline += `<p>Faltam ${tempoRestanteCapitao.dias} dias, ${tempoRestanteCapitao.horas} horas e ${tempoRestanteCapitao.minutos} minutos para a promoção a Capitão.</p>`;
        timeline += `</li>`;
        resultadosDiv.innerHTML = `<ul class="timeline">${timeline}</ul>`;
    }
}

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

function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}
