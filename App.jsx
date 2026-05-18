import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

const C = {
  bg: "#111111", card: "#1C1C1C", card2: "#242424", card3: "#2A2A2A",
  gold: "#C4A35A", goldLight: "#D4B483", goldDark: "#9A7A38",
  white: "#F0EDE8", gray: "#A8A39D", grayDark: "#555",
  green: "#4CAF50", red: "#E57373", blue: "#7B9EE0",
  border: "#2A2A2A",
};

function formatTime(s){ const m=Math.floor(s/60),sec=s%60; return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`; }
function todayStr(){ return new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"}); }

const MUSCLE_COLORS = {
  "Quadríceps":"#C4A35A","Glúteo":"#A8C5A0","Posterior":"#7B9EE0",
  "Costas":"#B08ECF","Bíceps":"#E8A87C","Peito":"#E57373",
  "Ombro":"#7BC5C5","Tríceps":"#D4B483","Core":"#9A9A9A",
};
const EQUIP_TAGS = {
  "Máquina":C.blue,"Haltere":C.gold,"Cabo":"#A8C5A0",
  "Barra":C.goldLight,"Peso corporal":"#9A9A9A",
};

// ── USUÁRIOS ─────────────────────────────────────────────────────
const USERS = {
  "camila@teste.com": { password:"camila123", name:"Camila", lastName:"Fernandes", role:"aluno" },
  "vivian@teste.com": { password:"vivian123", name:"Vivian", lastName:"Mosna", role:"aluno" },
  "treinadorvilasboas@gmail.com": { password:"Jackson@10", name:"Treinador", lastName:"Vilas Boas", role:"admin" },
};

// ── TREINO COMPLETO DA CAMILA ────────────────────────────────────
const CAMILA_DAYS = [
  { id:"seg", label:"SEG", title:"Membros Inferiores", sub:"Ênfase Quadríceps · Estímulo Glúteo", color:"#C4A35A",
    exercises:[
      { num:"01", name:"Afundo com Recuo — haltere bilateral", muscle:"Glúteo", equip:"Haltere", tags:"Unilateral · Glúteo · Quadríceps", series:3, reps:"10 cada", method:"Pico de Contração 2s", note:"Joelho não ultrapassa a ponta do pé. Tronco levemente inclinado para ativação glútea.", rest:75, link:"https://youtube.com/shorts/XKbZF4JR5Go",
        adaptive:{ name:"Afundo com Recuo — sem peso", equip:"Peso corporal", note:"Mesmo movimento sem halteres. Foco em cadência e equilíbrio." }},
      { num:"02", name:"Leg Press 45°", muscle:"Quadríceps", equip:"Máquina", tags:"Bilateral · Quadríceps · Glúteo", series:3, reps:"8–10", method:"Última série: Cluster Set (4 reps + 10–20s pausa, 4–6 ciclos)", note:"Pés na largura dos ombros. Não travar joelhos no topo.", rest:90, link:"https://www.youtube.com/watch?v=waAxlYvtCcI",
        adaptive:{ name:"Agachamento Búlgaro com Haltere", equip:"Haltere", note:"Mantém foco em quadríceps com carga unilateral." }},
      { num:"03", name:"Hack Squat", muscle:"Quadríceps", equip:"Máquina", tags:"Bilateral · Quadríceps", series:4, reps:"8–10", method:"Última série: Descendente de Carga", note:"Amplitude completa. Joelhos alinhados com os pés. Reduzir 20–30% na descendente.", rest:90, link:"https://youtube.com/shorts/qBy3jgt1yO0",
        adaptive:{ name:"Agachamento Sumô com Haltere", equip:"Haltere", note:"Posição larga, foco em quadríceps e glúteo médio." }},
      { num:"04", name:"Belt Squat", muscle:"Quadríceps", equip:"Máquina", tags:"Bilateral · Quadríceps · Core", series:3, reps:"10–12", method:"Pico de Contração 1s", note:"Tronco ereto. Descer até 90°. Contração no quadríceps no topo.", rest:75, link:"https://www.youtube.com/watch?v=04YYmk7R2G0",
        adaptive:{ name:"Agachamento Goblet com Haltere", equip:"Haltere", note:"Haltere no peito. Mantém padrão de movimento do Belt Squat." }},
      { num:"05", name:"Cadeira Extensora", muscle:"Quadríceps", equip:"Máquina", tags:"Isolamento · Quadríceps", series:3, reps:"12–15", method:"Última série: FST-7 + Pico de Contração 2s", note:"Extensão total com contração máxima. Não usar impulso no início.", rest:45, link:"https://youtu.be/PzIfB9MiiX8",
        adaptive:{ name:"Wall Sit + Extensão", equip:"Peso corporal", note:"Isometria na parede com extensão terminal de joelho." }},
    ]},
  { id:"ter", label:"TER", title:"Costas + Bíceps", sub:"Volume moderado · Carga progressiva", color:"#7B9EE0",
    exercises:[
      { num:"01", name:"Remada na Máquina — pegada neutra", muscle:"Costas", equip:"Máquina", tags:"Costas · Escapular", series:4, reps:"12/10/8/8", method:"Pirâmide Crescente de carga", note:"Escápulas retraídas. Cotovelos próximos ao tronco. Aumentar carga a cada série.", rest:90, link:"https://www.youtube.com/watch?v=CTf7y_alXVM",
        adaptive:{ name:"Remada Curvada com Haltere", equip:"Haltere", note:"Mesma proposta com halteres." }},
      { num:"02", name:"Puxada Frontal na Máquina — pegada supinada", muscle:"Costas", equip:"Máquina", tags:"Dorsais · Bíceps", series:4, reps:"8–12", method:"Pico de Contração 1s", note:"Puxar até o queixo. Segurar 1s na contração máxima. Controlar o retorno.", rest:75, link:"https://www.youtube.com/watch?v=IFDUGxHRIKA",
        adaptive:{ name:"Remada Invertida na Barra", equip:"Barra", note:"Usa barra em suporte baixo. Excelente substituto da puxada." }},
      { num:"03", name:"Remada Unilateral com Haltere — serrote", muscle:"Costas", equip:"Haltere", tags:"Costas · Unilateral", series:3, reps:"10–12", method:"Pico de Contração 1s", note:"Coluna neutra. Cotovelo puxa para trás e para cima.", rest:75, link:"https://youtu.be/OhQTM6Mkq-E",
        adaptive:{ name:"Remada Unilateral com Haltere", equip:"Haltere", note:"Mesmo exercício, disponível sem máquina." }},
      { num:"04", name:"Remada Baixa na Polia — pegada neutra bilateral", muscle:"Costas", equip:"Cabo", tags:"Costas · Romboides", series:3, reps:"12", method:"Última série: FST-7", note:"Tronco fixo sem balanço. Retração escapular no final.", rest:45, link:"https://www.youtube.com/watch?v=1aH9OL4UTwo",
        adaptive:{ name:"Remada com Elástico", equip:"Peso corporal", note:"Elástico fixo na parede. Mantém o padrão de puxada bilateral." }},
      { num:"05", name:"Rosca Direta com Barra", muscle:"Bíceps", equip:"Barra", tags:"Bíceps · Braquial", series:3, reps:"8–10", method:"Nas 2 últimas séries: reps + isometria no pico + reps até a falha", note:"Cotovelos fixos. Isometria no pico por 2–3s antes das reps finais.", rest:90, link:"https://www.youtube.com/watch?v=J7Qn1UJpUyQ",
        adaptive:{ name:"Rosca Alternada com Haltere", equip:"Haltere", note:"Mesmo padrão de movimento com halteres." }},
      { num:"06", name:"Rosca Banco Inclinado 60° com Haltere", muscle:"Bíceps", equip:"Haltere", tags:"Bíceps · Cabeça longa", series:3, reps:"10–12", method:"Pico de Contração 1s + controle na excêntrica", note:"Amplitude máxima no alongamento. Controlar descida em 3s.", rest:75, link:"https://www.youtube.com/watch?v=Os0CbdSre6I",
        adaptive:{ name:"Rosca Concentrada com Haltere", equip:"Haltere", note:"Cotovelo apoiado na coxa. Isolamento do bíceps." }},
    ]},
  { id:"qua", label:"QUA", title:"Glúteo + Ombro Posterior + Abdômen", sub:"Estímulo moderado · Postura e estética", color:"#A8C5A0",
    exercises:[
      { num:"01", name:"Búlgaro com Haltere — bilateral", muscle:"Glúteo", equip:"Haltere", tags:"Glúteo · Quadríceps · Equilíbrio", series:3, reps:"8–10 cada", method:"Cadência Controlada (3s descida / 1s subida)", note:"Pé da frente afastado. Joelho não ultrapassa a ponta do pé. Tronco levemente inclinado.", rest:90, link:"https://youtube.com/shorts/rKtVQcJkvbc",
        adaptive:{ name:"Afundo Estático com Haltere", equip:"Haltere", note:"Posição fixa de afundo. Mesma ativação sem banco." }},
      { num:"02", name:"Stiff com Haltere", muscle:"Posterior", equip:"Haltere", tags:"Posterior · Glúteo", series:3, reps:"10–12", method:"Pico de Contração 2s", note:"Quadril empurra para trás. Coluna neutra. Sentir o alongamento do posterior.", rest:75, link:"https://www.youtube.com/watch?v=601YoPL6y6E",
        adaptive:{ name:"Stiff com Haltere", equip:"Haltere", note:"Mesmo exercício disponível sem máquina." }},
      { num:"03", name:"Crucifixo Inverso na Máquina", muscle:"Ombro", equip:"Máquina", tags:"Ombro posterior · Romboides", series:3, reps:"12–15", method:"Pico de Contração 2s", note:"Escápulas retraídas no final. Cotovelos levemente flexionados.", rest:75, link:"https://www.youtube.com/watch?v=mtZOrNqFywg",
        adaptive:{ name:"Crucifixo Inverso com Haltere", equip:"Haltere", note:"Tronco inclinado. Mesmo padrão de movimento." }},
      { num:"04", name:"Face Pull na Polia", muscle:"Ombro", equip:"Cabo", tags:"Ombro posterior · Manguito", series:3, reps:"15", method:"Pico de Contração 1s", note:"Puxar até a altura dos olhos. Rotação externa dos ombros. Cotovelos acima dos ombros.", rest:75, link:"https://www.youtube.com/watch?v=kYMTJAx_dTM",
        adaptive:{ name:"Face Pull com Elástico", equip:"Peso corporal", note:"Elástico fixo na parede. Mesma mecânica de rotação externa." }},
      { num:"05", name:"Tríceps Francês na Polia — corda", muscle:"Tríceps", equip:"Cabo", tags:"Tríceps · Cabeça longa", series:3, reps:"10–12", method:"Pico de Contração 1s", note:"Cotovelos fixos. Extensão total. Opção: corda na polia alta se ocupada.", rest:75, link:"https://www.youtube.com/watch?v=lkEoFfNyzkk",
        adaptive:{ name:"Tríceps Testa com Haltere", equip:"Haltere", note:"Deitado no banco. Cotovelos fixos. Mesma ativação da cabeça longa." }},
      { num:"06", name:"Abdominal Remador + Prancha — bi-set", muscle:"Core", equip:"Peso corporal", tags:"Core · Oblíquos · Estabilizadores", series:3, reps:"12–15 + 40s", method:"B7 na última série do remador", note:"Remador: coluna arredondada controlada. Prancha: quadril neutro, glúteo contraído.", rest:60, link:"https://www.youtube.com/watch?v=pNRpcChQmq0",
        adaptive:{ name:"Abdominal Remador + Prancha", equip:"Peso corporal", note:"Mesmo exercício disponível sem equipamento." }},
    ]},
  { id:"qui", label:"QUI", title:"Peito + Tríceps + Ombro", sub:"Força e volume · Upper body", color:"#E57373",
    exercises:[
      { num:"01", name:"Supino Inclinado com Haltere", muscle:"Peito", equip:"Haltere", tags:"Peito superior · Ombro", series:3, reps:"8–10", method:"Última série: Cluster Set (4 reps + 10–20s pausa, 4–6 ciclos)", note:"Cotovelos a 45° do tronco. Amplitude completa.", rest:90, link:"https://www.youtube.com/watch?v=RGeSgQmO1EU",
        adaptive:{ name:"Flexão Inclinada com Apoio", equip:"Peso corporal", note:"Pés elevados. Simula o ângulo do supino inclinado." }},
      { num:"02", name:"Crucifixo Inclinado com Haltere", muscle:"Peito", equip:"Haltere", tags:"Peito superior · Isolamento", series:3, reps:"12–15", method:"Pico de Contração 1s", note:"Cotovelos levemente flexionados. Sentir o alongamento no peitoral.", rest:75, link:"https://www.youtube.com/watch?v=NdvAiM9qGu0",
        adaptive:{ name:"Crucifixo com Haltere no Solo", equip:"Haltere", note:"Deitado no chão. Amplitude reduzida mas mantém o isolamento." }},
      { num:"03", name:"Desenvolvimento com Haltere", muscle:"Ombro", equip:"Haltere", tags:"Deltoides · Ombro", series:3, reps:"8–10", method:"Última série: Cluster Set (4 reps + 10–20s pausa, 4–6 ciclos)", note:"Banco a 60–80°. Cotovelos levemente à frente. Não travar no topo.", rest:90, link:"https://www.youtube.com/watch?v=eufDL9MmF8A",
        adaptive:{ name:"Desenvolvimento com Haltere em Pé", equip:"Haltere", note:"Mesmo exercício sem banco. Core ativado para estabilização." }},
      { num:"04", name:"Elevação Lateral Sentado no Banco", muscle:"Ombro", equip:"Haltere", tags:"Deltoides lateral", series:3, reps:"12–15", method:"Pico de Contração 1s", note:"Cotovelos levemente flexionados. Elevar até a altura dos ombros.", rest:75, link:"https://www.youtube.com/watch?v=ewU_guoThdo",
        adaptive:{ name:"Elevação Lateral em Pé", equip:"Haltere", note:"Mesmo movimento em pé. Evitar impulso do tronco." }},
      { num:"05", name:"Tríceps Coice Unilateral no Cabo", muscle:"Tríceps", equip:"Cabo", tags:"Tríceps · Cabeça lateral", series:3, reps:"12–15", method:"Pico de Contração 1s", note:"Tronco inclinado. Cotovelo fixo. Extensão total com contração máxima.", rest:75, link:"https://www.youtube.com/watch?v=0OPXhT-VbEw",
        adaptive:{ name:"Tríceps Coice com Haltere", equip:"Haltere", note:"Mesmo padrão de movimento com haltere." }},
      { num:"06", name:"Tríceps Pulley com Barra", muscle:"Tríceps", equip:"Cabo", tags:"Tríceps geral", series:3, reps:"12–15", method:"Última série: FST-7", note:"Cotovelos fixos. Extensão completa. Punhos neutros.", rest:45, link:"https://www.youtube.com/watch?v=gPJo1ZDGiS4",
        adaptive:{ name:"Tríceps Testa com Haltere", equip:"Haltere", note:"Deitado. Cotovelos fixos. Extensão completa." }},
      { num:"07", name:"Rotação de Tronco com Anilha — oblíquo", muscle:"Core", equip:"Peso corporal", tags:"Core · Oblíquos", series:3, reps:"12–15 cada", method:"—", note:"Quadril fixo. Rotação parte do tronco. Sem impulso.", rest:60, link:"https://www.youtube.com/watch?v=MeNKk3-ujF8",
        adaptive:{ name:"Rotação de Tronco — sem peso", equip:"Peso corporal", note:"Mesmo movimento sem anilha. Foco no controle." }},
      { num:"08", name:"Abdominal Curto — pernas elevadas + anilha 10kg", muscle:"Core", equip:"Peso corporal", tags:"Core · Reto abdominal", series:3, reps:"15–20", method:"—", note:"Lombar pressionada no solo. Expirar na contração.", rest:60, link:"https://m.youtube.com/shorts/ja65qQ1lNZM",
        adaptive:{ name:"Abdominal Curto — pernas elevadas", equip:"Peso corporal", note:"Mesmo exercício sem anilha." }},
    ]},
  { id:"sex", label:"SEX", title:"Posterior + Glúteo", sub:"Ênfase e força · Sessão principal", color:"#B08ECF",
    exercises:[
      { num:"01", name:"Abdução de Quadril", muscle:"Glúteo", equip:"Máquina", tags:"Glúteo médio", series:3, reps:"12–15", method:"—", note:"Movimento controlado. Contração glútea no topo. Evitar compensação lombar.", rest:75, link:"https://www.youtube.com/watch?v=50qHGus1TZk",
        adaptive:{ name:"Abdução de Quadril com Elástico", equip:"Peso corporal", note:"Elástico acima dos joelhos. Deitado ou em pé." }},
      { num:"02", name:"Levantamento Terra — barra ou máquina", muscle:"Posterior", equip:"Barra", tags:"Posterior · Glúteo · Lombar", series:4, reps:"5–8", method:"Última série: Cluster Set (4 reps + 10–20s pausa, 4–6 ciclos)", note:"Coluna neutra. Quadril empurra para frente no topo. Barra próxima ao corpo.", rest:120, link:"https://www.youtube.com/watch?v=QuePyle8pVs",
        adaptive:{ name:"Terra com Halteres", equip:"Haltere", note:"Mesma mecânica com halteres. Reduz carga mas mantém o padrão." }},
      { num:"03", name:"Stiff na Belt Squat", muscle:"Posterior", equip:"Máquina", tags:"Posterior · Glúteo", series:4, reps:"8–10", method:"—", note:"Quadril empurra para trás. Amplitude máxima. Coluna neutra.", rest:90, link:"https://www.youtube.com/watch?v=1xk5w5Vp5Hc",
        adaptive:{ name:"Stiff com Haltere", equip:"Haltere", note:"Mesmo padrão de movimento com halteres." }},
      { num:"04", name:"Cadeira Flexora", muscle:"Posterior", equip:"Máquina", tags:"Posterior · Isolamento", series:3, reps:"12–15", method:"Última série: FST-7", note:"Pico de contração no final. Controlar fase excêntrica. Quadril fixo no banco.", rest:45, link:"https://www.youtube.com/watch?v=CHsaztLSSrc",
        adaptive:{ name:"Flexão de Joelho com Elástico", equip:"Peso corporal", note:"Deitado com elástico. Simula a cadeira flexora." }},
      { num:"05", name:"Elevação Pélvica na Máquina", muscle:"Glúteo", equip:"Máquina", tags:"Glúteo máximo", series:4, reps:"8–10", method:"Última série: Cluster Set (4 reps + 10–20s pausa, 4–6 ciclos)", note:"Extensão total do quadril no topo. Contração máxima do glúteo. Queixo no peito.", rest:90, link:"https://youtube.com/shorts/TUgI9g0aYuw",
        adaptive:{ name:"Hip Thrust com Haltere no Banco", equip:"Haltere", note:"Costas apoiadas no banco. Haltere sobre o quadril." }},
    ]},
  { id:"sab_a", label:"SAB A", title:"Full Body", sub:"Volume reduzido · Manutenção", color:"#E8A87C",
    exercises:[
      { num:"01", name:"Leg Press 45°", muscle:"Quadríceps", equip:"Máquina", tags:"Quadríceps · Glúteo", series:3, reps:"10–12", method:"—", note:"Pés na largura dos ombros. Amplitude completa sem travar os joelhos.", rest:90, link:"https://www.youtube.com/watch?v=waAxlYvtCcI",
        adaptive:{ name:"Agachamento com Haltere", equip:"Haltere", note:"Halteres nas mãos. Amplitude completa." }},
      { num:"02", name:"Búlgaro com Haltere — bilateral", muscle:"Glúteo", equip:"Haltere", tags:"Glúteo · Quadríceps", series:3, reps:"10 cada", method:"Cadência Controlada (3s descida / 1s subida)", note:"Tronco levemente inclinado. Joelho alinhado com o pé.", rest:90, link:"https://youtube.com/shorts/rKtVQcJkvbc",
        adaptive:{ name:"Afundo com Haltere", equip:"Haltere", note:"Sem banco. Passo à frente controlado." }},
      { num:"03", name:"Supino Inclinado com Haltere ou Máquina", muscle:"Peito", equip:"Haltere", tags:"Peito superior · Ombro", series:3, reps:"10–12", method:"—", note:"Amplitude completa. Cotovelos a 45° do tronco.", rest:75, link:"https://www.youtube.com/watch?v=RGeSgQmO1EU",
        adaptive:{ name:"Flexão com Apoio Elevado", equip:"Peso corporal", note:"Pés elevados. Simula o ângulo inclinado." }},
      { num:"04", name:"Remada na Máquina — pegada neutra", muscle:"Costas", equip:"Máquina", tags:"Costas · Escapular", series:3, reps:"10–12", method:"—", note:"Escápulas retraídas. Cotovelos próximos ao tronco.", rest:75, link:"https://www.youtube.com/watch?v=CTf7y_alXVM",
        adaptive:{ name:"Remada Curvada com Haltere", equip:"Haltere", note:"Tronco inclinado. Bilateral ou unilateral." }},
      { num:"05", name:"Desenvolvimento com Haltere (banco 60°) ou Máquina", muscle:"Ombro", equip:"Haltere", tags:"Deltoides · Ombro", series:3, reps:"10–12", method:"—", note:"Não travar cotovelos no topo. Movimento controlado.", rest:75, link:"https://www.youtube.com/watch?v=eufDL9MmF8A",
        adaptive:{ name:"Desenvolvimento com Haltere em Pé", equip:"Haltere", note:"Sem banco. Core ativado." }},
      { num:"06", name:"Rosca Direta na Polia", muscle:"Bíceps", equip:"Cabo", tags:"Bíceps", series:3, reps:"12", method:"—", note:"Cotovelos fixos. Amplitude completa. Movimento limpo.", rest:60, link:"https://www.youtube.com/watch?v=Em5sYz2x-KQ",
        adaptive:{ name:"Rosca Direta com Haltere", equip:"Haltere", note:"Mesmo padrão. Cotovelos fixos ao tronco." }},
    ]},
  { id:"sab_b", label:"SAB B", title:"Upper Body", sub:"Foco em membros superiores", color:"#7BC5C5",
    exercises:[
      { num:"01", name:"Supino Reto na Máquina", muscle:"Peito", equip:"Máquina", tags:"Peito · Ombro · Tríceps", series:3, reps:"10–12", method:"—", note:"Amplitude completa. Cotovelos a 45°. Retração escapular.", rest:90, link:"https://www.youtube.com/watch?v=qmSOsrheLEg",
        adaptive:{ name:"Supino com Haltere no Solo", equip:"Haltere", note:"Deitado no chão. Amplitude reduzida mas segura." }},
      { num:"02", name:"Remada Curvada — Máquina ou Barra", muscle:"Costas", equip:"Barra", tags:"Costas · Bíceps", series:3, reps:"10–12", method:"Pico de Contração 1s", note:"Tronco fixo a 45°. Cotovelos puxam para trás e para cima.", rest:75, link:"https://www.youtube.com/watch?v=VJHBEy2duVc",
        adaptive:{ name:"Remada Curvada com Haltere", equip:"Haltere", note:"Mesmo padrão com halteres bilaterais." }},
      { num:"03", name:"Desenvolvimento com Haltere — banco 60°", muscle:"Ombro", equip:"Haltere", tags:"Deltoides · Ombro", series:3, reps:"10–12", method:"Última série: Cluster Set (4 reps + 10–20s pausa, 4–6 ciclos)", note:"Banco a 60°. Cotovelos levemente à frente do tronco.", rest:90, link:"https://www.youtube.com/watch?v=eufDL9MmF8A",
        adaptive:{ name:"Desenvolvimento com Haltere em Pé", equip:"Haltere", note:"Sem banco. Estabilização de core." }},
      { num:"04", name:"Puxada Frontal Articulada — pegada supinada", muscle:"Costas", equip:"Máquina", tags:"Dorsais · Bíceps", series:3, reps:"10–12", method:"Pico de Contração 1s", note:"Puxar até o queixo. Cotovelos apontam para baixo no final.", rest:75, link:"",
        adaptive:{ name:"Remada Invertida na Barra", equip:"Barra", note:"Barra baixa. Corpo inclinado. Excelente substituto." }},
      { num:"05", name:"Elevação Lateral com Haltere", muscle:"Ombro", equip:"Haltere", tags:"Deltoides lateral", series:3, reps:"12–15", method:"—", note:"Cotovelos levemente flexionados. Elevar até a altura dos ombros.", rest:60, link:"https://www.youtube.com/watch?v=IwWvZ0rlNXs",
        adaptive:{ name:"Elevação Lateral com Haltere", equip:"Haltere", note:"Mesmo exercício disponível sem máquina." }},
      { num:"06", name:"Rosca Scott", muscle:"Bíceps", equip:"Barra", tags:"Bíceps · Isolamento", series:3, reps:"10–12", method:"—", note:"Amplitude completa no alongamento. Controlar fase excêntrica.", rest:75, link:"https://www.youtube.com/watch?v=wWKrF4iSU_8",
        adaptive:{ name:"Rosca Concentrada com Haltere", equip:"Haltere", note:"Cotovelo apoiado na coxa. Isolamento similar." }},
      { num:"07", name:"Tríceps Pulley com Barra na Polia Alta", muscle:"Tríceps", equip:"Cabo", tags:"Tríceps geral", series:3, reps:"12–15", method:"—", note:"Cotovelos fixos. Extensão completa. Punhos neutros.", rest:60, link:"https://www.youtube.com/watch?v=YQ6MRBeyIAE",
        adaptive:{ name:"Tríceps Testa com Haltere", equip:"Haltere", note:"Deitado. Cotovelos fixos. Extensão completa." }},
    ]},
];

// Vivian usa o mesmo treino como base
const VIVIAN_DAYS = CAMILA_DAYS.map(d=>({...d, id:d.id+"_v"}));

const STUDENT_DATA = {
  "camila@teste.com": { days: CAMILA_DAYS, color: "#C4A35A" },
  "vivian@teste.com": { days: VIVIAN_DAYS, color: "#7B9EE0" },
};

const WARMUPS = [
  { id:"areia", icon:"🏖️", title:"Aquecimento — Areia", sub:"Futevôlei · Vôlei · Beach Tênis", duration:"12–15 min", exercises:[{name:"Corrida leve na areia",duration:"3 min",note:"Passadas curtas, foco no contato com o solo."},{name:"Rotação de tornozelo",duration:"30s cada",note:"Mobilidade para instabilidade da areia."},{name:"Agachamento lateral",duration:"2x10",note:"Ativação de glúteo médio."},{name:"Salto vertical com pausa",duration:"3x5",note:"Pré-ativação neuromuscular."}]},
  { id:"corrida", icon:"🏃", title:"Aquecimento — Corrida", sub:"5km · 10km · Longa distância", duration:"10 min", exercises:[{name:"Caminhada acelerada",duration:"2 min",note:"Elevar temperatura gradualmente."},{name:"Skipping",duration:"30s",note:"Ativação de quadríceps."},{name:"Rotação de quadril",duration:"10 cada",note:"Mobilidade para passada eficiente."},{name:"Trote leve",duration:"3 min",note:"Cadência baixa, postura ereta."}]},
  { id:"futebol", icon:"⚽", title:"Aquecimento — Futebol", sub:"Campo · Society · Futsal", duration:"15 min", exercises:[{name:"Corrida em figura 8",duration:"2 min",note:"Mudanças de direção suaves."},{name:"Passada lateral",duration:"20m x 3",note:"Ativação de adutores."},{name:"Agachamento com rotação",duration:"2x10",note:"Mobilidade de quadril."},{name:"Aceleração curta",duration:"5x10m",note:"Pré-ativação anaeróbia."}]},
  { id:"geral", icon:"💪", title:"Aquecimento Geral", sub:"Musculação · Academia", duration:"8–10 min", exercises:[{name:"Esteira ou bike leve",duration:"5 min",note:"Intensidade baixa."},{name:"Rotação de ombros",duration:"10 cada",note:"Mobilidade escapular."},{name:"Agachamento livre",duration:"2x15",note:"Ativação de membros inferiores."},{name:"Prancha estática",duration:"30s",note:"Ativação de core."}]},
];

const COMPLEMENTARY = [
  { id:"potencia", icon:"⚡", title:"Treino de Potência", sub:"Explosão · Velocidade", exercises:[{name:"Salto vertical máximo",sets:"4x5",note:"Explosão máxima."},{name:"Agachamento com salto",sets:"3x6",note:"Descer controlado, subir explosivo."},{name:"Medicine ball slam",sets:"4x8",note:"Potência de tronco."}]},
  { id:"pliometria", icon:"🦘", title:"Pliometria", sub:"Reatividade · Impacto", exercises:[{name:"Box jump",sets:"4x6",note:"Aterrissagem suave."},{name:"Salto lateral cone",sets:"3x10",note:"Reatividade lateral."},{name:"Skater jump",sets:"3x12",note:"Potência unilateral."}]},
  { id:"mobilidade", icon:"🧘", title:"Mobilidade", sub:"Recuperação · Amplitude", exercises:[{name:"Hip 90/90",sets:"2x60s",note:"Rotação interna e externa."},{name:"Thoracic rotation",sets:"2x10 cada",note:"Mobilidade torácica."},{name:"World's greatest stretch",sets:"3 cada lado",note:"Mobilidade global."}]},
];

const PARTNERS = [
  { id:1, category:"Nutrição", name:"Dra. Ana Lima", role:"Nutricionista Esportiva", desc:"Especializada em performance e hipertrofia.", contact:"Ver perfil", color:"#7B9EE0", products:["Consulta nutricional","Plano alimentar","Suplementação orientada"] },
  { id:2, category:"Suplementação", name:"Supp Store", role:"10% desconto exclusivo", desc:"Whey, creatina, pré-treino e mais com desconto para alunos.", contact:"Acessar loja", color:"#C4A35A", products:["Whey Protein","Creatina","Pré-treino","Vitaminas"] },
  { id:3, category:"Alimentação", name:"Marmitas Fit", role:"Marmitas saudáveis com entrega", desc:"Refeições balanceadas por nutricionista.", contact:"Fazer pedido", color:"#A8C5A0", products:["Marmita fit diária","Plano semanal","Low carb","High protein"] },
  { id:4, category:"Saúde", name:"Dr. Pedro Costa", role:"Fisioterapeuta Esportivo", desc:"Prevenção e reabilitação de lesões.", contact:"Agendar", color:"#B08ECF", products:["Avaliação postural","Reabilitação","RPG"] },
];

// ── Componentes base ─────────────────────────────────────────────
function FeedbackBtn({screen}){
  const [open,setOpen]=useState(false);
  const [text,setText]=useState("");
  const [sent,setSent]=useState(false);
  return(
    <>
      <button onClick={()=>setOpen(true)} style={{position:"fixed",bottom:90,right:16,background:C.goldDark,border:"none",borderRadius:20,padding:"8px 14px",color:"#000",fontSize:10,fontWeight:800,cursor:"pointer",zIndex:90,boxShadow:"0 4px 12px rgba(0,0,0,0.5)"}}>💬 FEEDBACK</button>
      {open&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:C.card,borderRadius:"16px 16px 0 0",padding:20,width:"100%",boxSizing:"border-box"}}>
            <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:8}}>FEEDBACK — {screen.toUpperCase()}</div>
            {!sent?(
              <>
                <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Sua sugestão ou comentário..." rows={4} style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,padding:10,color:C.white,fontSize:12,outline:"none",resize:"none",boxSizing:"border-box",marginBottom:12}}/>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setOpen(false)} style={{flex:1,padding:12,background:C.card2,border:"none",borderRadius:8,color:C.white,fontWeight:700,cursor:"pointer"}}>Cancelar</button>
                  <button onClick={()=>setSent(true)} style={{flex:1,padding:12,background:C.gold,border:"none",borderRadius:8,color:"#000",fontWeight:800,cursor:"pointer"}}>Enviar</button>
                </div>
              </>
            ):(
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:28,marginBottom:8}}>✓</div>
                <div style={{fontSize:13,color:C.white,marginBottom:16}}>Obrigado pelo feedback!</div>
                <button onClick={()=>{setOpen(false);setSent(false);setText("");}} style={{width:"100%",padding:12,background:C.gold,border:"none",borderRadius:8,color:"#000",fontWeight:800,cursor:"pointer"}}>Fechar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function RestModal({seconds,onDone}){
  const [left,setLeft]=useState(seconds);
  const r=useRef();
  useEffect(()=>{ r.current=setInterval(()=>setLeft(p=>{if(p<=1){clearInterval(r.current);onDone();return 0;}return p-1;}),1000); return()=>clearInterval(r.current); },[]);
  const pct=((seconds-left)/seconds)*100;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.97)",zIndex:300,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{fontSize:9,color:C.gray,letterSpacing:3,marginBottom:20}}>INTERVALO DE DESCANSO</div>
      <div style={{position:"relative",width:180,height:180,marginBottom:28}}>
        <svg width="180" height="180" style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)"}}>
          <circle cx="90" cy="90" r="78" fill="none" stroke="#2A2A2A" strokeWidth="8"/>
          <circle cx="90" cy="90" r="78" fill="none" stroke={C.gold} strokeWidth="8" strokeDasharray={`${2*Math.PI*78}`} strokeDashoffset={`${2*Math.PI*78*(1-pct/100)}`} style={{transition:"stroke-dashoffset 1s linear"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
          <span style={{fontSize:52,fontWeight:900,color:C.white,fontVariantNumeric:"tabular-nums"}}>{left}</span>
          <span style={{fontSize:11,color:C.gray}}>seg</span>
        </div>
      </div>
      <button onClick={onDone} style={{background:"transparent",border:`1px solid ${C.gold}`,color:C.gold,padding:"12px 32px",borderRadius:8,fontSize:12,letterSpacing:2,fontWeight:700,cursor:"pointer"}}>PULAR</button>
    </div>
  );
}

function ExCard({ex,mode}){
  const exercise=mode==="adaptive"&&ex.adaptive?{...ex,...ex.adaptive}:ex;
  const [sets,setSets]=useState(Array(ex.series).fill({done:false,load:"",reps:""}));
  const [resting,setResting]=useState(false);
  const allDone=sets.every(s=>s.done);
  const toggleSet=(i)=>{ const nd=[...sets]; nd[i]={...nd[i],done:!nd[i].done}; setSets(nd); if(!nd[i].done)return; if(nd.findIndex((s,idx)=>idx>i&&!s.done)!==-1)setResting(true); };
  const updateSet=(i,f,v)=>{ const nd=[...sets]; nd[i]={...nd[i],[f]:v}; setSets(nd); };
  return(
    <>
      {resting&&<RestModal seconds={ex.rest} onDone={()=>setResting(false)}/>}
      <div style={{background:allDone?"#192419":C.card,borderRadius:12,marginBottom:10,overflow:"hidden",border:allDone?`1px solid #2D5A2D`:`1px solid ${C.border}`,transition:"all 0.3s"}}>
        <div style={{display:"flex",alignItems:"center",padding:"14px",gap:12,borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:22,fontWeight:900,color:allDone?C.green:C.gold,minWidth:38}}>{ex.num}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:C.white,lineHeight:1.3}}>{exercise.name}</div>
            <div style={{fontSize:10,color:C.gray,marginTop:2}}>{ex.tags}</div>
            <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
              <span style={{fontSize:9,color:MUSCLE_COLORS[ex.muscle]||C.gold,background:(MUSCLE_COLORS[ex.muscle]||C.gold)+"22",padding:"2px 8px",borderRadius:20}}>{ex.muscle}</span>
              <span style={{fontSize:9,color:EQUIP_TAGS[exercise.equip||ex.equip]||C.gray,background:(EQUIP_TAGS[exercise.equip||ex.equip]||C.gray)+"22",padding:"2px 8px",borderRadius:20}}>{exercise.equip||ex.equip}</span>
              {mode==="adaptive"&&ex.adaptive&&<span style={{fontSize:9,color:C.goldLight,background:C.goldDark+"33",padding:"2px 8px",borderRadius:20}}>ADAPTADO</span>}
            </div>
          </div>
          <div style={{display:"flex",gap:8,textAlign:"center"}}>
            <div><div style={{fontSize:8,color:C.gray,letterSpacing:1,marginBottom:1}}>SÉR</div><div style={{fontSize:20,fontWeight:900,color:C.white}}>{ex.series}</div></div>
            <div style={{width:1,background:C.border}}/>
            <div><div style={{fontSize:8,color:C.gray,letterSpacing:1,marginBottom:1}}>REPS</div><div style={{fontSize:15,fontWeight:900,color:C.white}}>{ex.reps}</div></div>
          </div>
        </div>
        <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:8,color:C.gold,letterSpacing:1.5,marginBottom:8}}>SÉRIES — toque para marcar</div>
          {sets.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <button onClick={()=>toggleSet(i)} style={{width:36,height:36,borderRadius:8,background:s.done?C.gold:C.card3,border:s.done?`2px solid ${C.gold}`:`2px solid ${C.border}`,color:s.done?"#000":C.gray,fontWeight:900,fontSize:13,cursor:"pointer",flexShrink:0,transition:"all 0.2s"}}>{i+1}</button>
              <input placeholder="Carga kg" value={s.load} onChange={e=>updateSet(i,"load",e.target.value)} style={{flex:1,background:C.card3,border:`1px solid ${C.border}`,borderRadius:6,padding:"7px 10px",color:C.white,fontSize:11,outline:"none"}}/>
              <input placeholder="Reps" value={s.reps} onChange={e=>updateSet(i,"reps",e.target.value)} style={{flex:1,background:C.card3,border:`1px solid ${C.border}`,borderRadius:6,padding:"7px 10px",color:C.white,fontSize:11,outline:"none"}}/>
              <div style={{fontSize:9,color:C.gold,flexShrink:0,textAlign:"right"}}>⏱<br/>{formatTime(ex.rest)}</div>
            </div>
          ))}
        </div>
        {ex.method&&ex.method!=="—"&&<div style={{margin:"8px 14px 0",padding:"8px 10px",background:"#1A1714",borderRadius:6,borderLeft:`3px solid ${C.gold}`}}><div style={{fontSize:8,color:C.gold,letterSpacing:1.5,marginBottom:3}}>MÉTODO</div><div style={{fontSize:11,color:C.white}}>{ex.method}</div></div>}
        <div style={{margin:"6px 14px",padding:"8px 10px",background:"#1A1714",borderRadius:6}}><div style={{fontSize:8,color:C.gray,letterSpacing:1.5,marginBottom:3}}>EXECUÇÃO</div><div style={{fontSize:11,color:C.gray,lineHeight:1.5}}>{exercise.note}</div></div>
        {exercise.link&&<div style={{padding:"8px 14px 12px"}}><a href={exercise.link} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,color:C.gold,fontSize:11,textDecoration:"none",border:`1px solid ${C.gold}33`,borderRadius:6,padding:"5px 12px"}}>▶ Ver no YouTube</a></div>}
      </div>
    </>
  );
}

// ── Prévia do Treino ─────────────────────────────────────────────
function WorkoutPreview({day,onStart,onBack}){
  const [mode,setMode]=useState("academy");
  const equipList=[...new Set(day.exercises.map(e=>mode==="adaptive"&&e.adaptive?e.adaptive.equip:e.equip))];
  return(
    <div style={{paddingBottom:100}}>
      <div style={{position:"sticky",top:0,zIndex:50,background:"#111111EE",backdropFilter:"blur(10px)",borderBottom:`1px solid ${C.border}`,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onBack} style={{background:"transparent",border:"none",color:C.gold,fontSize:22,cursor:"pointer"}}>‹</button>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.white}}>{day.title}</div><div style={{fontSize:10,color:C.gray}}>Prévia do treino</div></div>
      </div>
      <div style={{padding:"16px"}}>
        <div style={{display:"flex",gap:10,marginBottom:16}}>
          {[{label:"EXERCÍCIOS",value:day.exercises.length},{label:"DURAÇÃO EST.",value:"~55 min"},{label:"SÉRIES TOTAL",value:day.exercises.reduce((a,e)=>a+e.series,0)}].map(({label,value})=>(
            <div key={label} style={{flex:1,background:C.card,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{fontSize:7,color:C.gray,letterSpacing:1,marginBottom:4}}>{label}</div>
              <div style={{fontSize:13,fontWeight:800,color:C.white}}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{background:C.card,borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:10}}>ONDE VOCÊ VAI TREINAR?</div>
          <div style={{display:"flex",gap:8}}>
            {[{id:"academy",label:"🏋️ Academia",sub:"Equipamentos completos"},{id:"adaptive",label:"🏠 Adaptado",sub:"Halteres e peso corporal"}].map(m=>(
              <button key={m.id} onClick={()=>setMode(m.id)} style={{flex:1,padding:"12px 8px",borderRadius:10,border:mode===m.id?`2px solid ${C.gold}`:`1px solid ${C.border}`,background:mode===m.id?C.gold+"18":C.card2,cursor:"pointer",textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:4}}>{m.label.split(" ")[0]}</div>
                <div style={{fontSize:11,fontWeight:700,color:mode===m.id?C.gold:C.white}}>{m.label.substring(3)}</div>
                <div style={{fontSize:9,color:C.gray,marginTop:2}}>{m.sub}</div>
              </button>
            ))}
          </div>
        </div>
        <div style={{background:C.card,borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:10}}>EQUIPAMENTOS NECESSÁRIOS</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {equipList.map(eq=><span key={eq} style={{fontSize:11,color:EQUIP_TAGS[eq]||C.gray,background:(EQUIP_TAGS[eq]||C.gray)+"22",padding:"6px 12px",borderRadius:20,fontWeight:700}}>{eq}</span>)}
          </div>
        </div>
        <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:10}}>EXERCÍCIOS DO DIA</div>
        {day.exercises.map((ex,i)=>{
          const exercise=mode==="adaptive"&&ex.adaptive?{...ex,...ex.adaptive}:ex;
          return(
            <div key={i} style={{background:C.card,borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12,border:`1px solid ${C.border}`}}>
              <span style={{fontSize:16,fontWeight:900,color:C.gold,minWidth:28}}>{ex.num}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:C.white}}>{exercise.name}</div>
                <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                  <span style={{fontSize:9,color:MUSCLE_COLORS[ex.muscle]||C.gold,background:(MUSCLE_COLORS[ex.muscle]||C.gold)+"22",padding:"2px 8px",borderRadius:20}}>{ex.muscle}</span>
                  <span style={{fontSize:9,color:EQUIP_TAGS[exercise.equip||ex.equip]||C.gray,background:(EQUIP_TAGS[exercise.equip||ex.equip]||C.gray)+"22",padding:"2px 8px",borderRadius:20}}>{exercise.equip||ex.equip}</span>
                </div>
              </div>
              <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:800,color:C.white}}>{ex.series}x</div><div style={{fontSize:10,color:C.gray}}>{ex.reps}</div></div>
            </div>
          );
        })}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,padding:"16px",background:"#111111F8",backdropFilter:"blur(12px)",borderTop:`1px solid ${C.border}`,boxSizing:"border-box"}}>
        <button onClick={()=>onStart(mode)} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,border:"none",borderRadius:12,color:"#000",fontWeight:900,fontSize:14,letterSpacing:2,cursor:"pointer"}}>INICIAR TREINO ›</button>
      </div>
    </div>
  );
}

// ── Tela de Treino ───────────────────────────────────────────────
function WorkoutScreen({day,mode,onFinish}){
  const [elapsed,setElapsed]=useState(0);
  const [obs,setObs]=useState("");
  const [showObs,setShowObs]=useState(false);
  const ref=useRef();
  useEffect(()=>{ ref.current=setInterval(()=>setElapsed(p=>p+1),1000); return()=>clearInterval(ref.current); },[]);
  return(
    <div style={{paddingBottom:80}}>
      <div style={{position:"sticky",top:0,zIndex:50,background:"#111111EE",backdropFilter:"blur(10px)",borderBottom:`1px solid ${C.border}`,padding:"12px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.white}}>{day.title}</div><div style={{fontSize:10,color:C.gray}}>{mode==="academy"?"Academia":"Adaptado"}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:900,color:C.gold,fontVariantNumeric:"tabular-nums"}}>{formatTime(elapsed)}</div><div style={{fontSize:8,color:C.gray,letterSpacing:1}}>EM TREINO</div></div>
        </div>
      </div>
      <div style={{padding:"14px"}}>
        <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:14}}>{day.exercises.length} EXERCÍCIOS · TOQUE NAS SÉRIES PARA MARCAR</div>
        {day.exercises.map((ex,i)=><ExCard key={i} ex={ex} mode={mode}/>)}
        <div style={{background:C.card,borderRadius:12,marginBottom:10,overflow:"hidden",border:`1px solid ${C.border}`}}>
          <button onClick={()=>setShowObs(p=>!p)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px",background:"transparent",border:"none",cursor:"pointer"}}>
            <span style={{fontSize:12,fontWeight:700,color:C.white}}>📝 Observações</span>
            <span style={{color:C.gold,fontSize:18}}>{showObs?"∨":"›"}</span>
          </button>
          {showObs&&<div style={{padding:"0 14px 14px"}}><textarea value={obs} onChange={e=>setObs(e.target.value)} placeholder="Cargas, sensações, pontos de atenção..." rows={4} style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px",color:C.white,fontSize:12,outline:"none",resize:"none",boxSizing:"border-box"}}/></div>}
        </div>
        <button onClick={()=>onFinish(elapsed)} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,border:"none",borderRadius:12,color:"#000",fontWeight:900,fontSize:13,letterSpacing:2,cursor:"pointer"}}>✓ FINALIZAR TREINO</button>
      </div>
    </div>
  );
}

// ── Resumo Pós-treino ────────────────────────────────────────────
function WorkoutSummary({day,elapsed,onDone}){
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 20px",textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:12}}>🏆</div>
      <div style={{fontSize:10,color:C.gold,letterSpacing:3,marginBottom:8}}>TREINO CONCLUÍDO</div>
      <div style={{fontSize:28,fontWeight:900,color:C.white,marginBottom:4}}>{day.title}</div>
      <div style={{fontSize:13,color:C.gray,marginBottom:32}}>{todayStr()}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,width:"100%",maxWidth:340,marginBottom:24}}>
        {[{icon:"⏱",label:"Duração",value:formatTime(elapsed)},{icon:"💪",label:"Exercícios",value:day.exercises.length},{icon:"🔥",label:"Séries totais",value:day.exercises.reduce((a,e)=>a+e.series,0)},{icon:"📅",label:"Sequência",value:"5 dias"}].map(({icon,label,value})=>(
          <div key={label} style={{background:C.card,borderRadius:12,padding:"16px 12px"}}><div style={{fontSize:24,marginBottom:6}}>{icon}</div><div style={{fontSize:22,fontWeight:900,color:C.gold,marginBottom:4}}>{value}</div><div style={{fontSize:10,color:C.gray,letterSpacing:1}}>{label.toUpperCase()}</div></div>
        ))}
      </div>
      <div style={{background:`linear-gradient(135deg, ${C.gold}22, ${C.goldDark}22)`,border:`1px solid ${C.gold}44`,borderRadius:12,padding:"16px",width:"100%",maxWidth:340,marginBottom:24}}>
        <div style={{fontSize:10,color:C.gold,letterSpacing:2,marginBottom:8}}>🏅 NOVO RECORDE PESSOAL</div>
        <div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:4}}>{day.exercises[0].name}</div>
        <div style={{fontSize:12,color:C.gray}}>Você superou sua marca anterior!</div>
      </div>
      <button onClick={onDone} style={{width:"100%",maxWidth:340,padding:"16px",background:`linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,border:"none",borderRadius:12,color:"#000",fontWeight:900,fontSize:13,letterSpacing:2,cursor:"pointer"}}>VOLTAR AO INÍCIO</button>
    </div>
  );
}

// ── Painel do Treinador ──────────────────────────────────────────
function AdminPanel({onLogout}){
  const [tab,setTab]=useState("alunos");
  const [selectedStudent,setSelectedStudent]=useState(null);
  const [selectedDay,setSelectedDay]=useState(null);
  const [editEx,setEditEx]=useState(null);
  const [editData,setEditData]=useState({});

  const students = [
    { email:"camila@teste.com", name:"Camila Fernandes", days: CAMILA_DAYS, lastWorkout:"Hoje", streak:"6 dias", freq:"87%" },
    { email:"vivian@teste.com", name:"Vivian Mosna", days: VIVIAN_DAYS, lastWorkout:"Ontem", streak:"4 dias", freq:"78%" },
  ];

  const startEdit=(ex)=>{ setEditEx(ex.num); setEditData({name:ex.name,series:ex.series,reps:ex.reps,method:ex.method,note:ex.note}); };

  if(selectedDay&&selectedStudent){
    const day=selectedStudent.days.find(d=>d.id===selectedDay);
    return(
      <div style={{paddingBottom:80}}>
        <div style={{position:"sticky",top:0,background:"#111111EE",backdropFilter:"blur(8px)",borderBottom:`1px solid ${C.border}`,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setSelectedDay(null)} style={{background:"transparent",border:"none",color:C.gold,fontSize:22,cursor:"pointer"}}>‹</button>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.white}}>{day.title}</div><div style={{fontSize:10,color:C.gray}}>{selectedStudent.name} · Editar exercícios</div></div>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{background:`${C.gold}18`,borderRadius:10,padding:"12px 14px",marginBottom:16,border:`1px solid ${C.gold}33`}}>
            <div style={{fontSize:10,color:C.gold,fontWeight:700}}>🔧 Modo edição ativo</div>
            <div style={{fontSize:11,color:C.gray,marginTop:2}}>Toque em qualquer exercício para editar nome, séries, reps, método ou execução.</div>
          </div>
          {day.exercises.map((ex,i)=>(
            <div key={i} style={{background:editEx===ex.num?C.card2:C.card,borderRadius:12,padding:14,marginBottom:10,border:editEx===ex.num?`2px solid ${C.gold}`:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:editEx===ex.num?12:0}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.white}}>{ex.num} · {editEx===ex.num?editData.name:ex.name}</div>
                  <div style={{fontSize:10,color:C.gray,marginTop:2}}>{ex.tags}</div>
                </div>
                <button onClick={()=>editEx===ex.num?setEditEx(null):startEdit(ex)} style={{background:editEx===ex.num?C.gold:"transparent",border:`1px solid ${editEx===ex.num?"transparent":C.gold}`,color:editEx===ex.num?"#000":C.gold,padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer"}}>
                  {editEx===ex.num?"✓ OK":"Editar"}
                </button>
              </div>
              {editEx===ex.num&&(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[["Nome",editData.name,"name"],["Séries",editData.series,"series"],["Repetições",editData.reps,"reps"],["Método",editData.method,"method"],["Execução",editData.note,"note"]].map(([label,val,field])=>(
                    <div key={field}>
                      <div style={{fontSize:8,color:C.gold,letterSpacing:1.5,marginBottom:4}}>{label.toUpperCase()}</div>
                      <input value={val||""} onChange={e=>setEditData(p=>({...p,[field]:e.target.value}))} style={{width:"100%",background:C.card3,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px",color:C.white,fontSize:12,outline:"none",boxSizing:"border-box"}}/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if(selectedStudent){
    return(
      <div style={{paddingBottom:80}}>
        <div style={{position:"sticky",top:0,background:"#111111EE",backdropFilter:"blur(8px)",borderBottom:`1px solid ${C.border}`,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setSelectedStudent(null)} style={{background:"transparent",border:"none",color:C.gold,fontSize:22,cursor:"pointer"}}>‹</button>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.white}}>{selectedStudent.name}</div><div style={{fontSize:10,color:C.gray}}>Editar treinos</div></div>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{background:C.card,borderRadius:12,padding:16,marginBottom:16}}>
            <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:12}}>MÉTRICAS DO ALUNO</div>
            {[["Último treino",selectedStudent.lastWorkout],["Sequência",selectedStudent.streak],["Frequência",selectedStudent.freq]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",paddingBottom:8,marginBottom:8,borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:12,color:C.gray}}>{k}</span>
                <span style={{fontSize:12,fontWeight:800,color:C.white}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:12}}>SELECIONAR DIA PARA EDITAR</div>
          {selectedStudent.days.map(day=>(
            <button key={day.id} onClick={()=>setSelectedDay(day.id)} style={{display:"flex",alignItems:"center",width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px",marginBottom:10,cursor:"pointer",textAlign:"left",gap:12,borderLeftWidth:4,borderLeftColor:day.color}}>
              <div style={{minWidth:44,height:44,background:day.color+"18",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,fontWeight:900,color:day.color}}>{day.label}</span></div>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:C.white}}>{day.title}</div><div style={{fontSize:10,color:C.gray,marginTop:2}}>{day.exercises.length} exercícios</div></div>
              <span style={{fontSize:18,color:C.gold}}>›</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return(
    <div style={{paddingBottom:80}}>
      <div style={{padding:"28px 18px 16px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:8,color:C.gold,letterSpacing:3,marginBottom:8}}>PAINEL DO TREINADOR</div>
        <div style={{fontSize:28,fontWeight:900,color:C.white}}>Vilas Boas</div>
        <div style={{fontSize:14,color:C.gold,fontWeight:300}}>Performance</div>
        <div style={{fontSize:9,color:C.grayDark,marginTop:6}}>Versão de teste · 2 alunos ativos</div>
      </div>

      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
        {[{id:"alunos",label:"Alunos"},{id:"stats",label:"Métricas"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"14px",background:"transparent",border:"none",color:tab===t.id?C.gold:C.gray,fontWeight:tab===t.id?800:400,fontSize:12,cursor:"pointer",borderBottom:tab===t.id?`2px solid ${C.gold}`:"2px solid transparent"}}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{padding:"16px"}}>
        {tab==="alunos"&&(
          <>
            <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:12}}>ALUNOS ATIVOS</div>
            {students.map(s=>(
              <button key={s.email} onClick={()=>setSelectedStudent(s)} style={{display:"flex",alignItems:"center",width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px",marginBottom:12,cursor:"pointer",textAlign:"left",gap:14}}>
                <div style={{width:48,height:48,borderRadius:24,background:C.gold+"22",border:`2px solid ${C.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>👤</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.white}}>{s.name}</div>
                  <div style={{fontSize:10,color:C.gray,marginTop:2}}>Último treino: {s.lastWorkout}</div>
                  <div style={{display:"flex",gap:8,marginTop:4}}>
                    <span style={{fontSize:9,color:C.green,background:C.green+"22",padding:"2px 8px",borderRadius:20}}>🔥 {s.streak}</span>
                    <span style={{fontSize:9,color:C.gold,background:C.gold+"22",padding:"2px 8px",borderRadius:20}}>{s.freq} frequência</span>
                  </div>
                </div>
                <span style={{fontSize:18,color:C.gold}}>›</span>
              </button>
            ))}
          </>
        )}
        {tab==="stats"&&(
          <>
            <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:12}}>VISÃO GERAL</div>
            {[{label:"Total de treinos este mês",value:"43",icon:"📊"},{label:"Alunos ativos",value:"2",icon:"👥"},{label:"Média de frequência",value:"83%",icon:"📈"},{label:"Feedbacks recebidos",value:"8",icon:"💬"}].map(({label,value,icon})=>(
              <div key={label} style={{background:C.card,borderRadius:12,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:14}}>
                <span style={{fontSize:24}}>{icon}</span>
                <div style={{flex:1}}><div style={{fontSize:12,color:C.gray}}>{label}</div></div>
                <div style={{fontSize:22,fontWeight:900,color:C.gold}}>{value}</div>
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{padding:"0 16px"}}>
        <button onClick={onLogout} style={{width:"100%",padding:"14px",background:"transparent",border:`1px solid ${C.border}`,color:C.gray,borderRadius:12,fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:1}}>SAIR DA CONTA</button>
      </div>
    </div>
  );
}

// ── Telas do Aluno ───────────────────────────────────────────────
function HomeScreen({user,days,onSelectDay}){
  const [checkin,setCheckin]=useState({sleep:0,energy:0,mood:0});
  const [checkinDone,setCheckinDone]=useState(false);
  return(
    <div style={{paddingBottom:80}}>
      <div style={{padding:"28px 18px 16px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:8,color:C.gold,letterSpacing:3,marginBottom:10}}>PROTOCOLO DE TREINAMENTO</div>
        <div style={{fontSize:36,fontWeight:900,color:C.white,lineHeight:1}}>{user.name.toUpperCase()}</div>
        <div style={{fontSize:17,color:C.gold,fontWeight:300,marginBottom:6}}>{user.lastName}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
          {["Hipertrofia","Força","Performance","Saúde"].map(t=><span key={t} style={{fontSize:9,color:C.gold,background:C.gold+"18",padding:"3px 10px",borderRadius:20,letterSpacing:1}}>{t}</span>)}
        </div>
        <div style={{fontSize:9,color:C.grayDark,marginTop:8}}>Treinador Vilas Boas · Maio 2026</div>
      </div>

      <div style={{margin:"14px 16px 0",background:C.card,borderRadius:12,padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:8,color:C.gold,letterSpacing:2}}>SEMANA ATUAL</div>
          <div style={{fontSize:11,color:C.white,fontWeight:700}}>4 de 6 treinos</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {["S","T","Q","Q","S","S"].map((d,i)=><div key={i} style={{flex:1,height:6,borderRadius:3,background:i<4?C.gold:C.card3}}/>)}
        </div>
        <div style={{fontSize:10,color:C.gray,marginTop:6}}>Sequência: 4 dias 🔥</div>
      </div>

      <div style={{margin:"10px 16px 0",padding:"14px",background:C.card,borderRadius:12,borderLeft:`4px solid ${C.gold}`}}>
        <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:6}}>DICA DO DIA</div>
        <div style={{fontSize:12,color:C.white,lineHeight:1.6}}>A consistência supera a perfeição. Um treino incompleto é melhor do que nenhum treino.</div>
        <div style={{fontSize:9,color:C.grayDark,marginTop:6}}>Treinador Vilas Boas</div>
      </div>

      {!checkinDone?(
        <div style={{margin:"10px 16px 0",padding:"14px",background:C.card,borderRadius:12}}>
          <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:14}}>CHECK-IN DE BEM-ESTAR</div>
          {[{label:"Sono",field:"sleep",icon:"🌙"},{label:"Energia",field:"energy",icon:"⚡"},{label:"Humor",field:"mood",icon:"😊"}].map(({label,field,icon})=>(
            <div key={field} style={{display:"flex",alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:16,minWidth:28}}>{icon}</span>
              <span style={{fontSize:12,color:C.white,width:64}}>{label}</span>
              <div style={{display:"flex",gap:6,flex:1}}>
                {[1,2,3,4,5].map(n=><button key={n} onClick={()=>setCheckin(p=>({...p,[field]:n}))} style={{flex:1,height:28,borderRadius:6,background:n<=checkin[field]?C.gold:C.card3,border:"none",cursor:"pointer",transition:"all 0.15s"}}/>)}
              </div>
            </div>
          ))}
          <button onClick={()=>setCheckinDone(true)} style={{width:"100%",marginTop:6,padding:"12px",background:C.gold,border:"none",borderRadius:8,color:"#000",fontWeight:800,fontSize:12,letterSpacing:1,cursor:"pointer"}}>REGISTRAR</button>
        </div>
      ):(
        <div style={{margin:"10px 16px 0",padding:"12px 14px",background:"#192419",borderRadius:12,border:"1px solid #2D5A2D",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20,color:C.green}}>✓</span>
          <div style={{fontSize:12,color:C.white}}>Check-in registrado. Bom treino!</div>
        </div>
      )}

      <div style={{padding:"16px 16px 0"}}>
        <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:12}}>SELECIONE O TREINO DO DIA</div>
        {days.map(day=>(
          <button key={day.id} onClick={()=>onSelectDay(day)} style={{display:"flex",alignItems:"center",width:"100%",background:C.card,border:"none",borderRadius:12,padding:"16px",marginBottom:10,cursor:"pointer",borderLeft:`4px solid ${day.color}`,textAlign:"left",gap:14}}>
            <div style={{minWidth:48,height:48,background:day.color+"18",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${day.color}44`}}>
              <span style={{fontSize:10,fontWeight:900,color:day.color,letterSpacing:1}}>{day.label}</span>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:C.white}}>{day.title}</div>
              <div style={{fontSize:11,color:C.gray,marginTop:2}}>{day.sub}</div>
              <div style={{fontSize:10,color:C.grayDark,marginTop:3}}>{day.exercises.length} exercícios · ver prévia ›</div>
            </div>
            <span style={{fontSize:22,color:day.color}}>›</span>
          </button>
        ))}
      </div>
      <FeedbackBtn screen="início"/>
    </div>
  );
}

function HistoryScreen(){
  const [tab,setTab]=useState("cal");
  const FREQ_DATA=[{sem:"S1",treinos:5},{sem:"S2",treinos:6},{sem:"S3",treinos:4},{sem:"S4",treinos:6},{sem:"S5",treinos:5},{sem:"S6",treinos:6}];
  const CARGA_DATA=[{data:"Jan",legPress:80,terra:60},{data:"Fev",legPress:90,terra:70},{data:"Mar",legPress:100,terra:80},{data:"Abr",legPress:110,terra:90},{data:"Mai",legPress:120,terra:100}];
  const TEMPO_DATA=[{sem:"S1",min:52},{sem:"S2",min:58},{sem:"S3",min:55},{sem:"S4",min:61},{sem:"S5",min:57},{sem:"S6",min:59}];
  const WELL=[{dia:"S",sono:4,energia:3,humor:4},{dia:"T",sono:3,energia:4,humor:3},{dia:"Q",sono:5,energia:5,humor:5},{dia:"Q",sono:4,energia:4,humor:4},{dia:"S",sono:3,energia:3,humor:3},{dia:"S",sono:4,energia:5,humor:4}];
  return(
    <div style={{padding:"24px 16px 80px"}}>
      <div style={{fontSize:8,color:C.gold,letterSpacing:3,marginBottom:4}}>HISTÓRICO</div>
      <div style={{fontSize:24,fontWeight:900,color:C.white,marginBottom:20}}>Evolução</div>
      <div style={{display:"flex",gap:6,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
        {[{id:"cal",label:"📅 Cal"},{id:"freq",label:"📊 Freq"},{id:"carga",label:"💪 Carga"},{id:"tempo",label:"⏱ Tempo"},{id:"bem",label:"🌙 Bem-estar"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flexShrink:0,padding:"8px 14px",borderRadius:20,border:"none",background:tab===t.id?C.gold:C.card2,color:tab===t.id?"#000":C.gray,fontSize:10,fontWeight:700,cursor:"pointer"}}>{t.label}</button>
        ))}
      </div>
      {tab==="cal"&&(
        <div style={{background:C.card,borderRadius:12,padding:16}}>
          <div style={{fontSize:10,color:C.gold,fontWeight:700,marginBottom:14,textAlign:"center"}}>MAIO 2026</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>
            {["D","S","T","Q","Q","S","S"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:9,color:C.grayDark,paddingBottom:6,fontWeight:700}}>{d}</div>)}
            {Array(2).fill(null).map((_,i)=><div key={"e"+i}/>)}
            {Array.from({length:31},(_,i)=>i+1).map(d=><div key={d} style={{aspectRatio:"1",borderRadius:7,background:TRAINED.includes(d)?C.gold:C.card3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:TRAINED.includes(d)?800:400,color:TRAINED.includes(d)?"#000":C.grayDark}}>{d}</div>)}
          </div>
        </div>
      )}
      {tab==="freq"&&<div style={{background:C.card,borderRadius:12,padding:16}}><div style={{fontSize:32,fontWeight:900,color:C.white,marginBottom:16}}>5.3 <span style={{fontSize:14,color:C.gray,fontWeight:400}}>média/semana</span></div><ResponsiveContainer width="100%" height={160}><BarChart data={FREQ_DATA} barSize={28}><CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false}/><XAxis dataKey="sem" tick={{fill:C.gray,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.gray,fontSize:10}} axisLine={false} tickLine={false} domain={[0,7]}/><Tooltip contentStyle={{background:C.card2,border:`1px solid ${C.gold}33`,borderRadius:8,color:C.white,fontSize:11}}/><Bar dataKey="treinos" fill={C.gold} radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>}
      {tab==="carga"&&<div style={{background:C.card,borderRadius:12,padding:16}}><div style={{fontSize:9,color:C.gold,letterSpacing:1,marginBottom:14}}>EVOLUÇÃO DE CARGA (kg)</div><ResponsiveContainer width="100%" height={160}><LineChart data={CARGA_DATA}><CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false}/><XAxis dataKey="data" tick={{fill:C.gray,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.gray,fontSize:10}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:C.card2,border:`1px solid ${C.gold}33`,borderRadius:8,color:C.white,fontSize:11}}/><Line type="monotone" dataKey="legPress" stroke={C.gold} strokeWidth={2.5} dot={{fill:C.gold,r:4,strokeWidth:0}} name="Leg Press"/><Line type="monotone" dataKey="terra" stroke={C.blue} strokeWidth={2.5} dot={{fill:C.blue,r:4,strokeWidth:0}} name="Terra"/></LineChart></ResponsiveContainer></div>}
      {tab==="tempo"&&<div style={{background:C.card,borderRadius:12,padding:16}}><div style={{fontSize:32,fontWeight:900,color:C.white,marginBottom:16}}>57 <span style={{fontSize:14,color:C.gray,fontWeight:400}}>min/treino</span></div><ResponsiveContainer width="100%" height={160}><AreaChart data={TEMPO_DATA}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={0.3}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false}/><XAxis dataKey="sem" tick={{fill:C.gray,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.gray,fontSize:10}} axisLine={false} tickLine={false} domain={[40,70]}/><Tooltip contentStyle={{background:C.card2,border:`1px solid ${C.gold}33`,borderRadius:8,color:C.white,fontSize:11}}/><Area type="monotone" dataKey="min" stroke={C.gold} strokeWidth={2.5} fill="url(#g)" dot={{fill:C.gold,r:4,strokeWidth:0}}/></AreaChart></ResponsiveContainer></div>}
      {tab==="bem"&&<div style={{background:C.card,borderRadius:12,padding:16}}><div style={{fontSize:9,color:C.gold,letterSpacing:1,marginBottom:16}}>BEM-ESTAR — ÚLTIMA SEMANA</div><ResponsiveContainer width="100%" height={160}><LineChart data={WELL}><CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false}/><XAxis dataKey="dia" tick={{fill:C.gray,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.gray,fontSize:10}} axisLine={false} tickLine={false} domain={[1,5]}/><Tooltip contentStyle={{background:C.card2,border:`1px solid ${C.gold}33`,borderRadius:8,color:C.white,fontSize:11}}/><Line type="monotone" dataKey="sono" stroke={C.blue} strokeWidth={2} dot={{r:3,strokeWidth:0,fill:C.blue}} name="Sono"/><Line type="monotone" dataKey="energia" stroke={C.gold} strokeWidth={2} dot={{r:3,strokeWidth:0,fill:C.gold}} name="Energia"/><Line type="monotone" dataKey="humor" stroke="#A8C5A0" strokeWidth={2} dot={{r:3,strokeWidth:0,fill:"#A8C5A0"}} name="Humor"/></LineChart></ResponsiveContainer></div>}
      <FeedbackBtn screen="histórico"/>
    </div>
  );
}

function ZonaScreen(){
  const [active,setActive]=useState(null);
  if(active) return(
    <div style={{paddingBottom:80}}>
      <div style={{position:"sticky",top:0,background:"#111111EE",backdropFilter:"blur(8px)",borderBottom:`1px solid ${C.border}`,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setActive(null)} style={{background:"transparent",border:"none",color:C.gold,fontSize:22,cursor:"pointer"}}>‹</button>
        <div><div style={{fontSize:13,fontWeight:700,color:C.white}}>{active.title}</div><div style={{fontSize:10,color:C.gray}}>{active.sub}</div></div>
      </div>
      <div style={{padding:"16px"}}>
        {active.duration&&<div style={{background:C.card,borderRadius:10,padding:"12px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:16}}>⏱</span><div><div style={{fontSize:8,color:C.gold,letterSpacing:1}}>DURAÇÃO</div><div style={{fontSize:13,fontWeight:700,color:C.white}}>{active.duration}</div></div></div>}
        {active.exercises.map((ex,i)=><div key={i} style={{background:C.card,borderRadius:10,padding:"14px",marginBottom:10,borderLeft:`3px solid ${C.gold}`}}><div style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:4}}>{ex.name}</div><div style={{fontSize:11,color:C.gold,marginBottom:4}}>{ex.duration||ex.sets}</div><div style={{fontSize:11,color:C.gray}}>{ex.note}</div></div>)}
      </div>
    </div>
  );
  return(
    <div style={{padding:"24px 16px 80px"}}>
      <div style={{fontSize:8,color:C.gold,letterSpacing:3,marginBottom:4}}>BIBLIOTECA</div>
      <div style={{fontSize:24,fontWeight:900,color:C.white,marginBottom:4}}>Zona de Performance</div>
      <div style={{fontSize:11,color:C.gray,marginBottom:20}}>Aquecimentos e treinos complementares</div>
      <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:12}}>AQUECIMENTOS</div>
      {WARMUPS.map(w=><button key={w.id} onClick={()=>setActive(w)} style={{display:"flex",alignItems:"center",width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px",marginBottom:10,cursor:"pointer",textAlign:"left",gap:14}}><div style={{width:48,height:48,background:C.gold+"18",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{w.icon}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.white}}>{w.title}</div><div style={{fontSize:11,color:C.gray,marginTop:2}}>{w.sub}</div><div style={{fontSize:10,color:C.grayDark,marginTop:2}}>{w.duration}</div></div><span style={{fontSize:20,color:C.gold}}>›</span></button>)}
      <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:12,marginTop:8}}>COMPLEMENTARES</div>
      {COMPLEMENTARY.map(c=><button key={c.id} onClick={()=>setActive(c)} style={{display:"flex",alignItems:"center",width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px",marginBottom:10,cursor:"pointer",textAlign:"left",gap:14}}><div style={{width:48,height:48,background:C.blue+"18",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{c.icon}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.white}}>{c.title}</div><div style={{fontSize:11,color:C.gray,marginTop:2}}>{c.sub}</div></div><span style={{fontSize:20,color:C.gold}}>›</span></button>)}
      <FeedbackBtn screen="zona"/>
    </div>
  );
}

function PartnersScreen(){
  const [active,setActive]=useState(null);
  if(active) return(
    <div style={{paddingBottom:80}}>
      <div style={{position:"sticky",top:0,background:"#111111EE",backdropFilter:"blur(8px)",borderBottom:`1px solid ${C.border}`,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setActive(null)} style={{background:"transparent",border:"none",color:C.gold,fontSize:22,cursor:"pointer"}}>‹</button>
        <div><div style={{fontSize:13,fontWeight:700,color:C.white}}>{active.name}</div><div style={{fontSize:10,color:C.gray}}>{active.category}</div></div>
      </div>
      <div style={{padding:"16px"}}>
        <div style={{background:C.card,borderRadius:12,padding:16,marginBottom:12,borderLeft:`4px solid ${active.color}`}}>
          <div style={{fontSize:9,color:active.color,letterSpacing:1.5,marginBottom:6}}>{active.category.toUpperCase()}</div>
          <div style={{fontSize:16,fontWeight:800,color:C.white,marginBottom:6}}>{active.name}</div>
          <div style={{fontSize:12,color:C.gray,lineHeight:1.6}}>{active.desc}</div>
        </div>
        <div style={{background:C.card,borderRadius:12,padding:16,marginBottom:12}}>
          <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:12}}>PRODUTOS / SERVIÇOS</div>
          {active.products.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,paddingBottom:8,marginBottom:8,borderBottom:i<active.products.length-1?`1px solid ${C.border}`:"none"}}><div style={{width:6,height:6,borderRadius:3,background:active.color,flexShrink:0}}/><span style={{fontSize:12,color:C.white}}>{p}</span></div>)}
        </div>
        <button style={{width:"100%",padding:"16px",background:active.color,border:"none",borderRadius:12,color:"#000",fontWeight:900,fontSize:13,letterSpacing:1,cursor:"pointer"}}>{active.contact} ›</button>
      </div>
    </div>
  );
  return(
    <div style={{padding:"24px 16px 80px"}}>
      <div style={{fontSize:8,color:C.gold,letterSpacing:3,marginBottom:4}}>REDE</div>
      <div style={{fontSize:24,fontWeight:900,color:C.white,marginBottom:20}}>Parceiros</div>
      {PARTNERS.map(p=><button key={p.id} onClick={()=>setActive(p)} style={{display:"flex",alignItems:"center",width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px",marginBottom:12,cursor:"pointer",textAlign:"left",gap:14,borderLeftWidth:4,borderLeftColor:p.color}}><div style={{width:48,height:48,background:p.color+"18",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{p.category==="Nutrição"?"🥗":p.category==="Suplementação"?"💊":p.category==="Alimentação"?"🍱":"🏥"}</div><div style={{flex:1}}><div style={{fontSize:9,color:p.color,letterSpacing:1.5,marginBottom:3}}>{p.category.toUpperCase()}</div><div style={{fontSize:13,fontWeight:700,color:C.white}}>{p.name}</div><div style={{fontSize:11,color:C.gray,marginTop:2}}>{p.role}</div></div><span style={{fontSize:20,color:p.color}}>›</span></button>)}
      <FeedbackBtn screen="parceiros"/>
    </div>
  );
}

function ProfileScreen({user,onLogout}){
  const [photos,setPhotos]=useState([{date:"Jan 2026"},{date:"Mar 2026"}]);
  return(
    <div style={{padding:"24px 16px 80px"}}>
      <div style={{fontSize:8,color:C.gold,letterSpacing:3,marginBottom:4}}>PERFIL</div>
      <div style={{fontSize:24,fontWeight:900,color:C.white,marginBottom:20}}>{user.name} {user.lastName}</div>
      <div style={{background:C.card,borderRadius:12,padding:16,marginBottom:12}}>
        <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:14}}>RESUMO DO MÊS</div>
        {[["Treinos realizados","21 / 24"],["Frequência","87%"],["Média por treino","57 min"],["Sequência atual","6 dias 🔥"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",paddingBottom:10,marginBottom:10,borderBottom:`1px solid ${C.border}`}}>
            <span style={{fontSize:12,color:C.gray}}>{k}</span>
            <span style={{fontSize:12,fontWeight:800,color:C.white}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{background:C.card,borderRadius:12,overflow:"hidden",marginBottom:12}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:12}}>LINHA DO TEMPO — AVALIAÇÕES</div>
          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
            {photos.map((p,i)=><div key={i} style={{flexShrink:0,width:100}}><div style={{width:100,height:130,background:C.card2,borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,border:`1px solid ${C.border}`}}><span style={{fontSize:24,color:"#444"}}>📷</span></div><div style={{fontSize:9,color:C.gray,textAlign:"center",marginTop:4}}>{p.date}</div></div>)}
          </div>
        </div>
        <button onClick={()=>setPhotos(p=>[...p,{date:todayStr()}])} style={{width:"100%",padding:"14px",background:"transparent",border:"none",color:C.gold,fontSize:12,fontWeight:700,cursor:"pointer"}}>+ ADICIONAR FOTO ({todayStr()})</button>
      </div>
      <div style={{background:C.card,borderRadius:12,padding:16,marginBottom:12}}>
        <div style={{fontSize:8,color:C.gold,letterSpacing:2,marginBottom:12}}>MEU TREINADOR</div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:52,height:52,borderRadius:26,background:"#2A2520",display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${C.gold}`}}><span style={{fontSize:20}}>👤</span></div>
          <div><div style={{fontSize:14,fontWeight:700,color:C.white}}>Treinador Vilas Boas</div><div style={{fontSize:11,color:C.gray}}>@treinadorvilasboas</div></div>
        </div>
      </div>
      <button onClick={onLogout} style={{width:"100%",padding:"14px",background:"transparent",border:`1px solid ${C.border}`,color:C.gray,borderRadius:12,fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:1}}>SAIR DA CONTA</button>
      <FeedbackBtn screen="perfil"/>
    </div>
  );
}

// ── Login ────────────────────────────────────────────────────────
function LoginScreen({onLogin}){
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const handleLogin=()=>{
    setError("");
    const user=USERS[email.toLowerCase().trim()];
    if(!user||user.password!==pass){ setError("Email ou senha incorretos."); return; }
    setLoading(true);
    setTimeout(()=>{ setLoading(false); onLogin(email.toLowerCase().trim(),user); },800);
  };
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{textAlign:"center",marginBottom:48}}>
        <div style={{width:76,height:76,borderRadius:22,background:`linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:`0 8px 32px ${C.gold}44`}}><span style={{fontSize:34}}>⚡</span></div>
        <div style={{fontSize:30,fontWeight:900,color:C.white,letterSpacing:2}}>VILAS BOAS</div>
        <div style={{fontSize:11,color:C.gold,letterSpacing:4,marginTop:2}}>PERFORMANCE</div>
        <div style={{width:40,height:2,background:C.gold,margin:"12px auto 0",borderRadius:1}}/>
      </div>
      <div style={{width:"100%",maxWidth:340}}>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:9,color:C.gray,letterSpacing:1.5,marginBottom:6}}>EMAIL</div>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" style={{width:"100%",background:C.card,border:`1px solid ${error?C.red:C.border}`,borderRadius:10,padding:"14px 16px",color:C.white,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{marginBottom:error?8:24}}>
          <div style={{fontSize:9,color:C.gray,letterSpacing:1.5,marginBottom:6}}>SENHA</div>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••" style={{width:"100%",background:C.card,border:`1px solid ${error?C.red:C.border}`,borderRadius:10,padding:"14px 16px",color:C.white,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        {error&&<div style={{fontSize:11,color:C.red,marginBottom:16,textAlign:"center"}}>{error}</div>}
        <button onClick={handleLogin} style={{width:"100%",padding:16,background:`linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,border:"none",borderRadius:10,color:"#000",fontWeight:900,fontSize:13,letterSpacing:2,cursor:"pointer",boxShadow:`0 4px 20px ${C.gold}44`}}>
          {loading?"ENTRANDO...":"ENTRAR"}
        </button>
        <div style={{textAlign:"center",marginTop:16,fontSize:11,color:C.grayDark}}>Acesso restrito · Treinador Vilas Boas</div>
      </div>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [flow,setFlow]=useState("home");
  const [activeDay,setActiveDay]=useState(null);
  const [workoutMode,setWorkoutMode]=useState("academy");
  const [finalElapsed,setFinalElapsed]=useState(0);
  const [tab,setTab]=useState("home");

  const handleLogin=(email,userData)=>setUser({email,...userData});
  const handleLogout=()=>{ setUser(null); setFlow("home"); setTab("home"); };

  if(!user) return <LoginScreen onLogin={handleLogin}/>;
  if(user.role==="admin") return <AdminPanel onLogout={handleLogout}/>;

  const days=STUDENT_DATA[user.email]?.days||CAMILA_DAYS;

  if(flow==="preview") return <WorkoutPreview day={activeDay} onBack={()=>setFlow("home")} onStart={(m)=>{setWorkoutMode(m);setFlow("workout");}}/>;
  if(flow==="workout") return <WorkoutScreen day={activeDay} mode={workoutMode} onFinish={(el)=>{setFinalElapsed(el);setFlow("summary");}}/>;
  if(flow==="summary") return <WorkoutSummary day={activeDay} elapsed={finalElapsed} onDone={()=>{setFlow("home");setActiveDay(null);}}/>;

  const navItems=[
    {id:"home",icon:"🏠",label:"Início"},
    {id:"history",icon:"📊",label:"Histórico"},
    {id:"zona",icon:"⚡",label:"Zona"},
    {id:"partners",icon:"🤝",label:"Parceiros"},
    {id:"profile",icon:"👤",label:"Perfil"},
  ];

  return(
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:C.bg,fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:C.white,overflowX:"hidden"}}>
      {tab==="home"&&<HomeScreen user={user} days={days} onSelectDay={day=>{setActiveDay(day);setFlow("preview");}}/>}
      {tab==="history"&&<HistoryScreen/>}
      {tab==="zona"&&<ZonaScreen/>}
      {tab==="partners"&&<PartnersScreen/>}
      {tab==="profile"&&<ProfileScreen user={user} onLogout={handleLogout}/>}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#111111F2",backdropFilter:"blur(12px)",borderTop:`1px solid ${C.border}`,display:"flex",zIndex:100}}>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,padding:"10px 0 14px",background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span style={{fontSize:18}}>{n.icon}</span>
            <span style={{fontSize:8,color:tab===n.id?C.gold:C.grayDark,fontWeight:tab===n.id?800:400,letterSpacing:0.5}}>{n.label.toUpperCase()}</span>
            {tab===n.id&&<div style={{width:16,height:2,borderRadius:1,background:C.gold,marginTop:1}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
