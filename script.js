/**
 * Calculadora de Promoções do QAO - Quadro Auxiliar de Oficiais
 * Versão melhorada com validações, tratamento de erros e melhor UX
 */

document.addEventListener('DOMContentLoaded', function() {
    inicializarSeletorDatas();
    // Adiciona evento para calcular quando a data for alterada
    document.getElementById('data-2tenente').addEventListener('change', calcular);
});

/**
 * Inicializa o seletor de datas com opções válidas
 */
function inicializarSeletorDatas() {
    const select = document.getElementById('data-2tenente');
    const currentYear = new Date().getFullYear();
    
    // Limpa qualquer opção existente
    select.innerHTML = '';
    
    // Adiciona uma opção padrão
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione uma data';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    
    // Adiciona opções para 1º de Junho e 1º de Dezembro de cada ano
    for (let year = 2015; year <= currentYear; year++) {
        adicionarOpcaoData(select, year, 6, '1 de Junho de');
        adicionarOpcaoData(select, year, 12, '1 de Dezembro de');
    }
}

/**
 * Adiciona uma opção de data ao seletor
 * @param {HTMLSelectElement} select - Elemento select
 * @param {number} year - Ano
 * @param {number} month - Mês (1-12)
 * @param {string} prefix - Texto prefixo para exibição
 */
function adicionarOpcaoData(select, year, month, prefix) {
    const option = document.createElement('option');
    const date = new Date(year, month - 1, 1);
    
    // Valida se a data é válida
    if (isNaN(date.getTime())) {
        console.error(`Data inválida: ${year}-${month}`);
        return;
    }
    
    option.value = date.toISOString().split('T')[0];
    option.textContent = `${prefix} ${year}`;
    select.appendChild(option);
}

/**
 * Calcula a trajetória de promoções
 */
function calcular() {
    try {
        const data2TenenteInput = document.getElementById('data-2tenente').value;
        const resultadosDiv = document.getElementById('resultados');
        
        // Limpa resultados anteriores
        resultadosDiv.innerHTML = '';
        
        // Validação básica
        if (!data2TenenteInput) {
            mostrarMensagemErro('Por favor, selecione uma data válida.');
            return;
        }
        
        const data2Tenente = new Date(data2TenenteInput);
        if (isNaN(data2Tenente.getTime())) {
            mostrarMensagemErro('Data selecionada é inválida.');
            return;
        }
        
        const agora = new Date();
        
        // Calcula datas de promoção
        const promocao1Tenente = calcularDataPromocao(data2Tenente, 2);
        const promocaoCapitao = calcularDataPromocao(data2Tenente, 5);
        
        // Verifica se já foi promovido a Capitão
        if (agora >= promocaoCapitao) {
            resultadosDiv.innerHTML = criarMensagemFinal(promocaoCapitao);
            return;
        }
        
        // Cria timeline de promoções
        const timeline = document.createElement('ul');
        timeline.className = 'timeline';
        
        // Adiciona eventos à timeline
        adicionarEventoTimeline(timeline, promocao1Tenente, 'Promoção a 1º Tenente', agora);
        adicionarEventoTimeline(timeline, promocaoCapitao, 'Promoção a Capitão', agora);
        
        resultadosDiv.appendChild(timeline);
        
    } catch (error) {
        console.error('Erro ao calcular promoções:', error);
        mostrarMensagemErro('Ocorreu um erro ao calcular as promoções. Por favor, tente novamente.');
    }
}

/**
 * Calcula a data de promoção baseada na data de referência e anos para adicionar
 * @param {Date} dataReferencia - Data de referência
 * @param {number} anosParaAdicionar - Anos para adicionar
 * @returns {Date} Data de promoção calculada
 */
function calcularDataPromocao(dataReferencia, anosParaAdicionar) {
    const dataBase = new Date(dataReferencia);
    const anoPromocao = dataBase.getFullYear() + anosParaAdicionar;
    
    // Determina o mês da promoção (Junho ou Dezembro)
    const mesOriginal = dataBase.getMonth();
    const mesPromocao = mesOriginal <= 5 ? 5 : 11; // Junho(5) ou Dezembro(11)
    
    // Cria a data de promoção
    const dataPromocao = new Date(anoPromocao, mesPromocao, 1);
    
    // Ajuste se a data de referência for após a data de promoção no mesmo ano
    if (dataBase > dataPromocao) {
        dataPromocao.setFullYear(anoPromocao + 1);
    }
    
    return dataPromocao;
}

/**
 * Adiciona um evento à timeline
 * @param {HTMLUListElement} timeline - Elemento UL da timeline
 * @param {Date} dataEvento - Data do evento
 * @param {string} tituloEvento - Título do evento
 * @param {Date} dataAtual - Data atual para comparação
 */
function adicionarEventoTimeline(timeline, dataEvento, tituloEvento, dataAtual) {
    const eventoLi = document.createElement('li');
    
    const dateDiv = document.createElement('div');
    dateDiv.className = 'date';
    dateDiv.textContent = formatarData(dataEvento);
    
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event';
    eventDiv.textContent = tituloEvento;
    
    eventoLi.appendChild(dateDiv);
    eventoLi.appendChild(eventDiv);
    
    // Adiciona contagem regressiva se o evento for futuro
    if (dataAtual < dataEvento) {
        const tempoRestante = calcularTempoRestante(dataEvento, dataAtual);
        const contagemRegressiva = document.createElement('p');
        contagemRegressiva.innerHTML = `Faltam <strong>${tempoRestante.dias}</strong> dias, 
                                       <strong>${tempoRestante.horas}</strong> horas e 
                                       <strong>${tempoRestante.minutos}</strong> minutos`;
        eventoLi.appendChild(contagemRegressiva);
    }
    
    timeline.appendChild(eventoLi);
}

/**
 * Cria mensagem final para quando já foi promovido a Capitão
 * @param {Date} dataPromocao - Data da promoção a Capitão
 * @returns {string} HTML da mensagem
 */
function criarMensagemFinal(dataPromocao) {
    return `
        <div class="resultado-final">
            <h3>Trajetória completa</h3>
            <p>Você foi promovido a Capitão em <strong>${formatarData(dataPromocao)}</strong>.</p>
            <p>Parabéns por concluir seu ciclo de promoções no QAO!</p>
        </div>
    `;
}

/**
 * Mostra mensagem de erro
 * @param {string} mensagem - Mensagem de erro
 */
function mostrarMensagemErro(mensagem) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = `<div class="error-message">${mensagem}</div>`;
}

/**
 * Calcula o tempo restante entre duas datas
 * @param {Date} dataFutura - Data futura
 * @param {Date} dataAtual - Data atual
 * @returns {Object} Objeto com dias, horas e minutos restantes
 */
function calcularTempoRestante(dataFutura, dataAtual) {
    const diffMs = Math.max(0, dataFutura - dataAtual); // Garante que não seja negativo
    
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
 * Formata uma data no formato DD/MM/YYYY
 * @param {Date} data - Data a formatar
 * @returns {string} Data formatada
 */
function formatarData(data) {
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}