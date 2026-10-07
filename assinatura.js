// BLOQUEIO GLOBAL - Coloque na primeira linha de cada .js
(function(){
    let inicio = localStorage.getItem('inicio_trial');
    let ultimoPagamento = localStorage.getItem('ultimo_pagamento');
    if(!inicio){
        localStorage.setItem('inicio_trial', new Date().toISOString());
        return; // deixa entrar, é primeira vez
    }
    let hoje = new Date();
    let dataInicio = new Date(inicio);
    let diasUso = Math.floor((hoje - dataInicio) / (1000*60*60*24));
    
    let bloqueado = false;
    if(diasUso >= 14 && !ultimoPagamento) bloqueado = true;
    if(ultimoPagamento){
        let diasDesdePag = Math.floor((hoje - new Date(ultimoPagamento)) / (1000*60*60*24));
        if(diasDesdePag >= 30) bloqueado = true;
    }

    if(bloqueado && !window.location.href.includes('assinatura.html')){
        alert("🔒 Sistema bloqueado! Seus 14 dias grátis acabaram. Pague 25.000 XOF via Orange Money para continuar.");
        window.location.href = "assinatura.html";
    }
})();

// CONFIGURAÇÃO DO SEU NEGÓCIO
const VALOR_MENSAL = 10000;
const DIAS_GRATIS = 14;
const DIAS_MES = 30;

// Verifica ao abrir
window.onload = () => {
    let status = verificarAssinatura();
    document.getElementById('mensagem').innerHTML = status.msg;
}

function verificarAssinatura(){
    let inicio = localStorage.getItem('inicio_trial');
    let ultimoPagamento = localStorage.getItem('ultimo_pagamento');
    let hoje = new Date();

    // Primeira vez - inicia os 14 dias grátis
    if(!inicio){
        localStorage.setItem('inicio_trial', hoje.toISOString());
        return { bloqueado: false, msg: `<h3 style="color:green">🎉 Bem-vindo! Você ganhou ${DIAS_GRATIS}
         dias grátis. Aproveite!</h3>` };
    }

    let dataInicio = new Date(inicio);
    let diasUso = Math.floor((hoje - dataInicio) / (1000*60*60*24));

    // Ainda está nos 14 dias grátis
    if(diasUso < DIAS_GRATIS && !ultimoPagamento){
        let restantes = DIAS_GRATIS - diasUso;
        return { bloqueado: false, msg: `<h3 style="color:green">Período grátis: faltam ${restantes}
         dias. Depois será ${VALOR_MENSAL} XOF/mês</h3>` };
    }

    // Já pagou - verifica se o mês venceu
    if(ultimoPagamento){
        let dataPag = new Date(ultimoPagamento);
        let diasDesdePag = Math.floor((hoje - dataPag) / (1000*60*60*24));
        
        if(diasDesdePag < DIAS_MES){
            let falta = DIAS_MES - diasDesdePag;
            return { bloqueado: false, msg: `<h3 style="color:green">Assinatura ativa! Vence em ${falta} dias</h3>` };
        } else {
            return { bloqueado: true, msg: `<h3 style="color:red">Sua mensalidade venceu há ${diasDesdePag - DIAS_MES} dias. Pague ${VALOR_MENSAL} para continuar</h3>` };
        }
    }

    // Acabou trial e nunca pagou
    return { bloqueado: true, msg: `<h3 style="color:red">Seus ${DIAS_GRATIS} dias grátis acabaram em ${diasUso - DIAS_GRATIS} dias atrás. Faça depósito de ${VALOR_MENSAL} para desbloquear</h3>` };
}

function verificarPagamento(){
    let numero = document.getElementById('numeroOrange').value.trim();
    let codigo = document.getElementById('codigoTransacao').value.trim();

    if(numero.length < 9 || codigo.length < 5){
        alert("Digite número e código da transação Orange Money");
        return;
    }

    // AQUI É ONDE VOCÊ CONECTA COM A API REAL DA ORANGE
    // Por enquanto fazemos validação manual, depois você aprova no WhatsApp
    
    // Simula verificação - você vai trocar por API real
    if(confirm(`Confirmar pagamento?\nNúmero: ${numero}\nCódigo: ${codigo}\nValor: ${VALOR_MENSAL} XOF`)){
        
        // LIBERA O SISTEMA
        localStorage.setItem('ultimo_pagamento', new Date().toISOString());
        localStorage.setItem('comprovante_orange', JSON.stringify({numero, codigo, data: new Date().toISOString()}));
        
        alert("✅ Pagamento confirmado! Sistema liberado por 30 dias");
        window.location.href = "painel.html";
    }
}

// Função para você (dono) liberar manualmente via WhatsApp
function liberarManualmente(numeroCliente){
    localStorage.setItem('ultimo_pagamento', new Date().toISOString());
    alert(`Cliente ${numeroCliente} liberado!`);
}