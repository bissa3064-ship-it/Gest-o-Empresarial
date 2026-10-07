// bloqueio.js - COLE ISSO INTEIRO NUM ARQUIVO NOVO
(function () {
    let paginaAtual = window.location.href;
    let estaNaAssinatura = paginaAtual.includes('assinatura.html');

    let inicio = localStorage.getItem('inicio_trial');
    let ultimoPagamento = localStorage.getItem('ultimo_pagamento');

    // Se é a primeira vez, cria o trial e DEIXA ENTRAR
    if (!inicio) {
        localStorage.setItem('inicio_trial', new Date().toISOString());
        console.log("Trial iniciado: 14 dias grátis");
        return;
    }

    let hoje = new Date();
    let dataInicio = new Date(inicio);
    let diasUso = Math.floor((hoje - dataInicio) / (1000 * 60 * 60 * 24));

    let bloqueado = false;

    // Regra 1: Passou 14 dias e nunca pagou
    if (diasUso >= 14 && !ultimoPagamento) {
        bloqueado = true;
    }

    // Regra 2: Já pagou mas venceu 30 dias
    if (ultimoPagamento) {
        let diasDesdePag = Math.floor((hoje - new Date(ultimoPagamento)) / (1000 * 60 * 60 * 24));
        if (diasDesdePag >= 30) bloqueado = true;
    }

    if (bloqueado && !estaNaAssinatura) {
        alert("🔒 SISTEMA BLOQUEADO! Seus 14 dias grátis acabaram. Pague 10.000 XOF via Orange Money.");
        window.location.href = "assinatura.html";
    }
})();